"use client";

import { useState, useRef, useEffect } from "react";

interface CustomScoreProps {
  onAdd: (amount: number) => void;
  teamName: string;
  accent: string;
}

/** Shortcuts a host actually reaches for mid-game: bonuses and penalties. */
const QUICK_DELTAS = [-10, -5, 5, 10] as const;

export default function CustomScore({
  onAdd,
  teamName,
  accent,
}: CustomScoreProps) {
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (open) inputRef.current?.focus();
  }, [open]);

  useEffect(() => {
    if (!open) return;

    function handlePointerDown(e: MouseEvent) {
      if (!containerRef.current?.contains(e.target as Node)) setOpen(false);
    }
    function handleEscape(e: KeyboardEvent) {
      if (e.key === "Escape") {
        setOpen(false);
        triggerRef.current?.focus();
      }
    }

    document.addEventListener("mousedown", handlePointerDown);
    document.addEventListener("keydown", handleEscape);
    return () => {
      document.removeEventListener("mousedown", handlePointerDown);
      document.removeEventListener("keydown", handleEscape);
    };
  }, [open]);

  const parsed = parseInt(value, 10);
  const valid = !isNaN(parsed) && parsed !== 0;

  const commit = (amount: number) => {
    onAdd(amount);
    setValue("");
    setOpen(false);
    triggerRef.current?.focus();
  };

  return (
    <div ref={containerRef} className="relative flex">
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

      {open && (
        <div
          role="dialog"
          aria-label={`Puntaje personalizado para ${teamName}`}
          className="animate-fade-in absolute right-0 bottom-full z-50 mb-2 w-56 rounded-xl border border-line-2 bg-surface-2 p-3 shadow-2xl shadow-black/60"
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
      )}
    </div>
  );
}
