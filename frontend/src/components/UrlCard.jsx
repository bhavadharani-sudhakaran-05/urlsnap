import React, { useState } from 'react';
import { 
  CheckCheck, 
  Copy,
  MousePointerClick, 
  Calendar,
  Clock, 
  BarChart2, 
  Pencil, 
  QrCode, 
  Trash2 
} from 'lucide-react';
import { format, formatDistanceToNow, isAfter } from 'date-fns';

export default function UrlCard({ 
  url, 
  onEdit, 
  onDelete, 
  onQR, 
  onAnalytics, 
  onCopy 
}) {
  const [copied, setCopied] = useState(false);

  const handleCopy = (e) => {
    e.stopPropagation();
    setCopied(true);
    if (onCopy) onCopy(url.shortUrl);
    setTimeout(() => setCopied(false), 2000);
  };

  const getDomain = (urlStr) => {
    try {
      return new URL(urlStr).hostname;
    } catch {
      return urlStr.substring(0, 40);
    }
  };

  const isExpired = url.expiresAt && !isAfter(new Date(url.expiresAt), new Date());

  return (
    <div className="bg-white border-[1.5px] border-border rounded-2xl p-[18px_20px] mb-3 transition-shadow duration-200 hover:shadow-[0_6px_24px_rgba(28,22,18,0.08)]">
      
      {/* TOP ROW */}
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-2 flex-wrap">
          <div className="font-sans text-[14px] font-bold text-ink">
            {url.title || getDomain(url.originalUrl)}
          </div>
          {url.isCustomAlias && (
            <span className="bg-[rgba(107,143,110,0.12)] text-sage font-sans text-[9px] font-bold tracking-[1px] px-1.5 py-0.5 rounded-full uppercase">
              Custom
            </span>
          )}
        </div>
        
        <div className="shrink-0">
          {isExpired ? (
            <div className="inline-flex items-center gap-1.5 bg-[rgba(220,38,38,0.08)] text-[#DC2626] font-sans text-[10px] font-bold tracking-wide uppercase px-2 py-0.5 rounded-full">
              <div className="w-1.5 h-1.5 rounded-full bg-[#DC2626]" />
              Expired
            </div>
          ) : !url.isActive ? (
            <div className="inline-flex items-center gap-1.5 bg-[rgba(139,115,85,0.10)] text-muted font-sans text-[10px] font-bold tracking-wide uppercase px-2 py-0.5 rounded-full">
              <div className="w-1.5 h-1.5 rounded-full bg-muted" />
              Inactive
            </div>
          ) : (
            <div className="inline-flex items-center gap-1.5 bg-[rgba(107,143,110,0.12)] text-sage font-sans text-[10px] font-bold tracking-wide uppercase px-2 py-0.5 rounded-full">
              <div className="w-1.5 h-1.5 rounded-full bg-sage" />
              Active
            </div>
          )}
        </div>
      </div>

      {/* MIDDLE */}
      <div className="font-sans text-[12px] text-muted truncate my-2 mb-1">
        {url.originalUrl}
      </div>

      <div className="inline-flex items-center gap-1.5 bg-[rgba(232,85,62,0.06)] px-2.5 py-1.5 rounded-lg">
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
          onClick={handleCopy}
          className="bg-transparent border-none text-coral p-0 flex items-center justify-center cursor-pointer ml-1 hover:opacity-80"
        >
          {copied ? <CheckCheck size={14} /> : <Copy size={14} />}
        </button>
      </div>

      {/* STATS ROW */}
      <div className="flex items-center gap-4 mt-3">
        <div className="flex items-center gap-1.5">
          <MousePointerClick size={12} className="text-coral" />
          <span className="font-sans text-[13px] font-bold text-ink">{url.clickCount || 0}</span>
        </div>
        <div className="flex items-center gap-1.5">
          <Calendar size={12} className="text-muted" />
          <span className="font-sans text-[12px] text-muted">
            {format(new Date(url.createdAt), 'MMM d')}
          </span>
        </div>
        <div className="flex items-center gap-1.5">
          <Clock size={12} className="text-muted" />
          <span className="font-sans text-[12px] text-muted">
            {url.lastVisit ? formatDistanceToNow(new Date(url.lastVisit)) : 'Never'}
          </span>
        </div>
      </div>

      {/* ACTION ROW */}
      <div className="border-t border-border pt-3 mt-3 flex justify-around items-center">
        <button 
          onClick={() => onAnalytics(url)}
          className="flex flex-col items-center gap-1 bg-transparent border-none cursor-pointer group"
        >
          <BarChart2 size={16} className="text-muted group-hover:text-coral transition-colors" />
          <span className="font-sans text-[10px] text-muted">Stats</span>
        </button>
        <button 
          onClick={() => onEdit(url)}
          className="flex flex-col items-center gap-1 bg-transparent border-none cursor-pointer group"
        >
          <Pencil size={16} className="text-muted group-hover:text-amber transition-colors" />
          <span className="font-sans text-[10px] text-muted">Edit</span>
        </button>
        <button 
          onClick={() => onQR(url)}
          className="flex flex-col items-center gap-1 bg-transparent border-none cursor-pointer group"
        >
          <QrCode size={16} className="text-muted group-hover:text-sage transition-colors" />
          <span className="font-sans text-[10px] text-muted">QR</span>
        </button>
        <button 
          onClick={() => onDelete(url)}
          className="flex flex-col items-center gap-1 bg-transparent border-none cursor-pointer group"
        >
          <Trash2 size={16} className="text-muted group-hover:text-[#DC2626] transition-colors" />
          <span className="font-sans text-[10px] text-muted">Delete</span>
        </button>
      </div>

    </div>
  );
}
