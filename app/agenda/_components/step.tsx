import type { ReactNode } from "react";
import { BackButton } from "../../_components/back-button";
import { cn } from "../../_components/ui";

/** Topo dos passos: voltar, rótulo central e barra de progresso segmentada. */
export function StepHeader({
  backHref,
  label,
  total,
  done = 0,
  pendingTint = false,
  action,
}: {
  backHref: string;
  label: string;
  /** Sem `total`, o topo não mostra a barra de progresso. */
  total?: number;
  done?: number;
  /** Segmentos restantes em azul claro em vez de cinza (A05b). */
  pendingTint?: boolean;
  action?: ReactNode;
}) {
  return (
    <header className="flex flex-col gap-3.5 px-5 pt-6">
      <div className="grid grid-cols-[1fr_auto_1fr] items-center">
        <BackButton fallbackHref={backHref} variant="light" />
        <p className="font-display text-xs leading-none font-bold text-ink-3">
          {label}
        </p>
        <div className="justify-self-end">{action}</div>
      </div>
      {total !== undefined && (
      <div
        role="progressbar"
        aria-valuemin={0}
        aria-valuemax={total}
        aria-valuenow={done}
        aria-label={label}
        className="flex gap-1"
      >
        {Array.from({ length: total }, (_, i) => (
          <div
            key={i}
            className={cn(
              "h-1.5 flex-1 rounded-full",
              i < done ? "bg-brand" : pendingTint ? "bg-brand-line" : "bg-subtle",
            )}
          />
        ))}
      </div>
      )}
    </header>
  );
}

export function StepContent({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("flex flex-1 flex-col gap-5 p-5", className)}>
      {children}
    </div>
  );
}

export function StepTitle({
  title,
  children,
  className,
}: {
  title: string;
  children?: ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("flex flex-col gap-2", className)}>
      <h1 className="font-display text-[32px] leading-[38px] font-bold text-ink">
        {title}
      </h1>
      {children && (
        <p className="text-base leading-normal text-ink-2">{children}</p>
      )}
    </div>
  );
}

/** Rodapé fixo com a ação principal. */
export function StepFooter({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <footer
      className={cn(
        "sticky bottom-0 flex flex-col border-t border-subtle bg-surface px-5 pt-3 pb-6",
        className,
      )}
    >
      {children}
    </footer>
  );
}

export function Overline({
  children,
  tone = "brand",
}: {
  children: ReactNode;
  tone?: "brand" | "muted";
}) {
  return (
    <p
      className={cn(
        "text-[10px] leading-none font-bold tracking-[1.5px] uppercase",
        tone === "brand" ? "text-brand-ink" : "text-ink-3",
      )}
    >
      {children}
    </p>
  );
}

export const tag =
  "inline-flex items-center justify-center rounded-full px-2.5 py-[5px] font-display text-xs leading-none font-bold";
