"use client";

import { cn } from "./ui";

/** Grupo de pílulas de escolha única. */
export function ChipGroup({
  label,
  options,
  value,
  onChange,
  allowDeselect = false,
}: {
  label: string;
  options: string[];
  value: string | null;
  onChange: (value: string | null) => void;
  allowDeselect?: boolean;
}) {
  return (
    <div role="radiogroup" aria-label={label} className="flex flex-wrap gap-2">
      {options.map((option) => {
        const selected = option === value;
        return (
          <button
            key={option}
            type="button"
            role="radio"
            aria-checked={selected}
            onClick={() =>
              onChange(selected && allowDeselect ? null : option)
            }
            className={cn(
              "flex items-center justify-center rounded-full px-3.5 py-2 font-display text-sm leading-none font-bold transition focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand",
              selected
                ? "border-[1.5px] border-brand bg-brand-soft text-brand-ink"
                : "border border-line bg-surface text-ink hover:border-line-muted",
            )}
          >
            {option}
          </button>
        );
      })}
    </div>
  );
}
