"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { Team, TEAM_COLORS } from "@/lib/types";
import { loadTeams, saveTeams, isStorageAvailable } from "@/lib/storage";

export interface UseTeamsReturn {
  teams: Team[];
  storageReady: boolean;
  storageWarning: boolean;
  addTeam: (name: string) => string | null; // returns error message or null
  addScore: (id: string, amount: number) => void;
  removeTeam: (id: string) => void;
  resetAll: () => void;
}

export function useTeams(): UseTeamsReturn {
  const [state, setState] = useState<{
    teams: Team[];
    storageReady: boolean;
    storageWarning: boolean;
  }>({ teams: [], storageReady: false, storageWarning: false });
  const hydrationSettled = useRef(false);

  // Hydrate from localStorage on mount (legitimate external sync — localStorage is a browser API)
  useEffect(() => {
    let teams: Team[] = [];
    let storageWarning = false;

    if (!isStorageAvailable()) {
      storageWarning = true;
    } else {
      teams = loadTeams();
    }

    // eslint-disable-next-line react-hooks/set-state-in-effect -- syncing external browser API on mount
    setState({ teams, storageReady: true, storageWarning });
  }, []);

  const teams = state.teams;
  const storageReady = state.storageReady;
  const storageWarning = state.storageWarning;

  const setTeams = useCallback(
    (updater: Team[] | ((prev: Team[]) => Team[])) => {
      setState((prev) => ({
        ...prev,
        teams: typeof updater === "function" ? updater(prev.teams) : updater,
      }));
    },
    []
  );

  // Persist to localStorage on every change.
  // The first pass after hydration is skipped on purpose: at that point `teams`
  // is exactly what we just read back, and writing during the pre-hydration
  // render would clobber stored teams with the empty initial state.
  useEffect(() => {
    if (!storageReady) return;
    if (!hydrationSettled.current) {
      hydrationSettled.current = true;
      return;
    }
    saveTeams(teams);
  }, [teams, storageReady]);

  const addTeam = useCallback(
    (name: string): string | null => {
      const trimmed = name.trim();
      if (!trimmed) return "El nombre no puede estar vacío";

      const duplicate = teams.some(
        (t) => t.name.toLowerCase() === trimmed.toLowerCase()
      );
      if (duplicate) return "Ya existe un equipo con ese nombre";

      const colorIndex = teams.length % TEAM_COLORS.length;
      const newTeam: Team = {
        id: crypto.randomUUID(),
        name: trimmed,
        score: 0,
        color: TEAM_COLORS[colorIndex],
        createdAt: Date.now(),
      };

      setTeams((prev) => [...prev, newTeam]);
      return null;
    },
    [teams, setTeams]
  );

  const addScore = useCallback(
    (id: string, amount: number) => {
      setTeams((prev) =>
        prev.map((t) =>
          t.id === id ? { ...t, score: Math.max(0, t.score + amount) } : t
        )
      );
    },
    [setTeams]
  );

  const removeTeam = useCallback(
    (id: string) => {
      setTeams((prev) => prev.filter((t) => t.id !== id));
    },
    [setTeams]
  );

  const resetAll = useCallback(() => {
    setTeams((prev) => prev.map((t) => ({ ...t, score: 0 })));
  }, [setTeams]);

  return {
    teams,
    storageReady,
    storageWarning,
    addTeam,
    addScore,
    removeTeam,
    resetAll,
  };
}
