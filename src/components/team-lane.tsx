"use client";

import { useState, useRef, useEffect } from "react";
import { Team } from "@/lib/types";
import ScoreButton from "./score-button";
import CustomScore from "./custom-score";

interface TeamLaneProps {
  team: Team;
  rank: number;
  /** Highest score on the board — the bar is measured against it. */
  maxScore: number;
  /** Points between this team and the leader. 0 when tied or leading. */
  gap: number;
  /** Leader's margin over second place. Only meaningful for rank 1. */
  lead: number;
  onAddScore: (id: string, amount: number) => void;
  onRemove: (id: string) => void;
}

export default function TeamLane({
  team,
  rank,
  maxScore,
  gap,
  lead,
  onAddScore,
  onRemove,
}: TeamLaneProps) {
  const [flash, setFlash] = useState<{ key: number; delta: number } | null>(
    null
  );
  const [exiting, setExiting] = useState(false);
  const [confirmingRemove, setConfirmingRemove] = useState(false);
  const prevScore = useRef(team.score);
  const flashKey = useRef(0);

  // Surface the delta the moment the score moves — the host is looking at the
  // board, not at the button they just pressed.
  useEffect(() => {
    const delta = team.score - prevScore.current;
    prevScore.current = team.score;
    if (delta === 0) return;

    flashKey.current += 1;
    setFlash({ key: flashKey.current, delta });
    const timer = window.setTimeout(() => setFlash(null), 900);
    return () => window.clearTimeout(timer);
  }, [team.score]);

  // A destructive control that arms itself should also disarm itself.
  useEffect(() => {
    if (!confirmingRemove) return;
    const timer = window.setTimeout(() => setConfirmingRemove(false), 3500);
    return () => window.clearTimeout(timer);
  }, [confirmingRemove]);

  const handleRemove = () => {
    if (!confirmingRemove) {
      setConfirmingRemove(true);
      return;
    }
    setExiting(true);
    window.setTimeout(() => onRemove(team.id), 240);
  };

  const isLeader = rank === 1 && team.score > 0;
  const fill = maxScore > 0 ? (team.score / maxScore) * 100 : 0;

  const status = (() => {
    if (isLeader) return lead > 0 ? `Líder · +${lead}` : "Líder · empate";
    if (maxScore === 0) return "Sin puntos";
    if (gap === 0) return "Empatado en la punta";
    return `A ${gap} del líder`;
  })();

  return (
    <li
      data-lane-id={team.id}
      className={exiting ? "animate-lane-out" : "animate-lane-in"}
    >
      <article
        className={`relative overflow-hidden rounded-xl border pl-4 transition-colors duration-500 sm:pl-5 ${
          isLeader
            ? "border-gold/35 bg-gradient-to-r from-gold/[0.07] via-surface to-surface"
            : "border-line bg-surface/70 hover:border-line-2"
        }`}
      >
        {/* Lane marker — the team color lives here instead of on a loose dot */}
        <span
          aria-hidden="true"
          className="absolute inset-y-0 left-0 w-[3px]"
          style={{ backgroundColor: team.color }}
        />

        <div className="py-3 pr-3 sm:py-3.5 sm:pr-4">
          {/* ── Identity + score ── */}
          <div className="flex items-center gap-3 sm:gap-4">
            <span
              className={`numerals shrink-0 text-base font-medium tabular-nums sm:text-lg ${
                isLeader ? "text-gold" : "text-text-faint"
              }`}
              aria-hidden="true"
            >
              {String(rank).padStart(2, "0")}
            </span>

            <h3 className="min-w-0 flex-1 truncate font-display text-base font-semibold tracking-[-0.01em] text-text uppercase sm:text-lg">
              {team.name}
            </h3>

            <div className="relative shrink-0 text-right">
              {flash && (
                <span
                  key={flash.key}
                  aria-hidden="true"
                  className={`numerals animate-rise-up pointer-events-none absolute -top-1 right-0 text-sm font-bold ${
                    flash.delta > 0 ? "text-signal" : "text-danger"
                  }`}
                >
                  {flash.delta > 0 ? `+${flash.delta}` : flash.delta}
                </span>
              )}
              <span
                className={`numerals block text-3xl leading-none font-semibold tabular-nums transition-colors duration-300 sm:text-4xl ${
                  flash ? "animate-pop" : ""
                } ${isLeader ? "text-gold" : "text-text"}`}
              >
                {team.score}
                <span className="sr-only"> puntos</span>
              </span>
            </div>
          </div>

          {/* ── Track ── */}
          <div
            className="relative mt-2.5 h-[3px] overflow-hidden rounded-full bg-line"
            role="presentation"
          >
            <div
              className="h-full rounded-full transition-[width] duration-700 ease-out"
              style={{
                width: `${fill}%`,
                backgroundColor: isLeader ? "var(--color-gold)" : team.color,
              }}
            />
            {isLeader && (
              <span
                aria-hidden="true"
                className="animate-sweep absolute inset-y-0 left-0 w-1/4 bg-gradient-to-r from-transparent via-white/40 to-transparent"
              />
            )}
          </div>

          {/* ── Status + controls ── */}
          <div className="mt-2.5 flex items-center gap-3">
            <p
              className={`label-xs min-w-0 truncate ${
                isLeader ? "text-gold/80" : "text-text-faint"
              }`}
            >
              {status}
            </p>

            <div className="ml-auto flex items-center gap-1.5">
              <div
                className="flex items-stretch divide-x divide-line rounded-lg border border-line bg-surface-2/70"
                role="group"
                aria-label={`Puntaje de ${team.name}`}
              >
                <ScoreButton
                  amount={-1}
                  accent={team.color}
                  disabled={team.score === 0}
                  onClick={(n) => onAddScore(team.id, n)}
                />
                <ScoreButton
                  amount={1}
                  accent={team.color}
                  onClick={(n) => onAddScore(team.id, n)}
                />
                <ScoreButton
                  amount={2}
                  accent={team.color}
                  onClick={(n) => onAddScore(team.id, n)}
                />
                <ScoreButton
                  amount={3}
                  accent={team.color}
                  onClick={(n) => onAddScore(team.id, n)}
                />
                <CustomScore
                  teamName={team.name}
                  accent={team.color}
                  onAdd={(n) => onAddScore(team.id, n)}
                />
              </div>

              <button
                type="button"
                onClick={handleRemove}
                onBlur={() => setConfirmingRemove(false)}
                className={`inline-flex h-8 shrink-0 cursor-pointer items-center gap-1.5 rounded-lg px-2 transition-all duration-200 ${
                  confirmingRemove
                    ? "bg-danger/15 text-danger"
                    : "text-text-faint hover:bg-danger/10 hover:text-danger"
                }`}
                aria-label={
                  confirmingRemove
                    ? `Confirmar eliminación de ${team.name}`
                    : `Eliminar equipo ${team.name}`
                }
              >
                {confirmingRemove ? (
                  <span className="label-xs">Eliminar</span>
                ) : (
                  <svg
                    className="h-4 w-4"
                    viewBox="0 0 16 16"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.4"
                    aria-hidden="true"
                  >
                    <path
                      d="M2.5 4.2h11M6 4.2V2.9c0-.7.6-1.3 1.3-1.3h1.4c.7 0 1.3.6 1.3 1.3v1.3m2 0v9.2c0 .7-.6 1.3-1.3 1.3H5.3c-.7 0-1.3-.6-1.3-1.3V4.2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                )}
              </button>
            </div>
          </div>
        </div>
      </article>
    </li>
  );
}
