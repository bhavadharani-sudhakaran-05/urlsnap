/* src/components/QRPreview.jsx
   Right panel displaying live QR preview, encoded string, and action buttons.
*/
import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function QRPreview({ qrDataUrl, isGenerating, options, onDownload, onCopy, onShare, buildQRContent }) {
  const encodedString = buildQRContent(options);

  // Effect to pause generation indicator after data URL updates
  useEffect(() => {
    // no extra logic needed; isGenerating flag handles UI
  }, [qrDataUrl]);

  return (
    <div className="glass-card" style={{
      background: 'var(--white)',
      border: '1.5px solid var(--border)',
      borderRadius: '24px',
      padding: '32px',
      boxShadow: '0 4px 20px rgba(28,22,18,0.06)',
      position: 'sticky',
      top: '100px',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
    }}>
      <h3 style={{ fontFamily: 'Playfair Display', fontSize: '22px', fontWeight: 800, color: 'var(--ink)', margin: 0 }}>QR Code Preview</h3>
      <p style={{ fontFamily: 'DM Sans', fontSize: '13px', color: 'var(--muted)', marginTop: '4px' }}>Updates live as you customize</p>

      <div style={{ width: '280px', height: '280px', margin: '28px auto', position: 'relative', borderRadius: '20px', border: '1.5px solid var(--border)', overflow: 'hidden', backgroundImage: `linear-gradient(45deg, #e0d8cc 25%, transparent 25%),
        linear-gradient(-45deg, #e0d8cc 25%, transparent 25%),
        linear-gradient(45deg, transparent 75%, #e0d8cc 75%),
        linear-gradient(-45deg, transparent 75%, #e0d8cc 75%)`,
        backgroundSize: '16px 16px',
        backgroundPosition: '0 0, 0 8px, 8px -8px, -8px 0px'
      }}>
        {/* Live QR or placeholder */}
        <AnimatePresence mode="wait">
          {isGenerating && (
            <motion.div key="loading" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} style={{
              position: 'absolute', inset: 0, background: 'rgba(255,255,255,0.85)',
              backdropFilter: 'blur(6px)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center'
            }}>
              <div className="spinner" style={{ width: '28px', height: '28px', border: '3px solid var(--coral)', borderTopColor: 'transparent', borderRadius: '50%', animation: 'spin 1s linear infinite' }} />
              <span style={{ marginTop: '8px', fontFamily: 'DM Sans', fontSize: '13px', color: 'var(--muted)' }}>Generating...</span>
            </motion.div>
          )}
          {!isGenerating && qrDataUrl ? (
            <motion.img key="qr" src={qrDataUrl} alt="QR Code" style={{ width: '100%', height: '100%', objectFit: 'contain' }}
              initial={{ opacity: 0, scale: 0.97 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.25 }} />
          ) : (
            <motion.div key="placeholder" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} style={{
              position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', filter: 'blur(4px) grayscale(0.5) opacity(0.5)'
            }}>
              <img src="https://snipra.io/placeholder-qr.png" alt="placeholder" style={{ width: '80%', height: '80%' }} />
              <div style={{ position: 'absolute', background: 'rgba(253,246,236,0.85)', borderRadius: '12px', padding: '12px 20px', backdropFilter: 'blur(4px)', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <span style={{ fontSize: '28px', color: 'var(--coral)' }}>⬛</span>
                <span style={{ marginTop: '8px', fontFamily: 'DM Sans', fontSize: '13px', color: 'var(--muted)' }}>Enter content to generate</span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
        {/* Live preview badge */}
        <div style={{ position: 'absolute', top: '8px', right: '8px', background: 'rgba(107,143,110,0.12)', border: '1px solid rgba(107,143,110,0.25)', borderRadius: '999px', padding: '4px 10px', fontFamily: 'DM Sans', fontSize: '11px', fontWeight: 700, color: 'var(--sage)', display: 'flex', alignItems: 'center', gap: '5px' }}>
          <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: isGenerating ? 'var(--amber)' : 'var(--sage)', animation: isGenerating ? 'pulse 1.5s infinite' : 'none' }} />
          {isGenerating ? 'Updating...' : 'Live preview'}
        </div>
      </div>

      {/* Encoded string strip */}
      <div style={{ marginTop: '12px', fontFamily: 'DM Sans', fontSize: '12px', color: 'var(--muted)' }}>
        <span>Encodes: </span>
        <code title={encodedString} style={{ background: 'var(--surface)', borderRadius: '6px', padding: '4px 10px', color: 'var(--ink)', fontFamily: 'DM Mono' }}>
          {encodedString.length > 60 ? `${encodedString.slice(0, 57)}...` : encodedString}
        </code>
      </div>

      {/* Action buttons */}
      <button className="btn-coral" style={{ width: '100%', marginTop: '16px' }} onClick={onDownload}>⬇ Download QR Code</button>
      <button className="btn-secondary" style={{ width: '100%', marginTop: '8px' }} onClick={onCopy}>📋 Copy as PNG</button>
      <button className="btn-ghost" style={{ width: '100%', marginTop: '6px' }} onClick={onShare}>🔗 Share QR Code</button>
      <button className="btn-ghost" style={{ width: '100%', marginTop: '6px' }} onClick={() => alert('Point your phone camera at the QR code above to test it')}>📷 Test with camera</button>
    </div>
  );
}

/* Simple CSS animations (add to index.css if not present) */
/*
@keyframes spin { to { transform: rotate(360deg); } }
@keyframes pulse { 0% { opacity: 1; } 50% { opacity: 0.4; } 100% { opacity: 1; } }
*/
