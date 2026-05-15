interface Props {
  active: boolean;
  levels?: number[];
}

const staticBars = [
  { h: 11, color: "bg-outline-variant/40" },
  { h: 14, color: "bg-outline-variant/60" },
  { h: 17, color: "bg-outline-variant/60" },
  { h: 20, color: "bg-primary/60" },
  { h: 23, color: "bg-primary" },
  { h: 20, color: "bg-primary/60" },
  { h: 17, color: "bg-outline-variant/60" },
  { h: 14, color: "bg-outline-variant/40" },
  { h: 11, color: "bg-outline-variant/40" },
];

export default function WaveformBars({ active, levels }: Props) {
  if (levels) {
    const mirrored = [
      ...levels.slice(0, -1).reverse(),
      ...levels,
    ];
    const maxH = 46;
    return (
      <div className="flex gap-1 items-center mb-8 h-16">
        {mirrored.map((level, i) => {
          const center = mirrored.length - 1;
          const dist = Math.abs(i - center);
          return (
            <div
              key={i}
              className="w-1 rounded-full transition-all duration-150 bg-primary"
              style={{
                height: `${Math.max(4, Math.round(level * maxH))}px`,
                opacity: 1 - dist * 0.12,
              }}
            />
          );
        })}
      </div>
    );
  }

  return (
    <div className="flex gap-1 items-center mb-8 h-16">
      {staticBars.map((bar, i) => (
        <div
          key={i}
          className={`w-1 rounded-full transition-all duration-150 ${
            active ? "bg-primary animate-pulse" : bar.color
          }`}
          style={{
            height: `${bar.h}px`,
            animationDelay: active ? `${i * 0.08}s` : undefined,
            animationDuration: active ? "0.5s" : undefined,
          }}
        />
      ))}
    </div>
  );
}
