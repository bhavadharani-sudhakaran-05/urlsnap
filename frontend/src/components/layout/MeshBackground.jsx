import { motion } from 'framer-motion';

export default function MeshBackground({ className = '' }) {
  return (
    <div className={`pointer-events-none fixed inset-0 -z-10 overflow-hidden ${className}`} aria-hidden>
      <div className="absolute inset-0 bg-mesh dark:bg-mesh-dark" />
      <motion.div
        className="absolute -left-32 top-0 h-[420px] w-[420px] rounded-full bg-brand-500/20 blur-3xl dark:bg-brand-600/25"
        animate={{ x: [0, 40, 0], y: [0, -30, 0], scale: [1, 1.08, 1] }}
        transition={{ duration: 14, repeat: Infinity, ease: 'easeInOut' }}
      />
      <motion.div
        className="absolute right-0 top-1/4 h-[360px] w-[360px] rounded-full bg-sky-500/20 blur-3xl dark:bg-sky-600/20"
        animate={{ x: [0, -35, 0], y: [0, 25, 0], scale: [1, 0.92, 1] }}
        transition={{ duration: 11, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
      />
      <motion.div
        className="absolute bottom-0 left-1/3 h-[300px] w-[300px] rounded-full bg-cyan-500/15 blur-3xl"
        animate={{ x: [0, 25, 0], y: [0, -20, 0] }}
        transition={{ duration: 16, repeat: Infinity, ease: 'easeInOut', delay: 2 }}
      />
    </div>
  );
}
