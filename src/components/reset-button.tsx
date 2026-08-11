"use client";

import { useEffect, useState } from "react";

interface ResetButtonProps {
  onReset: () => void;
  hasTeams: boolean;
}

export default function ResetButton({ onReset, hasTeams }: ResetButtonProps) {
  const [confirming, setConfirming] = useState(false);

  useEffect(() => {
    if (!confirming) return;
    const timer = window.setTimeout(() => setConfirming(false), 5000);
    return () => window.clearTimeout(timer);
  }, [confirming]);

  if (!hasTeams) return null;

  if (!confirming) {
    return (
      <button
        type="button"
        onClick={() => setConfirming(true)}
        className="label-xs inline-flex cursor-pointer items-center gap-2 rounded-lg border border-line px-3 py-2 text-text-faint transition-colors duration-200 hover:border-danger/40 hover:text-danger"
      >
        <svg
          className="h-3.5 w-3.5"
          viewBox="0 0 16 16"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.4"
          aria-hidden="true"
        >
          <path
            d="M2 8a6 6 0 0 1 10.47-4M14 8a6 6 0 0 1-10.47 4M2 2.5v4h4M14 13.5v-4h-4"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
        Reiniciar puntajes
      </button>
    );
  }

  return (
    <div className="animate-fade-in rounded-lg border border-danger/30 bg-danger/5 p-3">
      <p className="text-xs text-text-dim">
        Todos los marcadores vuelven a cero. Los equipos se mantienen.
      </p>
      <div className="mt-2.5 flex gap-2">
        <button
          type="button"
          autoFocus
          onClick={() => {
            onReset();
            setConfirming(false);
          }}
          className="flex-1 cursor-pointer rounded-md bg-danger px-3 py-1.5 text-xs font-semibold text-ink transition-opacity duration-150 hover:opacity-85"
        >
          Reiniciar
        </button>
        <button
          type="button"
          onClick={() => setConfirming(false)}
          className="flex-1 cursor-pointer rounded-md border border-line px-3 py-1.5 text-xs text-text-dim transition-colors duration-150 hover:text-text"
        >
          Cancelar
        </button>
      </div>
    </div>
  );
}
