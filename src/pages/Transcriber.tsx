import {useRef, useState} from 'react';
import {Check, Copy, FileAudio, Loader2, RefreshCw, Upload} from 'lucide-react';
import {GoogleGenAI} from '@google/genai';

const ai = new GoogleGenAI({apiKey: process.env.GEMINI_API_KEY});

export default function Transcriber() {
  const [file, setFile] = useState<File | null>(null);
  const [isTranscribing, setIsTranscribing] = useState(false);
  const [transcription, setTranscription] = useState('');
  const [error, setError] = useState('');
  const [copied, setCopied] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const acceptAudio = (selected: File | undefined) => {
    if (!selected) return;
    if (selected.type.startsWith('audio/') || selected.name.endsWith('.mp3')) {
      setFile(selected);
      setTranscription('');
      setError('');
      return;
    }
    setError('Please select a valid audio file (e.g., MP3).');
  };

  const transcribeAudio = async () => {
    if (!file) return;

    setIsTranscribing(true);
    setError('');
    setTranscription('');

    try {
      const reader = new FileReader();
      reader.readAsDataURL(file);

      reader.onload = async () => {
        try {
          const result = reader.result as string;
          const base64Data = result.split(',')[1];
          const mimeType = file.type || 'audio/mp3';

          const response = await ai.models.generateContent({
            model: 'gemini-3-flash-preview',
            contents: {
              parts: [
                {
                  inlineData: {
                    data: base64Data,
                    mimeType,
                  },
                },
                {
                  text: 'Please transcribe this audio accurately. Only output the transcription, nothing else.',
                },
              ],
            },
          });

          setTranscription(response.text || 'No transcription generated.');
        } catch (err: unknown) {
          const message = err instanceof Error ? err.message : 'An error occurred during transcription.';
          setError(message);
        } finally {
          setIsTranscribing(false);
        }
      };

      reader.onerror = () => {
        setError('Failed to read the file.');
        setIsTranscribing(false);
      };
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'An error occurred while processing the file.';
      setError(message);
      setIsTranscribing(false);
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(transcription);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-8">
      <header className="text-center space-y-2 pt-4">
        <h1 className="text-4xl font-semibold tracking-tight text-neutral-900">Audio Transcriber</h1>
        <p className="text-neutral-500">Upload an MP3 file to get an accurate text transcription.</p>
      </header>

      <div className="bg-white rounded-2xl shadow-sm border border-neutral-200 p-6 sm:p-8">
        {!file ? (
          <div
            onDrop={(event) => {
              event.preventDefault();
              acceptAudio(event.dataTransfer.files?.[0]);
            }}
            onDragOver={(event) => event.preventDefault()}
            onClick={() => fileInputRef.current?.click()}
            className="border-2 border-dashed border-neutral-300 rounded-xl p-12 text-center cursor-pointer hover:bg-neutral-50 transition-colors flex flex-col items-center justify-center space-y-4"
          >
            <div className="w-16 h-16 bg-indigo-50 text-indigo-600 rounded-full flex items-center justify-center">
              <Upload className="w-8 h-8" />
            </div>
            <div>
              <p className="text-lg font-medium text-neutral-700">Click to upload or drag and drop</p>
              <p className="text-sm text-neutral-500">MP3, WAV, M4A up to 20MB</p>
            </div>
            <input
              type="file"
              ref={fileInputRef}
              onChange={(event) => acceptAudio(event.target.files?.[0])}
              accept="audio/*"
              className="hidden"
            />
          </div>
        ) : (
          <div className="space-y-6">
            <div className="flex items-center justify-between bg-neutral-50 p-4 rounded-xl border border-neutral-200">
              <div className="flex items-center space-x-4 overflow-hidden">
                <div className="w-12 h-12 bg-indigo-100 text-indigo-600 rounded-lg flex items-center justify-center shrink-0">
                  <FileAudio className="w-6 h-6" />
                </div>
                <div className="min-w-0">
                  <p className="font-medium text-neutral-900 truncate">{file.name}</p>
                  <p className="text-sm text-neutral-500">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                </div>
              </div>
              <button
                onClick={() => {
                  setFile(null);
                  setTranscription('');
                  setError('');
                }}
                className="p-2 text-neutral-500 hover:text-neutral-700 hover:bg-neutral-200 rounded-lg transition-colors shrink-0"
                title="Choose different file"
              >
                <RefreshCw className="w-5 h-5" />
              </button>
            </div>

            <audio controls src={URL.createObjectURL(file)} className="w-full" />

            {!transcription && !isTranscribing && (
              <button
                onClick={transcribeAudio}
                className="w-full py-3 px-4 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-xl transition-colors flex items-center justify-center space-x-2"
              >
                <FileAudio className="w-5 h-5" />
                <span>Transcribe Audio</span>
              </button>
            )}

            {isTranscribing && (
              <div className="flex flex-col items-center justify-center py-8 space-y-4">
                <Loader2 className="w-8 h-8 text-indigo-600 animate-spin" />
                <p className="text-neutral-600 font-medium animate-pulse">Transcribing your audio...</p>
              </div>
            )}

            {error && (
              <div className="p-4 bg-red-50 text-red-700 rounded-xl border border-red-200">
                <p className="font-medium">Error</p>
                <p className="text-sm">{error}</p>
              </div>
            )}
          </div>
        )}
      </div>

      {transcription && (
        <div className="bg-white rounded-2xl shadow-sm border border-neutral-200 p-6 sm:p-8 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-neutral-900">Transcription</h2>
            <button
              onClick={copyToClipboard}
              className="flex items-center space-x-1 text-sm text-indigo-600 hover:text-indigo-700 font-medium transition-colors"
            >
              {copied ? (
                <>
                  <Check className="w-4 h-4" />
                  <span>Copied!</span>
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4" />
                  <span>Copy</span>
                </>
              )}
            </button>
          </div>
          <p className="whitespace-pre-wrap text-neutral-700 leading-relaxed">{transcription}</p>
        </div>
      )}
    </div>
  );
}
