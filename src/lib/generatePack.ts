import {GoogleGenAI} from '@google/genai';
import {buildTemplatePack} from './buildTemplatePack';
import type {DigitalPack, PackBrief, PackFile} from './packTypes';
import {slugify} from './slug';

const SYSTEM_RULES = `You build original digital product packs for a human to review before upload.
Return ONLY valid JSON. No markdown fences.
Do not use trademarks, celebrity names, sports clubs, or brand logos.
Keep files in markdown. Be specific to the niche. No fluff.
Each file must be usable as-is after a human skim.`;

function packSchemaHint(): string {
  return `{
  "productName": "string",
  "price": "12",
  "audience": "string",
  "niche": "string",
  "shortPitch": "one or two sentences",
  "etsyTitle": "string under 140 chars",
  "gumroadTitle": "string",
  "tags": ["up to 13 short tags"],
  "files": [
    {"name": "START_HERE.md", "content": "markdown"},
    {"name": "LICENSE.md", "content": "markdown"},
    {"name": "01_MAIN_TEMPLATE.md", "content": "markdown"},
    {"name": "02_BONUS.md", "content": "markdown"},
    {"name": "03_CHECKLIST.md", "content": "markdown"},
    {"name": "ETSY_LISTING.md", "content": "markdown"},
    {"name": "GUMROAD_LISTING.md", "content": "markdown"},
    {"name": "PINTEREST_PINS.md", "content": "markdown"},
    {"name": "REVIEW_CHECKLIST.md", "content": "markdown"}
  ]
}`;
}

function extractJson(text: string): unknown {
  const trimmed = text.trim();
  const fenced = trimmed.match(/```(?:json)?\s*([\s\S]*?)```/);
  const raw = fenced ? fenced[1] : trimmed;
  return JSON.parse(raw);
}

function asPack(brief: PackBrief, data: unknown, builtBy: DigitalPack['builtBy']): DigitalPack {
  const fallback = buildTemplatePack(brief);
  if (!data || typeof data !== 'object') return fallback;

  const row = data as Record<string, unknown>;
  const filesIn = Array.isArray(row.files) ? row.files : [];
  const files: PackFile[] = filesIn
    .filter((file): file is {name: string; content: string} => {
      return (
        !!file &&
        typeof file === 'object' &&
        typeof (file as {name?: unknown}).name === 'string' &&
        typeof (file as {content?: unknown}).content === 'string'
      );
    })
    .map((file) => ({name: file.name.replace(/[/\\]/g, '-'), content: file.content}));

  const productName = String(row.productName || fallback.productName);
  const tags = Array.isArray(row.tags)
    ? row.tags.map((tag) => String(tag)).filter(Boolean).slice(0, 13)
    : fallback.tags;

  return {
    kind: brief.kind,
    productName,
    slug: slugify(productName),
    price: String(row.price || brief.price || fallback.price),
    audience: String(row.audience || brief.audience || fallback.audience),
    niche: String(row.niche || brief.niche || fallback.niche),
    shortPitch: String(row.shortPitch || fallback.shortPitch),
    etsyTitle: String(row.etsyTitle || fallback.etsyTitle),
    gumroadTitle: String(row.gumroadTitle || productName),
    tags: tags.length ? tags : fallback.tags,
    files: files.length >= 4 ? files : fallback.files,
    builtBy,
  };
}

export async function generateDigitalPack(
  brief: PackBrief,
  revisionNotes?: string,
): Promise<DigitalPack> {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    const pack = buildTemplatePack(brief);
    if (!revisionNotes?.trim()) return pack;
    return {
      ...pack,
      files: pack.files.map((file) =>
        file.name === 'START_HERE.md'
          ? {
              ...file,
              content: `${file.content}\n\n## Revision requested\n${revisionNotes.trim()}\n`,
            }
          : file,
      ),
    };
  }

  const ai = new GoogleGenAI({apiKey});
  const prompt = `${SYSTEM_RULES}

Pack type: ${brief.kind}
Niche: ${brief.niche || '(choose a specific niche from the type)'}
Audience: ${brief.audience || '(infer a specific buyer)'}
Price: $${brief.price || '12'}
Seller notes: ${brief.notes || 'none'}
${revisionNotes?.trim() ? `Human review notes to apply:\n${revisionNotes.trim()}\n` : ''}
JSON shape:
${packSchemaHint()}`;

  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: prompt,
    config: {
      responseMimeType: 'application/json',
    },
  });

  const text = response.text;
  if (!text) return buildTemplatePack(brief);
  return asPack(brief, extractJson(text), 'ai');
}
