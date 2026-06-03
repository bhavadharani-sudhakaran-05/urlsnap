import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { CheckCircle, Link2, MousePointerClick, Plus } from 'lucide-react';
import { getAllUrls, deleteUrl } from '../api/urlApi';
import { useToast } from '../context/ToastContext';
import { copyToClipboard } from '../utils/copyToClipboard';
import { getApiError } from '../utils/getApiError';
import EmptyState from '../components/EmptyState';
import ErrorState from '../components/ErrorState';
import QrModal from '../components/QrModal';
import UrlLinkCard from '../components/UrlLinkCard';
import PageHeader from '../components/PageHeader';
import PageTransition, { StaggerItem } from '../components/layout/PageTransition';
import MetricCard from '../components/ui/MetricCard';
import GradientButton from '../components/ui/GradientButton';
import { SkeletonCard } from '../components/Skeleton';

export default function Dashboard() {
  const [urls, setUrls] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [qrModal, setQrModal] = useState(null);
  const { showToast } = useToast();

  const fetchUrls = async () => {
    setLoading(true);
    setError(null);
    try {
      const { data } = await getAllUrls();
      setUrls(data.data);
    } catch (err) {
      setError(getApiError(err, 'Failed to load URLs'));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchUrls(); }, []);

  const stats = useMemo(() => {
    const totalClicks = urls.reduce((s, u) => s + (u.clickCount || 0), 0);
    const active = urls.filter((u) => !u.expiryDate || new Date(u.expiryDate) > new Date()).length;
    const spark = urls.slice(0, 7).map((u) => u.clickCount || 0);
    const trend = urls.length > 1 ? 12 : 0;
    return { totalClicks, active, spark, trend };
  }, [urls]);

  const handleCopy = async (shortUrl) => {
    await copyToClipboard(shortUrl);
    showToast('✓ Copied successfully');
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this short URL?')) return;
    try {
      await deleteUrl(id);
      setUrls((prev) => prev.filter((u) => u.id !== id));
      showToast('URL deleted');
    } catch (err) {
      showToast(getApiError(err, 'Delete failed'), 'error');
    }
  };

  if (loading) {
    return (
      <div className="space-y-8">
        <PageHeader title="Dashboard" description="Loading your links…" />
        <div className="grid gap-4 sm:grid-cols-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="skeleton h-32 rounded-2xl" />
          ))}
        </div>
        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {[1, 2, 3].map((i) => <SkeletonCard key={i} />)}
        </div>
      </div>
    );
  }

  if (error) return <ErrorState message={error} onRetry={fetchUrls} />;

  return (
    <PageTransition className="space-y-8">
      <StaggerItem>
        <PageHeader
          title="Dashboard"
          description="Manage shortened links and monitor performance"
          action={
            <Link to="/create">
              <GradientButton id="dashboard-new-link">
                <Plus className="h-4 w-4" />
                New link
              </GradientButton>
            </Link>
          }
        />
      </StaggerItem>

      {urls.length > 0 && (
        <div className="grid gap-4 sm:grid-cols-3">
          <MetricCard
            label="Total Links"
            numericValue={urls.length}
            icon={Link2}
            delay={0}
          />
          <MetricCard
            label="Total Clicks"
            numericValue={stats.totalClicks}
            trend={stats.trend}
            trendLabel="recent"
            sparkData={stats.spark}
            sparkColor="#2563eb"
            icon={MousePointerClick}
            live
            delay={1}
          />
          <MetricCard
            label="Active Links"
            numericValue={stats.active}
            icon={CheckCircle}
            delay={2}
          />
        </div>
      )}

      {urls.length === 0 ? (
        <EmptyState
          title="No links yet"
          description="Create your first short URL to start tracking clicks, QR scans, and analytics."
        />
      ) : (
        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {urls.map((url, i) => (
            <StaggerItem key={url.id}>
              <UrlLinkCard
                url={url}
                index={i}
                onCopy={handleCopy}
                onQr={(u) => setQrModal({ url: u.shortUrl, qrDataUrl: u.qrCode })}
                onDelete={handleDelete}
              />
            </StaggerItem>
          ))}
        </div>
      )}

      {qrModal && (
        <QrModal url={qrModal.url} qrDataUrl={qrModal.qrDataUrl} onClose={() => setQrModal(null)} />
      )}
    </PageTransition>
  );
}
