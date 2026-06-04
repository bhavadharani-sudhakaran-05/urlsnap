import { Link } from 'react-router-dom';
import { Link2 } from 'lucide-react';
import { cn } from '../lib/utils';

export default function BrandLogo({ className = '', to = '/', size = 'md', light = false }) {
  const sizes = {
    sm: { box: 'h-8 w-8', icon: 'h-4 w-4', text: 'text-base' },
    md: { box: 'h-9 w-9', icon: 'h-5 w-5', text: 'text-lg' },
    lg: { box: 'h-11 w-11', icon: 'h-6 w-6', text: 'text-xl' },
  };
  const s = sizes[size] || sizes.md;

  const content = (
    <>
      <div className={cn('flex shrink-0 items-center justify-center rounded-xl bg-brand-600 shadow-sm', s.box)}>
        <Link2 className={cn('text-white', s.icon)} strokeWidth={2.5} />
      </div>
      <span className={cn('font-bold tracking-tight', s.text, light ? 'text-white' : 'text-slate-900 dark:text-white')}>
        Zestlink
      </span>
    </>
  );

  if (to) {
    return (
      <Link to={to} className={cn('inline-flex items-center gap-2.5', className)}>
        {content}
      </Link>
    );
  }

  return <div className={cn('inline-flex items-center gap-2.5', className)}>{content}</div>;
}
