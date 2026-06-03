import React from 'react';
import { TrendingUp, TrendingDown } from 'lucide-react';

export default function StatCard({ 
  icon: Icon, 
  label, 
  value, 
  colorClass = 'coral', 
  trend, 
  loading = false 
}) {
  const colorMaps = {
    coral: {
      decoration: 'bg-coral',
      iconBoxBg: 'bg-[rgba(232,85,62,0.12)]',
      iconColor: 'text-coral'
    },
    amber: {
      decoration: 'bg-amber',
      iconBoxBg: 'bg-[rgba(245,158,11,0.12)]',
      iconColor: 'text-amber'
    },
    sage: {
      decoration: 'bg-sage',
      iconBoxBg: 'bg-[rgba(107,143,110,0.12)]',
      iconColor: 'text-sage'
    },
    ink: {
      decoration: 'bg-ink',
      iconBoxBg: 'bg-[rgba(28,22,18,0.07)]',
      iconColor: 'text-ink-light'
    }
  };

  const theme = colorMaps[colorClass] || colorMaps.coral;

  if (loading) {
    return (
      <div className="bg-white border-[1.5px] border-border rounded-[20px] p-6 relative overflow-hidden h-[166px]">
        {/* Loading skeletons */}
        <div className="w-[44px] h-[44px] rounded-xl skeleton mb-5" />
        <div className="w-[60px] h-[32px] skeleton mb-1.5" />
        <div className="w-[80px] h-[14px] skeleton" />
      </div>
    );
  }

  return (
    <div className="bg-white border-[1.5px] border-border rounded-[20px] p-6 relative overflow-hidden transition-all duration-[220ms] cursor-default hover:-translate-y-[3px] hover:shadow-[0_12px_36px_rgba(28,22,18,0.10)]">
      {/* Corner Decoration */}
      <div className={`absolute -top-5 -right-5 w-[100px] h-[100px] rounded-full opacity-[0.08] pointer-events-none ${theme.decoration}`} />

      {/* Icon Box */}
      <div className={`w-[44px] h-[44px] rounded-xl flex items-center justify-center mb-5 ${theme.iconBoxBg} ${theme.iconColor}`}>
        {Icon && <Icon size={22} />}
      </div>

      {/* Value */}
      <div className="font-display text-[38px] font-black text-ink leading-none">
        {value}
      </div>

      {/* Label */}
      <div className="font-sans text-[13px] font-medium text-muted mt-1.5 tracking-[0.3px]">
        {label}
      </div>

      {/* Trend */}
      {trend && (
        <div className={`flex items-center gap-[5px] mt-2.5 font-sans text-[12px] font-semibold ${trend.positive ? 'text-sage' : 'text-[#DC2626]'}`}>
          {trend.positive ? <TrendingUp size={14} /> : <TrendingDown size={14} />}
          <span>{trend.value}</span>
        </div>
      )}
    </div>
  );
}
