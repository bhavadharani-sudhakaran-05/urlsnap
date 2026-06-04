import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { BarChart3, Globe, Link2, QrCode, Zap } from 'lucide-react';
import MeshBackground from './layout/MeshBackground';

const features = [
  { Icon: Link2, text: 'Create short links in seconds' },
  { Icon: BarChart3, text: 'Real-time click analytics' },
  { Icon: Globe, text: 'Geo & device breakdown' },
  { Icon: QrCode, text: 'QR codes & custom aliases' },
];

export default function AuthLayout({ title, subtitle, children, footer }) {
  return (
    <div className="auth-panel relative min-h-screen overflow-hidden bg-slate-50 dark:bg-slate-950">
      <div className="auth-brand relative flex flex-col justify-between overflow-hidden p-10 lg:p-14">
        <MeshBackground className="!absolute" />
        <div className="absolute inset-0 bg-gradient-to-br from-slate-950 via-indigo-950 to-slate-900" />

        <div className="relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center gap-3"
          >
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/10 ring-1 ring-white/20 backdrop-blur-md">
              <Zap className="h-7 w-7 text-white" />
            </div>
            <div>
              <span className="text-2xl font-bold tracking-tight text-white">Zestlink</span>
              <p className="text-[10px] font-semibold uppercase tracking-widest text-indigo-300/70">URL Analytics</p>
            </div>
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="mt-14 max-w-md text-4xl font-bold leading-tight text-white lg:text-5xl"
          >
            Shorten.{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-violet-400">Track. Grow.</span>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="mt-4 max-w-md text-base leading-relaxed text-white/60"
          >
            Enterprise-grade link analytics with glass dashboards, live insights, and beautiful reports.
          </motion.p>

          <ul className="mt-10 space-y-3">
            {features.map(({ Icon, text }, i) => (
              <motion.li
                key={text}
                initial={{ opacity: 0, x: -16 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.25 + i * 0.08 }}
                className="flex items-center gap-3 text-sm text-white/80"
              >
                <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/10 ring-1 ring-white/15">
                  <Icon className="h-4 w-4 text-indigo-300" />
                </span>
                {text}
              </motion.li>
            ))}
          </ul>
        </div>

        <p className="relative z-10 text-xs text-white/30">© 2026 Zestlink · Secure & fast</p>
      </div>

      <div className="auth-form-wrap relative flex items-center justify-center bg-slate-50/80 dark:bg-slate-950/80 backdrop-blur-sm">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mx-auto w-full max-w-md"
        >
          <div className="mb-8 lg:hidden">
            <Link to="/" className="inline-flex items-center gap-2.5">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 to-violet-500">
                <Zap className="h-5 w-5 text-white" />
              </div>
              <span className="text-lg font-bold text-slate-900 dark:text-white">Zestlink</span>
            </Link>
          </div>

          <div className="gradient-border">
            <div className="card relative rounded-xl p-6 sm:p-8">
              <div className="mb-8">
                <h1 className="text-2xl font-bold text-slate-900 dark:text-white sm:text-3xl">{title}</h1>
                <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">{subtitle}</p>
              </div>
              {children}
              {footer && <div className="mt-6 text-center text-sm text-slate-500 dark:text-slate-400">{footer}</div>}
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
