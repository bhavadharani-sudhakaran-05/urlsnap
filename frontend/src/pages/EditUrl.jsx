import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { getUrlById, updateUrl } from '../api/urlApi';
import { useToast } from '../context/ToastContext';
import { getApiError } from '../utils/getApiError';
import ErrorState from '../components/ErrorState';
import PageHeader from '../components/PageHeader';
import PageTransition, { StaggerItem } from '../components/layout/PageTransition';
import GradientButton from '../components/ui/GradientButton';
import { SkeletonCard } from '../components/Skeleton';
import { Link2, Settings2, Calendar } from 'lucide-react';

export default function EditUrl() {
  const { id } = useParams();
  const [form, setForm] = useState({ originalUrl: '', customAlias: '', expiryDate: '' });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const { showToast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    const load = async () => {
      try {
        const { data } = await getUrlById(id);
        const url = data.data;
        setForm({
          originalUrl: url.originalUrl,
          customAlias: url.customAlias || url.shortCode,
          expiryDate: url.expiryDate
            ? new Date(url.expiryDate).toISOString().slice(0, 16)
            : '',
        });
      } catch (err) {
        setError(getApiError(err, 'URL not found'));
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await updateUrl(id, {
        originalUrl: form.originalUrl,
        customAlias: form.customAlias,
        expiryDate: form.expiryDate ? new Date(form.expiryDate).toISOString() : null,
      });
      showToast('URL updated!');
      navigate('/dashboard');
    } catch (err) {
      showToast(getApiError(err, 'Update failed'), 'error');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return (
    <div className="mx-auto max-w-xl">
      <div className="skeleton mb-6 h-16 rounded-2xl" />
      <div className="card space-y-5">
        {[1, 2, 3].map((i) => (
          <div key={i}>
            <div className="skeleton mb-2 h-4 w-24 rounded" />
            <div className="skeleton h-12 w-full rounded-xl" />
          </div>
        ))}
      </div>
    </div>
  );

  if (error) return <ErrorState message={error} onRetry={() => navigate('/dashboard')} />;

  return (
    <PageTransition className="mx-auto max-w-xl space-y-6">
      <StaggerItem>
        <PageHeader title="Edit short link" description="Update destination URL, alias, or expiry date." />
      </StaggerItem>

      <StaggerItem>
      <div className="gradient-border">
      <form onSubmit={handleSubmit} className="card space-y-6 p-6 sm:p-8">

        {/* Destination URL */}
        <div>
          <label className="input-label">
            <span className="flex items-center gap-1.5">
              <Link2 className="h-4 w-4 text-indigo-500" />
              Destination URL <span className="text-red-400">*</span>
            </span>
          </label>
          <input
            id="edit-url"
            type="url"
            required
            className="input-field"
            value={form.originalUrl}
            onChange={(e) => setForm({ ...form, originalUrl: e.target.value })}
          />
        </div>

        {/* Custom Alias */}
        <div>
          <label className="input-label">
            <span className="flex items-center gap-1.5">
              <Settings2 className="h-4 w-4 text-indigo-500" />
              Custom alias
            </span>
          </label>
          <div className="flex overflow-hidden rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 shadow-sm transition-all focus-within:border-indigo-500 focus-within:ring-2 focus-within:ring-indigo-500/20">
            <span className="flex items-center border-r border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 px-3.5 py-3 text-sm text-slate-500 dark:text-slate-400 select-none">
              …/
            </span>
            <input
              id="edit-alias"
              type="text"
              className="flex-1 border-0 bg-transparent px-4 py-3 text-sm focus:outline-none focus:ring-0"
              value={form.customAlias}
              onChange={(e) => setForm({ ...form, customAlias: e.target.value })}
            />
          </div>
        </div>

        {/* Expiry Date */}
        <div>
          <label className="input-label">
            <span className="flex items-center gap-1.5">
              <Calendar className="h-4 w-4 text-indigo-500" />
              Expiry date <span className="text-slate-400 font-normal">(optional)</span>
            </span>
          </label>
          <input
            id="edit-expiry"
            type="datetime-local"
            className="input-field"
            value={form.expiryDate}
            onChange={(e) => setForm({ ...form, expiryDate: e.target.value })}
          />
        </div>

        {/* Actions */}
        <div className="flex gap-3 border-t border-slate-200 dark:border-slate-800/50 pt-4">
          <GradientButton id="edit-submit" type="submit" loading={saving}>
            Save changes
          </GradientButton>
          <GradientButton type="button" variant="secondary" onClick={() => navigate('/dashboard')}>
            Cancel
          </GradientButton>
        </div>
      </form>
      </div>
      </StaggerItem>
    </PageTransition>
  );
}
