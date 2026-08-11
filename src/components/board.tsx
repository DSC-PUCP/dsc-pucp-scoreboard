"use client";

import { useLayoutEffect, useMemo, useRef } from "react";
import { Team } from "@/lib/types";
import TeamLane from "./team-lane";

interface BoardProps {
  teams: Team[];
  onAddScore: (id: string, amount: number) => void;
  onRemove: (id: string) => void;
}

export default function Board({ teams, onAddScore, onRemove }: BoardProps) {
  const sorted = useMemo(
    () => [...teams].sort((a, b) => b.score - a.score || a.createdAt - b.createdAt),
    [teams]
  );

  const listRef = useRef<HTMLOListElement>(null);
  const offsets = useRef(new Map<string, number>());

  // FLIP: when a team overtakes another, the lanes slide past each other
  // instead of teleporting. Ranking changes are the whole point of a
  // scoreboard, so they get the one non-trivial animation in the app.
  useLayoutEffect(() => {
    const list = listRef.current;
    if (!list) return;

    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    const next = new Map<string, number>();

    list.querySelectorAll<HTMLElement>("[data-lane-id]").forEach((lane) => {
      const id = lane.dataset.laneId;
      if (!id) return;

      const top = lane.offsetTop;
      next.set(id, top);

      const previous = offsets.current.get(id);
      if (previous === undefined || reduceMotion) return;

      const delta = previous - top;
      if (Math.abs(delta) < 1) return;

      lane.animate(
        [
          { transform: `translateY(${delta}px)` },
          { transform: "translateY(0)" },
        ],
        { duration: 480, easing: "cubic-bezier(0.16, 1, 0.3, 1)" }
      );
    });

    offsets.current = next;
  });

  if (sorted.length === 0) return null;

  const leaderScore = sorted[0].score;
  const runnerUpScore = sorted.length > 1 ? sorted[1].score : 0;
  const lead = leaderScore - runnerUpScore;

  return (
    <section aria-labelledby="board-heading">
      <div className="mb-4 flex items-baseline gap-3 border-b border-line pb-3">
        <h2
          id="board-heading"
          className="font-display text-sm font-semibold tracking-[0.02em] text-text uppercase"
        >
          Tabla de posiciones
        </h2>
        <span className="numerals ml-auto text-xs text-text-faint tabular-nums">
          {sorted.length} {sorted.length === 1 ? "equipo" : "equipos"}
        </span>
      </div>

      <ol ref={listRef} className="relative flex flex-col gap-2.5">
        {sorted.map((team, index) => (
          <TeamLane
            key={team.id}
            team={team}
            rank={index + 1}
            maxScore={leaderScore}
            gap={leaderScore - team.score}
            lead={lead}
            onAddScore={onAddScore}
            onRemove={onRemove}
          />
        ))}
      </ol>
    </section>
  );
}
