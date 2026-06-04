import { useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Link2, 
  BarChart2, 
  QrCode, 
  Upload, 
  Settings, 
  LogOut, 
  Zap,
  Menu,
  Bell
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function Sidebar({ isOpen, onClose }) {
  const { user, logout } = useAuth();
  const location = useLocation();

  // Mock progress state
  const thisWeekClicks = 1248;
  const progressPercent = 67;

  // Helper to determine if a path + search is active
  const isActivePath = (path) => {
    return location.pathname + location.search === path;
  };

  const navItemsMain = [
    { label: 'Dashboard', icon: LayoutDashboard, path: '/dashboard' },
    { label: 'My Links', icon: Link2, path: '/dashboard?tab=links' },
    { label: 'Analytics', icon: BarChart2, path: '/dashboard?tab=analytics' },
  ];

  const navItemsTools = [
    { label: 'QR Codes', icon: QrCode, path: '/qr-generator' },
    { label: 'Bulk Upload', icon: Upload, action: 'bulk' },
    { label: 'Settings', icon: Settings, path: '/settings' },
  ];

  const renderNavItem = (item, isAction = false) => {
    const active = isActivePath(item.path);
    const content = (
      <>
        {active && (
          <div className="absolute left-0 top-[20%] bottom-[20%] w-[3px] bg-white rounded-r-sm" />
        )}
        <item.icon className="shrink-0" size={18} />
        {item.label}
      </>
    );

    const baseClass = `
      relative flex items-center gap-2.5 px-3.5 py-2.5 rounded-[10px] text-[14px] font-medium font-sans cursor-pointer transition-all duration-180 mb-0.5 no-underline
      ${active 
        ? 'bg-coral text-white shadow-[0_4px_16px_rgba(232,85,62,0.35)]' 
        : 'text-white/50 hover:bg-white/5 hover:text-white/85'
      }
    `;

    if (item.path) {
      return (
        <NavLink key={item.label} to={item.path} className={baseClass} onClick={onClose}>
          {content}
        </NavLink>
      );
    }

    return (
      <button key={item.label} className={baseClass + ' w-full text-left'} onClick={() => {
        // Trigger bulk upload modal via global state or context (handled by parent typically)
        if (window.openBulkModal) window.openBulkModal();
        if (onClose) onClose();
      }}>
        {content}
      </button>
    );
  };

  return (
    <>
      {/* Mobile backdrop */}
      <div 
        className={`fixed inset-0 bg-black/50 backdrop-blur-[2px] z-[99] transition-opacity lg:hidden ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
        onClick={onClose}
      />

      <aside className={`
        fixed left-0 top-0 bottom-0 z-[100] w-[260px] bg-ink flex flex-col
        transition-transform duration-300 ease-[cubic-bezier(0.4,0,0.2,1)]
        lg:translate-x-0 ${isOpen ? 'translate-x-0' : '-translate-x-[260px]'}
      `}>
        {/* Decorative elements */}
        <div className="absolute top-0 right-0 w-[200px] h-[200px] rounded-full bg-[rgba(232,85,62,0.2)] blur-[60px] pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-[160px] h-[160px] rounded-full bg-[rgba(245,158,11,0.1)] blur-[50px] pointer-events-none" />
        
        {/* Fine dot grid overlay */}
        <div 
          className="absolute inset-0 pointer-events-none"
          style={{
            backgroundImage: 'radial-gradient(rgba(255,255,255,0.04) 1px, transparent 1px)',
            backgroundSize: '24px 24px'
          }}
        />

        <div className="relative z-10 flex flex-col h-full">
          {/* LOGO SECTION */}
          <div className="pt-7 px-6 pb-5 border-b border-white/5">
            <div className="flex items-center gap-1">
              <div className="font-display text-[26px] font-black leading-none flex items-center">
                <span className="text-white/95">Zest</span>
                <span className="text-coral">link</span>
              </div>
              <Zap size={14} className="text-coral ml-1" />
            </div>
            <div className="mt-1.5 font-sans text-[10px] tracking-[3px] text-white/25 uppercase">
              URL Intelligence
            </div>
          </div>

          {/* NAV SECTION */}
          <nav className="flex-1 px-3 py-4 overflow-y-auto custom-scrollbar">
            <div className="font-sans text-[10px] font-bold tracking-[2px] uppercase text-white/25 px-3 mb-1.5">
              Main
            </div>
            {navItemsMain.map(item => renderNavItem(item))}

            <div className="font-sans text-[10px] font-bold tracking-[2px] uppercase text-white/25 px-3 mt-5 mb-1.5">
              Tools
            </div>
            {navItemsTools.map(item => renderNavItem(item))}

            {/* MINI STAT BAR */}
            <div className="mx-3 mt-5 p-3.5 bg-white/5 border border-white/10 rounded-xl">
              <div className="flex items-center justify-between font-sans">
                <span className="text-[11px] text-white/30">This week</span>
                <span className="text-[13px] font-bold text-white">{thisWeekClicks.toLocaleString()}</span>
              </div>
              <div className="h-1 bg-white/10 rounded-full mt-2 overflow-hidden">
                <div 
                  className="h-full bg-coral transition-all duration-800 ease-out" 
                  style={{ width: `${progressPercent}%` }} 
                />
              </div>
              <div className="font-sans text-[11px] text-sage mt-2">
                ↑ 12% from last week
              </div>
            </div>
          </nav>

          {/* USER FOOTER */}
          <div className="p-4 border-t border-white/5 flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-full bg-gradient-to-br from-coral to-amber flex items-center justify-center text-white font-display text-[14px] font-bold shrink-0">
              {user?.name?.charAt(0)?.toUpperCase() || 'U'}
            </div>
            <div className="flex-1 min-w-0">
              <div className="font-sans text-[13px] font-semibold text-white truncate">
                {user?.name || 'User Name'}
              </div>
              <div className="font-sans text-[11px] text-white/35 truncate">
                {user?.email || 'user@example.com'}
              </div>
            </div>
            <button 
              onClick={logout}
              title="Sign out"
              className="shrink-0 p-1.5 rounded-md text-white/30 hover:text-coral hover:bg-[rgba(232,85,62,0.1)] transition-colors border-none bg-transparent cursor-pointer"
            >
              <LogOut size={16} />
            </button>
          </div>
        </div>
      </aside>
    </>
  );
}

// Mobile top bar to be rendered in Layout on small screens
export function MobileTopBar({ onMenuClick }) {
  const { user } = useAuth();
  
  return (
    <div className="h-[60px] bg-cream border-b border-border px-5 flex items-center justify-between lg:hidden sticky top-0 z-[50]">
      <div className="flex items-center gap-3">
        <button onClick={onMenuClick} className="text-ink p-1 -ml-1 cursor-pointer bg-transparent border-none">
          <Menu size={24} />
        </button>
        <div className="font-display text-[20px] font-black leading-none flex items-center">
          <span className="text-ink">Zest</span>
          <span className="text-coral">link</span>
        </div>
      </div>
      <div className="flex items-center gap-3">
        <button className="text-[rgba(28,22,18,0.6)] hover:text-ink cursor-pointer bg-transparent border-none">
          <Bell size={20} />
        </button>
        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-coral to-amber flex items-center justify-center text-white font-display text-[13px] font-bold">
          {user?.name?.charAt(0)?.toUpperCase() || 'U'}
        </div>
      </div>
    </div>
  );
}
