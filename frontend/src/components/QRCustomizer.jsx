/* src/components/QRCustomizer.jsx
   Left panel containing content inputs, customization controls, export options, history, and bulk CSV.
*/
import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { QR_TEMPLATES, getTemplateByName } from '../utils/qrTemplates';
import { getUrls } from '../utils/api';

// Helper components for inputs
const InputGroup = ({ label, children }) => (
  <div className="form-group" style={{ marginBottom: '16px' }}>
    <label className="form-label" style={{ fontFamily: 'DM Sans', fontSize: '13px', fontWeight: 600, color: 'var(--muted)' }}>{label}</label>
    {children}
  </div>
);

// Simple color picker component
const ColorPicker = ({ label, color, onChange }) => {
  const [hex, setHex] = useState(color);
  useEffect(() => setHex(color), [color]);

  const handlePicker = (e) => {
    const newColor = e.target.value;
    onChange(newColor);
    setHex(newColor);
  };
  const handleHex = (e) => {
    const val = e.target.value;
    setHex(val);
    if (/^#[0-9A-Fa-f]{6}$/.test(val)) {
      onChange(val);
    }
  };
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 14px', background: 'var(--white)', border: '1.5px solid var(--border)', borderRadius: '10px', transition: 'border-color .18s' }}>
      <input type="color" value={color} onChange={handlePicker} style={{ width: '24px', height: '24px', borderRadius: '6px', border: '1.5px solid var(--border)', cursor: 'pointer', appearance: 'none', padding: 0 }} />
      <input type="text" value={hex} maxLength={7} onChange={handleHex} className="form-input" style={{ fontFamily: 'DM Mono', fontSize: '14px', border: 'none', outline: 'none', background: 'transparent', width: '90px' }} />
    </div>
  );
};

