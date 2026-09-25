"use client";

import { cn } from "../../_components/ui";
import { useMural } from "../_lib/state";
import { Icon } from "./ui";

/** Botão redondo do topo que salva a história ou o aviso aberto. */
export function SaveButton({
  id,
  icon,
  label,
  iconSize = 20,
}: {
  id: string;
  icon: string;
  label: string;
  iconSize?: 18 | 20;
}) {
  const { saved, toggleSaved } = useMural();
  const pressed = saved.includes(id);
  return (
    <button
      type="button"
      aria-label={label}
      aria-pressed={pressed}
      onClick={() => toggleSaved(id)}
      className={cn(
        "flex size-10 items-center justify-center rounded-full border transition focus-visible:outline-2 focus-visible:outline-brand",
        pressed ? "border-brand-line bg-brand-soft" : "border-line hover:bg-surface-muted",
      )}
    >
      <Icon src={icon} size={iconSize} />
    </button>
  );
}
