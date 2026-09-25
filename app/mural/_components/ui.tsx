import Image from "next/image";
import Link from "next/link";
import type { ReactNode } from "react";
import { BackButton } from "../../_components/back-button";
import { cn } from "../../_components/ui";
import { tag } from "../../agenda/_components/step";
import { USER } from "../../home/data";
import type { SourceTone } from "../_lib/data";

export { tag };
export { heading } from "../../rotina/_components/ui";

export const display = "font-display text-[32px] leading-[38px] font-bold text-ink";
export const caption = "font-display text-[11px] leading-[1.2] font-medium text-ink-3";
export const overline = "text-[10px] leading-none font-bold tracking-[1.5px]";
export const card = "rounded-[18px] border border-line";
export const focusRing =
  "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand";

export function Icon({ src, size = 20 }: { src: string; size?: number }) {
  return (
    <Image
      src={src}
      alt=""
      width={size}
      height={size}
      style={{ width: size, height: size }}
      className="shrink-0"
    />
  );
}

export function Avatar({
  initials,
  size,
  strong = false,
}: {
  initials: string;
  size: 32 | 36 | 40 | 44;
  /** Tom mais forte usado no destaque e na história aberta. */
  strong?: boolean;
}) {
  return (
    <span
      aria-hidden
      className={cn(
        "flex shrink-0 items-center justify-center rounded-full font-display leading-none font-bold text-brand-ink",
        strong ? "bg-brand-line" : "bg-azure-100",
        size >= 40 ? "text-base leading-[1.2]" : "text-xs",
      )}
      style={{ width: size, height: size }}
    >
      {initials}
    </span>
  );
}

const SOURCE_TONES: Record<SourceTone, string> = {
  brand: "bg-brand text-white",
  soft: "bg-brand-soft text-brand-ink",
  amber: "bg-amber-50 text-amber-800",
  subtle: "bg-subtle text-ink-2",
};

/** Sigla quadrada de quem publicou o aviso. */
export function SourceBadge({ sigla, tone }: { sigla: string; tone: SourceTone }) {
  return (
    <span
      aria-hidden
      className={cn(
        "flex size-9 shrink-0 items-center justify-center rounded-[10px] font-display text-xs leading-none font-bold",
        SOURCE_TONES[tone],
      )}
    >
      {sigla}
    </span>
  );
}

/** Topo das abas do Mural: título, avatar e seletor Histórias/Vídeos/Avisos. */
export function MuralTop({ active }: { active: "Histórias" | "Vídeos" | "Avisos" }) {
  const tabs = [
    { label: "Histórias", href: "/mural" },
    { label: "Vídeos", href: "/mural/videos" },
    { label: "Avisos", href: "/mural/avisos" },
  ];
  return (
    <>
      <header className="flex items-center justify-between">
        <h1 className="font-display text-[22px] leading-[1.3] font-bold text-ink">
          Mural
        </h1>
        <Avatar initials={USER.initials} size={40} />
      </header>
      <nav
        aria-label="Seções do mural"
        className="flex gap-1 rounded-full bg-subtle p-1"
      >
        {tabs.map((tab) => {
          const current = tab.label === active;
          const className = cn(
            "flex h-10 min-w-0 flex-1 items-center justify-center rounded-full font-display text-sm leading-none font-bold focus-visible:outline-2 focus-visible:outline-brand",
            current ? "border border-line bg-surface text-ink" : "text-ink-2",
          );
          return tab.href ? (
            <Link
              key={tab.label}
              href={tab.href}
              aria-current={current ? "page" : undefined}
              className={className}
            >
              {tab.label}
            </Link>
          ) : (
            <button key={tab.label} type="button" className={className}>
              {tab.label}
            </button>
          );
        })}
      </nav>
    </>
  );
}

export function Intro({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div className="flex flex-col gap-1.5">
      <h2 className={display}>{title}</h2>
      <p className="text-base leading-normal text-ink-2">{children}</p>
    </div>
  );
}

