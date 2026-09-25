"use client";

import { cn } from "../../../_components/ui";
import { caption, focusRing, Icon } from "../../_components/ui";
import type { Reaction } from "../../_lib/data";
import { useMural } from "../../_lib/state";
import { asset } from "./ui";

const reactions: {
  key: Reaction;
  title: string;
  icon: string;
  count: number;
}[] = [
  { key: "ajudou", title: "Me ajudou", icon: "a29f1", count: 412 },
  { key: "identifiquei", title: "Me identifiquei", icon: "2ccb3", count: 230 },
  { key: "obrigado", title: "Obrigado", icon: "c8096", count: 98 },
];

export function VideoReactions({ id }: { id: string }) {
  const mural = useMural();
  const key = `video:${id}`;
  return (
    <div className="flex gap-2" aria-label="Reações de apoio">
      {reactions.map((reaction) => {
        const active = (mural.reactions[key] ?? []).includes(reaction.key);
        return (
          <button
            key={reaction.key}
            onClick={() => mural.toggleReaction(key, reaction.key)}
            aria-pressed={active}
            className={cn(
              "flex min-w-0 flex-1 flex-col items-center gap-1 rounded-[14px] border px-1 py-2.5",
              active
                ? "border-brand bg-brand-soft text-brand-ink"
                : "border-line text-ink-2",
              focusRing,
            )}
          >
            <Icon src={asset(reaction.icon)} />
            <span className="font-display text-xs leading-none font-bold">
              {reaction.title}
            </span>
            <span className={caption}>
              {reaction.count -
                (id === "marina" && reaction.key === "ajudou" ? 1 : 0) +
                (active ? 1 : 0)}
            </span>
          </button>
        );
      })}
    </div>
  );
}
