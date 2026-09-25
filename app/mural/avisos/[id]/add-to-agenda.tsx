"use client";

import { cn, secondaryButtonLg } from "../../../_components/ui";
import { Icon } from "../../_components/ui";
import { useMural } from "../../_lib/state";

export function AddToAgenda({ id }: { id: string }) {
  const { inAgenda, addToAgenda } = useMural();
  const added = inAgenda.includes(id);
  return (
    <button
      type="button"
      disabled={added}
      onClick={() => addToAgenda(id)}
      className={cn(secondaryButtonLg, "w-full disabled:opacity-60")}
    >
      <Icon src="/figma/mural/cal-brand-18.svg" size={18} />
      {added ? "Prazo na sua agenda" : "Adicionar prazo à agenda"}
    </button>
  );
}
