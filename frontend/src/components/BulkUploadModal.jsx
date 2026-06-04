import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Layers, X, Upload, FileText, Download, CheckCheck, AlertCircle } from 'lucide-react';
import toast from 'react-hot-toast';

export default function BulkUploadModal({ isOpen, onClose, onSuccess }) {
  const [tab, setTab] = useState('csv'); // 'csv' or 'paste'
  const [dragOver, setDragOver] = useState(false);
  const [parsedData, setParsedData] = useState([]);
  const [pasteData, setPasteData] = useState('');
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);

  const fileInputRef = useRef(null);

  if (!isOpen) return null;

  const downloadTemplate = () => {
    const csvContent = "originalUrl,title,customAlias\nhttps://example.com,My Link,\nhttps://google.com,Google,go-google";
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'zestlink-bulk-template.csv';
    link.click();
  };

  const parseCsv = (text) => {
    const lines = text.split('\n').map(l => l.trim()).filter(l => l);
    if (lines.length <= 1) return [];
    
    // Simple CSV parser assuming no quotes or escaped commas
    const headers = lines[0].split(',').map(h => h.trim());
    const data = lines.slice(1).map(line => {
      const values = line.split(',').map(v => v.trim());
      const obj = {};
      headers.forEach((h, i) => { obj[h] = values[i] || ''; });
      return { ...obj, _status: 'Ready' };
    }).slice(0, 50); // Max 50 rows
    
    setParsedData(data);
  };

  const handleFileUpload = (file) => {
    if (file.type !== 'text/csv' && !file.name.endsWith('.csv')) {
      toast.error("Please upload a valid CSV file");
      return;
    }
    const reader = new FileReader();
    reader.onload = (e) => parseCsv(e.target.result);
    reader.readAsText(file);
  };

  const getPastedUrls = () => {
    return pasteData.split('\n')
      .map(l => l.trim())
      .filter(l => l.length > 0)
      .slice(0, 50)
      .map(url => ({ originalUrl: url, _status: 'Ready' }));
  };

  const validItemsCount = tab === 'csv' ? parsedData.filter(d => d.originalUrl).length : getPastedUrls().filter(d => d.originalUrl).length;

  const handleSubmit = async () => {
    const items = tab === 'csv' ? parsedData : getPastedUrls();
    const toProcess = items.filter(i => i.originalUrl);
    
    if (toProcess.length === 0) return;
    
    setLoading(true);
    setResults(null);
    setProgress(0);
    
    const finalResults = [];
    
    // Process one by one to show progress (or could use a bulk API if available)
    for (let i = 0; i < toProcess.length; i++) {
      const item = toProcess[i];
      try {
        const payload = { originalUrl: item.originalUrl };
        if (item.title) payload.title = item.title;
        if (item.customAlias) payload.customAlias = item.customAlias;
        
        const res = await fetch('/api/urls', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${localStorage.getItem('token')}` },
          body: JSON.stringify(payload)
        });
        
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || 'Failed');
        
        finalResults.push({ ...item, _status: 'Created', shortUrl: data.url.shortUrl });
      } catch (err) {
        finalResults.push({ ...item, _status: `Error: ${err.message}` });
      }
      setProgress(i + 1);
    }
    
    setResults(finalResults);
    setLoading(false);
    
    const successCount = finalResults.filter(r => r._status === 'Created').length;
    if (successCount > 0) {
      toast.success(`${successCount} links created! 🎉`);
      onSuccess && onSuccess();
    }
  };

  const successCount = results ? results.filter(r => r._status === 'Created').length : 0;
  const errorCount = results ? results.length - successCount : 0;

  return (
    <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(28,22,18,0.55)', backdropFilter: 'blur(6px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: '20px' }}>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.94, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.94, y: 10 }}
            transition={{ duration: 0.25, ease: [0.34, 1.56, 0.64, 1] }}
            style={{ background: 'var(--white, #FFFFFF)', borderRadius: '28px', padding: '36px', width: '100%', maxWidth: '600px', maxHeight: '90vh', overflowY: 'auto', position: 'relative', boxShadow: '0 24px 80px rgba(28,22,18,0.18)', boxSizing: 'border-box' }}
          >
            <button onClick={onClose} style={{ position: 'absolute', top: '24px', right: '24px', width: '32px', height: '32px', borderRadius: '8px', background: 'var(--surface, #FBF2E8)', border: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--muted, #8B7355)', cursor: 'pointer', transition: 'all 0.15s' }} onMouseEnter={e => { e.currentTarget.style.backgroundColor = 'var(--coral, #E8553E)'; e.currentTarget.style.color = 'white'; }} onMouseLeave={e => { e.currentTarget.style.backgroundColor = 'var(--surface, #FBF2E8)'; e.currentTarget.style.color = 'var(--muted, #8B7355)'; }} >
              <X size={16} />
            </button>

            <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '24px' }}>
              <div style={{ width: '48px', height: '48px', borderRadius: '14px', background: 'rgba(28,22,18,0.07)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--ink, #1C1612)' }}>
                <Layers size={24} />
              </div>
              <div>
                <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: '26px', fontWeight: 800, color: 'var(--ink, #1C1612)', margin: 0 }}>Bulk URL Shortener</h2>
                <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: '13px', color: 'var(--muted, #8B7355)', margin: '4px 0 0 0' }}>Upload a CSV or paste URLs below</p>
              </div>
            </div>

            {!results && (
              <div style={{ display: 'flex', gap: '8px', background: 'var(--surface, #FBF2E8)', padding: '4px', borderRadius: '10px', marginBottom: '24px' }}>
                <button 
                  onClick={() => setTab('csv')}
                  style={{ flex: 1, padding: '10px', borderRadius: '8px', border: 'none', background: tab === 'csv' ? 'var(--white, #FFFFFF)' : 'transparent', color: tab === 'csv' ? 'var(--coral, #E8553E)' : 'var(--muted, #8B7355)', fontFamily: "'DM Sans', sans-serif", fontSize: '14px', fontWeight: 600, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', cursor: 'pointer', transition: 'all 0.2s', boxShadow: tab === 'csv' ? '0 2px 8px rgba(28,22,18,0.05)' : 'none' }}
                >
                  <Upload size={16} /> CSV Upload
                </button>
                <button 
                  onClick={() => setTab('paste')}
                  style={{ flex: 1, padding: '10px', borderRadius: '8px', border: 'none', background: tab === 'paste' ? 'var(--white, #FFFFFF)' : 'transparent', color: tab === 'paste' ? 'var(--coral, #E8553E)' : 'var(--muted, #8B7355)', fontFamily: "'DM Sans', sans-serif", fontSize: '14px', fontWeight: 600, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', cursor: 'pointer', transition: 'all 0.2s', boxShadow: tab === 'paste' ? '0 2px 8px rgba(28,22,18,0.05)' : 'none' }}
                >
                  <FileText size={16} /> Paste URLs
                </button>
              </div>
            )}

            {!results && tab === 'csv' && (
              <div>
                <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '12px' }}>
                  <button onClick={downloadTemplate} style={{ background: 'none', border: 'none', color: 'var(--coral, #E8553E)', fontFamily: "'DM Sans', sans-serif", fontSize: '12px', fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px', padding: 0 }}>
                    <Download size={14} /> Download CSV template
                  </button>
                </div>
                
                {parsedData.length === 0 ? (
                  <div 
                    onDragOver={e => { e.preventDefault(); setDragOver(true); }}
                    onDragLeave={() => setDragOver(false)}
                    onDrop={e => { e.preventDefault(); setDragOver(false); if (e.dataTransfer.files[0]) handleFileUpload(e.dataTransfer.files[0]); }}
                    onClick={() => fileInputRef.current?.click()}
                    style={{ border: `2px dashed ${dragOver ? 'var(--coral, #E8553E)' : 'var(--border-dark, #C8B49A)'}`, borderRadius: '16px', padding: '48px 32px', textAlign: 'center', background: dragOver ? 'rgba(232,85,62,0.04)' : 'var(--surface, #FBF2E8)', transition: 'all 0.2s', cursor: 'pointer' }}
                  >
                    <input type="file" accept=".csv" ref={fileInputRef} onChange={e => { if (e.target.files[0]) handleFileUpload(e.target.files[0]); }} style={{ display: 'none' }} />
                    <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'var(--muted-light, #C4A882)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
                      <Upload size={20} />
                    </div>
                    <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: '20px', fontWeight: 700, color: 'var(--ink, #1C1612)', margin: '0 0 4px 0' }}>Drop your CSV here</h3>
                    <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: '13px', color: 'var(--muted, #8B7355)', margin: '0 0 12px 0' }}>or click to browse files</p>
                    <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: '11px', color: 'var(--muted-light, #C4A882)', margin: 0 }}>Max 50 rows · originalUrl, title, customAlias</p>
                  </div>
                ) : (
                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                      <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: '12px', color: 'var(--muted, #8B7355)' }}>Showing {parsedData.length} rows</span>
                      <button onClick={() => setParsedData([])} style={{ background: 'none', border: 'none', color: '#DC2626', cursor: 'pointer', fontFamily: "'DM Sans', sans-serif", fontSize: '12px', fontWeight: 600 }}>Remove file</button>
                    </div>
                    <div style={{ maxHeight: '200px', overflowY: 'auto', border: '1px solid var(--border, #E5D5BE)', borderRadius: '10px' }}>
                      <table style={{ width: '100%', borderCollapse: 'collapse', fontFamily: "'DM Sans', sans-serif", fontSize: '12px', textAlign: 'left' }}>
                        <thead style={{ background: 'var(--surface, #FBF2E8)', position: 'sticky', top: 0 }}>
                          <tr>
                            <th style={{ padding: '10px 12px', borderBottom: '1px solid var(--border, #E5D5BE)', fontWeight: 600, color: 'var(--ink, #1C1612)' }}>URL</th>
                            <th style={{ padding: '10px 12px', borderBottom: '1px solid var(--border, #E5D5BE)', fontWeight: 600, color: 'var(--ink, #1C1612)' }}>Alias</th>
                            <th style={{ padding: '10px 12px', borderBottom: '1px solid var(--border, #E5D5BE)', fontWeight: 600, color: 'var(--ink, #1C1612)' }}>Status</th>
                          </tr>
                        </thead>
                        <tbody>
                          {parsedData.map((row, i) => (
                            <tr key={i} style={{ borderBottom: '1px solid var(--border, #E5D5BE)' }}>
                              <td style={{ padding: '10px 12px', maxWidth: '200px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', color: 'var(--muted, #8B7355)' }}>{row.originalUrl}</td>
                              <td style={{ padding: '10px 12px', color: 'var(--muted, #8B7355)' }}>{row.customAlias || '-'}</td>
                              <td style={{ padding: '10px 12px', color: 'var(--sage, #6B8F6E)', fontWeight: 600 }}>{row._status}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}
              </div>
            )}

            {!results && tab === 'paste' && (
              <div>
                <label style={{ display: 'block', fontFamily: "'DM Sans', sans-serif", fontSize: '13px', fontWeight: 600, color: 'var(--ink, #1C1612)', marginBottom: '8px' }}>
                  Paste one URL per line (max 50):
                </label>
                <textarea 
                  value={pasteData}
                  onChange={e => setPasteData(e.target.value)}
                  placeholder="https://example.com/page-one&#10;https://example.com/page-two&#10;https://example.com/page-three"
                  style={{ width: '100%', height: '160px', fontFamily: "'DM Mono', monospace", fontSize: '13px', color: 'var(--ink, #1C1612)', background: 'var(--white, #FFFFFF)', border: '1.5px solid var(--border, #E5D5BE)', borderRadius: '10px', padding: '14px 16px', resize: 'vertical', outline: 'none', transition: 'all 0.2s', boxSizing: 'border-box' }}
                  onFocus={e => { e.target.style.borderColor = 'var(--coral, #E8553E)'; e.target.style.boxShadow = '0 0 0 4px rgba(232,85,62,0.1)'; }}
                  onBlur={e => { e.target.style.borderColor = 'var(--border, #E5D5BE)'; e.target.style.boxShadow = 'none'; }}
                />
                <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: '12px', color: 'var(--muted, #8B7355)', marginTop: '8px' }}>
                  {getPastedUrls().length} URLs detected
                </div>
              </div>
            )}

            {results && (
              <AnimatePresence>
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} style={{ marginBottom: '24px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                    {successCount > 0 && (
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--sage, #6B8F6E)', fontFamily: "'DM Sans', sans-serif", fontSize: '16px', fontWeight: 600 }}>
                        <CheckCheck size={20} /> {successCount} links created!
                      </div>
                    )}
                    {errorCount > 0 && (
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#DC2626', fontFamily: "'DM Sans', sans-serif", fontSize: '14px', fontWeight: 600 }}>
                        <AlertCircle size={16} /> {errorCount} failed
                      </div>
                    )}
                  </div>
                  
                  <div style={{ maxHeight: '240px', overflowY: 'auto', border: '1px solid var(--border, #E5D5BE)', borderRadius: '10px' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse', fontFamily: "'DM Sans', sans-serif", fontSize: '12px', textAlign: 'left' }}>
                      <thead style={{ background: 'var(--surface, #FBF2E8)', position: 'sticky', top: 0 }}>
                        <tr>
                          <th style={{ padding: '10px 12px', borderBottom: '1px solid var(--border, #E5D5BE)', fontWeight: 600, color: 'var(--ink, #1C1612)' }}>URL</th>
                          <th style={{ padding: '10px 12px', borderBottom: '1px solid var(--border, #E5D5BE)', fontWeight: 600, color: 'var(--ink, #1C1612)' }}>Result</th>
                        </tr>
                      </thead>
                      <tbody>
                        {results.map((row, i) => {
                          const isSuccess = row._status === 'Created';
                          return (
                            <tr key={i} style={{ borderBottom: '1px solid var(--border, #E5D5BE)' }}>
                              <td style={{ padding: '10px 12px', maxWidth: '200px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', color: 'var(--muted, #8B7355)' }}>{row.originalUrl}</td>
                              <td style={{ padding: '10px 12px' }}>
                                {isSuccess ? (
                                  <span style={{ fontFamily: "'DM Mono', monospace", color: 'var(--coral, #E8553E)' }}>{row.shortUrl}</span>
                                ) : (
                                  <span style={{ color: '#DC2626' }}>{row._status}</span>
                                )}
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </motion.div>
              </AnimatePresence>
            )}

            {!results && (
              <button 
                onClick={handleSubmit}
                disabled={loading || validItemsCount === 0} 
                style={{ width: '100%', marginTop: '24px', backgroundColor: 'var(--coral, #E8553E)', color: 'white', padding: '14px', border: 'none', borderRadius: '10px', fontFamily: "'DM Sans', sans-serif", fontSize: '14px', fontWeight: 700, cursor: (loading || validItemsCount === 0) ? 'not-allowed' : 'pointer', opacity: (loading || validItemsCount === 0) ? 0.85 : 1, transition: 'all 0.2s', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '8px', boxShadow: '0 8px 24px rgba(232,85,62,0.28)' }}
              >
                {loading ? (
                  <><div style={{ width: '16px', height: '16px', border: '2px solid rgba(255,255,255,0.3)', borderTopColor: '#fff', borderRadius: '50%', animation: 'spin 1s linear infinite' }} /><style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>Creating... {progress}/{validItemsCount}</>
                ) : (
                  `Snap ${validItemsCount} Links →`
                )}
              </button>
            )}
            {results && (
              <button 
                onClick={onClose}
                style={{ width: '100%', marginTop: '24px', backgroundColor: 'var(--white, #FFFFFF)', color: 'var(--ink, #1C1612)', border: '1.5px solid var(--border, #E5D5BE)', padding: '14px', borderRadius: '10px', fontFamily: "'DM Sans', sans-serif", fontSize: '14px', fontWeight: 700, cursor: 'pointer', transition: 'all 0.2s' }}
                onMouseEnter={e => e.currentTarget.style.backgroundColor = 'var(--surface, #FBF2E8)'}
                onMouseLeave={e => e.currentTarget.style.backgroundColor = 'var(--white, #FFFFFF)'}
              >
                Done
              </button>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
