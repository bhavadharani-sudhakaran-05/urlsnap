import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { getApiError } from '../utils/getApiError';
import AuthShell from '../components/auth/AuthShell';

export default function Register() {
  const [form, setForm] = useState({ username: '', email: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const payload = { name: form.username, email: form.email, password: form.password };
      await register(payload);
      showToast('Account created successfully');
      navigate('/dashboard');
    } catch (err) {
      const msg = getApiError(err, 'Registration failed');
      showToast(msg, 'error');
    } finally {
      setLoading(false);
    }
  };

  const len = form.password.length;
  const strength = len === 0 ? -1 : len < 6 ? 0 : len < 10 ? 1 : 2;
  const strengthText = ['Weak', 'Good', 'Strong'][strength] || '';
  const strengthColors = ['bg-red-500', 'bg-amber-400', 'bg-emerald-500'];

  const footerText = (
    <>
      Already have an account?{' '}
      <Link to="/login" className="font-semibold text-brand-600 hover:text-brand-700 hover:underline">
        Sign in
      </Link>
    </>
  );

  return (
    <AuthShell
      title="Create an account"
      subtitle="Join Zestlink today"
      footer={footerText}
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Username */}
        <div>
          <label className="mb-1.5 block text-sm font-medium text-slate-700">
            Username
          </label>
          <input
            id="register-username"
            type="text"
            required
            value={form.username}
            onChange={(e) => setForm({ ...form, username: e.target.value })}
            className="input-field"
            placeholder="johndoe"
          />
        </div>

        {/* Email */}
        <div>
          <label className="mb-1.5 block text-sm font-medium text-slate-700">
            Email address
          </label>
          <input
            id="register-email"
            type="email"
            required
            autoComplete="email"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            className="input-field"
            placeholder="name@company.com"
          />
        </div>

        {/* Password */}
        <div>
          <label className="mb-1.5 block text-sm font-medium text-slate-700">
            Password
          </label>
          <div className="relative">
            <input
              id="register-password"
              type={showPassword ? 'text' : 'password'}
              required
              autoComplete="new-password"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              className="input-field pr-10"
            />
            <button
              type="button"
              onClick={() => setShowPassword((v) => !v)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
              tabIndex={-1}
            >
              {showPassword ? (
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                </svg>
              ) : (
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
              )}
            </button>
          </div>
          
          {/* Strength Meter */}
          {strength >= 0 && (
            <div className="mt-2.5 flex items-center gap-2">
              <div className="flex h-1 flex-1 gap-1">
                {[0, 1, 2].map((idx) => (
                  <div
                    key={idx}
                    className={`h-full flex-1 rounded-full transition-colors duration-300 ${
                      strength >= idx ? strengthColors[strength] : 'bg-slate-200'
                    }`}
                  />
                ))}
              </div>
              <span className={`text-[10px] font-bold uppercase ${strength >= 1 ? 'text-slate-700' : 'text-slate-500'}`}>
                {strengthText}
              </span>
            </div>
          )}
        </div>

        {/* Submit */}
        <button
          id="register-submit"
          type="submit"
          disabled={loading}
          className="btn-primary w-full mt-2"
        >
          {loading ? (
            <span className="flex items-center justify-center gap-2">
              <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>
              Creating account...
            </span>
          ) : (
            'Sign up'
          )}
        </button>
      </form>
    </AuthShell>
  );
}
