import { motion } from 'framer-motion';
import { TrendingDown, TrendingUp } from 'lucide-react';
import AnimatedCounter from './AnimatedCounter';
import SparklineChart from './SparklineChart';
import { cn } from '../../lib/utils';

export default function MetricCard({
  label,
  value,
  numericValue,
  suffix = '',
  prefix = '',
  trend,
  trendLabel,
  sparkData = [],
  sparkColor = '#09090b', // Default to black sparkline for clean look
  icon: Icon,
  live = false,
  delay = 0,
  className = '',
}) {
  const isUp = trend >= 0;
  const displayNumeric = numericValue ?? (typeof value === 'number' ? value : null);

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: delay * 0.05, ease: 'easeOut' }}
      className={cn('card p-5 group relative overflow-hidden', className)}
    >
      <div className="relative flex items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <p className="text-xs font-semibold text-brand-500">{label}</p>
            {live && (
              <span className="flex items-center gap-1.5 rounded-md bg-emerald-50 px-1.5 py-0.5">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-700">Live</span>
              </span>
            )}
          </div>

          <p className="mt-3 text-3xl font-bold tracking-tight text-brand-950 font-display">
            {displayNumeric != null ? (
              <AnimatedCounter value={displayNumeric} suffix={suffix} prefix={prefix} />
            ) : (
              <span>{value}</span>
            )}
          </p>

          {trend != null && (
            <div className={cn('mt-3 flex items-center gap-1.5 text-xs font-medium', isUp ? 'text-emerald-600' : 'text-red-600')}>
              {isUp ? <TrendingUp className="h-4 w-4" /> : <TrendingDown className="h-4 w-4" />}
              <span>{isUp ? '+' : ''}{trend}%</span>
              {trendLabel && <span className="text-brand-400">{trendLabel}</span>}
            </div>
          )}
        </div>

        {Icon && (
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-brand-200 bg-brand-50 text-brand-700 shadow-sm transition-colors group-hover:bg-brand-950 group-hover:text-white">
            <Icon className="h-5 w-5" />
          </div>
        )}
      </div>

      {sparkData.length > 0 && (
        <div className="relative mt-5 h-10 w-full">
          <SparklineChart data={sparkData} color={sparkColor} gradientId={`spark-${label.replace(/\s/g, '')}`} />
        </div>
      )}
    </motion.div>
  );
}
