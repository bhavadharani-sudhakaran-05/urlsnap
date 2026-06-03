import React from 'react';

export default function LoadingSpinner({ size = 'default', text = null }) {
  const sizeClasses = {
    small: 'w-5 h-5 border-2',
    default: 'w-10 h-10 border-[3px]',
    large: 'w-16 h-16 border-4'
  };

  return (
    <div className="flex flex-col items-center justify-center gap-3">
      <div className={`${sizeClasses[size] || sizeClasses.default} border-coral border-t-transparent rounded-full animate-[spin_1s_linear_infinite]`} />
      {text && (
        <span className="font-sans text-[13px] text-muted font-medium">{text}</span>
      )}
    </div>
  );
}
