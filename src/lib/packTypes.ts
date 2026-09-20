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

export const PACK_KIND_LABELS: Record<PackKind, string> = {
  podcast: 'Podcast / show-notes pack',
  meeting: 'Meeting notes pack',
  student: 'Student planner pack',
  custom: 'Custom digital pack',
};