export default function QRCustomizer({ activeTab, options, updateOption, updateMultiple, applyTemplate, selectedTemplate }) {
  const [shortLinks, setShortLinks] = useState([]);
  const [showLinksDropdown, setShowLinksDropdown] = useState(false);
  const [logoFile, setLogoFile] = useState(null);
  const [logoPreview, setLogoPreview] = useState(null);

  // Load user's short links for the URL tab dropdown
  useEffect(() => {
    if (activeTab !== 'url') return;
    getUrls().then(data => {
      const urls = data.urls || [];
      // Remove duplicates based on originalUrl
      const uniqueUrls = urls.filter((v, i, a) => a.findIndex(t => (t.originalUrl === v.originalUrl)) === i);
      setShortLinks(uniqueUrls);
    }).catch(() => setShortLinks([]));
  }, [activeTab]);

  // Handle logo drop/upload
  const handleLogoDrop = (e) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0] || e.target.files[0];
    if (file && file.size <= 2 * 1024 * 1024) {
      const reader = new FileReader();
      reader.onload = () => {
        setLogoPreview(reader.result);
        updateOption('logoDataUrl', reader.result);
        updateOption('logoFile', file);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleLogoRemove = () => {
    setLogoPreview(null);
    updateOption('logoDataUrl', null);
    updateOption('logoFile', null);
  };

  // Margin slider handler
  const handleMarginChange = (e) => updateOption('margin', Number(e.target.value));

  // Error correction selector
  const handleECLevel = (lvl) => updateOption('errorCorrectionLevel', lvl);

  // Style selector
  const STYLE_OPTIONS = [
    { id: 'square', label: 'Classic' },
    { id: 'dots', label: 'Dots' },
    { id: 'rounded', label: 'Rounded' },
    { id: 'classy', label: 'Classy' },
    { id: 'extra-rounded', label: 'Soft' },
  ];

  // Content forms per tab
  const renderContentForm = () => {
    switch (activeTab) {
      case 'url':
        return (
          <>
            <InputGroup label="Website URL">
              <input type="url" className="form-input" placeholder="https://your-website.com" value={options.content}
                onChange={e => updateOption('content', e.target.value)}
                style={{ width: '100%' }} />
            </InputGroup>
            <div style={{ marginBottom: '12px' }}>
              <span className="form-label" style={{ cursor: 'pointer', color: 'var(--coral)' }} onClick={() => setShowLinksDropdown(!showLinksDropdown)}>
                Or pick from your short links →
              </span>
              {showLinksDropdown && (
                <div style={{ maxHeight: '150px', overflowY: 'auto', border: '1px solid var(--border)', borderRadius: '8px', marginTop: '8px', background: 'var(--white)' }}>
                  {shortLinks.map(link => (
                    <div key={link._id} style={{ padding: '8px', cursor: 'pointer' }} onClick={() => {
                      const full = `${window.location.origin}/${link.shortCode}`;
                      updateOption('content', full);
                      setShowLinksDropdown(false);
                    }}>
                      <strong>{link.shortCode}</strong> – {link.title || link.originalUrl}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </>
        );
      case 'twitter':
        return (
          <InputGroup label="Twitter/X Profile URL or Username">
            <input type="text" className="form-input" placeholder="@username or https://twitter.com/username" value={options.content}
              onChange={e => updateOption('content', e.target.value)} style={{ width: '100%' }} />
          </InputGroup>
        );
      case 'facebook':
        return (
          <InputGroup label="Facebook Page URL">
            <input type="url" className="form-input" placeholder="https://facebook.com/yourpage" value={options.content}
              onChange={e => updateOption('content', e.target.value)} style={{ width: '100%' }} />
          </InputGroup>
        );
      case 'instagram':
        return (
          <InputGroup label="Instagram Profile URL or Username">
            <input type="text" className="form-input" placeholder="@username or https://instagram.com/username" value={options.content}
              onChange={e => updateOption('content', e.target.value)} style={{ width: '100%' }} />
          </InputGroup>
        );
      case 'linkedin':
        return (
          <InputGroup label="LinkedIn Profile or Company URL">
            <input type="url" className="form-input" placeholder="https://linkedin.com/in/yourname" value={options.content}
              onChange={e => updateOption('content', e.target.value)} style={{ width: '100%' }} />
          </InputGroup>
        );
      case 'whatsapp':
        return (
          <>
            <InputGroup label="Phone Number (with country code)">
              <input type="tel" className="form-input" placeholder="+91 98765 43210" value={options.content}
                onChange={e => updateOption('content', e.target.value)} style={{ width: '100%' }} />
            </InputGroup>
            <InputGroup label="Pre-filled Message (optional)">
              <textarea className="form-input" placeholder="Hello! I'd like to connect..." rows={2}
                value={options.whatsappMessage || ''}
                onChange={e => updateOption('whatsappMessage', e.target.value)} style={{ width: '100%' }} />
            </InputGroup>
          </>
        );
      case 'email':
        return (
          <>
            <InputGroup label="Email Address">
              <input type="email" className="form-input" placeholder="example@domain.com" value={options.content}
                onChange={e => updateOption('content', e.target.value)} style={{ width: '100%' }} />
            </InputGroup>
            <InputGroup label="Subject (optional)">
              <input type="text" className="form-input" placeholder="Subject" value={options.emailSubject || ''}
                onChange={e => updateOption('emailSubject', e.target.value)} style={{ width: '100%' }} />
            </InputGroup>
            <InputGroup label="Body (optional)">
              <textarea className="form-input" rows={3} placeholder="Message body" value={options.emailBody || ''}
                onChange={e => updateOption('emailBody', e.target.value)} style={{ width: '100%' }} />
            </InputGroup>
          </>
        );
      case 'phone':
        return (
          <InputGroup label="Phone Number">
            <input type="tel" className="form-input" placeholder="+91 98765 43210" value={options.content}
              onChange={e => updateOption('content', e.target.value)} style={{ width: '100%' }} />
          </InputGroup>
        );
      case 'sms':
        return (
          <>
            <InputGroup label="Phone Number">
              <input type="tel" className="form-input" placeholder="+91 98765 43210" value={options.content}
                onChange={e => updateOption('content', e.target.value)} style={{ width: '100%' }} />
            </InputGroup>
            <InputGroup label="Message (optional)">
              <textarea className="form-input" rows={2} placeholder="Your SMS text" value={options.smsMessage || ''}
                onChange={e => updateOption('smsMessage', e.target.value)} style={{ width: '100%' }} />
            </InputGroup>
          </>
        );
      case 'wifi':
        return (
          <>
            <InputGroup label="Network Name (SSID)">
              <input type="text" className="form-input" placeholder="MyWiFi" value={options.wifiSSID || ''}
                onChange={e => updateOption('wifiSSID', e.target.value)} style={{ width: '100%' }} />
            </InputGroup>
            <InputGroup label="Password">
              <input type="password" className="form-input" placeholder="Password (optional)" value={options.wifiPassword || ''}
                onChange={e => updateOption('wifiPassword', e.target.value)} style={{ width: '100%' }} />
            </InputGroup>
            <InputGroup label="Security Type">
              <select className="form-input" value={options.wifiSecurity || 'nopass'}
                onChange={e => updateOption('wifiSecurity', e.target.value)} style={{ width: '100%' }}>
                <option value="WPA">WPA/WPA2</option>
                <option value="WEP">WEP</option>
                <option value="nopass">None</option>
              </select>
            </InputGroup>
            <InputGroup label="Hidden Network">
              <label className="switch">
                <input type="checkbox" checked={!!options.wifiHidden}
                  onChange={e => updateOption('wifiHidden', e.target.checked)} />
                <span className="slider round"></span>
              </label>
            </InputGroup>
          </>
        );
      case 'vcard':
        return (
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            <InputGroup label="First Name">
              <input type="text" className="form-input" value={options.vcardFirst || ''}
                onChange={e => updateOption('vcardFirst', e.target.value)} />
            </InputGroup>
            <InputGroup label="Last Name">
              <input type="text" className="form-input" value={options.vcardLast || ''}
                onChange={e => updateOption('vcardLast', e.target.value)} />
            </InputGroup>
            <InputGroup label="Email">
              <input type="email" className="form-input" value={options.vcardEmail || ''}
                onChange={e => updateOption('vcardEmail', e.target.value)} />
            </InputGroup>
            <InputGroup label="Phone">
              <input type="tel" className="form-input" value={options.vcardPhone || ''}
                onChange={e => updateOption('vcardPhone', e.target.value)} />
            </InputGroup>
            <InputGroup label="Company">
              <input type="text" className="form-input" value={options.vcardCompany || ''}
                onChange={e => updateOption('vcardCompany', e.target.value)} />
            </InputGroup>
            <InputGroup label="Job Title">
              <input type="text" className="form-input" value={options.vcardTitle || ''}
                onChange={e => updateOption('vcardTitle', e.target.value)} />
            </InputGroup>
            <InputGroup label="Website">
              <input type="url" className="form-input" value={options.vcardWebsite || ''}
                onChange={e => updateOption('vcardWebsite', e.target.value)} />
            </InputGroup>
            <InputGroup label="Address">
              <textarea className="form-input" rows={2} placeholder="Street, City, Country" value={options.vcardAddress || ''}
                onChange={e => updateOption('vcardAddress', e.target.value)} />
            </InputGroup>
          </div>
        );
      case 'text':
        return (
          <InputGroup label="Free Text">
            <textarea className="form-input" rows={5} placeholder="Type any text to encode..." maxLength={500}
              value={options.content}
              onChange={e => updateOption('content', e.target.value)} style={{ width: '100%' }} />
            <div style={{ textAlign: 'right', fontSize: '12px', color: options.content.length > 400 ? 'var(--amber)' : 'var(--muted)' }}>
              {options.content.length} / 500
            </div>
          </InputGroup>
        );
      default:
        return null;
    }
  };

  // Contrast warning computation
  const contrastWarning = () => {
    const bg = options.bgColor.replace('#', '');
    const fg = options.fgColor.replace('#', '');
    const rgb = (hex) => [parseInt(hex.slice(0,2),16)/255, parseInt(hex.slice(2,4),16)/255, parseInt(hex.slice(4,6),16)/255];
    const lum = (c) => c <= 0.03928 ? c/12.92 : Math.pow((c+0.055)/1.055, 2.4);
    const [r1,g1,b1] = rgb(bg); const [r2,g2,b2] = rgb(fg);
    const L1 = Math.max(lum(r1), lum(g1), lum(b1));
    const L2 = Math.max(lum(r2), lum(g2), lum(b2));
    const contrast = (L1 + 0.05) / (L2 + 0.05);
    return contrast < 3; // simple threshold
  };

  // History handling (localStorage)
  useEffect(() => {
    const hist = JSON.parse(localStorage.getItem('snipra_qr_history') || '[]');
    // keep max 10
    if (hist.length > 10) {
      localStorage.setItem('snipra_qr_history', JSON.stringify(hist.slice(-10)));
    }
  }, []);

  // Bulk CSV handling placeholders (implementation later)

  return (
    <div className="glass-card" style={{ background: 'var(--white)', border: '1.5px solid var(--border)', borderRadius: '24px', padding: '28px', boxShadow: '0 4px 20px rgba(28,22,18,0.06)' }}>
      {/* SECTION A – Content Input */}
      <div style={{ marginBottom: '24px' }}>
        <h4 style={{ fontFamily: 'DM Sans', fontSize: '10px', fontWeight: 700, letterSpacing: '2px', color: 'var(--muted)', marginBottom: '8px' }}>CONTENT</h4>
        <AnimatePresence mode="wait">
          <motion.div key={activeTab} initial={{ opacity:0, x:-10 }} animate={{ opacity:1, x:0 }} exit={{ opacity:0, x:-10 }} transition={{ duration:0.2 }}>
            {renderContentForm()}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* SECTION B – Customization */}
      <div style={{ marginTop: '24px' }}>
        <h4 style={{ fontFamily: 'DM Sans', fontSize: '10px', fontWeight: 700, letterSpacing: '2px', color: 'var(--muted)', marginBottom: '8px' }}>CUSTOMIZE</h4>
        {/* Preset Swatches */}
        <div style={{ marginBottom: '12px' }}>
          <span style={{ fontFamily: 'DM Sans', fontSize: '12px', fontWeight: 600, color: 'var(--muted)' }}>Presets</span>
          <div style={{ display: 'flex', gap: '8px', marginTop: '8px' }}>
            {QR_TEMPLATES.map((tmpl, idx) => (
              <button key={tmpl.name} onClick={() => applyTemplate(tmpl, idx)}
                style={{ width:'36px', height:'36px', borderRadius:'50%', border: selectedTemplate===idx ? '2px solid var(--coral)' : '2px solid transparent', background: 'transparent', padding:0, position:'relative', cursor:'pointer', transition:'transform .15s, border .15s' }}
                aria-label={`Preset ${tmpl.name}`}
                >
                <div style={{ position:'absolute', inset:0, overflow:'hidden', borderRadius:'50%' }}>
                  <div style={{ background: tmpl.bg, width:'100%', height:'100%', clipPath:'polygon(0 0,100% 0,0 100%)' }}></div>
                  <div style={{ background: tmpl.fg, width:'100%', height:'100%', clipPath:'polygon(100% 0,100% 100%,0 100%)', position:'absolute', top:0, left:0 }}></div>
                </div>
              </button>
            ))}
          </div>
        </div>
        {/* Color pickers */}
        <div style={{ display: 'flex', gap: '16px', marginBottom: '12px' }}>
          <div style={{ flex:1 }}>
            <label className="form-label" style={{ fontFamily:'DM Sans', fontSize:'13px', fontWeight:600, color:'var(--muted)' }}>Background Color</label>
            <ColorPicker label="Background" color={options.bgColor} onChange={c => updateOption('bgColor', c)} />
          </div>
          <div style={{ flex:1 }}>
            <label className="form-label" style={{ fontFamily:'DM Sans', fontSize:'13px', fontWeight:600, color:'var(--muted)' }}>Foreground Color</label>
            <ColorPicker label="Foreground" color={options.fgColor} onChange={c => updateOption('fgColor', c)} />
          </div>
        </div>
        {contrastWarning() && (
          <div style={{ background: 'rgba(220,38,38,0.08)', border: '1px solid rgba(220,38,38,0.2)', borderRadius:'10px', padding:'8px', marginBottom:'12px', color:'var(--amber)', fontFamily:'DM Sans', fontSize:'12px' }}>
            ⚠ Low contrast — QR code may not scan reliably
          </div>
        )}
        {/* Margin slider */}
        <div style={{ marginBottom: '12px' }}>
          <label className="form-label" style={{ fontFamily:'DM Sans', fontSize:'13px', fontWeight:600, color:'var(--muted)' }}>Margin (Quiet Zone) <span title="A quiet zone (white border) around the QR code improves scan reliability">ℹ</span></label>
          <div style={{ display:'flex', alignItems:'center', gap:'8px' }}>
            <input type="range" min={0} max={10} step={1} value={options.margin} onChange={handleMarginChange}
              style={{ flex:1, appearance:'none', height:'4px', borderRadius:'99px', background:`linear-gradient(90deg, var(--coral) 0%, var(--coral) ${(options.margin/10)*100}%, var(--border) ${(options.margin/10)*100}%, var(--border) 100%)` }} />
            <span className="pill" style={{ background:'var(--coral)', color:'var(--white)', borderRadius:'999px', padding:'2px 10px', fontFamily:'DM Sans', fontWeight:700, fontSize:'13px' }}>{options.margin}</span>
          </div>
        </div>
        {/* Style selector */}
        <div style={{ marginBottom: '12px' }}>
          <label className="form-label" style={{ fontFamily:'DM Sans', fontSize:'13px', fontWeight:600, color:'var(--muted)' }}>QR Style</label>
          <div style={{ display:'flex', gap:'8px' }}>
            {STYLE_OPTIONS.map(st => (
              <button key={st.id} onClick={() => updateOption('style', st.id)}
                style={{ width:'40px', height:'40px', borderRadius:'10px', background: options.style===st.id ? 'rgba(232,85,62,0.1)' : 'var(--surface)', border: options.style===st.id ? '1.5px solid var(--coral)' : '1.5px solid var(--border)', display:'flex', alignItems:'center', justifyContent:'center', cursor:'pointer' }}
                aria-label={st.label}>
                {/* Simple SVG preview placeholder */}
                <svg width="24" height="24" viewBox="0 0 24 24"><rect width="6" height="6" x="4" y="4" fill={options.fgColor}/><rect width="6" height="6" x="14" y="4" fill={options.fgColor}/><rect width="6" height="6" x="4" y="14" fill={options.fgColor}/><rect width="6" height="6" x="14" y="14" fill={options.fgColor}/></svg>
              </button>
            ))}
          </div>
        </div>
        {/* Error correction */}
        <div style={{ marginBottom: '12px' }}>
          <label className="form-label" style={{ fontFamily:'DM Sans', fontSize:'13px', fontWeight:600, color:'var(--muted)' }}>Error Correction <span title="Higher correction = more resilience to damage or logo overlay">ℹ</span></label>
          <div style={{ display:'flex', gap:'8px' }}>
            {['L','M','Q','H'].map(lvl => (
              <button key={lvl} onClick={() => handleECLevel(lvl)}
                className={options.errorCorrectionLevel===lvl ? 'active' : ''}
                style={{ padding:'6px 12px', borderRadius:'999px', background: options.errorCorrectionLevel===lvl ? 'var(--white)' : 'transparent', border: options.errorCorrectionLevel===lvl ? '1px solid var(--coral)' : '1px solid var(--border)', color: options.errorCorrectionLevel===lvl ? 'var(--coral)' : 'var(--muted)', fontFamily:'DM Sans', fontSize:'13px', cursor:'pointer' }}>
                {lvl}
              </button>
            ))}
          </div>
        </div>
        {/* Logo upload */}
        <div style={{ marginBottom: '12px' }}>
          <label className="form-label" style={{ fontFamily:'DM Sans', fontSize:'13px', fontWeight:600, color:'var(--muted)' }}>Add Logo</label>
          <div onDragOver={(e)=>e.preventDefault()} onDrop={handleLogoDrop}
            style={{ border: '2px dashed var(--border-dark)', borderRadius:'14px', padding:'24px', textAlign:'center', background:'var(--surface)', cursor:'pointer', transition:'all .2s' }}>
            {logoPreview ? (
              <div style={{ position:'relative', display:'inline-block' }}>
                <img src={logoPreview} alt="logo preview" style={{ width:'60px', height:'60px', borderRadius:'10px', objectFit:'contain' }} />
                <button onClick={handleLogoRemove} style={{ position:'absolute', top:'-8px', right:'-8px', background:'var(--white)', border:'1px solid var(--border)', borderRadius:'50%', width:'24px', height:'24px' }}>✕</button>
              </div>
            ) : (
              <div>
                <span style={{ fontSize:'28px', color:'var(--muted)' }}>⬆</span><br />
                Drop logo here or <span style={{ color:'var(--coral)', textDecoration:'underline', cursor:'pointer' }} onClick={() => document.getElementById('logoInput').click()}>browse</span><br />
                <small style={{ color:'var(--muted-light)' }}>PNG · SVG · Max 2MB</small>
                <input type="file" id="logoInput" accept=".png,.svg,.jpg" style={{ display:'none' }} onChange={handleLogoDrop} />
              </div>
            )}
          </div>
          {logoPreview && (
            <div style={{ marginTop:'8px', fontSize:'12px', color:'var(--muted)' }}>⚠ Large logos can reduce scan reliability. Keep logo under 25% of QR area.</div>
          )}
        </div>
      </div>

      {/* SECTION C – Export */}
      <div style={{ marginTop:'24px' }}>
        <h4 style={{ fontFamily:'DM Sans', fontSize:'10px', fontWeight:700, letterSpacing:'2px', color:'var(--muted)', marginBottom:'8px' }}>EXPORT</h4>
        <div style={{ display:'flex', gap:'12px', marginBottom:'12px' }}>
          {/* Size dropdown */}
          <div style={{ flex:1 }}>
            <label className="form-label" style={{ fontFamily:'DM Sans', fontSize:'13px', fontWeight:600, color:'var(--muted)' }}>Size</label>
            <select className="form-input" value={options.size} onChange={e => updateOption('size', Number(e.target.value))} style={{ width:'100%' }}>
              <option value={128}>Small (128×128)</option>
              <option value={256}>Medium (256×256)</option>
              <option value={512}>Large (512×512)</option>
              <option value={1024}>HD (1024×1024)</option>
              <option value={2048}>Ultra HD (2048×2048)</option>
            </select>
          </div>
          {/* Format dropdown */}
          <div style={{ flex:1 }}>
            <label className="form-label" style={{ fontFamily:'DM Sans', fontSize:'13px', fontWeight:600, color:'var(--muted)' }}>Format</label>
            <select className="form-input" value={options.format} onChange={e => updateOption('format', e.target.value)} style={{ width:'100%' }}>
              <option value="png">PNG</option>
              <option value="svg">SVG</option>
              <option value="jpeg">JPEG</option>
              <option value="webp">WebP</option>
            </select>
            {options.format === 'svg' && (
              <small style={{ color:'var(--amber)' }}>Logo not supported in SVG export</small>
            )}
          </div>
        </div>
        {/* Action buttons */}
        <button className="btn-coral" style={{ width:'100%' }} onClick={() => updateOption('triggerDownload', true)} aria-label="Download QR Code">⬇ Download QR Code</button>
        <button className="btn-secondary" style={{ width:'100%', marginTop:'8px' }} onClick={() => updateOption('triggerCopy', true)} aria-label="Copy QR as PNG">📋 Copy as PNG</button>
        <button className="btn-ghost" style={{ width:'100%', marginTop:'6px' }} onClick={() => updateOption('triggerShare', true)} aria-label="Share QR Code">🔗 Share QR Code</button>
      </div>
    </div>
  );
}
