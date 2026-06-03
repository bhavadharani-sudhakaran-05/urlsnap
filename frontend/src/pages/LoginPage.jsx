import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, Lock, Eye, EyeOff, AlertCircle, CheckCircle } from 'lucide-react';
import toast from 'react-hot-toast';

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

export default function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const isMobile = useMediaQuery('(max-width: 768px)');

  const [formData, setFormData] = useState({ email: '', password: '' });
  const [errors, setErrors] = useState({ email: '', password: '', general: '' });
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [fieldTouched, setFieldTouched] = useState({ email: false, password: false });
  const [success, setSuccess] = useState(false);
  const [shake, setShake] = useState(0);

  const validateEmail = (email) => {
    if (!email) return 'Email is required';
    if (!/\S+@\S+\.\S+/.test(email)) return 'Please enter a valid email';
    return '';
  };

  const validatePassword = (password) => {
    if (!password) return 'Password is required';
    return '';
  };

  const handleBlur = (field) => {
    setFieldTouched((prev) => ({ ...prev, [field]: true }));
    if (field === 'email') {
      setErrors((prev) => ({ ...prev, email: validateEmail(formData.email) }));
    }
    if (field === 'password') {
      setErrors((prev) => ({ ...prev, password: validatePassword(formData.password) }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({ email: '', password: '', general: '' });
    setFieldTouched({ email: true, password: true });

    const emailErr = validateEmail(formData.email);
    const passErr = validatePassword(formData.password);

    if (emailErr || passErr) {
      setErrors({ email: emailErr, password: passErr, general: '' });
      setShake((prev) => prev + 1);
      return;
    }

    setLoading(true);
    try {
      await login(formData);
      setSuccess(true);
      toast.success('Welcome back! 🎉', {
        style: { fontFamily: "'DM Sans', sans-serif" }
      });
      setTimeout(() => {
        navigate('/dashboard');
      }, 600);
    } catch (err) {
      setLoading(false);
      setShake((prev) => prev + 1);
      const msg = err.response?.data?.error || err.message || 'Invalid credentials. Please try again.';
      setErrors((prev) => ({ ...prev, general: msg }));
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
          @keyframes ticker {
            0% { transform: translateX(0); }
            100% { transform: translateX(-50%); }
          }
          .ticker-content {
            display: inline-block;
            white-space: nowrap;
            animation: ticker 20s linear infinite;
          }
          .form-input:focus {
            border-color: var(--coral, #E8553E) !important;
            box-shadow: 0 0 0 4px rgba(232,85,62,0.10) !important;
          }
          .form-input.error {
            border-color: #DC2626 !important;
            box-shadow: 0 0 0 4px rgba(220,38,38,0.08) !important;
          }
          .form-input.success {
            border-color: var(--sage, #6B8F6E) !important;
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
            <span style={{ fontFamily: "'Playfair Display', serif", fontWeight: 900, fontSize: '32px', color: 'var(--white, #FFFFFF)' }}>Link</span>
            <span style={{ fontFamily: "'Playfair Display', serif", fontWeight: 900, fontSize: '32px', color: 'var(--coral, #E8553E)' }}>Snap</span>
          </div>
          <div style={{ fontSize: '11px', letterSpacing: '3px', color: 'rgba(255,255,255,0.35)', textTransform: 'uppercase', marginTop: '6px' }}>
            URL Intelligence Platform
          </div>
        </div>

        {!isMobile && (
          <>
            <div style={{ position: 'relative', zIndex: 10, marginTop: 'auto', marginBottom: 'auto' }}>
              <h1 style={{ fontFamily: "'Playfair Display', serif", margin: 0, padding: 0 }}>
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4, duration: 0.8 }} style={{ fontSize: '52px', fontWeight: 300, color: 'rgba(255,255,255,0.5)', fontStyle: 'italic', lineHeight: 1.1 }}>
                  Every great
                </motion.div>
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.55, duration: 0.8 }} style={{ fontSize: '52px', fontWeight: 900, color: 'var(--white, #FFFFFF)', lineHeight: 1.1 }}>
                  journey starts
                </motion.div>
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.7, duration: 0.8 }} style={{ fontSize: '52px', fontWeight: 900, color: 'var(--coral, #E8553E)', lineHeight: 1.1 }}>
                  with a link.
                </motion.div>
              </h1>
              <div style={{ width: '60px', height: '1px', backgroundColor: 'rgba(255,255,255,0.1)', margin: '28px 0' }} />
              <p style={{ fontSize: '15px', fontWeight: 300, color: 'rgba(255,255,255,0.5)', lineHeight: 1.8, maxWidth: '380px', margin: 0 }}>
                LinkSnap turns your URLs into insights. Shorten, track, and understand every click — all in one beautiful dashboard.
              </p>
            </div>

            <div style={{ position: 'relative', zIndex: 10, display: 'flex', gap: '12px', alignItems: 'center' }}>
              {[
                { value: '2.4M+', label: 'Links Created', color: 'var(--coral, #E8553E)' },
                { value: '98ms', label: 'Avg Redirect', color: 'var(--amber, #F59E0B)' },
                { value: '99.9%', label: 'Uptime', color: 'var(--white, #FFFFFF)' }
              ].map((stat, idx) => (
                <React.Fragment key={idx}>
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.8 + idx * 0.1, duration: 0.5 }}
                    style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '12px', padding: '14px 18px', minWidth: '110px' }}
                  >
                    <div style={{ fontFamily: "'Playfair Display', serif", fontSize: '22px', fontWeight: 800, color: stat.color, marginBottom: '2px' }}>{stat.value}</div>
                    <div style={{ fontSize: '11px', color: 'var(--muted, #8B7355)' }}>{stat.label}</div>
                  </motion.div>
                  {idx < 2 && <div style={{ width: '1px', height: '30px', backgroundColor: 'rgba(255,255,255,0.08)' }} />}
                </React.Fragment>
              ))}
            </div>

            <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, overflow: 'hidden', padding: '12px 0', borderTop: '1px solid rgba(255,255,255,0.05)' }}>
              <div className="ticker-content" style={{ fontFamily: "'DM Mono', monospace", fontSize: '11px', color: 'rgba(255,255,255,0.2)' }}>
                ↗ linksnap.io/go/product-launch &nbsp;&nbsp;&nbsp;&nbsp; ↗ linksnap.io/go/campaign-q4 &nbsp;&nbsp;&nbsp;&nbsp; ↗ linksnap.io/go/team-dashboard &nbsp;&nbsp;&nbsp;&nbsp;
                ↗ linksnap.io/go/product-launch &nbsp;&nbsp;&nbsp;&nbsp; ↗ linksnap.io/go/campaign-q4 &nbsp;&nbsp;&nbsp;&nbsp; ↗ linksnap.io/go/team-dashboard
              </div>
            </div>
          </>
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
            <div style={{ fontSize: '12px', letterSpacing: '2px', textTransform: 'uppercase', color: 'var(--coral, #E8553E)', fontWeight: 600, marginBottom: '12px' }}>
              Welcome back
            </div>
            <h2 style={{ fontFamily: "'Playfair Display', serif", margin: 0, color: 'var(--ink, #1C1612)', fontSize: '34px', lineHeight: 1.2 }}>
              <span style={{ fontWeight: 400, display: 'block' }}>Sign in to</span>
              <span style={{ fontWeight: 900, display: 'block' }}>your dashboard.</span>
            </h2>
            <p style={{ fontSize: '14px', color: 'var(--muted, #8B7355)', marginTop: '8px', marginBottom: 0 }}>
              Enter your credentials to continue.
            </p>
          </div>

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <AnimatePresence>
              {errors.general && (
                <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} style={{ backgroundColor: '#FEF2F2', border: '1px solid #FECACA', borderRadius: '8px', padding: '12px', display: 'flex', alignItems: 'center', gap: '8px', color: '#DC2626', fontSize: '13px', fontWeight: 500 }}>
                  <AlertCircle size={16} />
                  {errors.general}
                </motion.div>
              )}
            </AnimatePresence>

            {/* Email Field */}
            <motion.div initial={{ y: 12, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.2 }}>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: 'var(--ink-light, #3D3028)', letterSpacing: '0.8px', textTransform: 'uppercase', marginBottom: '7px' }}>
                Email
              </label>
              <div style={{ position: 'relative' }}>
                <div style={{ position: 'absolute', top: 0, bottom: 0, left: 0, width: '44px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--muted-light, #C4A882)', pointerEvents: 'none' }}>
                  <Mail size={16} />
                </div>
                <input
                  type="email"
                  placeholder="name@company.com"
                  className={`form-input ${fieldTouched.email && errors.email ? 'error' : ''} ${fieldTouched.email && !errors.email && formData.email ? 'success' : ''}`}
                  style={{ width: '100%', padding: '13px 16px 13px 44px', background: 'var(--white, #FFFFFF)', border: '1.5px solid var(--border, #E5D5BE)', borderRadius: '10px', fontFamily: "'DM Sans', sans-serif", fontSize: '15px', color: 'var(--ink, #1C1612)', transition: 'all 0.2s ease', outline: 'none', boxSizing: 'border-box' }}
                  value={formData.email}
                  onChange={(e) => {
                    setFormData({ ...formData, email: e.target.value });
                    if (fieldTouched.email) setErrors({ ...errors, email: validateEmail(e.target.value) });
                  }}
                  onBlur={() => handleBlur('email')}
                />
                {fieldTouched.email && !errors.email && formData.email && (
                  <div style={{ position: 'absolute', top: 0, bottom: 0, right: '12px', display: 'flex', alignItems: 'center', color: 'var(--sage, #6B8F6E)' }}>
                    <CheckCircle size={16} />
                  </div>
                )}
              </div>
              <AnimatePresence>
                {fieldTouched.email && errors.email && (
                  <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} style={{ fontSize: '12px', color: '#DC2626', display: 'flex', alignItems: 'center', gap: '4px', marginTop: '6px' }}>
                    <AlertCircle size={14} /> {errors.email}
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>

            {/* Password Field */}
            <motion.div initial={{ y: 12, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.27 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '7px' }}>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: 'var(--ink-light, #3D3028)', letterSpacing: '0.8px', textTransform: 'uppercase' }}>
                  Password
                </label>
                <Link to="#" style={{ fontSize: '13px', color: 'var(--coral, #E8553E)', textDecoration: 'none' }}>Forgot password?</Link>
              </div>
              <div style={{ position: 'relative' }}>
                <div style={{ position: 'absolute', top: 0, bottom: 0, left: 0, width: '44px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--muted-light, #C4A882)', pointerEvents: 'none' }}>
                  <Lock size={16} />
                </div>
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  className={`form-input ${fieldTouched.password && errors.password ? 'error' : ''}`}
                  style={{ width: '100%', padding: '13px 44px 13px 44px', background: 'var(--white, #FFFFFF)', border: '1.5px solid var(--border, #E5D5BE)', borderRadius: '10px', fontFamily: "'DM Sans', sans-serif", fontSize: '15px', color: 'var(--ink, #1C1612)', transition: 'all 0.2s ease', outline: 'none', boxSizing: 'border-box' }}
                  value={formData.password}
                  onChange={(e) => {
                    setFormData({ ...formData, password: e.target.value });
                    if (fieldTouched.password) setErrors({ ...errors, password: validatePassword(e.target.value) });
                  }}
                  onBlur={() => handleBlur('password')}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  style={{ position: 'absolute', top: 0, bottom: 0, right: 0, width: '44px', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'none', border: 'none', color: 'var(--muted-light, #C4A882)', cursor: 'pointer' }}
                  aria-label="Toggle password visibility"
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
              <AnimatePresence>
                {fieldTouched.password && errors.password && (
                  <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} style={{ fontSize: '12px', color: '#DC2626', display: 'flex', alignItems: 'center', gap: '4px', marginTop: '6px' }}>
                    <AlertCircle size={14} /> {errors.password}
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>

            <motion.div initial={{ y: 12, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.34 }}>
              <motion.button
                type="submit"
                disabled={loading || success}
                whileHover={!loading && !success ? { y: -1, backgroundColor: 'var(--coral-dark, #C93D28)', boxShadow: '0 12px 32px rgba(232,85,62,0.35)' } : {}}
                whileTap={!loading && !success ? { y: 0, boxShadow: '0 8px 24px rgba(232,85,62,0.28)' } : {}}
                animate={success ? { scale: 1.02, backgroundColor: 'var(--sage, #6B8F6E)' } : {}}
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
                  cursor: loading || success ? 'not-allowed' : 'pointer',
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
                    Signing in...
                  </>
                ) : success ? (
                  <>
                    <CheckCircle size={20} />
                    Success
                  </>
                ) : (
                  "Sign In →"
                )}
              </motion.button>
            </motion.div>
          </form>

          <motion.div initial={{ y: 12, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.41 }}>


            <div style={{ textAlign: 'center', marginTop: '24px', fontSize: '14px', color: 'var(--ink, #1C1612)' }}>
              Don't have an account?{' '}
              <Link
                to="/register"
                onMouseEnter={(e) => { e.currentTarget.style.textDecoration = 'underline'; }}
                onMouseLeave={(e) => { e.currentTarget.style.textDecoration = 'none'; }}
                style={{ color: 'var(--coral, #E8553E)', fontWeight: 700, textDecoration: 'none' }}
              >
                Sign up free
              </Link>
            </div>
          </motion.div>
        </motion.div>
        
        <div style={{ position: 'absolute', bottom: '24px', left: 0, right: 0, textAlign: 'center', color: 'var(--muted-light, #C4A882)', fontSize: '11px' }}>
          Protected by JWT Auth · Passwords encrypted with bcrypt
        </div>
      </motion.div>
    </div>
  );
}
