import type { ReactNode } from "react";
import { BackButton } from "./back-button";

/** Topo simples: voltar, título central e ação opcional à direita. */
export function PageHeader({
  title,
  backHref,
  action,
  titleAs: Title = "h1",
}: {
  title: string;
  backHref: string;
  action?: ReactNode;
  /** Use "p" quando a página já tem o próprio h1. */
  titleAs?: "h1" | "p";
}) {
  return (
    <header className="grid grid-cols-[1fr_auto_1fr] items-center px-5 pt-6">
      <BackButton fallbackHref={backHref} variant="light" />
      <Title className="text-sm leading-normal font-bold text-ink">{title}</Title>
      <div className="justify-self-end">{action}</div>
    </header>
  );
}
