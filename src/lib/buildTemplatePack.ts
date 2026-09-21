import type {DigitalPack, PackBrief, PackFile} from './packTypes';
import {PACK_KIND_LABELS} from './packTypes';
import {slugify} from './slug';

function productNameFor(brief: PackBrief): string {
  const niche = brief.niche.trim() || defaultNiche(brief.kind);
  if (brief.kind === 'podcast') return `${niche} Podcast Show Notes Pack`;
  if (brief.kind === 'meeting') return `${niche} Meeting Notes Pack`;
  if (brief.kind === 'student') return `${niche} Student Planner Pack`;
  return `${niche} Digital Pack`;
}

function defaultNiche(kind: PackBrief['kind']): string {
  if (kind === 'podcast') return 'Indie podcast';
  if (kind === 'meeting') return 'Remote team';
  if (kind === 'student') return 'Exam week';
  return 'Creator';
}

function defaultAudience(kind: PackBrief['kind']): string {
  if (kind === 'podcast') return 'indie hosts who publish weekly';
  if (kind === 'meeting') return 'founders and team leads who run recurring meetings';
  if (kind === 'student') return 'students who need a simple weekly study system';
  return 'people who want a ready-to-use template';
}

export function buildTemplatePack(brief: PackBrief): DigitalPack {
  const niche = brief.niche.trim() || defaultNiche(brief.kind);
  const audience = brief.audience.trim() || defaultAudience(brief.kind);
  const price = brief.price.trim() || '12';
  const name = productNameFor({...brief, niche});
  const slug = slugify(name);
  const notes = brief.notes.trim();

  const files: PackFile[] = [
    {
      name: 'START_HERE.md',
      content: startHere(name, brief.kind, audience, notes),
    },
    {
      name: 'LICENSE.md',
      content: license(name),
    },
    ...coreFiles(brief.kind, niche, audience, notes),
    {
      name: 'ETSY_LISTING.md',
      content: etsyListing(name, brief.kind, niche, audience, price),
    },
    {
      name: 'GUMROAD_LISTING.md',
      content: gumroadListing(name, niche, audience, price),
    },
    {
      name: 'PINTEREST_PINS.md',
      content: pinCopy(name, niche, audience, price),
    },
    {
      name: 'REVIEW_CHECKLIST.md',
      content: reviewChecklist(name),
    },
  ];

  return {
    kind: brief.kind,
    productName: name,
    slug,
    price,
    audience,
    niche,
    shortPitch: `${PACK_KIND_LABELS[brief.kind]} for ${audience}. Open the files, copy the structure, publish faster.`,
    etsyTitle: etsyTitle(brief.kind, niche),
    gumroadTitle: name,
    tags: tagsFor(brief.kind, niche),
    files,
    builtBy: 'template',
  };
}

