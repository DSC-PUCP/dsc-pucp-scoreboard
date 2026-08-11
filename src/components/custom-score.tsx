"use client";

import {
  useState,
  useRef,
  useEffect,
  useLayoutEffect,
  useCallback,
} from "react";
import { createPortal } from "react-dom";

interface CustomScoreProps {
  onAdd: (amount: number) => void;
  teamName: string;
  accent: string;
}

/** Shortcuts a host actually reaches for mid-game: bonuses and penalties. */
const QUICK_DELTAS = [-10, -5, 5, 10] as const;

/** Matches the panel's `w-56`; needed before paint to keep it on screen. */
const PANEL_WIDTH = 224;
const VIEWPORT_MARGIN = 8;
const TRIGGER_GAP = 8;

export default function CustomScore({
  onAdd,
  teamName,
  accent,
}: CustomScoreProps) {
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState("");
  // The lane card clips overflow, so the panel lives in a portal and carries
  // its own viewport coordinates instead of riding on the trigger's box.
  const [coords, setCoords] = useState<{ top: number; left: number } | null>(
    null
  );
  const inputRef = useRef<HTMLInputElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);

  const place = useCallback(() => {
    const trigger = triggerRef.current;
    const panel = panelRef.current;
    if (!trigger || !panel) return;

    const rect = trigger.getBoundingClientRect();
    const height = panel.offsetHeight;
    const spaceAbove = rect.top - VIEWPORT_MARGIN;
    const spaceBelow = window.innerHeight - rect.bottom - VIEWPORT_MARGIN;

    // Above by default — it keeps the score column visible — unless the top
    // lane leaves no room there.
    const above = spaceAbove >= height + TRIGGER_GAP || spaceAbove >= spaceBelow;
    const rawTop = above
      ? rect.top - height - TRIGGER_GAP
      : rect.bottom + TRIGGER_GAP;

    const maxTop = Math.max(
      VIEWPORT_MARGIN,
      window.innerHeight - height - VIEWPORT_MARGIN
    );
    const maxLeft = Math.max(
      VIEWPORT_MARGIN,
      window.innerWidth - PANEL_WIDTH - VIEWPORT_MARGIN
    );

    setCoords({
      top: Math.min(Math.max(rawTop, VIEWPORT_MARGIN), maxTop),
      left: Math.min(Math.max(rect.right - PANEL_WIDTH, VIEWPORT_MARGIN), maxLeft),
    });
  }, []);

  // Measure and place before paint so the panel never flashes in the wrong spot
  // — including on reopen, when the coords from the previous open are stale.
  useLayoutEffect(() => {
    if (open) place();
  }, [open, place]);

  useEffect(() => {
    if (!open) return;
    inputRef.current?.focus();

    function handlePointerDown(e: MouseEvent) {
      const target = e.target as Node;
      if (
        !containerRef.current?.contains(target) &&
        !panelRef.current?.contains(target)
      ) {
        setOpen(false);
      }
    }
    function handleEscape(e: KeyboardEvent) {
      if (e.key === "Escape") {
        setOpen(false);
        triggerRef.current?.focus();
      }
    }

    document.addEventListener("mousedown", handlePointerDown);
    document.addEventListener("keydown", handleEscape);
    // A fixed panel has to follow the trigger when the board moves under it.
    window.addEventListener("scroll", place, true);
    window.addEventListener("resize", place);
    return () => {
      document.removeEventListener("mousedown", handlePointerDown);
      document.removeEventListener("keydown", handleEscape);
      window.removeEventListener("scroll", place, true);
      window.removeEventListener("resize", place);
    };
  }, [open, place]);

  const parsed = parseInt(value, 10);
  const valid = !isNaN(parsed) && parsed !== 0;

  const commit = (amount: number) => {
    onAdd(amount);
    setValue("");
    setOpen(false);
    triggerRef.current?.focus();
  };

  const panel = (
    <div
      ref={panelRef}
      role="dialog"
      aria-label={`Puntaje personalizado para ${teamName}`}
      style={{
        top: coords?.top ?? 0,
        left: coords?.left ?? 0,
        width: PANEL_WIDTH,
        visibility: coords ? "visible" : "hidden",
      }}
      className="animate-fade-in fixed z-[60] rounded-xl border border-line-2 bg-surface-2 p-3 shadow-2xl shadow-black/60"
    >
      <p className="label-xs mb-1 text-text-faint">Puntos manuales</p>
      <p className="mb-2.5 text-[11px] text-text-faint">
        Escribe un negativo para restar (ej.{" "}
        <span className="numerals text-danger">−7</span>).
      </p>

      <div className="flex gap-2">
        <input
          ref={inputRef}
          type="number"
          inputMode="numeric"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && valid) commit(parsed);
          }}
          placeholder="±0"
          className="numerals w-full min-w-0 rounded-lg border border-line-2 bg-ink px-3 py-2 text-center text-base font-semibold text-text placeholder:text-text-faint focus:border-signal focus:outline-none"
          aria-label="Cantidad de puntos"
        />
        <button
          type="button"
          onClick={() => valid && commit(parsed)}
          disabled={!valid}
          className="cursor-pointer rounded-lg bg-signal px-3.5 py-2 text-sm font-bold text-ink transition-opacity duration-150 hover:bg-signal/85 disabled:cursor-not-allowed disabled:opacity-25"
        >
          OK
        </button>
      </div>

      <div className="mt-2.5 grid grid-cols-4 gap-1.5">
        {QUICK_DELTAS.map((delta) => (
          <button
            key={delta}
            type="button"
            onClick={() => commit(delta)}
            className={`numerals cursor-pointer rounded-md border border-line-2 py-1.5 text-xs transition-colors duration-150 ${
              delta < 0
                ? "text-danger/70 hover:border-danger/40 hover:bg-danger/10 hover:text-danger"
                : "text-text-dim hover:border-signal/40 hover:bg-signal/10 hover:text-signal"
            }`}
          >
            {delta > 0 ? `+${delta}` : `−${Math.abs(delta)}`}
          </button>
        ))}
      </div>
    </div>
  );

  return (
    <div ref={containerRef} className="flex">
      <button
        ref={triggerRef}
        type="button"
        onClick={() => setOpen((v) => !v)}
        style={{ "--accent": accent } as React.CSSProperties}
        className={`chip-accent cursor-pointer rounded-r-[7px] px-3 py-2 text-sm leading-none font-bold tracking-widest ${
          open ? "bg-signal/15 text-signal" : "text-text-faint"
        }`}
        aria-label={`Puntaje personalizado para ${teamName}`}
        aria-expanded={open}
        aria-haspopup="dialog"
      >
        <span aria-hidden="true">···</span>
      </button>

      {open && typeof document !== "undefined"
        ? createPortal(panel, document.body)
        : null}
    </div>
  );
}
