/* Shared shimmer style */
const shimmerClass =
  'animate-pulse rounded-xl bg-gradient-to-r from-slate-200 via-slate-100 to-slate-200 bg-[length:400%_100%]';

export function SkeletonCard() {
  return (
    <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-glass">
      {/* Accent bar */}
      <div className={`mb-4 h-1 w-full rounded-full ${shimmerClass}`} />
      <div className="space-y-3">
        <div className={`h-3.5 w-3/4 ${shimmerClass}`} />
        <div className={`h-3 w-full ${shimmerClass}`} />
        <div className={`h-3 w-1/2 ${shimmerClass}`} />
      </div>
      {/* Stats row */}
      <div className="mt-4 grid grid-cols-3 gap-2">
        {[0, 1, 2].map((i) => (
          <div key={i} className={`h-12 rounded-xl ${shimmerClass}`} />
        ))}
      </div>
      {/* Action bar */}
      <div className="mt-4 flex gap-2 border-t border-slate-100 pt-4">
        {[0, 1, 2, 3].map((i) => (
          <div key={i} className={`h-7 w-14 rounded-lg ${shimmerClass}`} />
        ))}
      </div>
    </div>
  );
}

export function SkeletonTable({ rows = 5 }) {
  return (
    <div className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-glass">
      {/* Table header */}
      <div className="mb-5 flex gap-4 border-b border-slate-100 pb-3">
        {[40, 20, 20, 15].map((w, i) => (
          <div key={i} className={`h-3 rounded ${shimmerClass}`} style={{ width: `${w}%` }} />
        ))}
      </div>
      {/* Rows */}
      <div className="space-y-3">
        {Array.from({ length: rows }).map((_, i) => (
          <div key={i} className="flex gap-4 py-1">
            {[35, 15, 15, 15].map((w, j) => (
              <div key={j} className={`h-4 rounded ${shimmerClass}`} style={{ width: `${w}%` }} />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

export function SkeletonStatCards() {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {Array.from({ length: 4 }).map((_, i) => (
        <div key={i} className={`h-28 rounded-2xl ${shimmerClass}`} />
      ))}
    </div>
  );
}
