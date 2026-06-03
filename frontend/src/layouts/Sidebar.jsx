import { useEffect, useState } from 'react';
import { NavLink } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  ChevronLeft,
  ChevronRight,
  LayoutDashboard,
  Link2,
  Upload,
  Zap,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const STORAGE_KEY = 'linkforge-sidebar-collapsed';

const links = [
  { to: '/dashboard', label: 'Dashboard', Icon: LayoutDashboard },
  { to: '/create', label: 'Create URL', Icon: Link2 },
  { to: '/bulk', label: 'Bulk Upload', Icon: Upload },
];

export default function Sidebar({ open, onClose }) {
  const { user } = useAuth();
  const [collapsed, setCollapsed] = useState(() => localStorage.getItem(STORAGE_KEY) === 'true');

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, String(collapsed));
  }, [collapsed]);

  const initials = user?.name
    ? user.name.split(' ').map((n) => n[0]).join('').slice(0, 2).toUpperCase()
    : 'U';

  const usagePct = Math.min(100, ((user?.urlsCount ?? 3) / 50) * 100);

  return (
    <>
      {open && (
        <div
          className="fixed inset-0 z-30 bg-black/50 backdrop-blur-sm lg:hidden"
          onClick={onClose}
          aria-hidden
        />
      )}

      <aside
        className={`sidebar ${open ? 'sidebar-open' : ''} ${collapsed ? 'sidebar-collapsed' : ''}`}
      >
        <div className="flex h-16 items-center gap-3 border-b border-slate-200 dark:border-slate-800/50 px-4">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-indigo-600 shadow-lg shadow-indigo-500/20">
            <Zap className="h-5 w-5 text-white" />
          </div>
          <div className="sidebar-label min-w-0">
            <span className="block text-base font-bold tracking-tight text-slate-900 dark:text-white">LinkSnap</span>
            <span className="text-[10px] font-semibold uppercase tracking-widest text-indigo-500">Analytics</span>
          </div>
        </div>

        <nav className="mt-5 flex-1 space-y-1 px-3">
          <p className="sidebar-section-title mb-2 px-3 text-[10px] font-semibold uppercase tracking-widest text-slate-500 dark:text-slate-400">
            Menu
          </p>
          {links.map(({ to, label, Icon }) => (
            <NavLink
              key={to}
              to={to}
              onClick={onClose}
              title={collapsed ? label : undefined}
              className={({ isActive }) => `nav-item group ${isActive ? 'nav-item-active' : ''}`}
            >
              {({ isActive }) => (
                <>
                  {isActive && (
                    <motion.span
                      layoutId="nav-beam"
                      className="absolute inset-y-1 left-0 w-1 rounded-full bg-indigo-500 shadow-sm"
                      transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                    />
                  )}
                  <Icon className={`h-5 w-5 shrink-0 ${isActive ? 'text-indigo-600 dark:text-indigo-400' : ''}`} />
                  <span className="sidebar-label">{label}</span>
                </>
              )}
            </NavLink>
          ))}
        </nav>

        <div className="border-t border-slate-200 dark:border-slate-800/50 p-4">
          <div className="sidebar-user-meta mb-3">
            <div className="mb-1 flex justify-between text-[10px] font-medium text-slate-500 dark:text-slate-400">
              <span>Storage</span>
              <span>{Math.round(usagePct)}%</span>
            </div>
            <div className="progress-track">
              <motion.div
                className="progress-fill"
                initial={{ width: 0 }}
                animate={{ width: `${usagePct}%` }}
                transition={{ duration: 1, ease: 'easeOut' }}
              />
            </div>
          </div>

          <div className="flex items-center gap-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 p-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-indigo-600 text-xs font-bold text-white shadow-lg shadow-indigo-500/20">
              {initials}
            </div>
            <div className="sidebar-user-meta min-w-0 flex-1">
              <p className="truncate text-sm font-semibold text-slate-900 dark:text-white">{user?.name}</p>
              <span className="badge-brand mt-0.5">Premium</span>
            </div>
            <span className="h-2 w-2 shrink-0 rounded-full bg-emerald-500 animate-pulse-dot" />
          </div>
        </div>

        <button
          type="button"
          onClick={() => setCollapsed((c) => !c)}
          className="absolute -right-3 top-20 hidden h-6 w-6 items-center justify-center rounded-full border border-slate-200 dark:border-slate-700 bg-white text-slate-500 shadow-sm transition hover:text-indigo-600 dark:bg-slate-800 dark:hover:text-indigo-400 lg:flex"
          aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          {collapsed ? <ChevronRight className="h-3.5 w-3.5" /> : <ChevronLeft className="h-3.5 w-3.5" />}
        </button>
      </aside>
    </>
  );
}
