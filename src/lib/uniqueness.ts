import type {CatalogEntry, PackBrief, UniquenessIssue, UniquenessReport} from './packTypes';

const BLOCKED = [
  'disney',
  'marvel',
  'star wars',
  'pokemon',
  'nintendo',
  'nike',
  'adidas',
  'gucci',
  'louis vuitton',
  'chanel',
  'apple',
  'iphone',
  'tesla',
  'harry potter',
  'taylor swift',
  'beyonce',
  'bts',
  'premier league',
  'nba',
  'nfl',
  'fifa',
  'coca cola',
  'mcdonald',
  'hello kitty',
  'barbie',
  'minecraft',
  'fortnite',
  'gta',
  'openai',
  'chatgpt',
  'gemini',
  'claude',
];

const GENERIC = [
  'digital planner',
  'printable planner',
  'ebook',
  'ultimate planner',
  'ultimate guide',
  'make money online',
  'passive income',
  'ai prompts',
  '10000 prompts',
  'canva templates',
  'social media templates',
  'be kind',
  'good vibes',
  'girl boss',
];

function haystack(brief: PackBrief): string {
  return `${brief.niche} ${brief.audience} ${brief.notes}`.toLowerCase();
}

function tokens(value: string): Set<string> {
  return new Set(
    value
      .toLowerCase()
      .replace(/[^a-z0-9\s]+/g, ' ')
      .split(/\s+/)
      .filter((word) => word.length > 2),
  );
}

function overlap(a: string, b: string): number {
  const left = tokens(a);
  const right = tokens(b);
  if (!left.size || !right.size) return 0;
  let shared = 0;
  for (const word of left) {
    if (right.has(word)) shared += 1;
  }
  return shared / Math.min(left.size, right.size);
}

export function evaluateUniqueness(brief: PackBrief, catalog: CatalogEntry[]): UniquenessReport {
  const issues: UniquenessIssue[] = [];
  const text = haystack(brief);
  let score = 80;

  if (!brief.niche.trim() || brief.niche.trim().split(/\s+/).length < 2) {
    issues.push({
      level: 'warn',
      message: 'Niche is too thin. A unique product names a buyer and a job, not just “planner”.',
    });
    score -= 15;
  }

  for (const phrase of BLOCKED) {
    if (text.includes(phrase)) {
      issues.push({
        level: 'block',
        message: `Blocked brand or celebrity mark: “${phrase}”. That is someone else’s property.`,
      });
      score -= 40;
    }
  }

  for (const phrase of GENERIC) {
    if (text.includes(phrase) && brief.niche.trim().toLowerCase() === phrase) {
      issues.push({
        level: 'warn',
        message: `“${phrase}” is a crowded commodity. Add a specific buyer or job or this will look like a copy.`,
      });
      score -= 20;
    }
  }

  for (const entry of catalog) {
    const closeness = Math.max(
      overlap(brief.niche, entry.niche),
      overlap(brief.niche, entry.productName),
      overlap(`${brief.niche} ${brief.audience}`, entry.etsyTitle),
    );
    if (closeness >= 0.72) {
      issues.push({
        level: 'block',
        message: `Too close to a pack you already made: “${entry.productName}”. Change the buyer or the job.`,
      });
      score -= 35;
    } else if (closeness >= 0.45) {
      issues.push({
        level: 'warn',
        message: `Similar to your pack “${entry.productName}”. Make the angle sharper before you upload another copy.`,
      });
      score -= 12;
    }
  }

  if (/\b(copy of|same as|inspired by|dupe|replica)\b/i.test(text)) {
    issues.push({
      level: 'block',
      message: 'The brief asks for a copy of someone else’s product. Rewrite the job in your own words.',
    });
    score -= 40;
  }

  score = Math.max(0, Math.min(100, score));
  const ok = !issues.some((issue) => issue.level === 'block');
  return {ok, score, issues};
}

export const CATALOG_KEY = 'umk-pack-catalog';

export function loadCatalog(): CatalogEntry[] {
  try {
    const raw = localStorage.getItem(CATALOG_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as CatalogEntry[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function saveCatalogEntry(entry: CatalogEntry): void {
  const next = loadCatalog().filter((item) => item.slug !== entry.slug);
  next.unshift(entry);
  localStorage.setItem(CATALOG_KEY, JSON.stringify(next.slice(0, 80)));
}
