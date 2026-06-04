import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { QrCode, X, Download } from 'lucide-react';
import toast from 'react-hot-toast';

export default function QRModal({ isOpen, onClose, url, onGenerateQR }) {
  const [generating, setGenerating] = useState(false);

  if (!isOpen || !url) return null;

  const handleGenerate = async () => {
    if (!onGenerateQR) return;
    setGenerating(true);
    try {
      await onGenerateQR(url._id);
    } catch (err) {
      toast.error('Failed to generate QR code');
    } finally {
      setGenerating(false);
    }
  };

  const handleDownload = () => {
    if (!url.qrCode) return;
    const link = document.createElement('a');
    link.download = `zestlink-qr-${url.shortCode}.png`;
    link.href = url.qrCode;
    link.click();
  };

  return (
    <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(28,22,18,0.55)', backdropFilter: 'blur(6px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: '20px' }}>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.94, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.94, y: 10 }}
            transition={{ duration: 0.25, ease: [0.34, 1.56, 0.64, 1] }}
            style={{ background: 'var(--white, #FFFFFF)', borderRadius: '28px', padding: '36px', width: '100%', maxWidth: '440px', position: 'relative', boxShadow: '0 24px 80px rgba(28,22,18,0.18)', boxSizing: 'border-box' }}
          >
            <button onClick={onClose} style={{ position: 'absolute', top: '24px', right: '24px', width: '32px', height: '32px', borderRadius: '8px', background: 'var(--surface, #FBF2E8)', border: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--muted, #8B7355)', cursor: 'pointer', transition: 'all 0.15s' }} onMouseEnter={e => { e.currentTarget.style.backgroundColor = 'var(--coral, #E8553E)'; e.currentTarget.style.color = 'white'; }} onMouseLeave={e => { e.currentTarget.style.backgroundColor = 'var(--surface, #FBF2E8)'; e.currentTarget.style.color = 'var(--muted, #8B7355)'; }} >
              <X size={16} />
            </button>

            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
              <div style={{ width: '48px', height: '48px', borderRadius: '14px', background: 'rgba(107,143,110,0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--sage, #6B8F6E)', marginBottom: '16px' }}>
                <QrCode size={24} />
              </div>
              <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: '24px', fontWeight: 800, color: 'var(--ink, #1C1612)', margin: '0 0 4px 0' }}>QR Code</h2>
              <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: '13px', color: 'var(--muted, #8B7355)', margin: 0 }}>Scan to visit link</p>
            </div>

            <div style={{ margin: '24px 0', display: 'flex', justifyContent: 'center' }}>
              <div style={{ fontFamily: "'DM Mono', monospace", fontSize: '14px', color: 'var(--coral, #E8553E)', background: 'rgba(232,85,62,0.06)', borderRadius: '10px', padding: '10px 16px', display: 'inline-block' }}>
                zestlink.io/{url.shortCode}
              </div>
            </div>

            <div style={{ background: 'var(--surface, #FBF2E8)', border: '1.5px dashed var(--border-dark, #C8B49A)', borderRadius: '16px', padding: '28px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '240px', marginBottom: '24px' }}>
              {url.qrCode ? (
                <img src={url.qrCode} alt="QR Code" style={{ width: '200px', height: '200px', borderRadius: '8px' }} />
              ) : generating ? (
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px' }}>
                  <div style={{ width: '24px', height: '24px', border: '3px solid rgba(107,143,110,0.3)', borderTopColor: 'var(--sage, #6B8F6E)', borderRadius: '50%', animation: 'spin 1s linear infinite' }} />
                  <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: '13px', color: 'var(--sage, #6B8F6E)' }}>Generating QR code...</span>
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '16px' }}>
                  <QrCode size={48} color="var(--muted-light, #C4A882)" />
                  <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: '13px', color: 'var(--muted, #8B7355)' }}>QR code not yet generated</span>
                  <button 
                    onClick={handleGenerate}
                    style={{ background: 'transparent', border: '1.5px solid var(--sage, #6B8F6E)', color: 'var(--sage, #6B8F6E)', borderRadius: '8px', padding: '10px 20px', fontFamily: "'DM Sans', sans-serif", fontSize: '13px', fontWeight: 600, cursor: 'pointer', transition: 'all 0.2s' }}
                    onMouseEnter={e => { e.currentTarget.style.backgroundColor = 'rgba(107,143,110,0.1)'; }}
                    onMouseLeave={e => { e.currentTarget.style.backgroundColor = 'transparent'; }}
                  >
                    Generate QR Code
                  </button>
                </div>
              )}
            </div>

            {url.qrCode && (
              <button 
                onClick={handleDownload}
                style={{ width: '100%', background: 'var(--sage, #6B8F6E)', border: 'none', borderRadius: '10px', padding: '14px', fontFamily: "'DM Sans', sans-serif", fontSize: '14px', fontWeight: 700, color: 'white', cursor: 'pointer', transition: 'background-color 0.2s', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '8px', marginBottom: '16px' }}
                onMouseEnter={e => e.currentTarget.style.backgroundColor = '#587A5B'}
                onMouseLeave={e => e.currentTarget.style.backgroundColor = 'var(--sage, #6B8F6E)'}
              >
                <Download size={16} /> Download QR Code (PNG)
              </button>
            )}

            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '8px', fontFamily: "'DM Sans', sans-serif", fontSize: '12px', color: 'var(--muted, #8B7355)' }}>
              <span>300 × 300 px</span>
              <span>·</span>
              <span>PNG Format</span>
              <span>·</span>
              <span>SSL Secured</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