/** Pílulas de filtro de escolha única, roláveis na horizontal. */
export function FilterChips({
  label,
  options,
  value,
  onChange,
  compact = false,
}: {
  label: string;
  options: string[];
  value: string;
  onChange: (value: string) => void;
  compact?: boolean;
}) {
  return (
    <div
      role="radiogroup"
      aria-label={label}
      className="-mx-5 flex gap-2 overflow-x-auto px-5 [scrollbar-width:none]"
    >
      {options.map((option) => {
        const selected = option === value;
        return (
          <button
            key={option}
            type="button"
            role="radio"
            aria-checked={selected}
            onClick={() => onChange(option)}
            className={cn(
              "flex shrink-0 items-center justify-center rounded-full px-3.5 font-display text-sm leading-none font-bold transition focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand",
              compact ? "py-2" : "py-[9px]",
              selected
                ? "border border-brand bg-brand text-white"
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

export function StoryCard({
  tema,
  leitura,
  titulo,
  trecho,
  autor,
  iniciais,
  ajudou,
  href,
}: {
  tema: string;
  leitura: string;
  titulo: string;
  trecho: string;
  autor: string;
  iniciais: string;
  ajudou: string;
  href?: string;
}) {
  const title = `"${titulo}"`;
  return (
    <article
      className={cn(
        card,
        "relative flex flex-col gap-3 bg-surface p-4",
        href && "transition hover:border-line-muted",
      )}
    >
      <div className="flex items-center justify-between">
        <span className={cn(tag, "bg-brand-soft text-brand-ink")}>{tema}</span>
        <span className={caption}>{leitura}</span>
      </div>
      <h3 className="font-display text-base leading-[1.2] font-bold text-ink">
        {href ? (
          <Link
            href={href}
            className="rounded-[18px] after:absolute after:inset-0 after:rounded-[18px] focus-visible:outline-none focus-visible:after:outline-2 focus-visible:after:outline-brand"
          >
            {title}
          </Link>
        ) : (
          title
        )}
      </h3>
      <p className="text-sm leading-normal text-ink-2">{trecho}</p>
      <div className="flex items-center gap-2.5">
        <Avatar initials={iniciais} size={32} />
        <div className="flex min-w-0 flex-1 flex-col">
          <span className="text-xs leading-normal text-ink">{autor}</span>
          <span className="flex items-center gap-1">
            <Icon src="/figma/mural/heart-12.svg" size={12} />
            <span className={caption}>{ajudou}</span>
          </span>
        </div>
      </div>
    </article>
  );
}

/** Topo do fluxo "Contar minha história": voltar, passo e barra de progresso. */
export function StepTop({
  step,
  backHref,
  action,
}: {
  step: 1 | 2;
  backHref: string;
  action?: ReactNode;
}) {
  return (
    <header className="flex flex-col gap-3.5 px-5 pt-6">
      <div className="grid grid-cols-[1fr_auto_1fr] items-center">
        <BackButton fallbackHref={backHref} variant="light" />
        <p className="font-display text-xs leading-none font-bold text-ink-3">
          Passo {step} de 2
        </p>
        <div className="justify-self-end">{action}</div>
      </div>
      <div
        role="progressbar"
        aria-label="Progresso"
        aria-valuemin={1}
        aria-valuemax={2}
        aria-valuenow={step}
        className="flex gap-1"
      >
        {[1, 2].map((n) => (
          <span
            key={n}
            className={cn(
              "h-1.5 flex-1 rounded-full",
              n <= step ? "bg-brand" : "bg-subtle",
            )}
          />
        ))}
      </div>
    </header>
  );
}

/** Rodapé fixo com a ação principal. */
export function StickyFooter({ children }: { children: ReactNode }) {
  return (
    <div className="sticky bottom-0 mt-auto border-t border-subtle bg-surface px-5 pt-3 pb-6">
      {children}
    </div>
  );
}

/** Nota de rodapé com ícone de aviso. */
export function Hint({
  children,
  icon = "/figma/icon-warning-sm.svg",
  size = 14,
}: {
  children: ReactNode;
  icon?: string;
  size?: 14 | 16;
}) {
  return (
    <p className="flex items-start gap-2 text-xs leading-normal text-ink-3">
      <Icon src={icon} size={size} />
      <span className="flex-1">{children}</span>
    </p>
  );
}

export function CrisisLine() {
  return (
    <a
      href="tel:188"
      className="flex items-center gap-2 text-xs leading-normal text-ink-3 hover:text-ink-2"
    >
      <Icon src="/figma/mural/phone-14.svg" size={14} />
      <span className="flex-1">
        Se algo aqui mexer com você, a DASU e o CVV (188) estão disponíveis.
      </span>
    </a>
  );
}

/** Linha de recurso/serviço com chevron; vira link quando há destino. */
export function ResourceRow({
  leading,
  title,
  sub,
  href,
  className,
}: {
  leading: ReactNode;
  title: string;
  sub: string;
  href?: string;
  className?: string;
}) {
  const content = (
    <>
      {leading}
      <span className="flex min-w-0 flex-1 flex-col gap-0.5 leading-normal">
        <span className="text-sm font-bold text-ink">{title}</span>
        <span className="text-xs text-ink-3">{sub}</span>
      </span>
      <Icon src="/figma/icon-chev.svg" size={18} />
    </>
  );
  const base = cn("flex items-center gap-3 p-3.5", className);
  return href ? (
    <Link href={href} className={cn(base, "transition hover:bg-surface-muted", focusRing)}>
      {content}
    </Link>
  ) : (
    <div className={base}>{content}</div>
  );
}
