import { useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { cn } from '../../lib/utils';

export default function GradientButton({
  children,
  className,
  onClick,
  disabled,
  type = 'button',
  size = 'md',
  variant = 'primary',
  loading = false,
  id,
  ...props
}) {
  const btnRef = useRef(null);
  const [ripple, setRipple] = useState(null);

  const handleClick = (e) => {
    // Ripple
    const rect = btnRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    setRipple({ x, y });
    setTimeout(() => setRipple(null), 600);
    onClick?.(e);
  };

  const sizes = {
    sm: 'px-4 py-2 text-xs',
    md: 'px-5 py-2.5 text-sm',
    lg: 'px-7 py-3.5 text-base',
    xl: 'px-8 py-4 text-lg',
  };

  if (variant === 'secondary') {
    return (
      <motion.button
        ref={btnRef}
        id={id}
        type={type}
        disabled={disabled || loading}
        whileHover={{ y: -2, boxShadow: '0 8px 24px rgba(99,102,241,0.2)' }}
        whileTap={{ scale: 0.96 }}
        onClick={handleClick}
        className={cn('btn-secondary relative overflow-hidden', sizes[size], className)}
        {...props}
      >
        {loading ? <Spinner /> : children}
      </motion.button>
    );
  }

  return (
    <motion.button
      ref={btnRef}
      id={id}
      type={type}
      disabled={disabled || loading}
      whileHover={{ y: -2 }}
      whileTap={{ scale: 0.96 }}
      onClick={handleClick}
      className={cn(
        'relative inline-flex items-center justify-center gap-2 overflow-hidden rounded-xl font-semibold text-white transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-brand-500/40 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50',
        sizes[size],
        className
      )}
      style={{
        background: 'linear-gradient(135deg, #1d4ed8 0%, #2563eb 50%, #3b82f6 100%)',
        backgroundSize: '200% auto',
        boxShadow: '0 4px 20px rgba(37,99,235,0.35)',
      }}
      {...props}
    >
      {/* Shimmer layer */}
      <span className="pointer-events-none absolute inset-0 overflow-hidden rounded-xl">
        <span className="absolute inset-0 -translate-x-full animate-shimmer bg-gradient-to-r from-transparent via-white/20 to-transparent" />
      </span>

      {/* Ripple */}
      {ripple && (
        <span
          className="absolute rounded-full bg-white/20"
          style={{
            left: ripple.x - 10, top: ripple.y - 10,
            width: 20, height: 20,
            animation: 'scale-in 0.6s ease-out forwards',
            transform: 'scale(0)',
          }}
        />
      )}

      <span className="relative flex items-center gap-2">
        {loading ? <Spinner /> : children}
      </span>
    </motion.button>
  );
}

function Spinner() {
  return (
    <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none">
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
    </svg>
  );
}
