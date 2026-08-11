import { ScoreboardData, Team } from "./types";

const STORAGE_KEY = "dsc-scoreboard-teams";
const CURRENT_VERSION = 1;

function isTeam(value: unknown): value is Team {
  if (!value || typeof value !== "object") return false;
  const t = value as Record<string, unknown>;
  return (
    typeof t.id === "string" &&
    typeof t.name === "string" &&
    typeof t.score === "number" &&
    typeof t.color === "string" &&
    typeof t.createdAt === "number"
  );
}

function isValidData(value: unknown): value is ScoreboardData {
  if (!value || typeof value !== "object") return false;
  const data = value as Record<string, unknown>;
  return (
    data.version === CURRENT_VERSION &&
    Array.isArray(data.teams) &&
    data.teams.every(isTeam)
  );
}

export function loadTeams(): Team[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];

    const parsed: unknown = JSON.parse(raw);
    if (!isValidData(parsed)) {
      // Corrupted or outdated — reset
      localStorage.removeItem(STORAGE_KEY);
      return [];
    }

    return parsed.teams;
  } catch {
    localStorage.removeItem(STORAGE_KEY);
    return [];
  }
}

export function saveTeams(teams: Team[]): void {
  const data: ScoreboardData = {
    version: CURRENT_VERSION,
    teams,
  };
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch {
    // localStorage full or unavailable — silently fail
    console.warn("DSC Scoreboard: could not save teams to localStorage");
  }
}

export function clearTeams(): void {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch {
    // noop
  }
}

export function isStorageAvailable(): boolean {
  try {
    const key = "__dsc_storage_test__";
    localStorage.setItem(key, "1");
    localStorage.removeItem(key);
    return true;
  } catch {
    return false;
  }
}
