import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { BarChart3, Copy, Globe, Pencil, QrCode, Trash2 } from 'lucide-react';
import { formatDate } from '../utils/formatDate';

function getDomain(url) {
  try {
    return new URL(url).hostname.replace(/^www\./, '');
  } catch {
    return url;
  }
}

export default function UrlLinkCard({ url, onCopy, onQr, onDelete, index = 0 }) {
  const [hovered, setHovered] = useState(false);
  const isExpired = url.expiryDate && new Date(url.expiryDate) < new Date();
  const domain = getDomain(url.originalUrl);

  return (
    <motion.article
      layout
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05, duration: 0.4 }}
      onHoverStart={() => setHovered(true)}
      onHoverEnd={() => setHovered(false)}
      className="card group relative overflow-hidden flex flex-col h-full"
    >
      <div className="flex-1 p-5">
        <div className="flex items-start gap-4">
          {/* Icon */}
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-brand-200 bg-brand-50 text-sm font-bold text-brand-700 shadow-sm transition-colors group-hover:bg-brand-950 group-hover:text-white">
            {domain.slice(0, 2).toUpperCase()}
          </div>
          
          <div className="min-w-0 flex-1">
            <a
              href={url.shortUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="block truncate text-sm font-semibold text-brand-950 transition-colors hover:text-brand-600"
            >
              {url.shortUrl}
            </a>
            <p className="mt-1 truncate text-xs text-brand-500" title={url.originalUrl}>
              {url.originalUrl}
            </p>
          </div>
          {isExpired ? (
            <span className="badge-danger shrink-0">Expired</span>
          ) : (
            <span className="badge-success shrink-0">Active</span>
          )}
        </div>

        <div className="mt-5 grid grid-cols-3 gap-3">
          <StatPill label="Clicks" value={url.clickCount ?? 0} highlight />
          <StatPill label="Created" value={formatDate(url.createdAt)} />
          <StatPill label="Expires" value={url.expiryDate ? formatDate(url.expiryDate) : 'Never'} />
        </div>

        <AnimatePresence>
          {hovered && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="mt-4 overflow-hidden rounded-lg border border-brand-100 bg-brand-50 px-3 py-3"
            >
              <p className="mb-2 text-[10px] font-bold uppercase tracking-widest text-brand-500">
                Quick analytics
              </p>
              <div className="grid grid-cols-2 gap-2 text-xs">
                <span className="text-brand-600">
                  Clicks: <strong className="text-brand-950">{url.clickCount ?? 0}</strong>
                </span>
                <span className="text-brand-600">
                  Domain: <strong className="text-brand-950">{domain}</strong>
                </span>
                <span className="col-span-2 flex items-center gap-1.5 text-brand-500">
                  <Globe className="h-3.5 w-3.5" /> View full report in Analytics
                </span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className="flex flex-wrap items-center gap-2 border-t border-brand-100 bg-brand-50/50 px-5 py-3">
        <ActionBtn id={`copy-${url.id}`} onClick={() => onCopy(url.shortUrl)} icon={Copy} label="Copy" />
        <ActionBtn id={`qr-${url.id}`} onClick={() => onQr(url)} icon={QrCode} label="QR" />
        <Link id={`analytics-${url.id}`} to={`/analytics/${url.id}`} className="action-btn">
          <BarChart3 className="h-3.5 w-3.5" />
          Stats
        </Link>
        <Link id={`edit-${url.id}`} to={`/edit/${url.id}`} className="action-btn">
          <Pencil className="h-3.5 w-3.5" />
          Edit
        </Link>
        <button
          id={`delete-${url.id}`}
          type="button"
          onClick={() => onDelete(url.id)}
          className="action-btn-danger ml-auto"
        >
          <Trash2 className="h-3.5 w-3.5" />
          Delete
        </button>
      </div>
    </motion.article>
  );
}

function StatPill({ label, value, highlight }) {
  return (
    <div className={`rounded-lg border px-2 py-2 text-center ${highlight ? 'border-brand-200 bg-white shadow-sm' : 'border-transparent bg-brand-50'}`}>
      <p className="text-[10px] font-semibold uppercase tracking-widest text-brand-500">{label}</p>
      <p className={`mt-1 text-sm font-bold ${highlight ? 'text-brand-950' : 'text-brand-700'}`}>
        {value}
      </p>
    </div>
  );
}

function ActionBtn({ id, onClick, icon: Icon, label }) {
  return (
    <motion.button
      id={id}
      type="button"
      onClick={onClick}
      whileHover={{ y: -2 }}
      whileTap={{ scale: 0.96 }}
      className="action-btn"
    >
      <Icon className="h-3.5 w-3.5" />
      {label}
    </motion.button>
  );
}
