import { formatRupiahShort } from '@/utils/format';

interface BarChartProps {
  data: { label: string; value: number }[];
  color?: string;
  height?: number;
}

export function BarChart({ data, color = '#2563eb', height = 200 }: BarChartProps) {
  const width = 600;
  const padding = { top: 20, right: 16, bottom: 30, left: 50 };
  const chartW = width - padding.left - padding.right;
  const chartH = height - padding.top - padding.bottom;

  const maxVal = Math.max(...data.map((d) => d.value), 1);
  const barWidth = (chartW / data.length) * 0.5;
  const gap = chartW / data.length;

  const gridLines = [0, 0.25, 0.5, 0.75, 1].map((t) => padding.top + chartH * t);
  const gridValues = [0, 0.25, 0.5, 0.75, 1].map((t) => maxVal * (1 - t));

  return (
    <svg viewBox={`0 0 ${width} ${height}`} className="w-full" style={{ height }}>
      <defs>
        <linearGradient id="bar-grad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.9" />
          <stop offset="100%" stopColor={color} stopOpacity="0.5" />
        </linearGradient>
      </defs>
      {gridLines.map((y, i) => (
        <g key={i}>
          <line
            x1={padding.left}
            y1={y}
            x2={width - padding.right}
            y2={y}
            stroke="#f1f5f9"
            strokeWidth="1"
          />
          <text
            x={padding.left - 8}
            y={y + 4}
            textAnchor="end"
            className="fill-gray-400"
            style={{ fontSize: '10px' }}
          >
            {formatRupiahShort(gridValues[i])}
          </text>
        </g>
      ))}
      {data.map((d, i) => {
        const barH = (d.value / maxVal) * chartH;
        const x = padding.left + i * gap + (gap - barWidth) / 2;
        const y = padding.top + chartH - barH;
        return (
          <g key={i}>
            <rect
              x={x}
              y={y}
              width={barWidth}
              height={barH}
              rx="4"
              fill="url(#bar-grad)"
            />
            <text
              x={x + barWidth / 2}
              y={height - 8}
              textAnchor="middle"
              className="fill-gray-500"
              style={{ fontSize: '11px', fontWeight: 600 }}
            >
              {d.label}
            </text>
          </g>
        );
      })}
    </svg>
  );
}
