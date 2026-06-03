const config = {
  success: {
    bg: 'bg-white',
    border: 'border-emerald-200',
    icon: (
      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-emerald-100">
        <svg className="h-4 w-4 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
        </svg>
      </div>
    ),
    text: 'text-slate-800',
  },
  error: {
    bg: 'bg-white',
    border: 'border-red-200',
    icon: (
      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-red-100">
        <svg className="h-4 w-4 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
        </svg>
      </div>
    ),
    text: 'text-slate-800',
  },
  info: {
    bg: 'bg-white',
    border: 'border-brand-200',
    icon: (
      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-brand-100">
        <svg className="h-4 w-4 text-brand-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      </div>
    ),
    text: 'text-slate-800',
  },
};

export default function Toast({ message, type = 'success' }) {
  const c = config[type] || config.success;
  return (
    <div
      role="alert"
      className={`animate-slide-in flex items-center gap-3 rounded-xl border ${c.border} ${c.bg} px-4 py-3 shadow-glass backdrop-blur-sm`}
    >
      {c.icon}
      <span className={`text-sm font-medium ${c.text}`}>{message}</span>
    </div>
  );
}
