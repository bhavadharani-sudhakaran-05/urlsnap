import { motion } from 'framer-motion';
import { cn } from '../../lib/utils';

export default function ChartPanel({ title, subtitle, action, children, className = '', delay = 0 }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: delay * 0.05, ease: 'easeOut' }}
      className={cn('card p-5 sm:p-6', className)}
    >
      <div className="mb-5 flex flex-wrap items-start justify-between gap-3">
        <div>
          <h3 className="text-sm font-semibold text-brand-950">{title}</h3>
          {subtitle && <p className="mt-1 text-xs text-brand-500">{subtitle}</p>}
        </div>
        {action}
      </div>
      {children}
    </motion.div>
  );
}
