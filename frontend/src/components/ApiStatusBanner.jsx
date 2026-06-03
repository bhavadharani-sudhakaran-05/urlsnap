import { useApiHealth } from '../hooks/useApiHealth';
import { API_ORIGIN } from '../config/api';

export default function ApiStatusBanner() {
  const status = useApiHealth();

  if (status === 'checking' || status === 'online') return null;

  return (
    <div className="border-b border-amber-200 bg-amber-50 px-4 py-3 text-center text-sm text-amber-900">
      <strong>Backend offline.</strong> Open a terminal, run{' '}
      <code className="rounded bg-amber-100 px-1.5 py-0.5 text-xs">npm run dev</code> in folder{' '}
      <code className="rounded bg-amber-100 px-1.5 py-0.5 text-xs">backend</code>
      {' '}(uses in-memory DB if MongoDB is not installed). API:{' '}
      <code className="rounded bg-amber-100 px-1.5 py-0.5 text-xs">{API_ORIGIN}</code>
    </div>
  );
}
