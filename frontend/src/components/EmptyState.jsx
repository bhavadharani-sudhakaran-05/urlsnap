import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { BarChart3, Link2, QrCode, Sparkles } from 'lucide-react';
import GradientButton from './ui/GradientButton';

const checklist = [
  { id: 'link', label: 'Create first URL', Icon: Link2 },
  { id: 'qr', label: 'Generate QR code', Icon: QrCode },
  { id: 'analytics', label: 'View analytics', Icon: BarChart3 },
  { id: 'custom', label: 'Customize short link', Icon: Sparkles },
];

export default function EmptyState({ title, description, action }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      className="relative overflow-hidden rounded-3xl border border-brand-500/15 bg-gradient-to-b from-white/90 to-brand-50/30 p-8 text-center backdrop-blur-md dark:from-white/[0.04] dark:to-brand-950/20 sm:p-12"
    >
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        {[...Array(6)].map((_, i) => (
          <motion.span
            key={i}
            className="particle"
            style={{
              left: `${10 + i * 15}%`,
              animationDelay: `${i * 1.2}s`,
              animationDuration: `${6 + i}s`,
            }}
          />
        ))}
      </div>

      <div className="relative mx-auto max-w-lg">
        <motion.div
          animate={{ y: [0, -10, 0] }}
          transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
          className="mx-auto mb-8 flex h-24 w-24 items-center justify-center rounded-3xl bg-gradient-to-br from-brand-500/20 to-violet-500/20 ring-1 ring-brand-500/25 shadow-glow"
        >
          <Link2 className="h-12 w-12 text-brand-600 dark:text-brand-400" />
        </motion.div>

        <h3 className="text-2xl font-bold text-ink">{title}</h3>
        <p className="mx-auto mt-2 max-w-md text-sm leading-relaxed text-ink-muted">{description}</p>

        <div className="mx-auto mt-10 max-w-sm">
          <div className="mb-4 flex items-center justify-center gap-4">
            <svg className="h-16 w-16 -rotate-90" viewBox="0 0 36 36">
              <circle cx="18" cy="18" r="16" fill="none" stroke="currentColor" className="text-brand-500/15" strokeWidth="3" />
              <circle
                cx="18"
                cy="18"
                r="16"
                fill="none"
                stroke="url(#progressGrad)"
                strokeWidth="3"
                strokeDasharray="0 100"
                strokeLinecap="round"
              />
              <defs>
                <linearGradient id="progressGrad" x1="0" y1="0" x2="1" y2="1">
                  <stop offset="0%" stopColor="#6366f1" />
                  <stop offset="100%" stopColor="#8b5cf6" />
                </linearGradient>
              </defs>
            </svg>
            <div className="text-left">
              <p className="text-2xl font-bold text-ink">0%</p>
              <p className="text-xs text-ink-muted">Setup progress</p>
            </div>
          </div>

          <ul className="space-y-2 text-left">
            {checklist.map((item, i) => (
              <motion.li
                key={item.id}
                initial={{ opacity: 0, x: -12 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 + i * 0.08 }}
                className="flex items-center gap-3 rounded-xl border border-brand-500/10 bg-white/60 px-3 py-2.5 dark:bg-white/[0.03]"
              >
                <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand-500/10">
                  <item.Icon className="h-4 w-4 text-brand-600 dark:text-brand-400" />
                </span>
                <span className="flex-1 text-sm text-ink-muted">{item.label}</span>
                <span className="flex h-5 w-5 items-center justify-center rounded-md border border-brand-500/20" />
              </motion.li>
            ))}
          </ul>
        </div>

        <div className="mt-8">
          {action || (
            <Link to="/create">
              <GradientButton size="lg">
                <Link2 className="h-5 w-5" />
                Create first link
              </GradientButton>
            </Link>
          )}
        </div>
      </div>
    </motion.div>
  );
}
