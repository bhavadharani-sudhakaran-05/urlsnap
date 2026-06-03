import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';
import { Check, Globe, Link2, QrCode } from 'lucide-react';
import QRCode from 'react-qr-code';
import { createUrl } from '../api/urlApi';
import { useToast } from '../context/ToastContext';
import { getApiError } from '../utils/getApiError';
import PageHeader from '../components/PageHeader';
import PageTransition, { StaggerItem } from '../components/layout/PageTransition';
import GradientButton from '../components/ui/GradientButton';

const STEPS = ['URL Detected', 'Domain extracted', 'Preview ready', 'QR generated'];

function getDomain(url) {
  try {
    return new URL(url.startsWith('http') ? url : `https://${url}`).hostname.replace(/^www\./, '');
  } catch {
    return null;
  }
}

function isValidUrl(str) {
  try {
    new URL(str.startsWith('http') ? str : `https://${str}`);
    return str.length > 8;
  } catch {
    return false;
  }
}

export default function CreateUrl() {
  const [form, setForm] = useState({ originalUrl: '', customAlias: '', expiryDate: '' });
  const [loading, setLoading] = useState(false);
  const [activeStep, setActiveStep] = useState(-1);
  const { showToast } = useToast();
  const navigate = useNavigate();

  const valid = isValidUrl(form.originalUrl);
  const domain = useMemo(() => (valid ? getDomain(form.originalUrl) : null), [form.originalUrl, valid]);

  useEffect(() => {
    if (!valid) {
      setActiveStep(-1);
      return;
    }
    setActiveStep(0);
    const t1 = setTimeout(() => setActiveStep(1), 400);
    const t2 = setTimeout(() => setActiveStep(2), 800);
    const t3 = setTimeout(() => setActiveStep(3), 1200);
    return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); };
  }, [form.originalUrl, valid]);

  const fireConfetti = () => {
    confetti({ particleCount: 120, spread: 70, origin: { y: 0.65 }, colors: ['#6366f1', '#8b5cf6', '#06b6d4'] });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const payload = {
        originalUrl: form.originalUrl.startsWith('http') ? form.originalUrl : `https://${form.originalUrl}`,
        ...(form.customAlias && { customAlias: form.customAlias }),
        ...(form.expiryDate && { expiryDate: new Date(form.expiryDate).toISOString() }),
      };
      await createUrl(payload);
      fireConfetti();
      showToast('Short URL created!');
      navigate('/dashboard');
    } catch (err) {
      showToast(getApiError(err, 'Failed to create URL'), 'error');
    } finally {
      setLoading(false);
    }
  };

  const BASE_URL = import.meta.env.VITE_BASE_URL;
  const previewShort = form.customAlias
    ? `${BASE_URL}/${form.customAlias}`
    : `${BASE_URL}/••••••`;

  return (
    <PageTransition className="mx-auto max-w-2xl space-y-6">
      <StaggerItem>
        <PageHeader
          title="Create short link"
          description="Paste a long URL — we'll detect, preview, and generate a QR code instantly."
        />
      </StaggerItem>

      <StaggerItem>
        <div className="gradient-border">
          <form onSubmit={handleSubmit} className="card space-y-6 p-6 sm:p-8">
            <div>
              <label className="input-label flex items-center gap-1.5">
                <Link2 className="h-3.5 w-3.5 text-indigo-500" />
                Destination URL <span className="text-red-400">*</span>
              </label>
              <input
                id="create-url"
                type="url"
                required
                className="input-field"
                placeholder="https://example.com/your-very-long-page-url"
                value={form.originalUrl}
                onChange={(e) => setForm({ ...form, originalUrl: e.target.value })}
              />
            </div>

            <AnimatePresence>
              {valid && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="space-y-4 overflow-hidden"
                >
                  <ul className="flex flex-wrap gap-2">
                    {STEPS.map((step, i) => (
                      <motion.li
                        key={step}
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: i * 0.1 }}
                        className={`flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium ${activeStep >= i
                          ? 'bg-emerald-500/15 text-emerald-700 dark:text-emerald-400'
                          : 'bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400'
                          }`}
                      >
                        {activeStep >= i ? <Check className="h-3 w-3" /> : <span className="h-3 w-3 rounded-full border border-current" />}
                        {step}
                      </motion.li>
                    ))}
                  </ul>

                  {activeStep >= 2 && (
                    <motion.div
                      initial={{ opacity: 0, y: 12 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="rounded-2xl border border-slate-200 dark:border-slate-800/50 bg-slate-50 dark:bg-slate-800/30 p-4"
                    >
                      <div className="flex gap-4">
                        <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-white shadow-sm dark:bg-white/10">
                          <Globe className="h-7 w-7 text-indigo-500" />
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="text-xs font-semibold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
                            {domain}
                          </p>
                          <p className="mt-1 truncate text-sm text-slate-500 dark:text-slate-400">{form.originalUrl}</p>
                          <p className="mt-2 font-mono text-sm font-semibold text-indigo-600 dark:text-indigo-400">
                            {previewShort}
                          </p>
                        </div>
                        {activeStep >= 3 && (
                          <motion.div
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="flex shrink-0 flex-col items-center gap-1 rounded-xl bg-white p-2 shadow-sm dark:bg-white/10"
                          >
                            <QRCode value={form.originalUrl} size={64} />
                            <span className="flex items-center gap-0.5 text-[9px] font-medium text-slate-500 dark:text-slate-400">
                              <QrCode className="h-3 w-3" /> Preview
                            </span>
                          </motion.div>
                        )}
                      </div>
                    </motion.div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>

            <div>
              <label className="input-label">Custom alias (optional)</label>
              <div className="flex overflow-hidden rounded-xl border border-slate-200 dark:border-slate-700 bg-white/60 dark:bg-slate-800/50">
                <span className="flex items-center border-r border-slate-200 dark:border-slate-700 px-3 text-sm text-slate-500 dark:text-slate-400">…/</span>
                <input
                  id="create-alias"
                  type="text"
                  placeholder="my-campaign"
                  pattern="[a-zA-Z0-9_-]{3,32}"
                  className="flex-1 border-0 bg-transparent px-4 py-3 text-sm focus:outline-none"
                  value={form.customAlias}
                  onChange={(e) => setForm({ ...form, customAlias: e.target.value })}
                />
              </div>
            </div>

            <div>
              <label className="input-label">Expiry date (optional)</label>
              <input
                id="create-expiry"
                type="datetime-local"
                className="input-field"
                value={form.expiryDate}
                onChange={(e) => setForm({ ...form, expiryDate: e.target.value })}
              />
            </div>

            <div className="flex flex-wrap gap-3 border-t border-slate-200 dark:border-slate-800/50 pt-4">
              <GradientButton id="create-submit" type="submit" loading={loading} size="lg">
                Create short link
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
