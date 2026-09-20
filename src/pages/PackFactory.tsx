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
  Upload,
} from 'lucide-react';
import {downloadPackZip} from '../lib/downloadZip';
import {generateDigitalPack} from '../lib/generatePack';
import type {DigitalPack, PackBrief, PackKind} from '../lib/packTypes';
import {PACK_KIND_LABELS} from '../lib/packTypes';

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
  const [error, setError] = useState('');
  const [copied, setCopied] = useState('');

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

  const buildPack = async (notes?: string) => {
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
          The bot builds the pack. You review it. Only after you approve does it ask you to upload.
          It will not publish to Etsy or Gumroad for you.
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
            Tell me the pack. I will generate the files, listing copy, pins, and a review checklist.
            {process.env.GEMINI_API_KEY
              ? ' Gemini will write a custom pack.'
              : ' No Gemini key is set, so I will build a complete template pack you can still edit and sell.'}
          </BotLine>

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

          {error && (
            <div className="p-4 bg-red-50 text-red-700 rounded-xl border border-red-200 text-sm">{error}</div>
          )}

          <button
            type="button"
            disabled={busy}
            onClick={() => buildPack()}
            className="w-full py-3 px-4 bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-400 text-white font-medium rounded-xl flex items-center justify-center gap-2"
          >
            {busy ? <Loader2 className="w-5 h-5 animate-spin" /> : <Package className="w-5 h-5" />}
            {busy ? 'Building pack…' : 'Build pack for review'}
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
                onClick={() => setStep('upload')}
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