function startHere(name: string, kind: PackBrief['kind'], audience: string, notes: string): string {
  return `# ${name}

Thanks for buying this pack. Use it this week — do not wait for a “perfect” setup.

## Who it is for
${audience}

## What you got
- A ready template you can copy
- A checklist so you do not skip the useful parts
- Listing text if you are the seller reviewing this pack

## How to use it (10 minutes)
1. Open the main template file.
2. Duplicate it for your next episode, meeting, or study week.
3. Fill the blanks. Delete any section you will not use.
4. Export or copy the result to Notion, Docs, or your show notes.

${notes ? `## Extra request from you\n${notes}\n` : ''}## Files
See the other markdown files in this folder. Keep LICENSE.md with the pack if you resell only under the written terms.

Kind: ${kind}
`;
}

function license(name: string): string {
  return `# License — ${name}

## You may
- Use this pack for your own episodes, meetings, classes, or client work
- Edit the text and layout
- Print copies for yourself

## You may not
- Resell, share, or gift the raw files
- Upload this pack to Etsy, Gumroad, or any marketplace as your own product
- Use brand names, celebrity names, or logos that you do not own

Personal use plus client delivery is allowed. Marketplace resale of the files is not.
`;
}

function coreFiles(
  kind: PackBrief['kind'],
  niche: string,
  audience: string,
  notes: string,
): PackFile[] {
  if (kind === 'podcast') {
    return [
      {
        name: '01_SHOW_NOTES_TEMPLATE.md',
        content: `# Show notes — ${niche}

Episode title:
Episode number:
Recorded:
Publish date:
Guest (if any):
Length:

## One-sentence hook
What this episode helps ${audience} do:

## Timestamps
- 00:00 Intro
- 00:00 Topic 1
- 00:00 Topic 2
- 00:00 Topic 3
- 00:00 Takeaway / close

## Show notes
### Topic 1


### Topic 2


### Topic 3


## Links mentioned
-
-

## Quote to clip


## CTA
Where should the listener go next?

${notes ? `Producer notes:\n${notes}\n` : ''}`,
      },
      {
        name: '02_TITLES_AND_CHAPTERS.md',
        content: `# Titles, chapters, and YouTube description

Write 8 title options. Keep under 70 characters.

1.
2.
3.
4.
5.
6.
7.
8.

## YouTube / podcast chapters
00:00 Intro
00:00
00:00
00:00
00:00 Close

## Description (paste-ready)
In this episode of ${niche}, we talk about ________.

You will learn:
- 
- 
- 

Listen / watch:
Subscribe:
`,
      },
      {
        name: '03_PUBLISH_CHECKLIST.md',
        content: `# Publish checklist

- [ ] Audio exported and named
- [ ] Show notes filled
- [ ] Titles picked
- [ ] Chapters added
- [ ] Description pasted
- [ ] Cover / thumbnail
- [ ] Scheduled
- [ ] 3 clips or pins scheduled
`,
      },
    ];
  }

  if (kind === 'meeting') {
    return [
      {
        name: '01_MEETING_NOTES_TEMPLATE.md',
        content: `# Meeting notes — ${niche}

Date:
Attendees:
Owner:
Goal (one line):

## Agenda
1.
2.
3.

## Decisions
| Decision | Owner | Date |
|---|---|---|
|  |  |  |

## Action items
| Task | Owner | Due | Done |
|---|---|---|---|
|  |  |  |  |

## Notes


## What we are not doing


Audience: ${audience}
${notes ? `\nExtra context:\n${notes}\n` : ''}`,
      },
      {
        name: '02_SLACK_UPDATE.md',
        content: `# Slack / email update (paste after the meeting)

**${niche} — notes**

Decisions:
- 

Next:
- @name — task — due date
- @name — task — due date

Blockers:
- 
`,
      },
      {
        name: '03_WEEKLY_REVIEW.md',
        content: `# Weekly review

Open last week's action items. Close or rewrite each one.

- Finished:
- Moved:
- Dropped (and why):
- One process change for next week:
`,
      },
    ];
  }

  if (kind === 'student') {
    return [
      {
        name: '01_WEEKLY_PLANNER.md',
        content: `# Weekly planner — ${niche}

Week of:
Main exam / deadline:
Hours available:

## This week's 3 outcomes
1.
2.
3.

## Daily blocks
| Day | Deep work | Review | Rest |
|---|---|---|---|
| Mon |  |  |  |
| Tue |  |  |  |
| Wed |  |  |  |
| Thu |  |  |  |
| Fri |  |  |  |
| Sat |  |  |  |
| Sun |  |  |  |

## Tasks
- [ ]
- [ ]
- [ ]

For: ${audience}
${notes ? `\nNotes:\n${notes}\n` : ''}`,
      },
      {
        name: '02_EXAM_CRAM_SHEET.md',
        content: `# Cram sheet

Subject:
Date:

## Must-know (only 7 lines)
1.
2.
3.
4.
5.
6.
7.

## Formulas / definitions


## Questions I keep missing


## 25-minute loop
1. 20 min practice
2. 5 min mark errors
3. Rewrite one rule
`,
      },
      {
        name: '03_SUNDAY_RESET.md',
        content: `# Sunday reset (20 minutes)

- [ ] Clear bag / desktop
- [ ] Write the 3 outcomes
- [ ] Put the hardest block on Monday morning
- [ ] Pick one reward for Friday
`,
      },
    ];
  }

  return [
    {
      name: '01_MAIN_TEMPLATE.md',
      content: `# ${niche} template

For: ${audience}

## Outcome
When someone finishes this, they should have:

## Steps
1.
2.
3.
4.
5.

## Checklist
- [ ]
- [ ]
- [ ]

${notes ? `Custom notes:\n${notes}\n` : ''}`,
    },
    {
      name: '02_BONUS_CHECKLIST.md',
      content: `# Bonus checklist

Use this after the main template.

- [ ] Saved a duplicate
- [ ] Removed unused sections
- [ ] Exported a clean copy
`,
    },
  ];
}

function etsyTitle(kind: PackBrief['kind'], niche: string): string {
  if (kind === 'podcast') {
    return `${niche} Podcast Show Notes Template — Timestamps, Titles, Publish Checklist`;
  }
  if (kind === 'meeting') {
    return `${niche} Meeting Notes Template — Agenda, Decisions, Action Items`;
  }
  if (kind === 'student') {
    return `${niche} Student Planner Printable — Weekly Plan + Exam Cram Sheet`;
  }
  return `${niche} Digital Template Pack — Instant Download`;
}

function etsyListing(
  name: string,
  kind: PackBrief['kind'],
  niche: string,
  audience: string,
  price: string,
): string {
  return `# Etsy listing

**Title**
${etsyTitle(kind, niche)}

**Price**
$${price}

**About this item**
${name} is an instant-download markdown pack for ${audience}.

Open the files, duplicate them, and fill the blanks. No app lock-in.

You get:
- START_HERE guide
- Main template
- Extra checklist / titles / update file
- License

How it works:
1. Download the zip after purchase
2. Open START_HERE.md
3. Copy the template for your next ${kind === 'student' ? 'study week' : kind === 'meeting' ? 'meeting' : 'episode'}

You will need a text editor, Notion, Google Docs, or any markdown app.

This is a digital file. No physical item will be shipped.

**Personal use.** Do not resell the raw files.
`;
}

function gumroadListing(name: string, niche: string, audience: string, price: string): string {
  return `# Gumroad listing

**Title**
${name}

**Price**
$${price}

**Short pitch**
A ready ${niche} pack for ${audience}. Download, duplicate, publish.

**Description**
Stop rebuilding the same notes from a blank page.

This pack gives you the pages, checklists, and listing-ready structure so you can ship the next piece of work today.

Instant download. Edit in any text app.
`;
}

function pinCopy(name: string, niche: string, audience: string, price: string): string {
  return `# Pinterest / Shorts copy

Pin 1: ${name} — $${price} instant download
Pin 2: For ${audience}
Pin 3: ${niche} template you can duplicate this week
Pin 4: What's inside: template + checklist + license
Pin 5: Link in shop — digital file, no shipping

Short script (15s):
"If you keep starting from a blank page, use this ${niche} pack. Download, copy, fill. That's the whole system."
`;
}

function reviewChecklist(name: string): string {
  return `# Review before you upload — ${name}

- [ ] I opened every file
- [ ] The niche and audience are specific
- [ ] No brand names, celebrities, or logos I do not own
- [ ] Price is set
- [ ] START_HERE matches the files in the zip
- [ ] I would pay this price for this pack
`;
}

function tagsFor(kind: PackBrief['kind'], niche: string): string[] {
  const nicheTag = niche.toLowerCase();
  if (kind === 'podcast') {
    return [
      'podcast template',
      'show notes',
      'podcast planner',
      'youtube chapters',
      'content planner',
      nicheTag,
      'instant download',
      'digital download',
      'podcaster',
      'episode notes',
      'timestamps',
      'podcast toolkit',
      'creator template',
    ];
  }
  if (kind === 'meeting') {
    return [
      'meeting notes',
      'meeting agenda',
      'action items',
      'standup template',
      'team meeting',
      nicheTag,
      'instant download',
      'digital download',
      'productivity',
      'work from home',
      'project management',
      'notion alternative',
      'printable',
    ];
  }
  if (kind === 'student') {
    return [
      'student planner',
      'study planner',
      'exam planner',
      'weekly planner',
      'printable planner',
      nicheTag,
      'instant download',
      'digital download',
      'college planner',
      'study schedule',
      'cram sheet',
      'academic planner',
      'back to school',
    ];
  }
  return [
    'digital download',
    'instant download',
    'template',
    'printable',
    nicheTag,
    'planner',
    'checklist',
    'workbook',
    'productivity',
    'canva alternative',
    'markdown',
    'digital product',
    'creator tools',
  ];
}
