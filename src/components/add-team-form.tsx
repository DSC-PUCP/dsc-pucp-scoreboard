"use client";

import { useEffect, useRef, useState } from "react";

const MAX_LENGTH = 30;

interface AddTeamFormProps {
  onAdd: (name: string) => string | null;
  teamCount: number;
}

export default function AddTeamForm({ onAdd, teamCount }: AddTeamFormProps) {
  const [name, setName] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [shaking, setShaking] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!error) return;
    const timer = window.setTimeout(() => {
      setError(null);
      setShaking(false);
    }, 3000);
    return () => window.clearTimeout(timer);
  }, [error]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const message = onAdd(name);
    if (message) {
      setError(message);
      setShaking(true);
      return;
    }
    setName("");
    setError(null);
    inputRef.current?.focus();
  };

  const canAdd = name.trim().length > 0;
  const nearLimit = name.length > MAX_LENGTH - 10;

  return (
    <form onSubmit={handleSubmit} noValidate>
      <div className="mb-2.5 flex items-baseline gap-2">
        <label htmlFor="team-name" className="label-xs text-text-faint">
          {teamCount === 0 ? "Registrar el primer equipo" : "Registrar equipo"}
        </label>
        {nearLimit && (
          <span className="numerals animate-fade-in ml-auto text-[10px] text-text-faint tabular-nums">
            {name.length}/{MAX_LENGTH}
          </span>
        )}
      </div>

      <div className="flex gap-2 lg:flex-col">
        <input
          ref={inputRef}
          id="team-name"
          type="text"
          value={name}
          onChange={(e) => {
            setName(e.target.value);
            if (error) {
              setError(null);
              setShaking(false);
            }
          }}
          placeholder="Los Compiladores"
          maxLength={MAX_LENGTH}
          autoComplete="off"
          className={`min-w-0 flex-1 rounded-lg border bg-ink px-3.5 py-2.5 text-sm text-text transition-colors duration-200 placeholder:text-text-faint focus:outline-none ${
            error
              ? "border-danger/60 focus:border-danger"
              : "border-line focus:border-signal"
          } ${shaking ? "animate-shake" : ""}`}
          aria-invalid={!!error}
          aria-describedby={error ? "team-name-error" : undefined}
        />

        <button
          type="submit"
          disabled={!canAdd}
          className="shrink-0 cursor-pointer rounded-lg bg-signal px-4 py-2.5 text-sm font-semibold text-ink transition-all duration-200 hover:bg-signal/85 active:scale-[0.98] disabled:cursor-not-allowed disabled:bg-surface-2 disabled:text-text-faint"
        >
          Agregar
        </button>
      </div>

      {error && (
        <p
          id="team-name-error"
          role="alert"
          className="animate-fade-in mt-2 text-xs text-danger"
        >
          {error}
        </p>
      )}
    </form>
  );
}
