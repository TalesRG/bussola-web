import { LEVELS, type Level, type TrendPoint } from "./data";

const WIDTH = 316;
const BAND = 110 / 3;
const X_START = 24;
const X_END = 258;

// Faixas de cima para baixo, como no Figma.
const BANDS: { level: Level; fill: string; text: string; label: string }[] = [
  { level: "fortes", fill: "fill-amber-100", text: "fill-amber-800", label: "Fortes" },
  { level: "alerta", fill: "fill-amber-50", text: "fill-amber-800", label: "Alerta" },
  { level: "leves", fill: "fill-brand-soft", text: "fill-brand-ink", label: "Leves" },
];

/** Tendência dos check-ins da quinzena sobre as faixas leves/alerta/fortes. */
export function TrendChart({ points }: { points: TrendPoint[] }) {
  const step = (X_END - X_START) / Math.max(1, points.length - 1);
  const coords = points.map((p, i) => ({
    ...p,
    x: X_START + i * step,
    y: 110 - p.value * BAND,
  }));
  const last = coords.at(-1);

  return (
    <svg
      viewBox={`0 0 ${WIDTH} 132`}
      className="h-auto w-full font-display text-[11px] font-medium"
      role="img"
      aria-label={`Tendência do check-in: ${points
        .map((p) => `semana ${p.week}, ${levelOf(p.value)}`)
        .join("; ")}`}
    >
      {BANDS.map((b, i) => (
        <g key={b.level}>
          <rect x={0} y={i * BAND} width={WIDTH} height={BAND} className={b.fill} />
          <text x={WIDTH - 4} y={i * BAND + 13} textAnchor="end" className={b.text}>
            {b.label}
          </text>
        </g>
      ))}
      <polyline
        points={coords.map((c) => `${c.x},${c.y}`).join(" ")}
        fill="none"
        className="stroke-brand"
        strokeWidth={2.5}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {coords.map((c) =>
        c === last ? (
          <circle key={c.week} cx={c.x} cy={c.y} r={5} className="fill-brand stroke-brand" strokeWidth={2} />
        ) : (
          <circle key={c.week} cx={c.x} cy={c.y} r={2.5} className="fill-white stroke-brand" strokeWidth={2} />
        ),
      )}
      {coords.map((c) => (
        <text
          key={c.week}
          x={c.x}
          y={126}
          textAnchor="middle"
          className={c === last ? "fill-ink" : "fill-ink-3"}
        >
          Sem {c.week}
        </text>
      ))}
    </svg>
  );
}

function levelOf(value: number) {
  const level: Level = value >= 2 ? "fortes" : value >= 1 ? "alerta" : "leves";
  return LEVELS[level].label.toLowerCase();
}
