import React from 'react';
import { Clock } from 'lucide-react';

export default function ExpiredPage() {
  return (
    <div className="min-h-screen bg-cream flex flex-col items-center justify-center p-6 text-center">
      <div className="max-w-md w-full bg-white border-[1.5px] border-border rounded-[24px] p-10 shadow-[0_24px_80px_rgba(28,22,18,0.06)] flex flex-col items-center">
        <div className="w-16 h-16 rounded-2xl bg-[rgba(245,158,11,0.12)] text-amber flex items-center justify-center mb-6">
          <Clock size={32} />
        </div>
        
        <h1 className="font-display text-[28px] font-black text-ink leading-tight m-0 mb-3">
          Link Expired
        </h1>
        
        <p className="font-sans text-[15px] text-muted leading-relaxed m-0 mb-8 max-w-[280px]">
          This short link has reached its expiration date and is no longer active.
        </p>
        
        <div className="w-full bg-surface border-[1.5px] border-border rounded-xl p-4">
          <div className="font-sans text-[13px] font-bold text-ink mb-1">
            Why am I seeing this?
          </div>
          <div className="font-sans text-[12px] text-muted">
            The creator of this link set it to automatically expire. If you believe this is an error, please contact the person who shared it.
          </div>
        </div>
      </div>
      
      <div className="mt-12 font-sans text-[13px] text-muted-light">
        Powered by <span className="font-display font-bold text-ink">Zest<span className="text-coral">link</span>.</span>
      </div>
    </div>
  );
}
