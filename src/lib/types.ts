export interface Team {
  id: string;
  name: string;
  score: number;
  color: string;
  createdAt: number;
}

export interface ScoreboardData {
  version: number;
  teams: Team[];
}

/**
 * Team colors read as lane markers against the dark arena canvas, so they are
 * tuned for luminance separation rather than hue variety. The palette stays
 * inside the green→lime→teal arc on purpose: it is the DSC identity, and it
 * leaves gold free to mean one thing only — the leader.
 */
export const TEAM_COLORS = [
  "#35E08A", // signal green
  "#B8F24D", // lime
  "#2DD4BF", // teal
  "#7CE38B", // mint
  "#D9F99D", // chartreuse
  "#14B8A6", // jade
  "#3DDC84", // android green
  "#5BE0C8", // aqua
  "#9AE6B4", // sage
  "#0FA968", // deep emerald
] as const;
