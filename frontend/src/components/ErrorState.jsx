export default function ErrorState({ message, onRetry }) {
  return (
    <div className="animate-scale-in flex flex-col items-center justify-center rounded-2xl border border-red-100 bg-gradient-to-b from-red-50/40 to-white py-16 text-center">
      {/* Icon */}
      <div className="mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-red-100">
        <svg
          className="h-8 w-8 text-red-500"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={1.5}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z"
          />
        </svg>
      </div>

      <h3 className="text-lg font-bold text-slate-900">Something went wrong</h3>
      <p className="mt-2 max-w-sm text-sm leading-relaxed text-slate-500">
        {message || 'An unexpected error occurred. Please try again.'}
      </p>

      {onRetry && (
        <button
          id="error-retry-btn"
          type="button"
          onClick={onRetry}
          className="btn-primary mt-8 gap-2"
        >
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
          Try again
        </button>
      )}
    </div>
  );
}
