import { useEffect, useState } from 'react';
import { Database, Zap, CheckCircle2, AlertCircle, Layout, Sparkles } from 'lucide-react';
import { checkBackendHealth, POCKETBASE_URL } from './lib/pocketbase';

export default function App() {
  const [backendStatus, setBackendStatus] = useState<{
    loading: boolean;
    ok: boolean;
    message: string;
  }>({
    loading: true,
    ok: false,
    message: 'Checking connection...',
  });

  useEffect(() => {
    checkBackendHealth().then((res) => {
      setBackendStatus({
        loading: false,
        ok: res.ok,
        message: res.message,
      });
    });
  }, []);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col selection:bg-indigo-500 selection:text-white">
      {/* Top Navbar */}
      <header className="border-b border-slate-800/80 bg-slate-900/40 backdrop-blur sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-9 w-9 rounded-lg bg-indigo-600 flex items-center justify-center shadow-lg shadow-indigo-600/30">
              <Zap className="h-5 w-5 text-white" />
            </div>
            <div>
              <span className="font-bold text-lg tracking-tight text-white">Web_template</span>
              <span className="text-xs ml-2 px-2 py-0.5 rounded-full bg-indigo-950 border border-indigo-700/50 text-indigo-300 font-medium">
                Hackathon Scaffold
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3 text-sm">
            <span className="flex items-center gap-2 px-3 py-1 rounded-full border border-slate-800 bg-slate-900/80">
              <span
                className={`h-2 w-2 rounded-full ${
                  backendStatus.ok
                    ? 'bg-emerald-400 animate-pulse'
                    : 'bg-amber-400'
                }`}
              />
              <span className="text-xs text-slate-300">
                {backendStatus.loading
                  ? 'Connecting DB...'
                  : backendStatus.ok
                  ? 'PocketBase Online'
                  : 'PocketBase Standby'}
              </span>
            </span>
          </div>
        </div>
      </header>

      {/* Main Scaffold Content */}
      <main className="flex-1 max-w-6xl w-full mx-auto px-6 py-12 flex flex-col justify-center">
        <div className="max-w-2xl mx-auto text-center space-y-4 mb-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-semibold uppercase tracking-wider">
            <Sparkles className="h-3.5 w-3.5" />
            Scaffold Armed & Ready
          </div>
          <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl text-white">
            Ready for Hackathon Execution
          </h1>
          <p className="text-slate-400 text-base sm:text-lg">
            Frontend foundation, PocketBase client, and Tailwind v4 are pre-wired.
            Provide your Problem Statement to begin building MVP components.
          </p>
        </div>

        {/* Status Verification Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto w-full">
          {/* Frontend Card */}
          <div className="p-6 rounded-xl border border-slate-800 bg-slate-900/50 backdrop-blur">
            <div className="h-10 w-10 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center mb-4">
              <Layout className="h-5 w-5 text-emerald-400" />
            </div>
            <h3 className="font-semibold text-white text-base mb-1">Frontend Stack</h3>
            <p className="text-xs text-slate-400 mb-4">
              React 19 + TypeScript + Vite + Tailwind CSS v4 + Lucide Icons.
            </p>
            <div className="flex items-center gap-2 text-xs font-medium text-emerald-400">
              <CheckCircle2 className="h-4 w-4" />
              <span>Dev Server Active</span>
            </div>
          </div>

          {/* Backend Card */}
          <div className="p-6 rounded-xl border border-slate-800 bg-slate-900/50 backdrop-blur">
            <div className="h-10 w-10 rounded-lg bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center mb-4">
              <Database className="h-5 w-5 text-indigo-400" />
            </div>
            <h3 className="font-semibold text-white text-base mb-1">PocketBase Backend</h3>
            <p className="text-xs text-slate-400 mb-4">
              Configured for <code className="text-indigo-300 text-xs">{POCKETBASE_URL}</code>.
            </p>
            <div className="flex items-center gap-2 text-xs font-medium">
              {backendStatus.ok ? (
                <>
                  <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                  <span className="text-emerald-400">Connected</span>
                </>
              ) : (
                <>
                  <AlertCircle className="h-4 w-4 text-amber-400" />
                  <span className="text-amber-400">Run backend/start-backend.bat</span>
                </>
              )}
            </div>
          </div>

          {/* Pipeline Card */}
          <div className="p-6 rounded-xl border border-slate-800 bg-slate-900/50 backdrop-blur">
            <div className="h-10 w-10 rounded-lg bg-purple-500/10 border border-purple-500/20 flex items-center justify-center mb-4">
              <Zap className="h-5 w-5 text-purple-400" />
            </div>
            <h3 className="font-semibold text-white text-base mb-1">Agent Pipeline</h3>
            <p className="text-xs text-slate-400 mb-4">
              Ideation, competitor teardown, and MVP scoping specs ready in <code className="text-purple-300 text-xs">spec/</code>.
            </p>
            <div className="flex items-center gap-2 text-xs font-medium text-purple-400">
              <CheckCircle2 className="h-4 w-4" />
              <span>Awaiting Problem Statement</span>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-800/80 py-6 text-center text-xs text-slate-500">
        Web_template • Zero cold-start hackathon environment
      </footer>
    </div>
  );
}
