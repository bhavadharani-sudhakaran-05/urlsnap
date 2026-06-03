import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Trash2 } from 'lucide-react';
import { format } from 'date-fns';

export default function DeleteConfirmModal({ isOpen, onClose, onConfirm, url, loading }) {
  const [confirmInput, setConfirmInput] = useState('');

  useEffect(() => {
    if (isOpen) {
      setConfirmInput('');
    }
  }, [isOpen]);

  if (!isOpen || !url) return null;

  const isMatch = confirmInput === url.shortCode;

  return (
    <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(28,22,18,0.55)', backdropFilter: 'blur(6px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: '20px' }}>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.94, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.94, y: 10 }}
            transition={{ duration: 0.25, ease: [0.34, 1.56, 0.64, 1] }}
            style={{ background: 'var(--white, #FFFFFF)', borderRadius: '28px', padding: '36px', width: '100%', maxWidth: '420px', position: 'relative', boxShadow: '0 24px 80px rgba(28,22,18,0.18)', boxSizing: 'border-box', display: 'flex', flexDirection: 'column', alignItems: 'center' }}
          >
            <div style={{ width: '64px', height: '64px', borderRadius: '50%', backgroundColor: 'rgba(220,38,38,0.10)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#DC2626', marginBottom: '24px' }}>
              <Trash2 size={28} />
            </div>

            <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: '26px', fontWeight: 800, color: 'var(--ink, #1C1612)', margin: '0 0 12px 0', textAlign: 'center' }}>
              Delete this link?
            </h2>

            <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: '14px', color: 'var(--muted, #8B7355)', textAlign: 'center', maxWidth: '320px', lineHeight: 1.7, margin: 0 }}>
              This will permanently delete <span style={{ fontFamily: "'DM Mono', monospace", fontSize: '14px', fontWeight: 700, color: 'var(--ink, #1C1612)' }}>{url.shortCode}</span> and all its analytics data. This action cannot be undone.
            </p>

            <div style={{ background: 'rgba(220,38,38,0.06)', border: '1px solid rgba(220,38,38,0.12)', borderRadius: '12px', padding: '14px 18px', margin: '24px 0', width: '100%', boxSizing: 'border-box' }}>
              <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: '12px', color: '#DC2626', fontWeight: 700, marginBottom: '8px' }}>
                The following data will be lost:
              </div>
              <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: '13px', color: 'var(--ink, #1C1612)', marginBottom: '4px' }}>
                <span style={{ color: 'var(--muted, #8B7355)' }}>Total Clicks: </span>{url.clickCount || 0}
              </div>
              <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: '13px', color: 'var(--ink, #1C1612)' }}>
                <span style={{ color: 'var(--muted, #8B7355)' }}>Created: </span>{url.createdAt ? format(new Date(url.createdAt), 'MMM d, yyyy') : 'Unknown'}
              </div>
            </div>

            <div style={{ width: '100%', marginBottom: '24px' }}>
              <label style={{ display: 'block', fontFamily: "'DM Sans', sans-serif", fontSize: '12px', color: 'var(--muted, #8B7355)', marginBottom: '8px' }}>
                Type the short code to confirm:
              </label>
              <input 
                type="text" 
                value={confirmInput} 
                onChange={(e) => setConfirmInput(e.target.value)} 
                style={{ width: '100%', background: 'var(--white, #FFFFFF)', border: '1.5px solid var(--border, #E5D5BE)', borderRadius: '10px', padding: '12px 16px', fontFamily: "'DM Mono', monospace", fontSize: '14px', color: 'var(--ink, #1C1612)', outline: 'none', transition: 'border-color 0.2s', boxSizing: 'border-box' }}
                onFocus={(e) => e.target.style.borderColor = '#DC2626'}
                onBlur={(e) => e.target.style.borderColor = 'var(--border, #E5D5BE)'}
              />
            </div>

            <div style={{ display: 'flex', gap: '12px', width: '100%' }}>
              <button 
                onClick={onClose} 
                disabled={loading}
                style={{ flex: 1, background: 'var(--white, #FFFFFF)', border: '1.5px solid var(--border, #E5D5BE)', borderRadius: '10px', padding: '12px', fontFamily: "'DM Sans', sans-serif", fontSize: '14px', fontWeight: 600, color: 'var(--ink-light, #3D3028)', cursor: 'pointer', transition: 'all 0.2s' }}
                onMouseEnter={e => e.currentTarget.style.backgroundColor = 'var(--surface, #FBF2E8)'}
                onMouseLeave={e => e.currentTarget.style.backgroundColor = 'var(--white, #FFFFFF)'}
              >
                Cancel
              </button>
              <button 
                onClick={() => onConfirm(url._id || url.id)} 
                disabled={!isMatch || loading}
                style={{ flex: 1, background: '#DC2626', border: 'none', borderRadius: '10px', padding: '12px', fontFamily: "'DM Sans', sans-serif", fontSize: '14px', fontWeight: 600, color: 'white', cursor: (!isMatch || loading) ? 'not-allowed' : 'pointer', opacity: (!isMatch || loading) ? 0.6 : 1, transition: 'background-color 0.2s', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '8px' }}
                onMouseEnter={e => { if (isMatch && !loading) e.currentTarget.style.backgroundColor = '#B91C1C' }}
                onMouseLeave={e => { if (isMatch && !loading) e.currentTarget.style.backgroundColor = '#DC2626' }}
              >
                {loading ? (
                  <><div style={{ width: '14px', height: '14px', border: '2px solid rgba(255,255,255,0.3)', borderTopColor: '#fff', borderRadius: '50%', animation: 'spin 1s linear infinite' }} /><style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>Deleting...</>
                ) : (
                  "Delete Forever"
                )}
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
