import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getPublicStats } from '../api/analyticsApi';
import { formatDateTime } from '../utils/formatDate';
import ErrorState from '../components/ErrorState';

export default function PublicStats() {
  const { shortCode } = useParams();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const load = async () => {
      try {
        const res = await getPublicStats(shortCode);
        setData(res.data.data);
      } catch (err) {
        setError(err.response?.data?.message || 'Stats not found');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [shortCode]);

  /* ── Loading ─── */
  if (loading) {
    return (
      <div
        className="flex min-h-screen items-center justify-center"
        style={{ background: 'linear-gradient(145deg, #1a0325, #2e073f, #531669)' }}
      >
        <div className="flex flex-col items-center gap-4">
          <div className="h-12 w-12 animate-spin rounded-full border-4 border-white/20 border-t-white" />
          <p className="text-sm font-medium text-white/60">Loading stats…</p>
        </div>
      </div>
    );
  }

  /* ── Error ─── */
  if (error) {
    return (
      <div
        className="flex min-h-screen flex-col items-center justify-center gap-6 p-6"
        style={{ background: 'linear-gradient(145deg, #1a0325, #2e073f, #531669)' }}
      >
        <div className="w-full max-w-md">
          <ErrorState message={error} />
        </div>
        <Link
          to="/login"
          className="text-sm font-medium text-white/70 underline underline-offset-2 hover:text-white transition-colors"
        >
          Sign in to LinkSnap
        </Link>
      </div>
    );
  }

  /* ── Stats ─── */
  if (!data) {
    return (
      <div className="flex min-h-screen items-center justify-center" style={{ background: '#111' }}>
        <p className="text-white">No data available for this link.</p>
      </div>
    );
  }
  return (
    <div
      className="flex min-h-screen flex-col items-center justify-center p-4 md:p-8"
      style={{ background: 'linear-gradient(145deg, #1a0325 0%, #2e073f 50%, #531669 100%)' }}
    >
      {/* Background orbs */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div
          className="animate-orb absolute -top-32 -left-32 h-96 w-96 rounded-full opacity-20"
          style={{ background: 'radial-gradient(circle, #b88ece 0%, transparent 70%)' }}
        />
        <div
          className="animate-orb anim-delay-4 absolute bottom-0 right-0 h-80 w-80 rounded-full opacity-15"
          style={{ background: 'radial-gradient(circle, #8e37a8 0%, transparent 70%)' }}
        />
      </div>

      <div className="relative w-full max-w-md animate-fade-in-up">

        {/* Logo chip */}
        <div className="mb-6 flex justify-center">
          <div className="flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-2 backdrop-blur">
            <span className="text-lg">⚡</span>
            <span className="text-sm font-bold text-white">LinkSnap</span>
          </div>
        </div>

        {/* Main card */}
        <div className="overflow-hidden rounded-2xl bg-white shadow-glow-lg">

          {/* Card header */}
          <div className="px-8 pb-0 pt-8 text-center">
            <div className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-xl text-3xl"
              style={{ background: 'linear-gradient(135deg, #f5eff8, #eadbed)' }}
            >
              📊
            </div>
            <h1 className="text-2xl font-bold text-slate-900">Public Statistics</h1>
            <div className="mt-2 inline-flex items-center gap-1.5 rounded-full bg-brand-50 px-3 py-1">
              <span className="font-mono text-sm font-semibold text-brand-600">/{data.shortCode}</span>
            </div>
          </div>

          {/* Stats grid */}
          <div className="grid grid-cols-2 gap-3 p-8">
            <StatBox
              label="Total Clicks"
              value={data.clickCount}
              gradient="linear-gradient(135deg, #6c2285, #2e073f)"
              glow="rgba(142,55,168,0.2)"
              white
            />
            <StatBox
              label="Total Visits"
              value={data.totalVisits}
              gradient="linear-gradient(135deg, #4f46e5, #1e1b4b)"
              glow="rgba(79,70,229,0.2)"
              white
            />
            <div className="col-span-2">
              <StatBox label="Last Visit" value={formatDateTime(data.lastVisit) || 'No visits yet'} />
            </div>
            <div className="col-span-2">
              <StatBox label="Created" value={formatDateTime(data.createdAt)} />
            </div>
          </div>

          {/* Footer */}
          <div className="border-t border-slate-100 px-8 py-4 text-center">
            <p className="text-xs text-slate-400">
              Powered by{' '}
              <Link to="/login" className="font-semibold text-brand-600 hover:text-brand-700 transition-colors">
                LinkSnap
              </Link>
              {' '}· Secure URL shortener
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

function StatBox({ label, value, gradient, glow, white }) {
  if (gradient) {
    return (
      <div
        className="rounded-xl p-4 text-center"
        style={{ background: gradient, boxShadow: `0 4px 14px ${glow}` }}
      >
        <p className="text-xs font-semibold uppercase tracking-widest text-white/60">{label}</p>
        <p className="mt-1 text-3xl font-bold text-white">{value}</p>
      </div>
    );
  }
  return (
    <div className="rounded-xl bg-slate-50 p-4 text-center">
      <p className="text-xs font-semibold uppercase tracking-widest text-slate-400">{label}</p>
      <p className="mt-1 text-sm font-semibold text-slate-800">{value || '—'}</p>
    </div>
  );
}
