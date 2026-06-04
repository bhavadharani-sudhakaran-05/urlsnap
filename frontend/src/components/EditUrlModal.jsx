import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Pencil, X, Globe, Tag, CalendarClock, AlertTriangle } from 'lucide-react';
import toast from 'react-hot-toast';
import { API_BASE_URL } from '../config/api';

export default function EditUrlModal({ isOpen, onClose, onSuccess, url }) {
  const [formData, setFormData] = useState({
    originalUrl: '',
    title: '',
    expiresAt: '',
    useExpiry: false,
    isActive: true
  });
  
  const [errors, setErrors] = useState({ originalUrl: '', general: '' });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen && url) {
      setFormData({
        originalUrl: url.originalUrl || '',
        title: url.title || '',
        expiresAt: url.expiresAt ? new Date(url.expiresAt).toISOString().slice(0, 16) : '',
        useExpiry: !!url.expiresAt,
        isActive: url.isActive !== false
      });
      setErrors({ originalUrl: '', general: '' });
    }
  }, [isOpen, url]);

  const validateUrl = (u) => {
    try { new URL(u); return true; } catch { return false; }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({ originalUrl: '', general: '' });
    
    if (!formData.originalUrl) {
      setErrors(prev => ({ ...prev, originalUrl: 'Destination URL is required' }));
      return;
    }
    if (!validateUrl(formData.originalUrl)) {
      setErrors(prev => ({ ...prev, originalUrl: 'Please enter a valid URL' }));
      return;
    }

    setLoading(true);
    try {
      const payload = {
        originalUrl: formData.originalUrl,
        title: formData.title,
        isActive: formData.isActive
      };
      if (formData.useExpiry && formData.expiresAt) payload.expiresAt = formData.expiresAt;
      else payload.expiresAt = null;
      
      const res = await fetch(`${API_BASE_URL}/url/${url._id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${localStorage.getItem('token')}` },
        body: JSON.stringify(payload)
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to update link');
      
      toast.success("Link updated successfully!", { style: { fontFamily: "'DM Sans', sans-serif" } });
      onSuccess && onSuccess(data.url);
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

  if (!isOpen || !url) return null;

  return (
    <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(28,22,18,0.55)', backdropFilter: 'blur(6px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: '20px' }}>
      <style>{`
        .modal-input { width: 100%; background: var(--white, #FFFFFF); border: 1.5px solid var(--border, #E5D5BE); border-radius: 10px; font-family: 'DM Sans', sans-serif; font-size: 15px; color: var(--ink, #1C1612); transition: all 0.2s ease; outline: none; box-sizing: border-box; }
        .modal-input:focus { border-color: var(--coral, #E8553E); box-shadow: 0 0 0 4px rgba(232,85,62,0.10); }
        .toggle-bg { width: 36px; height: 20px; border-radius: 99px; transition: background-color 0.2s; position: relative; cursor: pointer; }
        .toggle-bg.on { background-color: var(--sage, #6B8F6E); }
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
              <div style={{ width: '48px', height: '48px', borderRadius: '14px', background: 'rgba(245,158,11,0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--amber, #F59E0B)' }}>
                <Pencil size={24} />
              </div>
              <div>
                <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: '26px', fontWeight: 800, color: 'var(--ink, #1C1612)', margin: 0 }}>Edit Link</h2>
                <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: '13px', color: 'var(--muted, #8B7355)', margin: '4px 0 0 0' }}>Update destination or settings</p>
              </div>
            </div>

            <div style={{ background: 'var(--surface, #FBF2E8)', borderRadius: '8px', padding: '10px 14px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
              <div>
                <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: '13px', color: 'var(--muted, #8B7355)' }}>Short Code: </span>
                <span style={{ fontFamily: "'DM Mono', monospace", fontSize: '13px', color: 'var(--ink, #1C1612)' }}>{url.shortCode}</span>
              </div>
              <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: '11px', color: 'var(--muted-light, #C4A882)' }}>Cannot be changed</div>
            </div>

            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              {errors.general && (
                <div style={{ backgroundColor: '#FEF2F2', border: '1px solid #FECACA', borderRadius: '8px', padding: '12px', color: '#DC2626', fontSize: '13px', fontWeight: 500, fontFamily: "'DM Sans', sans-serif" }}>
                  {errors.general}
                </div>
              )}

              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: 'var(--ink-light, #3D3028)', letterSpacing: '0.8px', textTransform: 'uppercase', marginBottom: '7px', fontFamily: "'DM Sans', sans-serif" }}>
                  DESTINATION URL *
                </label>
                <div style={{ position: 'relative' }}>
                  <div style={{ position: 'absolute', left: 0, top: 0, bottom: 0, width: '44px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--muted-light, #C4A882)' }}>
                    <Globe size={16} />
                  </div>
                  <input type="url" required value={formData.originalUrl} onChange={e => setFormData({...formData, originalUrl: e.target.value})} className="modal-input" style={{ padding: '13px 16px 13px 44px', borderColor: errors.originalUrl ? '#DC2626' : 'var(--border, #E5D5BE)' }} />
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
                  <input type="text" value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} className="modal-input" style={{ padding: '13px 16px 13px 44px' }} />
                </div>
              </div>

              <div style={{ borderTop: '1px solid var(--border, #E5D5BE)', margin: '4px 0' }} />

              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }} onClick={() => setFormData({...formData, useExpiry: !formData.useExpiry})}>
                  <div>
                    <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: '14px', fontWeight: 600, color: 'var(--ink, #1C1612)' }}>Update Expiry</div>
                    <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: '12px', color: 'var(--muted, #8B7355)' }}>Auto-disable after a date</div>
                  </div>
                  <div className={`toggle-bg ${formData.useExpiry ? 'on' : 'off'}`} style={{ backgroundColor: formData.useExpiry ? 'var(--coral, #E8553E)' : '' }}><div className="toggle-knob" /></div>
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
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }} onClick={() => setFormData({...formData, isActive: !formData.isActive})}>
                  <div>
                    <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: '14px', fontWeight: 600, color: 'var(--ink, #1C1612)' }}>Link Status</div>
                    <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: '12px', color: 'var(--muted, #8B7355)' }}>Disable to pause all redirects</div>
                  </div>
                  <div className={`toggle-bg ${formData.isActive ? 'on' : 'off'}`}><div className="toggle-knob" /></div>
                </div>
                <AnimatePresence>
                  {!formData.isActive && (
                    <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1, marginTop: '12px' }} exit={{ height: 0, opacity: 0, marginTop: 0 }} style={{ overflow: 'hidden' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--amber, #F59E0B)', fontFamily: "'DM Sans', sans-serif", fontSize: '12px' }}>
                        <AlertTriangle size={14} /> ⚠ Visitors will see a 'Link Inactive' message
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              <div style={{ borderTop: '1px solid var(--border, #E5D5BE)', margin: '8px 0 4px' }} />

              <button type="submit" disabled={loading} style={{ width: '100%', backgroundColor: 'var(--coral, #E8553E)', color: 'white', padding: '14px', border: 'none', borderRadius: '10px', fontFamily: "'DM Sans', sans-serif", fontSize: '14px', fontWeight: 700, cursor: loading ? 'not-allowed' : 'pointer', opacity: loading ? 0.85 : 1, transition: 'all 0.2s', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '8px', boxShadow: '0 8px 24px rgba(232,85,62,0.28)' }}>
                {loading ? (
                  <><div style={{ width: '16px', height: '16px', border: '2px solid rgba(255,255,255,0.3)', borderTopColor: '#fff', borderRadius: '50%', animation: 'spin 1s linear infinite' }} /><style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>Saving...</>
                ) : (
                  "Save Changes"
                )}
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
