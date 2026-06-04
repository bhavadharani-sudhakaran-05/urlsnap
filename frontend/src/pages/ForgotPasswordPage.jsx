import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, AlertCircle, CheckCircle, ArrowLeft } from 'lucide-react';
import toast from 'react-hot-toast';
import { forgotPassword } from '../utils/api';

const useMediaQuery = (query) => {
  const [matches, setMatches] = useState(false);
  useEffect(() => {
    const media = window.matchMedia(query);
    if (media.matches !== matches) setMatches(media.matches);
    const listener = () => setMatches(media.matches);
    media.addEventListener('change', listener);
    return () => media.removeEventListener('change', listener);
  }, [matches, query]);
  return matches;
};

export default function ForgotPasswordPage() {
  const navigate = useNavigate();
  const isMobile = useMediaQuery('(max-width: 768px)');

  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [shake, setShake] = useState(0);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!email || !/\S+@\S+\.\S+/.test(email)) {
      setError('Please enter a valid email address');
      setShake((prev) => prev + 1);
      return;
    }

    setLoading(true);
    try {
      const data = await forgotPassword(email);
      setSuccess(true);
      toast.success(data.message || 'Reset link sent!', {
        style: { fontFamily: "'DM Sans', sans-serif" }
      });
    } catch (err) {
      setLoading(false);
      setShake((prev) => prev + 1);
      const msg = err.response?.data?.message || err.response?.data?.error || err.message || 'Something went wrong';
      setError(msg);
    }
  };

  // ─── STYLES ───
  const containerStyle = {
    display: 'flex',
    flexDirection: isMobile ? 'column' : 'row',
    minHeight: '100vh',
    width: '100%',
    backgroundColor: 'var(--cream, #FDF6EC)',
    fontFamily: "'DM Sans', sans-serif",
    boxSizing: 'border-box',
    margin: 0,
    padding: 0
  };

  const leftPanelStyle = {
    width: isMobile ? '100%' : '55%',
    height: isMobile ? '120px' : '100vh',
    backgroundColor: 'var(--ink, #1C1612)',
    position: 'relative',
    overflow: 'hidden',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: isMobile ? 'center' : 'space-between',
    padding: isMobile ? '24px' : '48px',
    color: 'var(--white, #FFFFFF)',
    boxSizing: 'border-box'
  };

  const rightPanelStyle = {
    width: isMobile ? '100%' : '45%',
    minHeight: isMobile ? 'calc(100vh - 120px)' : '100vh',
    position: 'relative',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    padding: isMobile ? '28px 24px' : '48px',
    boxSizing: 'border-box',
    overflow: 'hidden'
  };

  return (
    <div style={containerStyle}>
      <style>
        {`
          .form-input:focus {
            border-color: var(--coral, #E8553E) !important;
            box-shadow: 0 0 0 4px rgba(232,85,62,0.10) !important;
          }
          .form-input.error {
            border-color: #DC2626 !important;
            box-shadow: 0 0 0 4px rgba(220,38,38,0.08) !important;
          }
        `}
      </style>

      {/* LEFT PANEL */}
      <motion.div
        initial={{ x: -40, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
        style={leftPanelStyle}
      >
        <div style={{ position: 'absolute', top: 0, right: 0, width: '400px', height: '80px', backgroundColor: 'rgba(255,255,255,0.03)' }} />
        <div style={{ position: 'absolute', top: 0, right: '320px', width: '80px', height: '400px', backgroundColor: 'rgba(255,255,255,0.03)' }} />
        <div style={{ position: 'absolute', top: '-200px', left: '-200px', width: '600px', height: '600px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(232,85,62,0.18) 0%, transparent 65%)' }} />
        <div style={{ position: 'absolute', bottom: '-100px', right: '-100px', width: '400px', height: '400px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(245,158,11,0.12) 0%, transparent 60%)' }} />
        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, backgroundImage: 'radial-gradient(rgba(255,255,255,0.07) 1px, transparent 1px)', backgroundSize: '28px 28px', pointerEvents: 'none' }} />

        <div style={{ position: 'relative', zIndex: 10, display: 'flex', flexDirection: 'column', alignItems: isMobile ? 'center' : 'flex-start', width: '100%' }}>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: '2px' }}>
            <span style={{ fontFamily: "'Playfair Display', serif", fontWeight: 900, fontSize: '32px', color: 'var(--white, #FFFFFF)' }}>Zest</span>
            <span style={{ fontFamily: "'Playfair Display', serif", fontWeight: 900, fontSize: '32px', color: 'var(--coral, #E8553E)' }}>link</span>
          </div>
        </div>

        {!isMobile && (
          <div style={{ position: 'relative', zIndex: 10, marginTop: 'auto', marginBottom: 'auto' }}>
            <h1 style={{ fontFamily: "'Playfair Display', serif", margin: 0, padding: 0 }}>
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4, duration: 0.8 }} style={{ fontSize: '52px', fontWeight: 300, color: 'rgba(255,255,255,0.5)', fontStyle: 'italic', lineHeight: 1.1 }}>
                Reset your
              </motion.div>
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.55, duration: 0.8 }} style={{ fontSize: '52px', fontWeight: 900, color: 'var(--white, #FFFFFF)', lineHeight: 1.1 }}>
                password securely
              </motion.div>
            </h1>
            <div style={{ width: '60px', height: '1px', backgroundColor: 'rgba(255,255,255,0.1)', margin: '28px 0' }} />
            <p style={{ fontSize: '15px', fontWeight: 300, color: 'rgba(255,255,255,0.5)', lineHeight: 1.8, maxWidth: '380px', margin: 0 }}>
              Enter your email address and we'll send you a secure link to reset your password and regain access.
            </p>
          </div>
        )}
      </motion.div>

      {/* RIGHT PANEL */}
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.15 }}
        style={rightPanelStyle}
      >
        <div style={{ position: 'absolute', top: '-80px', right: '-80px', width: '300px', height: '300px', borderRadius: '50%', backgroundColor: 'rgba(232,85,62,0.06)', transform: isMobile ? 'scale(0.5)' : 'scale(1)', transformOrigin: 'top right', zIndex: 0 }} />

        <motion.div
          animate={shake > 0 ? { x: [0, -8, 8, -6, 6, -3, 3, 0] } : {}}
          transition={{ duration: 0.5 }}
          style={{ width: '100%', maxWidth: '380px', position: 'relative', zIndex: 10 }}
        >
          <div style={{ marginBottom: '32px' }}>
            <Link to="/login" style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', fontSize: '13px', color: 'var(--muted, #8B7355)', textDecoration: 'none', marginBottom: '24px', fontWeight: 600 }}>
              <ArrowLeft size={14} /> Back to Login
            </Link>
            <h2 style={{ fontFamily: "'Playfair Display', serif", margin: 0, color: 'var(--ink, #1C1612)', fontSize: '34px', lineHeight: 1.2 }}>
              <span style={{ fontWeight: 900, display: 'block' }}>Forgot password?</span>
            </h2>
            <p style={{ fontSize: '14px', color: 'var(--muted, #8B7355)', marginTop: '8px', marginBottom: 0 }}>
              No worries, we'll send you reset instructions.
            </p>
          </div>

          {!success ? (
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <AnimatePresence>
                {error && (
                  <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} style={{ backgroundColor: '#FEF2F2', border: '1px solid #FECACA', borderRadius: '8px', padding: '12px', display: 'flex', alignItems: 'center', gap: '8px', color: '#DC2626', fontSize: '13px', fontWeight: 500 }}>
                    <AlertCircle size={16} />
                    {error}
                  </motion.div>
                )}
              </AnimatePresence>

              <motion.div initial={{ y: 12, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.2 }}>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: 'var(--ink-light, #3D3028)', letterSpacing: '0.8px', textTransform: 'uppercase', marginBottom: '7px' }}>
                  Email Address
                </label>
                <div style={{ position: 'relative' }}>
                  <div style={{ position: 'absolute', top: 0, bottom: 0, left: 0, width: '44px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--muted-light, #C4A882)', pointerEvents: 'none' }}>
                    <Mail size={16} />
                  </div>
                  <input
                    type="email"
                    placeholder="name@company.com"
                    className={`form-input ${error ? 'error' : ''}`}
                    style={{ width: '100%', padding: '13px 16px 13px 44px', background: 'var(--white, #FFFFFF)', border: '1.5px solid var(--border, #E5D5BE)', borderRadius: '10px', fontFamily: "'DM Sans', sans-serif", fontSize: '15px', color: 'var(--ink, #1C1612)', transition: 'all 0.2s ease', outline: 'none', boxSizing: 'border-box' }}
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      setError('');
                    }}
                  />
                </div>
              </motion.div>

              <motion.div initial={{ y: 12, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.27 }}>
                <motion.button
                  type="submit"
                  disabled={loading}
                  whileHover={!loading ? { y: -1, backgroundColor: 'var(--coral-dark, #C93D28)', boxShadow: '0 12px 32px rgba(232,85,62,0.35)' } : {}}
                  whileTap={!loading ? { y: 0, boxShadow: '0 8px 24px rgba(232,85,62,0.28)' } : {}}
                  style={{
                    width: '100%',
                    padding: '14px',
                    backgroundColor: 'var(--coral, #E8553E)',
                    color: 'var(--white, #FFFFFF)',
                    border: 'none',
                    borderRadius: '10px',
                    fontFamily: "'DM Sans', sans-serif",
                    fontSize: '15px',
                    fontWeight: 700,
                    letterSpacing: '0.3px',
                    cursor: loading ? 'not-allowed' : 'pointer',
                    transition: 'all 0.2s',
                    boxShadow: '0 8px 24px rgba(232,85,62,0.28)',
                    marginTop: '8px',
                    opacity: loading ? 0.85 : 1,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '8px'
                  }}
                >
                  {loading ? (
                    <>
                      <div style={{ width: '20px', height: '20px', border: '2px solid rgba(255,255,255,0.3)', borderTopColor: '#fff', borderRadius: '50%', animation: 'spin 1s linear infinite' }} />
                      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
                      Sending...
                    </>
                  ) : (
                    "Reset Password →"
                  )}
                </motion.button>
              </motion.div>
            </form>
          ) : (
            <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} style={{ textAlign: 'center', padding: '32px 0' }}>
              <div style={{ width: '64px', height: '64px', backgroundColor: 'var(--sage, #6B8F6E)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 24px', color: 'white' }}>
                <CheckCircle size={32} />
              </div>
              <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: '24px', color: 'var(--ink, #1C1612)', margin: '0 0 12px 0' }}>Check your email</h3>
              <p style={{ fontSize: '15px', color: 'var(--muted, #8B7355)', lineHeight: 1.6, margin: '0 0 32px 0' }}>
                We've sent password reset instructions to<br />
                <strong style={{ color: 'var(--ink, #1C1612)' }}>{email}</strong>
              </p>
              <p style={{ fontSize: '13px', color: 'var(--muted-light, #C4A882)', fontStyle: 'italic' }}>
                Note: Since this is a demo, please check your server console for the actual reset link.
              </p>
            </motion.div>
          )}

        </motion.div>
        
        <div style={{ position: 'absolute', bottom: '24px', left: 0, right: 0, textAlign: 'center', color: 'var(--muted-light, #C4A882)', fontSize: '11px' }}>
          Protected by JWT Auth · Passwords encrypted with bcrypt
        </div>
      </motion.div>
    </div>
  );
}
