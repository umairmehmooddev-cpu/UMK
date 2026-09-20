import {useState} from 'react';
import {FileAudio, Package} from 'lucide-react';
import PackFactory from './pages/PackFactory';
import Transcriber from './pages/Transcriber';

type View = 'factory' | 'transcribe';

export default function App() {
  const [view, setView] = useState<View>('factory');

  return (
    <div className="min-h-screen bg-neutral-50 p-4 sm:p-8 font-sans text-neutral-900">
      <div className="max-w-5xl mx-auto space-y-6">
        <nav className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => setView('factory')}
            className={`inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium border ${
              view === 'factory'
                ? 'bg-indigo-600 text-white border-indigo-600'
                : 'bg-white text-neutral-700 border-neutral-200 hover:bg-neutral-100'
            }`}
          >
            <Package className="w-4 h-4" />
            Product bot
          </button>
          <button
            type="button"
            onClick={() => setView('transcribe')}
            className={`inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium border ${
              view === 'transcribe'
                ? 'bg-indigo-600 text-white border-indigo-600'
                : 'bg-white text-neutral-700 border-neutral-200 hover:bg-neutral-100'
            }`}
          >
            <FileAudio className="w-4 h-4" />
            Transcriber
          </button>
        </nav>

        {view === 'factory' ? <PackFactory /> : <Transcriber />}
      </div>
    </div>
  );
}
