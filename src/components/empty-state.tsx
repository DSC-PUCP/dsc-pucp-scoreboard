const GHOST_LANES = [
  { rank: "01", width: "62%", opacity: "opacity-60" },
  { rank: "02", width: "44%", opacity: "opacity-35" },
  { rank: "03", width: "28%", opacity: "opacity-20" },
];

export default function EmptyState() {
  return (
    <section className="animate-fade-in">
      <div className="mb-4 flex items-baseline gap-3 border-b border-line pb-3">
        <h2 className="font-display text-sm font-semibold tracking-[0.02em] text-text uppercase">
          Tabla de posiciones
        </h2>
        <span className="numerals ml-auto text-xs text-text-faint">
          sin equipos
        </span>
      </div>

      {/* The board's own skeleton — an empty arena, not a decorative blob */}
      <div className="flex flex-col gap-2.5" aria-hidden="true">
        {GHOST_LANES.map((lane) => (
          <div
            key={lane.rank}
            className={`rounded-xl border border-dashed border-line px-4 py-4 sm:px-5 ${lane.opacity}`}
          >
            <div className="flex items-center gap-4">
              <span className="numerals text-base text-text-faint">
                {lane.rank}
              </span>
              <span
                className="h-2.5 rounded-full bg-line"
                style={{ width: lane.width }}
              />
              <span className="numerals ml-auto text-2xl leading-none font-semibold text-line-2">
                —
              </span>
            </div>
            <div className="mt-3 h-[3px] rounded-full bg-line" />
          </div>
        ))}
      </div>

      <div className="mt-6 max-w-md">
        <h3 className="font-display text-lg font-semibold tracking-[-0.01em] text-text">
          La pista está vacía
        </h3>
        <p className="mt-1.5 text-sm leading-relaxed text-text-dim">
          Registra a los equipos y el marcador se ordena solo: cada vez que
          alguien suma, las posiciones se reacomodan en vivo y el líder se lleva
          el oro.
        </p>
      </div>
    </section>
  );
}
