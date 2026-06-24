export default function ScoreRing({ score, max = 10, size = 132, stroke = 9, label = 'Score', showLabel = true }) {
  const radius = (size - stroke) / 2;
  const circumference = 2 * Math.PI * radius;
  const pct = Math.max(0, Math.min(1, score / max));
  const offset = circumference * (1 - pct);

  const color = score >= 8 ? '#34d399' : score >= 5 ? '#fbbf24' : '#fb7185';
  const id = `grad-${size}-${Math.round(score * 100)}`;

  const numSize = Math.round(size * 0.26);
  const withLabel = showLabel && size >= 84;

  return (
    <div
      className="relative inline-flex items-center justify-center"
      style={{ width: size, height: size }}
    >
      <svg width={size} height={size} className="-rotate-90">
        <defs>
          <linearGradient id={id} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor={color} stopOpacity="0.7" />
            <stop offset="100%" stopColor={color} />
          </linearGradient>
        </defs>
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="rgba(255,255,255,0.07)"
          strokeWidth={stroke}
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={`url(#${id})`}
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          style={{ transition: 'stroke-dashoffset 1s cubic-bezier(0.16,1,0.3,1)' }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center leading-none">
        <span className="font-bold text-white tabular-nums" style={{ fontSize: numSize }}>
          {Number.isInteger(score) ? score : score.toFixed(1)}
          <span className="font-medium text-white/40" style={{ fontSize: numSize * 0.5 }}>
            /{max}
          </span>
        </span>
        {withLabel && (
          <span className="mt-1 text-[11px] font-medium uppercase tracking-wider text-white/40">
            {label}
          </span>
        )}
      </div>
    </div>
  );
}
