import CountUp from 'react-countup';
import { motion } from 'framer-motion';

export default function AnimatedCounter({ value, suffix = '', prefix = '', decimals = 0, duration = 2, className = '' }) {
  return (
    <motion.span
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
      className={className}
    >
      <CountUp
        end={typeof value === 'number' ? value : parseFloat(value) || 0}
        duration={duration}
        decimals={decimals}
        separator=","
        prefix={prefix}
        suffix={suffix}
        useEasing
        enableScrollSpy
        scrollSpyOnce
      />
    </motion.span>
  );
}
