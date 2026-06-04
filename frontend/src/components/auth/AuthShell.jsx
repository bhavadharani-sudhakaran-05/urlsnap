import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { BarChart3, Link2, QrCode, Shield } from 'lucide-react';
import BrandLogo from '../BrandLogo';

const highlights = [
  { Icon: Link2, title: 'Smart shortening', desc: 'Create branded short links in seconds.' },
  { Icon: BarChart3, title: 'Live analytics', desc: 'Track clicks, devices, and locations.' },
  { Icon: QrCode, title: 'QR codes', desc: 'Download QR for every link instantly.' },
  { Icon: Shield, title: 'Secure access', desc: 'Your data stays private and protected.' },
];

export default function AuthShell({ title, subtitle, footer, children }) {
  return (
    <div className="flex min-h-screen bg-slate-50">
      {/* Left panel — desktop */}
      <aside className="relative hidden w-[44%] flex-col justify-between overflow-hidden bg-slate-900 p-10 lg:flex xl:p-14">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_20%_0%,rgba(37,99,235,0.35),transparent),radial-gradient(ellipse_60%_50%_at_100%_100%,rgba(14,165,233,0.2),transparent)]" />
        <div className="absolute inset-0 opacity-[0.03]" style={{
          backgroundImage: 'linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)',
          backgroundSize: '48px 48px',
        }} />

        <div className="relative z-10">
          <BrandLogo light size="md" />
        </div>

        <div className="relative z-10 max-w-md">
          <motion.h2
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-3xl font-bold leading-tight text-white xl:text-4xl"
          >
            Professional URL management for modern teams
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="mt-4 text-base leading-relaxed text-slate-300"
          >
            Shorten links, monitor performance, and share insights — all in one polished dashboard.
          </motion.p>

          <ul className="mt-10 space-y-4">
            {highlights.map(({ Icon, title: t, desc }, i) => (
              <motion.li
                key={t}
                initial={{ opacity: 0, x: -12 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.15 + i * 0.08 }}
                className="flex gap-4"
              >
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-white/10 ring-1 ring-white/10">
                  <Icon className="h-5 w-5 text-blue-300" />
                </div>
                <div>
                  <p className="font-semibold text-white">{t}</p>
                  <p className="text-sm text-slate-400">{desc}</p>
                </div>
              </motion.li>
            ))}
          </ul>
        </div>

        <p className="relative z-10 text-xs text-slate-500">© 2026 Zestlink · URL Shortener & Analytics</p>
      </aside>

      {/* Right panel — form */}
      <main className="flex flex-1 flex-col justify-center px-6 py-12 sm:px-10 lg:px-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45 }}
          className="mx-auto w-full max-w-[420px]"
        >
          <div className="mb-8 lg:hidden">
            <BrandLogo />
          </div>

          <div className="mb-8">
            <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">{title}</h1>
            <p className="mt-2 text-sm leading-relaxed text-slate-500">{subtitle}</p>
          </div>

          <div className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-xl shadow-slate-200/50 sm:p-8">
            {children}
          </div>

          {footer && (
            <p className="mt-6 text-center text-sm text-slate-500">{footer}</p>
          )}

          <div className="mt-6 text-center">
            <Link
              to="/"
              className="inline-flex items-center gap-1.5 text-sm font-medium text-slate-500 transition-colors hover:text-brand-600"
            >
              ← Back to home
            </Link>
          </div>
        </motion.div>
      </main>
    </div>
  );
}
