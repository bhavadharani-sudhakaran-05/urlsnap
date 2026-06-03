import { useLocation, useNavigate } from 'react-router-dom';
import { LogOut, Moon, Sun } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { useApiHealth } from '../hooks/useApiHealth';

const titles = {
  '/dashboard': { label: 'Dashboard', sub: 'Manage your shortened links' },
  '/create': { label: 'Create URL', sub: 'Shorten a new link' },
  '/bulk': { label: 'Bulk Upload', sub: 'Import multiple URLs via CSV' },
};

export default function Navbar({ onMenuClick }) {
  const { logout } = useAuth();
  const { theme, setTheme } = useTheme();
  const navigate = useNavigate();
  const location = useLocation();
  const apiStatus = useApiHealth();

  const pageInfo =
    titles[location.pathname] ||
    (location.pathname.startsWith('/analytics')
      ? { label: 'Analytics', sub: 'Click performance & insights' }
      : null) ||
    (location.pathname.startsWith('/edit')
      ? { label: 'Edit URL', sub: 'Update link settings' }
      : null) ||
    { label: 'LinkSnap', sub: '' };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const toggleTheme = () => setTheme(theme === 'light' ? 'dark' : 'light');

  const statusColor = {
    online: { bg: 'bg-emerald-500/10', text: 'text-emerald-700 dark:text-emerald-400', dot: 'bg-emerald-500', label: 'Connected' },
    offline: { bg: 'bg-red-500/10', text: 'text-red-600 dark:text-red-400', dot: 'bg-red-500', label: 'Offline' },
    default: { bg: 'bg-slate-100 dark:bg-slate-800', text: 'text-slate-500 dark:text-slate-400', dot: 'bg-slate-400', label: '…' },
  }[apiStatus] ?? { bg: 'bg-slate-100 dark:bg-slate-800', text: 'text-slate-500 dark:text-slate-400', dot: 'bg-slate-400', label: '…' };

  return (
    <header className="navbar">
      <div className="flex items-center gap-4">
        <button type="button" id="navbar-menu-btn" onClick={onMenuClick} className="menu-btn lg:hidden" aria-label="Toggle menu">
          <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
        <div>
          <h1 className="text-base font-bold text-slate-900 dark:text-white sm:text-lg">{pageInfo.label}</h1>
          {pageInfo.sub && <p className="hidden text-xs text-slate-500 dark:text-slate-400 sm:block">{pageInfo.sub}</p>}
        </div>
      </div>

      <div className="flex items-center gap-2 sm:gap-3">
        <span className={`hidden items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium sm:inline-flex ${statusColor.bg} ${statusColor.text}`}>
          <span className={`h-1.5 w-1.5 rounded-full animate-pulse-dot ${statusColor.dot}`} />
          API {statusColor.label}
        </span>

        <button type="button" onClick={toggleTheme} className="btn-ghost" aria-label="Toggle theme">
          {theme === 'light' ? <Moon className="h-4 w-4" /> : <Sun className="h-4 w-4" />}
        </button>

        <div className="hidden h-5 w-px bg-slate-200 dark:bg-slate-700 sm:block" />

        <button id="navbar-signout" type="button" onClick={handleLogout} className="btn-ghost flex items-center gap-1.5">
          <LogOut className="h-4 w-4" />
          <span className="hidden sm:inline">Sign out</span>
        </button>
      </div>
    </header>
  );
}
