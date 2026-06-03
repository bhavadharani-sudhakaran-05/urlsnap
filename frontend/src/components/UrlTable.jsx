import React, { useState } from 'react';
import { 
  CheckCheck, 
  MousePointerClick, 
  Clock, 
  BarChart2, 
  Pencil, 
  QrCode, 
  Trash2, 
  Link2,
  Copy
} from 'lucide-react';
import { format, formatDistanceToNow, isAfter, subHours } from 'date-fns';
import SkeletonRow, { SkeletonTableBody } from './SkeletonRow';

export default function UrlTable({ 
  urls = [], 
  loading = false, 
  onEdit, 
  onDelete, 
  onQR, 
  onAnalytics, 
  onCopy,
  onCreateNew 
}) {
  const [copiedId, setCopiedId] = useState(null);

  const handleCopy = (e, url) => {
    e.stopPropagation();
    setCopiedId(url._id);
    if (onCopy) onCopy(url.shortUrl);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const getDomain = (urlStr) => {
    try {
      return new URL(urlStr).hostname;
    } catch {
      return urlStr.substring(0, 40);
    }
  };

  if (!loading && urls.length === 0) {
    return (
      <div className="bg-white border-[1.5px] border-border rounded-[20px] overflow-hidden">
        <div className="py-[80px] px-[40px] flex flex-col items-center text-center">
          <div className="w-[80px] h-[80px] rounded-full bg-surface flex items-center justify-center">
            <Link2 size={32} className="text-muted-light" />
          </div>
          <h2 className="font-display text-[24px] font-extrabold text-ink mt-5">
            No links yet.
          </h2>
          <p className="font-sans text-[14px] text-muted mt-2 max-w-[300px] leading-relaxed">
            Shorten your first URL to start tracking clicks and analytics.
          </p>
          <button 
            onClick={onCreateNew}
            className="mt-6 bg-coral text-white font-sans font-medium text-[14px] px-6 py-2.5 rounded-lg transition-colors hover:bg-coral-dark border-none cursor-pointer"
          >
            Shorten a URL
          </button>
          <div 
            className="font-sans text-[12px] text-muted-light mt-3 cursor-pointer hover:text-coral transition-colors"
            onClick={() => window.openBulkModal && window.openBulkModal()}
          >
            Or try bulk uploading a CSV →
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white border-[1.5px] border-border rounded-[20px] overflow-hidden">
      <div className="overflow-x-auto custom-scrollbar">
        <table className="w-full border-collapse text-left">
          <thead className="bg-surface border-b-[1.5px] border-border">
            <tr>
              <th className="font-sans text-[11px] font-bold tracking-[1.5px] uppercase text-muted py-[14px] px-5 whitespace-nowrap min-w-[280px]">
                Link
              </th>
              <th className="font-sans text-[11px] font-bold tracking-[1.5px] uppercase text-muted py-[14px] px-5 whitespace-nowrap min-w-[180px]">
                Short URL
              </th>
              <th className="font-sans text-[11px] font-bold tracking-[1.5px] uppercase text-muted py-[14px] px-5 whitespace-nowrap min-w-[120px]">
                Created
              </th>
              <th className="font-sans text-[11px] font-bold tracking-[1.5px] uppercase text-muted py-[14px] px-5 whitespace-nowrap min-w-[100px] text-center">
                Clicks
              </th>
              <th className="font-sans text-[11px] font-bold tracking-[1.5px] uppercase text-muted py-[14px] px-5 whitespace-nowrap min-w-[100px]">
                Status
              </th>
              <th className="font-sans text-[11px] font-bold tracking-[1.5px] uppercase text-muted py-[14px] px-5 whitespace-nowrap min-w-[160px] text-right">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <SkeletonTableBody rows={5} />
            ) : (
              urls.map(url => {
                const isExpired = url.expiresAt && !isAfter(new Date(url.expiresAt), new Date());
                const isExpiringSoon = url.expiresAt && !isExpired && isAfter(subHours(new Date(url.expiresAt), 24), new Date()); // Simplistic check
                
                return (
                  <tr 
                    key={url._id}
                    className="border-b-[1.5px] border-border last:border-0 hover:bg-[rgba(251,242,232,0.7)] transition-colors duration-150"
                  >
                    {/* LINK CELL */}
                    <td className="p-4 px-5 align-top">
                      <div className="flex items-center gap-2 mb-1">
                        <div className="font-sans text-[14px] font-semibold text-ink max-w-[240px] truncate">
                          {url.title || getDomain(url.originalUrl)}
                        </div>
                        <div className="flex items-center gap-1.5 shrink-0">
                          {url.isCustomAlias && (
                            <span className="bg-[rgba(107,143,110,0.12)] text-sage font-sans text-[9px] font-bold tracking-[1px] px-1.5 py-0.5 rounded-full uppercase">
                              Custom
                            </span>
                          )}
                          {isExpiringSoon && (
                            <span className="bg-[rgba(245,158,11,0.12)] text-amber-dark font-sans text-[9px] font-bold tracking-[1px] px-1.5 py-0.5 rounded-full uppercase">
                              Expiring
                            </span>
                          )}
                        </div>
                      </div>
                      <div className="font-sans text-[12px] text-muted max-w-[240px] truncate" title={url.originalUrl}>
                        {url.originalUrl}
                      </div>
                    </td>

                    {/* SHORT URL CELL */}
                    <td className="p-4 px-5 align-top">
                      <div className="inline-flex items-center gap-1.5 bg-[rgba(232,85,62,0.07)] border border-[rgba(232,85,62,0.15)] rounded-lg px-2.5 py-1.5">
                        <a 
                          href={url.shortUrl} 
                          target="_blank" 
                          rel="noopener noreferrer" 
                          className="font-mono text-[13px] font-medium text-coral hover:underline no-underline"
                          onClick={(e) => e.stopPropagation()}
                        >
                          {url.shortUrl ? url.shortUrl.replace(/^https?:\/\//, '') : url.shortCode}
                        </a>
                        <button 
                          onClick={(e) => handleCopy(e, url)}
                          className="bg-transparent border-none text-coral p-0 flex items-center justify-center cursor-pointer hover:opacity-80 ml-1"
                          title="Copy short URL"
                        >
                          {copiedId === url._id ? <CheckCheck size={14} /> : <Copy size={14} />}
                        </button>
                      </div>
                    </td>

                    {/* CREATED CELL */}
                    <td className="p-4 px-5 align-top">
                      <div className="font-sans text-[13px] text-muted mb-0.5">
                        {format(new Date(url.createdAt), 'MMM d, yyyy')}
                      </div>
                      <div className="font-sans text-[11px] text-muted-light">
                        {formatDistanceToNow(new Date(url.createdAt))} ago
                      </div>
                    </td>

                    {/* CLICKS CELL */}
                    <td className="p-4 px-5 align-top text-center">
                      <div className="inline-flex items-center gap-1.5 bg-[rgba(232,85,62,0.10)] rounded-full px-3 py-1.5">
                        <MousePointerClick size={12} className="text-coral-dark" />
                        <span className="font-sans text-[14px] font-bold text-coral-dark">
                          {url.clickCount || 0}
                        </span>
                      </div>
                    </td>

                    {/* STATUS CELL */}
                    <td className="p-4 px-5 align-top">
                      {isExpired ? (
                        <div className="inline-flex items-center gap-1.5 bg-[rgba(220,38,38,0.08)] text-[#DC2626] font-sans text-[12px] font-medium px-2.5 py-1 rounded-full">
                          <div className="w-1.5 h-1.5 rounded-full bg-[#DC2626]" />
                          Expired
                        </div>
                      ) : !url.isActive ? (
                        <div className="inline-flex items-center gap-1.5 bg-[rgba(139,115,85,0.10)] text-muted font-sans text-[12px] font-medium px-2.5 py-1 rounded-full">
                          <div className="w-1.5 h-1.5 rounded-full bg-muted" />
                          Inactive
                        </div>
                      ) : (
                        <div className="flex flex-col items-start gap-1">
                          <div className="inline-flex items-center gap-1.5 bg-[rgba(107,143,110,0.12)] text-sage font-sans text-[12px] font-medium px-2.5 py-1 rounded-full">
                            <div className="w-1.5 h-1.5 rounded-full bg-sage" />
                            Active
                          </div>
                          {url.expiresAt && (
                            <div className="flex items-center gap-1 font-sans text-[11px] text-muted-light mt-1">
                              <Clock size={10} />
                              {format(new Date(url.expiresAt), 'MMM d')}
                            </div>
                          )}
                        </div>
                      )}
                    </td>

                    {/* ACTIONS CELL */}
                    <td className="p-4 px-5 align-top text-right">
                      <div className="flex items-center justify-end gap-1">
                        <button 
                          onClick={() => onAnalytics(url)}
                          title="View Analytics"
                          className="w-[30px] h-[30px] rounded-lg border-none flex items-center justify-center cursor-pointer transition-all duration-150 bg-transparent text-muted hover:bg-[rgba(232,85,62,0.10)] hover:text-coral"
                        >
                          <BarChart2 size={15} />
                        </button>
                        <button 
                          onClick={() => onEdit(url)}
                          title="Edit Link"
                          className="w-[30px] h-[30px] rounded-lg border-none flex items-center justify-center cursor-pointer transition-all duration-150 bg-transparent text-muted hover:bg-[rgba(245,158,11,0.10)] hover:text-amber"
                        >
                          <Pencil size={15} />
                        </button>
                        <button 
                          onClick={() => onQR(url)}
                          title="QR Code"
                          className="w-[30px] h-[30px] rounded-lg border-none flex items-center justify-center cursor-pointer transition-all duration-150 bg-transparent text-muted hover:bg-[rgba(107,143,110,0.10)] hover:text-sage"
                        >
                          <QrCode size={15} />
                        </button>
                        <button 
                          onClick={() => onDelete(url)}
                          title="Delete"
                          className="w-[30px] h-[30px] rounded-lg border-none flex items-center justify-center cursor-pointer transition-all duration-150 bg-transparent text-[rgba(139,115,85,0.5)] hover:bg-[rgba(220,38,38,0.08)] hover:text-[#DC2626]"
                        >
                          <Trash2 size={15} />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
