import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { bulkUploadCsv } from '../api/urlApi';
import { useToast } from '../context/ToastContext';
import { getApiError } from '../utils/getApiError';
import PageHeader from '../components/PageHeader';
import PageTransition, { StaggerItem } from '../components/layout/PageTransition';
import GradientButton from '../components/ui/GradientButton';

const SAMPLE_CSV = `originalUrl,customAlias,expiryDate
https://example.com/page1,promo-2024,
https://example.com/page2,,2026-12-31`;

export default function BulkUpload() {
  const [csv, setCsv] = useState('');
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState(null);
  const { showToast } = useToast();
  const navigate = useNavigate();

  const lineCount = csv ? csv.trim().split('\n').length : 0;
  const dataLines = lineCount > 1 ? lineCount - 1 : 0; // minus header

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setResults(null);
    try {
      const { data } = await bulkUploadCsv(csv);
      setResults(data.data);
      showToast(`Created ${data.data.created.length} URL${data.data.created.length !== 1 ? 's' : ''}`);
    } catch (err) {
      showToast(getApiError(err, 'Bulk upload failed'), 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <PageTransition className="mx-auto max-w-2xl space-y-6">
      <StaggerItem>
      <PageHeader
        title="Bulk upload"
        description="Import multiple URLs via CSV. Columns: originalUrl (required), customAlias, expiryDate."
      />
      </StaggerItem>

      {/* Format hint card */}
      <div className="rounded-xl border border-amber-200/60 bg-amber-50/50 px-4 py-3">
        <div className="flex items-start gap-2.5">
          <span className="mt-0.5 text-amber-500">
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </span>
          <div className="text-xs text-amber-800">
            <p className="font-semibold">CSV format guide</p>
            <p className="mt-0.5 font-mono text-amber-700">originalUrl, customAlias (opt), expiryDate (opt)</p>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="card space-y-5">
        {/* Textarea with header row */}
        <div>
          <div className="mb-2 flex items-center justify-between">
            <label className="input-label mb-0 flex items-center gap-1.5">
              <svg className="h-3.5 w-3.5 text-brand-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              CSV content
            </label>
            <div className="flex items-center gap-3">
              {dataLines > 0 && (
                <span className="badge-brand">
                  {dataLines} URL{dataLines !== 1 ? 's' : ''}
                </span>
              )}
              <button
                type="button"
                id="load-sample"
                onClick={() => setCsv(SAMPLE_CSV)}
                className="text-xs font-medium text-brand-600 hover:text-brand-700 transition-colors"
              >
                Load sample ↗
              </button>
            </div>
          </div>

          <div className="overflow-hidden rounded-xl border border-slate-200 shadow-sm transition-all focus-within:border-brand-400 focus-within:ring-4 focus-within:ring-brand-500/10">
            {/* Fake "header" row */}
            <div className="border-b border-slate-100 bg-slate-50 px-4 py-2 font-mono text-[11px] text-slate-400 select-none">
              originalUrl, customAlias, expiryDate
            </div>
            <textarea
              id="bulk-csv"
              required
              rows={10}
              className="w-full border-0 bg-white px-4 py-3 font-mono text-xs text-slate-700 placeholder:text-slate-300 focus:outline-none focus:ring-0 resize-none"
              placeholder={`https://example.com/page1,promo,\nhttps://example.com/page2,,2026-12-31`}
              value={csv}
              onChange={(e) => setCsv(e.target.value)}
            />
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-3 border-t border-brand-500/10 pt-4">
          <GradientButton id="bulk-submit" type="submit" loading={loading} disabled={!csv.trim()}>
            Upload CSV
          </GradientButton>
          <GradientButton type="button" variant="secondary" onClick={() => navigate('/dashboard')}>
            Cancel
          </GradientButton>
        </div>
      </form>

      {/* Results */}
      {results && (
        <div className="animate-fade-in-up space-y-4">

          {/* Created */}
          <div className="card border-l-4 border-l-emerald-400">
            <div className="mb-3 flex items-center gap-2">
              <span className="flex h-7 w-7 items-center justify-center rounded-full bg-emerald-100 text-sm">✅</span>
              <h3 className="font-semibold text-emerald-800">
                Created — {results.created.length} URL{results.created.length !== 1 ? 's' : ''}
              </h3>
            </div>
            <ul className="max-h-48 space-y-1 overflow-y-auto">
              {results.created.map((u, i) => (
                <li key={i} className="flex items-center gap-2 rounded-lg bg-emerald-50/60 px-3 py-2 text-xs text-emerald-700">
                  <span className="font-mono truncate">{u.shortUrl || u.shortCode}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Failed */}
          {results.failed.length > 0 && (
            <div className="card border-l-4 border-l-red-400">
              <div className="mb-3 flex items-center gap-2">
                <span className="flex h-7 w-7 items-center justify-center rounded-full bg-red-100 text-sm">❌</span>
                <h3 className="font-semibold text-red-800">
                  Failed — {results.failed.length} URL{results.failed.length !== 1 ? 's' : ''}
                </h3>
              </div>
              <ul className="space-y-1">
                {results.failed.map((f, i) => (
                  <li key={i} className="rounded-lg bg-red-50/60 px-3 py-2 text-xs">
                    <span className="font-mono text-red-700 truncate block">{f.originalUrl}</span>
                    <span className="text-red-500">{f.error}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </PageTransition>
  );
}
