import { motion } from 'framer-motion';
import { cn } from '../../lib/utils';

export default function GlassCard({ children, className, hover = false, gradient = false, ...props }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: [0.23, 1, 0.32, 1] }}
      className={cn(
        'relative overflow-hidden rounded-2xl border backdrop-blur-xl transition-all duration-300',
        hover && 'hover:-translate-y-1 hover:shadow-glow cursor-pointer',
        gradient && 'card-gradient-border',
        className
      )}
      style={{
        background: 'rgba(255,255,255,0.07)',
        borderColor: 'rgba(255,255,255,0.12)',
        boxShadow: '0 8px 32px rgba(0,0,0,0.12), inset 0 1px 0 rgba(255,255,255,0.15)',
      }}
      {...props}
    >
      {/* Inner beam shimmer */}
      <div className="pointer-events-none absolute -left-full top-0 h-px w-3/4 animate-beam bg-gradient-to-r from-transparent via-white/30 to-transparent" />
      {children}
    </motion.div>
  );
}
