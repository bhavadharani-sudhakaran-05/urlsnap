import React from 'react';
import { Link } from 'react-router-dom';
import { AlertCircle, ArrowLeft } from 'lucide-react';
import BrandLogo from '../components/BrandLogo'; // Assuming BrandLogo exists or we use text

export default function NotFoundPage() {
  return (
    <div className="min-h-screen bg-cream flex flex-col items-center justify-center p-6 text-center">
      <div className="absolute top-8 left-8">
        <Link to="/" className="no-underline">
          <div className="font-display text-[22px] font-black tracking-tight text-ink">
            Link<span className="text-coral">Snap</span>.
          </div>
        </Link>
      </div>
      
      <div className="max-w-md w-full bg-white border-[1.5px] border-border rounded-[24px] p-10 shadow-[0_24px_80px_rgba(28,22,18,0.06)] flex flex-col items-center">
        <div className="w-16 h-16 rounded-2xl bg-[rgba(232,85,62,0.12)] text-coral flex items-center justify-center mb-6">
          <AlertCircle size={32} />
        </div>
        
        <h1 className="font-display text-[80px] font-black text-ink leading-none m-0 mb-2">
          404
        </h1>
        <h2 className="font-display text-[24px] font-bold text-ink m-0 mb-3">
          Page Not Found
        </h2>
        
        <p className="font-sans text-[15px] text-muted leading-relaxed m-0 mb-8 max-w-[280px]">
          The page or link you're looking for doesn't exist, has been moved, or is currently unavailable.
        </p>
        
        <Link 
          to="/" 
          className="w-full flex items-center justify-center gap-2 bg-coral hover:bg-coral-dark text-white font-sans text-[15px] font-bold py-3.5 px-6 rounded-xl transition-all shadow-[0_8px_24px_rgba(232,85,62,0.25)] hover:-translate-y-0.5 no-underline"
        >
          <ArrowLeft size={18} />
          Return to Dashboard
        </Link>
      </div>
      
      <div className="mt-12 font-sans text-[13px] text-muted-light">
        © {new Date().getFullYear()} Zestlink. All rights reserved.
      </div>
    </div>
  );
}
