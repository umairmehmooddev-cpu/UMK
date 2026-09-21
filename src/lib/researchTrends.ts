import {GoogleGenAI} from '@google/genai';
import type {PackKind, TrendIdea} from './packTypes';
import {evaluateUniqueness, loadCatalog} from './uniqueness';

const PATTERN_IDEAS: TrendIdea[] = [
  {
    id: 'night-shift-reset',
    kind: 'student',
    title: 'Night-shift study reset',
    niche: 'Night-shift nursing exams',
    audience: 'Working nurses studying between shifts',
    price: '14',
    whyItMightSell: 'Shift workers buy planners that match sleep, not Monday–Friday school weeks.',
    uniqueAngle: 'Plan around 12-hour shifts and a 20-minute cram block, not a normal class timetable.',
    source: 'pattern',
  },
  {
    id: 'guest-interview-kit',
    kind: 'podcast',
    title: 'Guest interview kit',
    niche: 'Solo-host guest interviews',
    audience: 'Weekly indie hosts who book one guest',
    price: '15',
    whyItMightSell: 'Interview shows need the same pre-show, timestamps, and clip list every week.',
    uniqueAngle: 'Guest bio, 8 questions, clip timestamps, and a thank-you email — not generic show notes.',
    source: 'pattern',
  },
  {
    id: 'client-kickoff',
    kind: 'meeting',
    title: 'Client kickoff notes',
    niche: 'Freelance client kickoff',
    audience: 'Designers and developers starting a paid project',
    price: '12',
    whyItMightSell: 'Freelancers pay to stop missing scope in the first call.',
    uniqueAngle: 'Scope, out-of-scope, deposit, and Slack update in one page.',
    source: 'pattern',
  },
  {
    id: 'exam-week-parent',
    kind: 'student',
    title: 'Exam-week household board',
    niche: 'Parent exam-week board',
    audience: 'Parents of teens in exam season',
    price: '11',
    whyItMightSell: 'Seasonal search spikes around exams; parents buy simple printables.',
    uniqueAngle: 'Household quiet hours and meals, not another student aesthetic planner.',
    source: 'pattern',
  },
  {
    id: 'faceless-script-from-notes',
    kind: 'custom',
    title: 'Faceless script pack',
    niche: 'Faceless YouTube from voice notes',
    audience: 'Creators who record voice notes and need a 45-second script',
    price: '17',
    whyItMightSell: 'Short-form volume is high; people pay to turn messy notes into a script.',
    uniqueAngle: 'Voice-note → hook, body, CTA. Not a pile of generic AI prompts.',
    source: 'pattern',
  },
  {
    id: 'hoa-meeting',
    kind: 'meeting',
    title: 'Volunteer committee minutes',
    niche: 'Volunteer committee minutes',
    audience: 'HOA, PTA, and mosque/church volunteers',
    price: '9',
    whyItMightSell: 'Unpaid secretaries still need clean minutes and votes.',
    uniqueAngle: 'Motions, votes, and who does what — not a startup standup.',
    source: 'pattern',
  },
  {
    id: 'bilingual-show-notes',
    kind: 'podcast',
    title: 'Bilingual show-notes pack',
    niche: 'Urdu-English podcast notes',
    audience: 'Hosts who publish in two languages',
    price: '16',
    whyItMightSell: 'Bilingual creators are underserved by English-only templates.',
    uniqueAngle: 'Two-language titles, chapters, and description blocks.',
    source: 'pattern',
  },
  {
    id: 'clinical-hours-log',
    kind: 'student',
    title: 'Clinical hours log + reflection',
    niche: 'Clinical placement hours log',
    audience: 'Nursing and therapy students who must log hours',
    price: '13',
    whyItMightSell: 'Required logs are a painful, repeating job with a deadline.',
    uniqueAngle: 'Hours, supervisor, and a 5-line reflection — not a cute weekly spread.',
    source: 'pattern',
  },
];

function ideaToBrief(idea: TrendIdea) {
  return {
    kind: idea.kind,
    niche: idea.niche,
    audience: idea.audience,
    price: idea.price,
    notes: idea.uniqueAngle,
  };
}

function keepUnique(ideas: TrendIdea[]): TrendIdea[] {
  const catalog = typeof localStorage === 'undefined' ? [] : loadCatalog();
  return ideas.filter((idea) => evaluateUniqueness(ideaToBrief(idea), catalog).ok);
}

export function patternTrendIdeas(kind?: PackKind): TrendIdea[] {
  const pool = kind ? PATTERN_IDEAS.filter((idea) => idea.kind === kind) : PATTERN_IDEAS;
  return keepUnique(pool).slice(0, 6);
}

export async function researchTrendIdeas(kind?: PackKind): Promise<TrendIdea[]> {
  const apiKey = process.env.GEMINI_API_KEY;
  const fallback = patternTrendIdeas(kind);
  if (!apiKey) return fallback;

  const ai = new GoogleGenAI({apiKey});
  const prompt = `Suggest 5 original digital product ideas to sell as instant-download markdown/PDF packs.
Kind filter: ${kind || 'any of podcast, meeting, student, custom'}
Rules:
- Specific buyer + specific job this week
- Not a clone of a famous Etsy listing
- No trademarks, celebrities, sports clubs, or brand names
- No "ultimate planner", "make money online", or prompt dumps
Return ONLY JSON array:
[{"id":"slug","kind":"podcast|meeting|student|custom","title":"","niche":"","audience":"","price":"12","whyItMightSell":"","uniqueAngle":""}]`;

  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: prompt,
    config: {responseMimeType: 'application/json'},
  });

  const text = response.text;
  if (!text) return fallback;

  try {
    const parsed = JSON.parse(text) as unknown;
    if (!Array.isArray(parsed)) return fallback;
    const ideas: TrendIdea[] = parsed
      .filter((row) => row && typeof row === 'object')
      .map((row, index) => {
        const item = row as Record<string, unknown>;
        const nextKind = (['podcast', 'meeting', 'student', 'custom'] as PackKind[]).includes(
          item.kind as PackKind,
        )
          ? (item.kind as PackKind)
          : kind || 'custom';
        return {
          id: String(item.id || `ai-${index}`),
          kind: nextKind,
          title: String(item.title || item.niche || 'Idea'),
          niche: String(item.niche || ''),
          audience: String(item.audience || ''),
          price: String(item.price || '12'),
          whyItMightSell: String(item.whyItMightSell || ''),
          uniqueAngle: String(item.uniqueAngle || ''),
          source: 'ai' as const,
        };
      });
    const unique = keepUnique(ideas);
    return unique.length ? unique : fallback;
  } catch {
    return fallback;
  }
}
