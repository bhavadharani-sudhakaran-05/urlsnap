/* src/pages/QRGeneratorPage.jsx
   Main page assembling QR generator UI.
*/
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import QRTypeTab from '../components/QRTypeTab';
import QRCustomizer from '../components/QRCustomizer';
import QRPreview from '../components/QRPreview';
import { useQRGenerator } from '../hooks/useQRGenerator';

export default function QRGeneratorPage() {
  const {
    options,
    qrDataUrl,
    isGenerating,
    error,
    selectedTemplate,
    updateOption,
    updateMultiple,
    applyTemplate,
    downloadQR,
    copyToClipboard,
    buildQRContent,
  } = useQRGenerator();

  const [activeTab, setActiveTab] = useState('url');

  // Trigger actions from Customizer via flags in options (simple approach)
  useEffect(() => {
    if (options.triggerDownload) {
      downloadQR();
      updateOption('triggerDownload', false);
    }
    if (options.triggerCopy) {
      copyToClipboard().then(success => {
        if (success) alert('Copied to clipboard! ✓');
        else alert('Copy failed.');
        updateOption('triggerCopy', false);
      });
    }
    if (options.triggerShare) {
      // Simple share using navigator.share if available
      if (navigator.share && qrDataUrl) {
        fetch(qrDataUrl)
          .then(r => r.blob())
          .then(blob => {
            const file = new File([blob], 'qr.png', { type: 'image/png' });
            navigator.share({ files: [file], title: 'Snipra QR Code' });
          })
          .catch(() => alert('Share failed.'));
      } else {
        alert('Web Share API not available. Use download or copy.');
      }
      updateOption('triggerShare', false);
    }
  }, [options, downloadQR, copyToClipboard, updateOption]);

  return (
    <div className="page-container" style={{ padding: '36px 40px 0', maxWidth: '1000px', margin: '0 auto' }}>
      {/* Header */}
      <div className="header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '24px' }}>
        <div>
          <div className="eyebrow" style={{ fontFamily: 'DM Sans', fontSize: '11px', fontWeight: 700, color: 'var(--coral)', letterSpacing: '3px', textTransform: 'uppercase' }}>QR GENERATOR</div>
          <h1 style={{ fontFamily: 'Playfair Display', fontSize: '36px', fontWeight: 900, color: 'var(--ink)', margin: '4px 0' }}>
            Create beautiful <span style={{ color: 'var(--coral)' }}>QR codes.</span>
          </h1>
          <p style={{ fontFamily: 'DM Sans', fontSize: '14px', color: 'var(--muted)' }}>
            Generate, customize, and download QR codes for any content type. Every short link gets its own QR automatically.
          </p>
        </div>
      </div>

      {/* Tab bar */}
      <QRTypeTab activeTab={activeTab} onSelect={setActiveTab} />

      {/* Main two‑column layout */}
      <div className="main-grid" style={{ display: 'grid', gap: '28px', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))' }}>
        <div>
          <QRCustomizer
            activeTab={activeTab}
            options={options}
            updateOption={updateOption}
            updateMultiple={updateMultiple}
            applyTemplate={applyTemplate}
            selectedTemplate={selectedTemplate}
          />
        </div>
        <div>
          <QRPreview
            qrDataUrl={qrDataUrl}
            isGenerating={isGenerating}
            options={options}
            buildQRContent={buildQRContent}
            onDownload={downloadQR}
            onCopy={copyToClipboard}
            onShare={() => { /* handled via useEffect */ }}
          />
        </div>
      </div>

      {error && (
        <div style={{ marginTop: '16px', background: 'rgba(220,38,38,0.08)', border: '1px solid rgba(220,38,38,0.2)', borderRadius: '10px', padding: '10px 14px', color: '#DC2626', fontFamily: 'DM Sans' }}>
          ⚠ {error}
        </div>
      )}
    </div>
  );
}
