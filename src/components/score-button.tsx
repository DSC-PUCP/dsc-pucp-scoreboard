"use client";

import { useState } from "react";

interface ScoreButtonProps {
  /** Signed delta. Negative amounts render in the danger register. */
  amount: number;
  onClick: (amount: number) => void;
  /** Team accent, used for the hover tint so the control belongs to its lane. */
  accent: string;
  disabled?: boolean;
}

/**
 * A single segment of the scoring control. Deliberately borderless — the
 * surrounding group owns the frame and the dividers.
 */
export default function ScoreButton({
  amount,
  onClick,
  accent,
  disabled = false,
}: ScoreButtonProps) {
  const [animating, setAnimating] = useState(false);
  const subtracts = amount < 0;

  const handleClick = () => {
    setAnimating(true);
    onClick(amount);
    window.setTimeout(() => setAnimating(false), 320);
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={disabled}
      style={{ "--accent": accent } as React.CSSProperties}
      className={`numerals cursor-pointer px-3 py-2 text-sm leading-none font-medium select-none first:rounded-l-[7px] sm:px-3.5 ${
        subtracts ? "chip-danger text-text-faint" : "chip-accent text-text-dim"
      } ${animating ? "animate-pop" : ""}`}
      aria-label={`${subtracts ? "Restar" : "Sumar"} ${Math.abs(amount)} ${
        Math.abs(amount) === 1 ? "punto" : "puntos"
      }`}
    >
      {/* U+2212 minus, not a hyphen — it aligns with the tabular figures */}
      {subtracts ? `−${Math.abs(amount)}` : `+${amount}`}
    </button>
  );
}
