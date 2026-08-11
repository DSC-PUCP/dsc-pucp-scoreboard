import { Team } from "@/lib/types";

interface StatsPanelProps {
  teams: Team[];
}

/**
 * Aggregate readouts. Deliberately a definition list of hairline-separated
 * rows rather than KPI cards — these are reference values, not the headline.
 */
export default function StatsPanel({ teams }: StatsPanelProps) {
  if (teams.length === 0) return null;

  const sorted = [...teams].sort((a, b) => b.score - a.score);
  const total = teams.reduce((sum, t) => sum + t.score, 0);
  const leader = sorted[0];
  const lead = leader.score - (sorted[1]?.score ?? 0);
  const tiedAtTop = sorted.filter((t) => t.score === leader.score).length > 1;

  const rows: { label: string; value: string; accent?: boolean }[] = [
    { label: "Equipos", value: String(teams.length).padStart(2, "0") },
    { label: "Puntos en juego", value: String(total) },
  ];

  if (leader.score > 0) {
    rows.push({
      label: "Líder",
      value: tiedAtTop ? "Empate" : leader.name,
      accent: true,
    });
    if (!tiedAtTop) {
      rows.push({ label: "Ventaja", value: `+${lead}` });
    }
  }

  return (
    <dl className="divide-y divide-line border-y border-line">
      {rows.map((row) => (
        <div
          key={row.label}
          className="flex items-baseline gap-3 py-2.5 first:pt-3 last:pb-3"
        >
          <dt className="label-xs text-text-faint">{row.label}</dt>
          <dd
            className={`numerals ml-auto min-w-0 truncate text-right text-sm tabular-nums ${
              row.accent ? "text-gold" : "text-text"
            }`}
          >
            {row.value}
          </dd>
        </div>
      ))}
    </dl>
  );
}
