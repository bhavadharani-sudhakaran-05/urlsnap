import React from 'react';

// Custom keyframes for the shimmer effect.
// Included via an inline style to ensure it works independent of tailwind setup, 
// though we also have it in tailwind config.
const shimmerKeyframes = `
  @keyframes customShimmer {
    0% { background-position: -200% 0 }
    100% { background-position: 200% 0 }
  }
`;

export default function SkeletonRow() {
  const shimmerStyle = {
    background: 'linear-gradient(90deg, var(--surface) 25%, var(--surface-dark) 50%, var(--surface) 75%)',
    backgroundSize: '200% 100%',
    animation: 'customShimmer 1.5s infinite',
    borderRadius: '6px'
  };

  return (
    <tr className="border-b-[1.5px] border-border last:border-0 hover:bg-transparent">
      <style>{shimmerKeyframes}</style>
      
      {/* Col 1: Title/URL */}
      <td className="p-4 px-5 align-middle">
        <div className="flex flex-col gap-2">
          <div style={{ ...shimmerStyle, width: '140px', height: '14px' }} />
          <div style={{ ...shimmerStyle, width: '180px', height: '11px' }} />
        </div>
      </td>

      {/* Col 2: Short URL */}
      <td className="p-4 px-5 align-middle">
        <div style={{ ...shimmerStyle, width: '110px', height: '14px' }} />
      </td>

      {/* Col 3: Created */}
      <td className="p-4 px-5 align-middle">
        <div style={{ ...shimmerStyle, width: '80px', height: '14px' }} />
      </td>

      {/* Col 4: Clicks */}
      <td className="p-4 px-5 align-middle text-center">
        <div className="mx-auto" style={{ ...shimmerStyle, width: '50px', height: '24px', borderRadius: '99px' }} />
      </td>

      {/* Col 5: Status */}
      <td className="p-4 px-5 align-middle">
        <div style={{ ...shimmerStyle, width: '60px', height: '22px', borderRadius: '99px' }} />
      </td>

      {/* Col 6: Actions */}
      <td className="p-4 px-5 align-middle text-right">
        <div className="flex items-center justify-end gap-1">
          <div style={{ ...shimmerStyle, width: '28px', height: '28px', borderRadius: '50%' }} />
          <div style={{ ...shimmerStyle, width: '28px', height: '28px', borderRadius: '50%' }} />
          <div style={{ ...shimmerStyle, width: '28px', height: '28px', borderRadius: '50%' }} />
          <div style={{ ...shimmerStyle, width: '28px', height: '28px', borderRadius: '50%' }} />
        </div>
      </td>
    </tr>
  );
}

// Utility component to render a full block of skeleton rows
export function SkeletonTableBody({ rows = 5 }) {
  return (
    <>
      {Array.from({ length: rows }).map((_, i) => (
        <SkeletonRow key={i} />
      ))}
    </>
  );
}
