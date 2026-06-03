import { AreaChart, Area, ResponsiveContainer, Tooltip } from 'recharts';

export default function SparklineChart({ data = [], color = '#6366f1', gradientId }) {
  const id = gradientId || `spark-${Math.random().toString(36).slice(2)}`;
  const normalized = data.map((v, i) => ({ i, v: typeof v === 'number' ? v : v.count ?? v.value ?? 0 }));

  if (!normalized.length) return null;

  return (
    <ResponsiveContainer width="100%" height={48}>
      <AreaChart data={normalized} margin={{ top: 2, right: 0, bottom: 0, left: 0 }}>
        <defs>
          <linearGradient id={id} x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%"  stopColor={color} stopOpacity={0.35} />
            <stop offset="95%" stopColor={color} stopOpacity={0.02} />
          </linearGradient>
        </defs>
        <Tooltip
          contentStyle={{ display: 'none' }}
          cursor={false}
        />
        <Area
          type="monotone"
          dataKey="v"
          stroke={color}
          strokeWidth={2}
          fill={`url(#${id})`}
          dot={false}
          activeDot={{ r: 3, fill: color, strokeWidth: 0 }}
          isAnimationActive
          animationDuration={1200}
        />
      </AreaChart>
    </ResponsiveContainer>
  );
}
