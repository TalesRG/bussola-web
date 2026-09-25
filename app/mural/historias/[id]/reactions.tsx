"use client";

import { cn } from "../../../_components/ui";
import { caption, heading, Hint, Icon } from "../../_components/ui";
import { REACTIONS, type Reaction } from "../../_lib/data";
import { useMural } from "../../_lib/state";

export function Reactions({
  story,
  base,
}: {
  story: string;
  base: Record<Reaction, number>;
}) {
  const { reactions, toggleReaction } = useMural();
  const mine = reactions[story] ?? [];

  return (
    <section className="flex flex-col gap-3 rounded-[18px] border border-line p-4">
      <h2 className={heading}>Essa história te ajudou?</h2>
      <div className="flex gap-2">
        {REACTIONS.map((r) => {
          const pressed = mine.includes(r.key);
          return (
            <button
              key={r.key}
              type="button"
              aria-pressed={pressed}
              onClick={() => toggleReaction(story, r.key)}
              className={cn(
                "flex min-w-0 flex-1 flex-col items-center justify-center gap-1 rounded-[14px] px-1 py-2.5 transition focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand",
                pressed
                  ? "border-[1.5px] border-brand bg-brand-soft"
                  : "border border-line bg-surface hover:border-line-muted",
              )}
            >
              <Icon src={r.icon} />
              <span
                className={cn(
                  "font-display text-xs leading-none font-bold",
                  pressed ? "text-brand-ink" : "text-ink-2",
                )}
              >
                {r.label}
              </span>
              <span className={caption}>{base[r.key] + (pressed ? 1 : 0)}</span>
            </button>
          );
        })}
      </div>
      <Hint>
        Para proteger quem escreve, as histórias não têm comentários. Os
        agradecimentos chegam de forma anônima.
      </Hint>
    </section>
  );
}
