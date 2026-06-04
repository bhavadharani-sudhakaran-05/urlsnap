import { Link } from 'react-router-dom';

export default function GenericPage({ title }) {
  return (
    <div className="flex min-h-screen flex-col bg-[#0A0A0A] text-zinc-200 font-sans selection:bg-coral/30 selection:text-white">
      {/* Simple Header */}
      <header className="flex items-center justify-between px-6 py-4 border-b border-zinc-800/80">
        <Link to="/" className="flex items-center gap-2.5">
          <div className="flex h-8 w-8 items-center justify-center rounded-md bg-coral text-white">
            <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
              <path d="M13 2L3 14h8l-1 8 10-12h-8l1-8z" />
            </svg>
          </div>
          <span className="text-lg font-bold tracking-tight text-white">Zestlink</span>
        </Link>
      </header>

      {/* Content */}
      <main className="flex-1 flex flex-col items-center justify-center px-6 text-center">
        <h1 className="text-4xl md:text-5xl font-extrabold tracking-tighter text-white mb-6">
          {title}
        </h1>
        <p className="text-lg text-zinc-400 max-w-2xl mx-auto">
          We are currently working hard on this page. Check back soon for updates!
        </p>
        <Link to="/" className="mt-8 inline-flex items-center justify-center rounded-lg border border-zinc-700 bg-zinc-800/50 px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-zinc-700">
          ← Return to Home
        </Link>
      </main>
    </div>
  );
}
