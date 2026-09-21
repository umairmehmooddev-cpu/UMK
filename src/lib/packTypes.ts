export type PackKind = 'podcast' | 'meeting' | 'student' | 'custom';

export type PackFile = {
  name: string;
  content: string;
};

export type DigitalPack = {
  kind: PackKind;
  productName: string;
  slug: string;
  price: string;
  audience: string;
  niche: string;
  shortPitch: string;
  etsyTitle: string;
  gumroadTitle: string;
  tags: string[];
  files: PackFile[];
  builtBy: 'ai' | 'template';
};

export type PackBrief = {
  kind: PackKind;
  niche: string;
  audience: string;
  price: string;
  notes: string;
};

export type TrendIdea = {
  id: string;
  kind: PackKind;
  title: string;
  niche: string;
  audience: string;
  price: string;
  whyItMightSell: string;
  uniqueAngle: string;
  source: 'pattern' | 'ai';
};

export type UniquenessIssue = {
  level: 'block' | 'warn';
  message: string;
};

export type UniquenessReport = {
  ok: boolean;
  score: number;
  issues: UniquenessIssue[];
};

export type CatalogEntry = {
  slug: string;
  productName: string;
  niche: string;
  etsyTitle: string;
};

export const PACK_KIND_LABELS: Record<PackKind, string> = {
  podcast: 'Podcast / show-notes pack',
  meeting: 'Meeting notes pack',
  student: 'Student planner pack',
  custom: 'Custom digital pack',
};
