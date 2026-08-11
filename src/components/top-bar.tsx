interface TopBarProps {
  /** Number of teams currently on the board. Drives the "live" state. */
  teamCount: number;
}

export default function TopBar({ teamCount }: TopBarProps) {
  const live = teamCount > 0;

  return (
    <header className="sticky top-0 z-40 border-b border-line bg-ink/80 backdrop-blur-md">
      <div className="mx-auto flex max-w-6xl items-center gap-3 px-4 py-3 sm:px-6">
        {/* The club's own mark, reduced to what survives at 32px: the angle
            brackets and the slash. The "dsc" lettering inside the real logo
            turns to mush at this size, so the wordmark carries it instead. */}
        <svg
          className="h-8 w-10 shrink-0 text-signal sm:h-9 sm:w-11"
          viewBox="0 0 40 32"
          fill="none"
          aria-hidden="true"
        >
          <path
            d="M15 4.5 4 16l11 11.5M25 4.5 36 16 25 27.5"
            stroke="currentColor"
            strokeWidth="3.1"
            strokeLinecap="square"
            strokeLinejoin="miter"
          />
          <path
            d="M23.6 2.5 16.4 29.5"
            stroke="currentColor"
            strokeOpacity="0.5"
            strokeWidth="3.4"
            strokeLinecap="butt"
          />
        </svg>

        <div className="min-w-0 leading-none">
          <p className="label-xs text-text-faint">
            DSC <span className="text-pucp">PUCP</span>
          </p>
          <h1 className="mt-1.5 font-display text-lg font-bold tracking-[-0.02em] text-text sm:text-xl">
            Scoreboard
          </h1>
        </div>

        <div className="ml-auto flex items-center gap-2">
          <span
            className={`inline-flex items-center gap-2 rounded-full border px-2.5 py-1.5 label-xs transition-colors duration-300 ${
              live
                ? "border-signal/30 bg-signal/10 text-signal"
                : "border-line text-text-faint"
            }`}
          >
            <span
              className={`h-1.5 w-1.5 rounded-full ${
                live ? "bg-signal animate-live" : "bg-text-faint"
              }`}
              aria-hidden="true"
            />
            {live ? "En vivo" : "En espera"}
          </span>
        </div>
      </div>
    </header>
  );
}
