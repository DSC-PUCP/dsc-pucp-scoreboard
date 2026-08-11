"use client";

import { useTeams } from "@/hooks/use-teams";
import TopBar from "@/components/top-bar";
import AddTeamForm from "@/components/add-team-form";
import EmptyState from "@/components/empty-state";
import Board from "@/components/board";
import StatsPanel from "@/components/stats-panel";
import ResetButton from "@/components/reset-button";

export default function Home() {
  const {
    teams,
    storageReady,
    storageWarning,
    addTeam,
    addScore,
    removeTeam,
    resetAll,
  } = useTeams();

  if (!storageReady) {
    return (
      <div className="flex flex-1 items-center justify-center px-4">
        <div className="flex items-center gap-3">
          <span
            className="h-2 w-2 animate-live rounded-full bg-signal"
            aria-hidden="true"
          />
          <p className="label-xs text-text-dim">Conectando con el marcador</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <TopBar teamCount={teams.length} />

      <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-6 sm:px-6 sm:py-8">
        {storageWarning && (
          <div
            role="status"
            className="mb-6 flex items-start gap-3 rounded-lg border border-danger/30 bg-danger/5 px-4 py-3"
          >
            <svg
              className="mt-0.5 h-4 w-4 shrink-0 text-danger"
              viewBox="0 0 16 16"
              fill="currentColor"
              aria-hidden="true"
            >
              <path
                fillRule="evenodd"
                d="M6.8 1.9a1.4 1.4 0 0 1 2.4 0l5.6 9.7a1.4 1.4 0 0 1-1.2 2.1H2.4a1.4 1.4 0 0 1-1.2-2.1l5.6-9.7ZM8 5a.7.7 0 0 1 .7.7v3a.7.7 0 0 1-1.4 0v-3A.7.7 0 0 1 8 5Zm0 7a.9.9 0 1 0 0-1.8A.9.9 0 0 0 8 12Z"
                clipRule="evenodd"
              />
            </svg>
            <p className="text-xs leading-relaxed text-text-dim">
              <span className="font-semibold text-danger">
                Sin almacenamiento local.
              </span>{" "}
              El marcador funciona igual, pero se perderá al cerrar esta
              pestaña.
            </p>
          </div>
        )}

        <div className="grid grid-cols-1 gap-7 lg:grid-cols-[minmax(0,1fr)_17rem] lg:grid-rows-[auto_1fr] lg:items-start lg:gap-x-10 lg:gap-y-6">
          <div className="lg:col-start-2 lg:row-start-1">
            <AddTeamForm onAdd={addTeam} teamCount={teams.length} />
          </div>

          <div className="min-w-0 lg:col-start-1 lg:row-span-2 lg:row-start-1">
            {teams.length === 0 ? (
              <EmptyState />
            ) : (
              <Board
                teams={teams}
                onAddScore={addScore}
                onRemove={removeTeam}
              />
            )}
          </div>

          <div className="flex flex-col gap-5 lg:col-start-2 lg:row-start-2">
            <StatsPanel teams={teams} />
            <ResetButton onReset={resetAll} hasTeams={teams.length > 0} />
          </div>
        </div>
      </main>

      <footer className="border-t border-line">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center gap-x-4 gap-y-1 px-4 py-4 sm:px-6">
          <p className="label-xs text-text-faint">
            DSC <span className="text-pucp/80">PUCP</span> · Scoreboard
          </p>
          <p className="ml-auto text-[11px] text-text-faint">
            Los puntajes se guardan en este navegador
          </p>
        </div>
      </footer>
    </>
  );
}
