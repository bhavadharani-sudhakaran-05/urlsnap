import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link2, X, Globe, Tag, AtSign, CalendarClock, QrCode } from 'lucide-react';
import toast from 'react-hot-toast';

export default function CreateUrlModal({ isOpen, onClose, onSuccess }) {
  const [formData, setFormData] = useState({
    originalUrl: '',
    title: '',
    customAlias: '',
    useCustomAlias: false,
    expiresAt: '',
    useExpiry: false,
    generateQr: false
  });
  
  const [errors, setErrors] = useState({ originalUrl: '', customAlias: '', general: '' });
  const [loading, setLoading] = useState(false);
  const [isValidUrl, setIsValidUrl] = useState(false);
  const [aliasStatus, setAliasStatus] = useState('none'); // 'none', 'checking', 'available', 'taken'

  useEffect(() => {
    if (isOpen) {
      setFormData({ originalUrl: '', title: '', customAlias: '', useCustomAlias: false, expiresAt: '', useExpiry: false, generateQr: false });
      setErrors({ originalUrl: '', customAlias: '', general: '' });
      setIsValidUrl(false);
      setAliasStatus('none');
    }
  }, [isOpen]);

  const validateUrl = (url) => {
    try { new URL(url); return true; } catch { return false; }
  };

  const handleUrlChange = (e) => {
    const url = e.target.value;
    setFormData(prev => ({ ...prev, originalUrl: url }));
    setIsValidUrl(validateUrl(url));
    if (errors.originalUrl) setErrors(prev => ({ ...prev, originalUrl: '' }));
  };

  useEffect(() => {
    if (!formData.useCustomAlias || !formData.customAlias) {
      setAliasStatus('none');
      return;
    }
    setAliasStatus('checking');
    const timer = setTimeout(() => {
      const isValid = /^[a-zA-Z0-9-_]{3,20}$/.test(formData.customAlias);
      if (!isValid) setAliasStatus('none');
      else setAliasStatus('available');
    }, 600);
    return () => clearTimeout(timer);
  }, [formData.customAlias, formData.useCustomAlias]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({ originalUrl: '', customAlias: '', general: '' });
    
    if (!formData.originalUrl) {
      setErrors(prev => ({ ...prev, originalUrl: 'Destination URL is required' }));
      return;
    }
    if (!validateUrl(formData.originalUrl)) {
      setErrors(prev => ({ ...prev, originalUrl: 'Please enter a valid URL (including http/https)' }));
      return;
    }
    if (formData.useCustomAlias && formData.customAlias) {
      if (!/^[a-zA-Z0-9-_]{3,20}$/.test(formData.customAlias)) {
        setErrors(prev => ({ ...prev, customAlias: 'Alias must be 3-20 chars (letters, numbers, hyphens, underscores)' }));
        return;
      }
    }

    setLoading(true);
    try {
      const payload = {
        originalUrl: formData.originalUrl,
        title: formData.title,
      };
      if (formData.useCustomAlias && formData.customAlias) payload.customAlias = formData.customAlias;
      if (formData.useExpiry && formData.expiresAt) payload.expiresAt = formData.expiresAt;
      
      const res = await fetch('/api/url/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${localStorage.getItem('token')}` },
        body: JSON.stringify(payload)
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to create link');
      const created = data.data;
      
      if (formData.generateQr) {
        await fetch(`/api/url/${created._id}/qr`, {
          method: 'POST',
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        });
      }

      toast.success("Link snapped! 🎉", { style: { fontFamily: "'DM Sans', sans-serif" } });
      onSuccess && onSuccess(created);
      onClose();
    } catch (err) {
      setErrors(prev => ({ ...prev, general: err.message }));
    } finally {
      setLoading(false);
    }
  };

  const getTomorrowString = () => {
    const tmrw = new Date();
    tmrw.setDate(tmrw.getDate() + 1);
    tmrw.setHours(12, 0, 0, 0);
    return tmrw.toISOString().slice(0, 16);
  };

  if (!isOpen) return null;

  return (
    <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(28,22,18,0.55)', backdropFilter: 'blur(6px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: '20px' }}>
      <style>{`
        .modal-input { width: 100%; background: var(--white, #FFFFFF); border: 1.5px solid var(--border, #E5D5BE); border-radius: 10px; font-family: 'DM Sans', sans-serif; font-size: 15px; color: var(--ink, #1C1612); transition: all 0.2s ease; outline: none; box-sizing: border-box; }
        .modal-input:focus { border-color: var(--coral, #E8553E); box-shadow: 0 0 0 4px rgba(232,85,62,0.10); }
        .toggle-bg { width: 36px; height: 20px; border-radius: 99px; transition: background-color 0.2s; position: relative; cursor: pointer; }
        .toggle-bg.on { background-color: var(--coral, #E8553E); }
        .toggle-bg.off { background-color: var(--border, #E5D5BE); }
        .toggle-knob { width: 16px; height: 16px; background-color: white; border-radius: 50%; position: absolute; top: 2px; transition: transform 0.2s, box-shadow 0.2s; box-shadow: 0 1px 3px rgba(0,0,0,0.1); }
        .toggle-bg.on .toggle-knob { transform: translateX(18px); }
        .toggle-bg.off .toggle-knob { transform: translateX(2px); }
      `}</style>
      
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.94, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.94, y: 10 }}
            transition={{ duration: 0.25, ease: [0.34, 1.56, 0.64, 1] }}
            style={{ background: 'var(--white, #FFFFFF)', borderRadius: '28px', padding: '36px', width: '100%', maxWidth: '520px', maxHeight: '88vh', overflowY: 'auto', position: 'relative', boxShadow: '0 24px 80px rgba(28,22,18,0.18)', boxSizing: 'border-box' }}
          >
            <button onClick={onClose} style={{ position: 'absolute', top: '24px', right: '24px', width: '32px', height: '32px', borderRadius: '8px', background: 'var(--surface, #FBF2E8)', border: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--muted, #8B7355)', cursor: 'pointer', transition: 'all 0.15s' }} onMouseEnter={e => { e.currentTarget.style.backgroundColor = 'var(--coral, #E8553E)'; e.currentTarget.style.color = 'white'; }} onMouseLeave={e => { e.currentTarget.style.backgroundColor = 'var(--surface, #FBF2E8)'; e.currentTarget.style.color = 'var(--muted, #8B7355)'; }} >
              <X size={16} />
            </button>

            <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '32px' }}>
              <div style={{ width: '48px', height: '48px', borderRadius: '14px', background: 'rgba(232,85,62,0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--coral, #E8553E)' }}>
                <Link2 size={24} />
              </div>
              <div>
                <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: '26px', fontWeight: 800, color: 'var(--ink, #1C1612)', margin: 0 }}>Snap a New Link</h2>
                <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: '13px', color: 'var(--muted, #8B7355)', margin: '4px 0 0 0' }}>Shorten, customize, and track.</p>
              </div>
            </div>

            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              {errors.general && (
                <div style={{ backgroundColor: '#FEF2F2', border: '1px solid #FECACA', borderRadius: '8px', padding: '12px', color: '#DC2626', fontSize: '13px', fontWeight: 500, fontFamily: "'DM Sans', sans-serif" }}>
                  {errors.general}
                </div>
              )}

              <div>
                <label style={{ display: 'flex', alignItems: 'center', fontSize: '12px', fontWeight: 600, color: 'var(--ink-light, #3D3028)', letterSpacing: '0.8px', textTransform: 'uppercase', marginBottom: '7px', fontFamily: "'DM Sans', sans-serif" }}>
                  DESTINATION URL *
                  {isValidUrl && <span style={{ marginLeft: '12px', color: 'var(--sage, #6B8F6E)', fontSize: '10px', backgroundColor: 'rgba(107,143,110,0.12)', padding: '2px 6px', borderRadius: '99px' }}>Valid URL ✓</span>}
                </label>
                <div style={{ position: 'relative' }}>
                  <div style={{ position: 'absolute', left: 0, top: 0, bottom: 0, width: '44px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--muted-light, #C4A882)' }}>
                    <Globe size={16} />
                  </div>
                  <input type="url" required placeholder="https://your-long-url.com/with-all-the-params" value={formData.originalUrl} onChange={handleUrlChange} className="modal-input" style={{ padding: '13px 16px 13px 44px', borderColor: errors.originalUrl ? '#DC2626' : 'var(--border, #E5D5BE)' }} />
                </div>
                {errors.originalUrl && <div style={{ color: '#DC2626', fontSize: '12px', marginTop: '4px', fontFamily: "'DM Sans', sans-serif" }}>{errors.originalUrl}</div>}
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: 'var(--ink-light, #3D3028)', letterSpacing: '0.8px', textTransform: 'uppercase', marginBottom: '7px', fontFamily: "'DM Sans', sans-serif" }}>
                  TITLE (optional)
                </label>
                <div style={{ position: 'relative' }}>
                  <div style={{ position: 'absolute', left: 0, top: 0, bottom: 0, width: '44px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--muted-light, #C4A882)' }}>
                    <Tag size={16} />
                  </div>
                  <input type="text" placeholder="e.g. Summer Campaign 2024" value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} className="modal-input" style={{ padding: '13px 16px 13px 44px' }} />
                </div>
                <div style={{ fontSize: '11px', color: 'var(--muted-light, #C4A882)', marginTop: '6px', fontFamily: "'DM Sans', sans-serif" }}>Helps you identify this link in your dashboard</div>
              </div>

              <div style={{ borderTop: '1px solid var(--border, #E5D5BE)', margin: '4px 0' }} />

              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }} onClick={() => setFormData({...formData, useCustomAlias: !formData.useCustomAlias})}>
                  <div>
                    <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: '14px', fontWeight: 600, color: 'var(--ink, #1C1612)' }}>Custom Alias</div>
                    <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: '12px', color: 'var(--muted, #8B7355)' }}>Use a memorable short code</div>
                  </div>
                  <div className={`toggle-bg ${formData.useCustomAlias ? 'on' : 'off'}`}><div className="toggle-knob" /></div>
                </div>
                
                <AnimatePresence>
                  {formData.useCustomAlias && (
                    <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1, marginTop: '16px' }} exit={{ height: 0, opacity: 0, marginTop: 0 }} style={{ overflow: 'hidden' }}>
                      <div style={{ display: 'flex' }}>
                        <div style={{ display: 'flex', alignItems: 'center', background: 'var(--surface, #FBF2E8)', border: '1.5px solid var(--border, #E5D5BE)', borderRight: 'none', borderRadius: '8px 0 0 8px', padding: '0 12px', fontFamily: "'DM Sans', sans-serif", fontSize: '13px', color: 'var(--muted, #8B7355)' }}>
                          linksnap.io/
                        </div>
                        <div style={{ position: 'relative', flex: 1 }}>
                          <div style={{ position: 'absolute', left: 0, top: 0, bottom: 0, width: '40px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--muted-light, #C4A882)' }}>
                            <AtSign size={14} />
                          </div>
                          <input type="text" placeholder="your-alias" value={formData.customAlias} onChange={e => {setFormData({...formData, customAlias: e.target.value}); if (errors.customAlias) setErrors({...errors, customAlias: ''}); }} className="modal-input" style={{ borderRadius: '0 8px 8px 0', padding: '13px 16px 13px 40px', borderColor: errors.customAlias ? '#DC2626' : 'var(--border, #E5D5BE)' }} />
                          {aliasStatus === 'checking' && <div style={{ position: 'absolute', right: '12px', top: 0, bottom: 0, display: 'flex', alignItems: 'center', fontSize: '11px', color: 'var(--muted-light, #C4A882)', fontFamily: "'DM Sans', sans-serif" }}>checking...</div>}
                          {aliasStatus === 'available' && <div style={{ position: 'absolute', right: '12px', top: 0, bottom: 0, display: 'flex', alignItems: 'center', fontSize: '11px', color: 'var(--sage, #6B8F6E)', fontFamily: "'DM Sans', sans-serif", fontWeight: 600 }}>✓ Available</div>}
                          {aliasStatus === 'taken' && <div style={{ position: 'absolute', right: '12px', top: 0, bottom: 0, display: 'flex', alignItems: 'center', fontSize: '11px', color: '#DC2626', fontFamily: "'DM Sans', sans-serif", fontWeight: 600 }}>✗ Taken</div>}
                        </div>
                      </div>
                      <div style={{ fontSize: '11px', color: errors.customAlias ? '#DC2626' : 'var(--muted-light, #C4A882)', marginTop: '6px', fontFamily: "'DM Sans', sans-serif" }}>
                        {errors.customAlias || "Only letters, numbers, hyphens, underscores (3-20 chars)"}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }} onClick={() => setFormData({...formData, useExpiry: !formData.useExpiry})}>
                  <div>
                    <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: '14px', fontWeight: 600, color: 'var(--ink, #1C1612)' }}>Set Expiry Date</div>
                    <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: '12px', color: 'var(--muted, #8B7355)' }}>Auto-disable after a date</div>
                  </div>
                  <div className={`toggle-bg ${formData.useExpiry ? 'on' : 'off'}`}><div className="toggle-knob" /></div>
                </div>
                <AnimatePresence>
                  {formData.useExpiry && (
                    <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1, marginTop: '16px' }} exit={{ height: 0, opacity: 0, marginTop: 0 }} style={{ overflow: 'hidden' }}>
                      <div style={{ position: 'relative' }}>
                        <div style={{ position: 'absolute', left: 0, top: 0, bottom: 0, width: '44px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--muted-light, #C4A882)' }}>
                          <CalendarClock size={16} />
                        </div>
                        <input type="datetime-local" min={getTomorrowString()} value={formData.expiresAt} onChange={e => setFormData({...formData, expiresAt: e.target.value})} className="modal-input" style={{ padding: '13px 16px 13px 44px' }} />
                      </div>
                      <div style={{ fontSize: '11px', color: 'var(--muted-light, #C4A882)', marginTop: '6px', fontFamily: "'DM Sans', sans-serif" }}>Link will automatically stop working after this date</div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }} onClick={() => setFormData({...formData, generateQr: !formData.generateQr})}>
                  <div>
                    <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: '14px', fontWeight: 600, color: 'var(--ink, #1C1612)' }}>Generate QR Code</div>
                    <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: '12px', color: 'var(--muted, #8B7355)' }}>Instantly create a scannable QR</div>
                  </div>
                  <div className={`toggle-bg ${formData.generateQr ? 'on' : 'off'}`}><div className="toggle-knob" /></div>
                </div>
                <AnimatePresence>
                  {formData.generateQr && (
                    <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1, marginTop: '16px' }} exit={{ height: 0, opacity: 0, marginTop: 0 }} style={{ overflow: 'hidden' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <div style={{ width: '40px', height: '40px', border: '1.5px dashed var(--border-dark, #C8B49A)', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--muted-light, #C4A882)' }}>
                          <QrCode size={20} />
                        </div>
                        <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: '11px', color: 'var(--muted, #8B7355)' }}>QR will be generated</span>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              <div style={{ borderTop: '1px solid var(--border, #E5D5BE)', margin: '8px 0 4px' }} />

              <button type="submit" disabled={loading} style={{ width: '100%', backgroundColor: 'var(--coral, #E8553E)', color: 'white', padding: '14px', border: 'none', borderRadius: '10px', fontFamily: "'DM Sans', sans-serif", fontSize: '14px', fontWeight: 700, cursor: loading ? 'not-allowed' : 'pointer', opacity: loading ? 0.85 : 1, transition: 'all 0.2s', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '8px', boxShadow: '0 8px 24px rgba(232,85,62,0.28)' }}>
                {loading ? (
                  <><div style={{ width: '16px', height: '16px', border: '2px solid rgba(255,255,255,0.3)', borderTopColor: '#fff', borderRadius: '50%', animation: 'spin 1s linear infinite' }} /><style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>Snapping...</>
                ) : (
                  "Snap This Link →"
                )}
              </button>
              
              <div style={{ textAlign: 'center', fontFamily: "'DM Sans', sans-serif", fontSize: '12px', color: 'var(--muted, #8B7355)', marginTop: '-8px' }}>
                Your link will be ready instantly. Analytics tracking starts immediately.
              </div>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
