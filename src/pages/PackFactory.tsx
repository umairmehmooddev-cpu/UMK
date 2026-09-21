import {useEffect, useMemo, useState, type ReactNode} from 'react';
import {
  ArrowLeft,
  Check,
  ClipboardList,
  Copy,
  Download,
  Loader2,
  Package,
  RefreshCw,
  Search,
  Upload,
} from 'lucide-react';
import {downloadPackZip} from '../lib/downloadZip';
import {generateDigitalPack} from '../lib/generatePack';
import {researchTrendIdeas} from '../lib/researchTrends';
import type {DigitalPack, PackBrief, PackKind, TrendIdea} from '../lib/packTypes';
import {PACK_KIND_LABELS} from '../lib/packTypes';
import {evaluateUniqueness, loadCatalog, saveCatalogEntry} from '../lib/uniqueness';

type Step = 'brief' | 'review' | 'upload';

const STORAGE_KEY = 'umk-pack-factory';

const KINDS: PackKind[] = ['podcast', 'meeting', 'student', 'custom'];

type SavedState = {
  step: Step;
  brief: PackBrief;
  pack: DigitalPack | null;
  reviewChecks: Record<string, boolean>;
  uploadChecks: Record<string, boolean>;
};

const REVIEW_ITEMS = [
  {id: 'opened', label: 'I opened every file and it makes sense'},
  {id: 'specific', label: 'The niche and audience are specific enough to sell'},
  {id: 'legal', label: 'No brand names, celebrities, or logos I do not own'},
  {id: 'unique', label: 'This is my own angle, not a copy of someone else’s listing'},
  {id: 'price', label: 'I am happy with the price'},
  {id: 'pay', label: 'I would pay this price for this pack'},
];

const UPLOAD_ITEMS = [
  {id: 'zip', label: 'Download the zip'},
  {id: 'etsy', label: 'Create the Etsy listing (title, tags, description, zip)'},
  {id: 'gumroad', label: 'Create the Gumroad listing (title, description, zip)'},
  {id: 'pin', label: 'Schedule at least 5 pins or 1 short from PINTEREST_PINS.md'},
];

function emptyBrief(): PackBrief {
  return {kind: 'podcast', niche: '', audience: '', price: '12', notes: ''};
}

function loadSaved(): SavedState {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      return {step: 'brief', brief: emptyBrief(), pack: null, reviewChecks: {}, uploadChecks: {}};
    }
    const parsed = JSON.parse(raw) as SavedState;
    return {
      step: parsed.step || 'brief',
      brief: {...emptyBrief(), ...parsed.brief},
      pack: parsed.pack,
      reviewChecks: parsed.reviewChecks || {},
      uploadChecks: parsed.uploadChecks || {},
    };
  } catch {
    return {step: 'brief', brief: emptyBrief(), pack: null, reviewChecks: {}, uploadChecks: {}};
  }
}

export default function PackFactory() {
  const saved = useMemo(() => loadSaved(), []);
  const [step, setStep] = useState<Step>(saved.step);
  const [brief, setBrief] = useState<PackBrief>(saved.brief);
  const [pack, setPack] = useState<DigitalPack | null>(saved.pack);
  const [activeFile, setActiveFile] = useState(saved.pack?.files[0]?.name || '');
  const [reviewChecks, setReviewChecks] = useState<Record<string, boolean>>(saved.reviewChecks);
  const [uploadChecks, setUploadChecks] = useState<Record<string, boolean>>(saved.uploadChecks);
  const [revisionNotes, setRevisionNotes] = useState('');
  const [busy, setBusy] = useState(false);
  const [researching, setResearching] = useState(false);
  const [ideas, setIdeas] = useState<TrendIdea[]>([]);
  const [error, setError] = useState('');
  const [copied, setCopied] = useState('');
  const uniqueness = useMemo(() => evaluateUniqueness(brief, loadCatalog()), [brief]);

  useEffect(() => {
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({step, brief, pack, reviewChecks, uploadChecks}),
    );
  }, [step, brief, pack, reviewChecks, uploadChecks]);

  const currentFile = pack?.files.find((file) => file.name === activeFile) ?? pack?.files[0];
  const reviewReady = REVIEW_ITEMS.every((item) => reviewChecks[item.id]);

  const copyText = async (label: string, value: string) => {
    await navigator.clipboard.writeText(value);
    setCopied(label);
    setTimeout(() => setCopied(''), 1600);
  };

  const runResearch = async () => {
    setResearching(true);
    setError('');
    try {
      setIdeas(await researchTrendIdeas(brief.kind));
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Could not research ideas.';
      setError(message);
    } finally {
      setResearching(false);
    }
  };

  const pickIdea = (idea: TrendIdea) => {
    setBrief({
      kind: idea.kind,
      niche: idea.niche,
      audience: idea.audience,
      price: idea.price,
      notes: idea.uniqueAngle,
    });
  };

  const buildPack = async (notes?: string) => {
    const report = evaluateUniqueness(brief, loadCatalog());
    if (!report.ok) {
      setError('Fix the uniqueness blocks before I build a pack.');
      return;
    }
    setBusy(true);
    setError('');
    try {
      const next = await generateDigitalPack(brief, notes);
      setPack(next);
      setActiveFile(next.files[0]?.name || '');
      setReviewChecks({});
      setUploadChecks({});
      setRevisionNotes('');
      setStep('review');
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Could not build the pack.';
      setError(message);
    } finally {
      setBusy(false);
    }
  };

  const updateFile = (name: string, content: string) => {
    if (!pack) return;
    setPack({
      ...pack,
      files: pack.files.map((file) => (file.name === name ? {...file, content} : file)),
    });
  };

  return (
    <div className="space-y-6">
      <header className="space-y-2 pt-4">
        <p className="text-sm font-medium text-indigo-600">Product bot</p>
        <h1 className="text-4xl font-semibold tracking-tight text-neutral-900">Digital pack factory</h1>
        <p className="text-neutral-500 max-w-2xl">
          Research a specific angle, block copies and trademarks, build the pack, then you review and
          upload. It will not scrape other shops or publish for you.
        </p>
      </header>

      <ol className="grid grid-cols-3 gap-2 text-sm">
        {[
          {id: 'brief', label: '1. Brief'},
          {id: 'review', label: '2. Review'},
          {id: 'upload', label: '3. Upload'},
        ].map((item) => (
          <li
            key={item.id}
            className={`rounded-xl px-3 py-2 text-center border ${
              step === item.id
                ? 'bg-indigo-600 text-white border-indigo-600'
                : 'bg-white text-neutral-500 border-neutral-200'
            }`}
          >
            {item.label}
          </li>
        ))}
      </ol>

      {step === 'brief' && (
        <section className="bg-white rounded-2xl border border-neutral-200 shadow-sm p-6 sm:p-8 space-y-6">
          <BotLine>
            First I look for a specific buyer and job — not a clone of a popular listing. Then I
            build files. I do not scrape Etsy. Ideas come from demand patterns
            {process.env.GEMINI_API_KEY ? ' plus Gemini' : ''}
            , then a uniqueness check against trademarks and packs you already made.
          </BotLine>

          <div className="rounded-2xl border border-neutral-200 p-4 space-y-3">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <p className="font-medium text-neutral-900">Research trending angles</p>
              <button
                type="button"
                disabled={researching}
                onClick={runResearch}
                className="py-2 px-3 bg-neutral-900 hover:bg-neutral-800 disabled:bg-neutral-400 text-white text-sm font-medium rounded-xl inline-flex items-center gap-2"
              >
                {researching ? <Loader2 className="w-4 h-4 animate-spin" /> : <Search className="w-4 h-4" />}
                {researching ? 'Researching…' : 'Find ideas'}
              </button>
            </div>
            {ideas.length === 0 ? (
              <p className="text-sm text-neutral-500">
                Pick a pack type, then find ideas. Confirm demand on Etsy or Pinterest before you
                spend on ads — this is not a live marketplace scrape.
              </p>
            ) : (
              <div className="grid md:grid-cols-2 gap-3">
                {ideas.map((idea) => (
                  <button
                    key={idea.id}
                    type="button"
                    onClick={() => pickIdea(idea)}
                    className="text-left rounded-xl border border-neutral-200 hover:border-indigo-400 p-3 space-y-1"
                  >
                    <p className="font-medium text-neutral-900">{idea.title}</p>
                    <p className="text-xs uppercase tracking-wide text-indigo-600">
                      {PACK_KIND_LABELS[idea.kind]} · {idea.source === 'ai' ? 'Gemini' : 'pattern'}
                    </p>
                    <p className="text-sm text-neutral-600">{idea.whyItMightSell}</p>
                    <p className="text-sm text-neutral-800">
                      <span className="font-medium">Unique: </span>
                      {idea.uniqueAngle}
                    </p>
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="grid sm:grid-cols-2 gap-3">
            {KINDS.map((kind) => (
              <button
                key={kind}
                type="button"
                onClick={() => setBrief((current) => ({...current, kind}))}
                className={`text-left rounded-xl border p-4 transition-colors ${
                  brief.kind === kind
                    ? 'border-indigo-600 bg-indigo-50'
                    : 'border-neutral-200 hover:bg-neutral-50'
                }`}
              >
                <p className="font-medium text-neutral-900">{PACK_KIND_LABELS[kind]}</p>
                <p className="text-sm text-neutral-500 mt-1">
                  {kind === 'podcast' && 'Show notes, titles, chapters, publish list'}
                  {kind === 'meeting' && 'Agenda, decisions, actions, Slack update'}
                  {kind === 'student' && 'Weekly plan, cram sheet, Sunday reset'}
                  {kind === 'custom' && 'Your niche, generic template + listings'}
                </p>
              </button>
            ))}
          </div>

          <label className="block space-y-1">
            <span className="text-sm font-medium text-neutral-700">Niche</span>
            <input
              value={brief.niche}
              onChange={(event) => setBrief((current) => ({...current, niche: event.target.value}))}
              placeholder={
                brief.kind === 'podcast'
                  ? 'True-crime indie show'
                  : brief.kind === 'meeting'
                    ? 'Agency standup'
                    : brief.kind === 'student'
                      ? 'Nursing school exams'
                      : 'YouTube faceless scripts'
              }
              className="w-full rounded-xl border border-neutral-200 px-3 py-2 outline-none focus:border-indigo-500"
            />
          </label>

          <label className="block space-y-1">
            <span className="text-sm font-medium text-neutral-700">Who pays</span>
            <input
              value={brief.audience}
              onChange={(event) => setBrief((current) => ({...current, audience: event.target.value}))}
              placeholder="New hosts who publish weekly"
              className="w-full rounded-xl border border-neutral-200 px-3 py-2 outline-none focus:border-indigo-500"
            />
          </label>

          <label className="block space-y-1">
            <span className="text-sm font-medium text-neutral-700">Price (USD)</span>
            <input
              value={brief.price}
              onChange={(event) => setBrief((current) => ({...current, price: event.target.value}))}
              className="w-full rounded-xl border border-neutral-200 px-3 py-2 outline-none focus:border-indigo-500"
            />
          </label>

          <label className="block space-y-1">
            <span className="text-sm font-medium text-neutral-700">Anything the bot must include</span>
            <textarea
              value={brief.notes}
              onChange={(event) => setBrief((current) => ({...current, notes: event.target.value}))}
              rows={4}
              placeholder="Add a guest-episode section and a 15-second clip script."
              className="w-full rounded-xl border border-neutral-200 px-3 py-2 outline-none focus:border-indigo-500"
            />
          </label>

          <div
            className={`rounded-2xl border p-4 space-y-2 ${
              uniqueness.ok ? 'border-neutral-200 bg-neutral-50' : 'border-red-200 bg-red-50'
            }`}
          >
            <p className="font-medium text-neutral-900">
              Uniqueness score {uniqueness.score}/100 {uniqueness.ok ? '— can build' : '— blocked'}
            </p>
            {uniqueness.issues.length === 0 ? (
              <p className="text-sm text-neutral-600">
                No trademark or clone flags on this brief. Still open a search for the niche and
                make sure you are not rewriting someone else’s listing.
              </p>
            ) : (
              <ul className="text-sm space-y-1">
                {uniqueness.issues.map((issue) => (
                  <li
                    key={issue.message}
                    className={issue.level === 'block' ? 'text-red-800' : 'text-amber-800'}
                  >
                    {issue.level === 'block' ? 'Block: ' : 'Warn: '}
                    {issue.message}
                  </li>
                ))}
              </ul>
            )}
          </div>

          {error && (
            <div className="p-4 bg-red-50 text-red-700 rounded-xl border border-red-200 text-sm">{error}</div>
          )}

          <button
            type="button"
            disabled={busy || !uniqueness.ok}
            onClick={() => buildPack()}
            className="w-full py-3 px-4 bg-indigo-600 hover:bg-indigo-700 disabled:bg-neutral-300 text-white font-medium rounded-xl flex items-center justify-center gap-2"
          >
            {busy ? <Loader2 className="w-5 h-5 animate-spin" /> : <Package className="w-5 h-5" />}
            {busy ? 'Building pack…' : uniqueness.ok ? 'Build pack for review' : 'Fix uniqueness blocks first'}
          </button>
        </section>
      )}

      {step === 'review' && pack && (
        <section className="space-y-4">
          <BotLine>
            Pack is ready ({pack.builtBy === 'ai' ? 'written by Gemini' : 'built from the template engine'}
            ). Edit any file. Check the boxes only if you actually reviewed it. I will not move to upload
            until you approve.
          </BotLine>

          <div className="bg-white rounded-2xl border border-neutral-200 shadow-sm p-5 space-y-2">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <h2 className="text-xl font-semibold text-neutral-900">{pack.productName}</h2>
                <p className="text-sm text-neutral-500">
                  ${pack.price} · {pack.audience}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setStep('brief')}
                className="text-sm text-neutral-600 hover:text-neutral-900 inline-flex items-center gap-1"
              >
                <ArrowLeft className="w-4 h-4" />
                Edit brief
              </button>
            </div>
            <p className="text-neutral-700">{pack.shortPitch}</p>
            <p className="text-sm text-neutral-500">
              Saved to your local catalog so the next research pass can reject a near-copy of this pack.
            </p>
          </div>

          <div className="grid lg:grid-cols-[220px_1fr] gap-4">
            <aside className="bg-white rounded-2xl border border-neutral-200 p-3 space-y-1">
              {pack.files.map((file) => (
                <button
                  key={file.name}
                  type="button"
                  onClick={() => setActiveFile(file.name)}
                  className={`w-full text-left text-sm rounded-lg px-3 py-2 ${
                    currentFile?.name === file.name
                      ? 'bg-indigo-50 text-indigo-800'
                      : 'text-neutral-600 hover:bg-neutral-50'
                  }`}
                >
                  {file.name}
                </button>
              ))}
            </aside>

            <div className="bg-white rounded-2xl border border-neutral-200 p-4 space-y-2">
              <p className="text-sm font-medium text-neutral-700">{currentFile?.name}</p>
              <textarea
                value={currentFile?.content ?? ''}
                onChange={(event) => currentFile && updateFile(currentFile.name, event.target.value)}
                className="w-full min-h-[420px] font-mono text-sm rounded-xl border border-neutral-200 p-3 outline-none focus:border-indigo-500"
              />
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-neutral-200 p-5 space-y-3">
            <p className="font-medium text-neutral-900 inline-flex items-center gap-2">
              <ClipboardList className="w-4 h-4" />
              Review gate
            </p>
            {REVIEW_ITEMS.map((item) => (
              <label key={item.id} className="flex items-start gap-3 text-sm text-neutral-700">
                <input
                  type="checkbox"
                  checked={!!reviewChecks[item.id]}
                  onChange={(event) =>
                    setReviewChecks((current) => ({...current, [item.id]: event.target.checked}))
                  }
                  className="mt-1"
                />
                {item.label}
              </label>
            ))}
          </div>

          <div className="bg-white rounded-2xl border border-neutral-200 p-5 space-y-3">
            <p className="font-medium text-neutral-900">Need changes?</p>
            <textarea
              value={revisionNotes}
              onChange={(event) => setRevisionNotes(event.target.value)}
              rows={3}
              placeholder="Make the titles shorter. Add a guest section."
              className="w-full rounded-xl border border-neutral-200 px-3 py-2 outline-none focus:border-indigo-500"
            />
            <div className="flex flex-col sm:flex-row gap-3">
              <button
                type="button"
                disabled={busy || !revisionNotes.trim()}
                onClick={() => buildPack(revisionNotes)}
                className="flex-1 py-3 px-4 border border-neutral-300 rounded-xl font-medium text-neutral-800 hover:bg-neutral-50 disabled:opacity-50 inline-flex items-center justify-center gap-2"
              >
                {busy ? <Loader2 className="w-5 h-5 animate-spin" /> : <RefreshCw className="w-5 h-5" />}
                Rebuild with my notes
              </button>
              <button
                type="button"
                disabled={!reviewReady}
                onClick={() => {
                  saveCatalogEntry({
                    slug: pack.slug,
                    productName: pack.productName,
                    niche: pack.niche,
                    etsyTitle: pack.etsyTitle,
                  });
                  setStep('upload');
                }}
                className="flex-1 py-3 px-4 bg-indigo-600 hover:bg-indigo-700 disabled:bg-neutral-300 text-white font-medium rounded-xl inline-flex items-center justify-center gap-2"
              >
                <Check className="w-5 h-5" />
                {reviewReady ? 'Approve and go to upload' : 'Check every review box first'}
              </button>
            </div>
          </div>
        </section>
      )}

      {step === 'upload' && pack && (
        <section className="space-y-4">
          <BotLine>
            You approved {pack.productName}. I will not log into Etsy or Gumroad. Download the zip, copy
            the listing fields, then tick each box when you have done it.
          </BotLine>

          <div className="bg-white rounded-2xl border border-neutral-200 shadow-sm p-5 space-y-4">
            <div className="flex flex-wrap gap-3">
              <button
                type="button"
                onClick={() => downloadPackZip(pack)}
                className="py-3 px-4 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-xl inline-flex items-center gap-2"
              >
                <Download className="w-5 h-5" />
                Download zip
              </button>
              <button
                type="button"
                onClick={() => setStep('review')}
                className="py-3 px-4 border border-neutral-300 rounded-xl font-medium text-neutral-800 hover:bg-neutral-50 inline-flex items-center gap-2"
              >
                <ArrowLeft className="w-4 h-4" />
                Back to review
              </button>
            </div>

            <CopyRow
              label="Etsy title"
              value={pack.etsyTitle}
              copied={copied}
              onCopy={copyText}
            />
            <CopyRow
              label="Gumroad title"
              value={pack.gumroadTitle}
              copied={copied}
              onCopy={copyText}
            />
            <CopyRow label="Price" value={`$${pack.price}`} copied={copied} onCopy={copyText} />
            <CopyRow
              label="Tags"
              value={pack.tags.join(', ')}
              copied={copied}
              onCopy={copyText}
            />
            <CopyRow
              label="Pitch"
              value={pack.shortPitch}
              copied={copied}
              onCopy={copyText}
            />
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <ol className="bg-white rounded-2xl border border-neutral-200 p-5 space-y-2 text-sm text-neutral-700 list-decimal list-inside">
              <p className="font-medium text-neutral-900 not-italic">Etsy</p>
              <li>Open Etsy Seller → Add a listing → Digital.</li>
              <li>Paste the title, tags, and ETSY_LISTING.md description.</li>
              <li>Upload the zip as the downloadable file.</li>
              <li>Set ${pack.price} and publish.</li>
            </ol>
            <ol className="bg-white rounded-2xl border border-neutral-200 p-5 space-y-2 text-sm text-neutral-700 list-decimal list-inside">
              <p className="font-medium text-neutral-900">Gumroad</p>
              <li>New product → Digital product.</li>
              <li>Paste the Gumroad title and GUMROAD_LISTING.md.</li>
              <li>Upload the same zip.</li>
              <li>Set ${pack.price} and make it visible.</li>
            </ol>
          </div>

          <div className="bg-white rounded-2xl border border-neutral-200 p-5 space-y-3">
            <p className="font-medium text-neutral-900 inline-flex items-center gap-2">
              <Upload className="w-4 h-4" />
              Upload checklist
            </p>
            {UPLOAD_ITEMS.map((item) => (
              <label key={item.id} className="flex items-start gap-3 text-sm text-neutral-700">
                <input
                  type="checkbox"
                  checked={!!uploadChecks[item.id]}
                  onChange={(event) =>
                    setUploadChecks((current) => ({...current, [item.id]: event.target.checked}))
                  }
                  className="mt-1"
                />
                {item.label}
              </label>
            ))}
            {UPLOAD_ITEMS.every((item) => uploadChecks[item.id]) && (
              <p className="text-sm text-green-700 bg-green-50 border border-green-200 rounded-xl p-3">
                This pack is listed. Start a new brief when you want the next one.
              </p>
            )}
            <button
              type="button"
              onClick={() => {
                setStep('brief');
                setPack(null);
                setReviewChecks({});
                setUploadChecks({});
                setRevisionNotes('');
              }}
              className="text-sm font-medium text-indigo-600 hover:text-indigo-800"
            >
              Build another pack
            </button>
          </div>
        </section>
      )}
    </div>
  );
}

function BotLine({children}: {children: ReactNode}) {
  return (
    <div className="rounded-2xl bg-indigo-50 border border-indigo-100 px-4 py-3 text-sm text-indigo-950">
      <span className="font-semibold">Bot:</span> {children}
    </div>
  );
}

function CopyRow({
  label,
  value,
  copied,
  onCopy,
}: {
  label: string;
  value: string;
  copied: string;
  onCopy: (label: string, value: string) => void;
}) {
  return (
    <div className="space-y-1">
      <div className="flex items-center justify-between gap-2">
        <p className="text-sm font-medium text-neutral-700">{label}</p>
        <button
          type="button"
          onClick={() => onCopy(label, value)}
          className="text-sm text-indigo-600 hover:text-indigo-800 inline-flex items-center gap-1"
        >
          {copied === label ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
          {copied === label ? 'Copied' : 'Copy'}
        </button>
      </div>
      <p className="text-sm text-neutral-800 bg-neutral-50 border border-neutral-200 rounded-xl px-3 py-2">
        {value}
      </p>
    </div>
  );
}
