"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { BottomNav } from "../_components/bottom-nav";
import { cn, primaryButtonMd, textLink } from "../_components/ui";
import { tag } from "../agenda/_components/step";
import { COURSE_RADAR, LEVELS, USER, type HomeState } from "./data";
import { TrendChart } from "./trend-chart";

const overline = "text-[10px] leading-none font-bold tracking-[1.5px] uppercase";
const sectionTitle = "font-display text-base leading-[1.2] font-bold text-ink";

function greeting(date: Date) {
  const h = date.getHours();
  return h < 12 ? "Bom dia" : h < 18 ? "Boa tarde" : "Boa noite";
}

const HELP = [
  // TODO: pausa guiada e agendamento com a DASU.
  { icon: "/figma/home/icon-wind.svg", title: "Pausa", hint: "2 min" },
  { icon: "/figma/home/icon-chat.svg", title: "DASU", hint: "Conversar" },
  { icon: "/figma/home/icon-phone-22.svg", title: "CVV 188", hint: "24 horas", href: "tel:188" },
];

export function HomeView({ state }: { state: HomeState }) {
  const [actionDismissed, setActionDismissed] = useState(false);
  const { action } = state;
  const level = LEVELS[state.level];

  return (
    <>
      <div className="flex flex-1 flex-col gap-5 px-5 pt-6 pb-4">
        <header className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Image src="/figma/home/marca-30.svg" alt="" width={30} height={30} />
            <span className="font-display text-[22px] leading-[1.3] font-bold text-ink">
              bússola
            </span>
          </div>
          <div className="flex items-center gap-2.5">
            <Link
              href="/notificacoes"
              aria-label="Notificações"
              className="flex size-10 items-center justify-center rounded-full border border-line hover:bg-surface-muted focus-visible:outline-2 focus-visible:outline-brand"
            >
              <Image src="/figma/home/icon-bell.svg" alt="" width={20} height={20} />
            </Link>
            {/* TODO: perfil */}
            <button
              type="button"
              aria-label="Perfil"
              className="flex size-10 items-center justify-center rounded-full bg-azure-100 font-display text-base leading-[1.2] font-bold text-brand-ink"
            >
              {USER.initials}
            </button>
          </div>
        </header>

        <section className="flex flex-col gap-1.5">
          <p suppressHydrationWarning className="text-base leading-normal text-ink-2">
            {greeting(new Date())}, {USER.name}
          </p>
          <h1 className="font-display text-2xl leading-[1.3] font-bold text-ink">
            {state.headline}
          </h1>
        </section>

        {!actionDismissed && (
          <section
            aria-labelledby="proxima-acao"
            className="flex flex-col gap-2.5 rounded-[22px] border border-brand-line bg-brand-soft p-[18px]"
          >
            <p className={cn(overline, "text-brand-ink")}>Sua próxima ação</p>
            <div className="flex items-center gap-3">
              <span className="flex size-11 shrink-0 items-center justify-center rounded-full bg-surface">
                <Image src={action.icon} alt="" width={22} height={22} />
              </span>
              <div className="flex flex-1 flex-col gap-0.5">
                <h2 id="proxima-acao" className="font-display text-xl leading-[1.2] font-bold text-ink">
                  {action.title}
                </h2>
                <p className="text-xs leading-normal text-ink-3">{action.meta}</p>
              </div>
            </div>
            <p className="text-sm leading-normal text-ink-2">{action.body}</p>
            <div className="flex items-center gap-3">
              {action.primary.href ? (
                <Link href={action.primary.href} className={cn(primaryButtonMd, "flex-1")}>
                  {action.primary.label}
                </Link>
              ) : (
                <button type="button" className={cn(primaryButtonMd, "flex-1")}>
                  {action.primary.label}
                </button>
              )}
              <button
                type="button"
                onClick={() => setActionDismissed(true)}
                className={textLink}
              >
                {action.dismissLabel}
              </button>
            </div>
          </section>
        )}

        <section className="flex flex-col gap-3 rounded-[20px] border border-line p-4">
          <div className="flex items-center justify-between">
            <h2 className={sectionTitle}>Seu check-in</h2>
            <span className={cn(tag, "uppercase", level.chip)}>{level.label}</span>
          </div>
          <p className="text-sm leading-normal text-ink-2">{state.summary}</p>
          <TrendChart points={state.trend} />
          {state.nextCheckin && (
            <div className="flex items-center gap-2 rounded-xl bg-surface-muted px-3 py-2.5">
              <Image src="/figma/home/icon-clock-16.svg" alt="" width={16} height={16} />
              <p className="flex-1 text-xs leading-normal text-ink-2">{state.nextCheckin}</p>
              <Link href="/check-in" className={textLink}>
                Refazer agora
              </Link>
            </div>
          )}
        </section>

        <section className="flex items-start gap-3 rounded-[20px] border border-line p-4">
          <span className="flex size-11 shrink-0 items-center justify-center rounded-full bg-amber-50">
            <Image src="/figma/home/icon-book-stack.svg" alt="" width={22} height={22} />
          </span>
          <div className="flex flex-1 flex-col gap-1">
            <p className={cn(overline, "text-ink-3")}>No radar do seu curso</p>
            <h2 className={sectionTitle}>{COURSE_RADAR.title}</h2>
            <p className="text-xs leading-normal text-ink-2">{COURSE_RADAR.body}</p>
            <Link href="/rotina/planejar" className={cn(textLink, "self-start")}>
              Planejar agora
            </Link>
          </div>
        </section>

        <section id="apoio" aria-labelledby="apoio-titulo" className="flex scroll-mt-4 flex-col gap-2.5">
          <h2 id="apoio-titulo" className={sectionTitle}>
            Se precisar de mais
          </h2>
          <div className="flex gap-2">
            {HELP.map((h) => {
              const content = (
                <>
                  <Image src={h.icon} alt="" width={22} height={22} />
                  <span className="text-sm leading-normal font-bold text-ink">{h.title}</span>
                  <span className="font-display text-[11px] leading-[1.2] font-medium text-ink-3">
                    {h.hint}
                  </span>
                </>
              );
              const className =
                "flex min-w-0 flex-1 flex-col items-center gap-1.5 rounded-2xl border border-line px-2 py-3 transition hover:bg-surface-muted focus-visible:outline-2 focus-visible:outline-brand";
              return h.href ? (
                <a key={h.title} href={h.href} className={className}>
                  {content}
                </a>
              ) : (
                <button key={h.title} type="button" className={className}>
                  {content}
                </button>
              );
            })}
          </div>
        </section>

        {state.fromMural && (
          // TODO: história completa no Mural.
          <button type="button" className="flex items-center gap-3 rounded-xl text-left focus-visible:outline-2 focus-visible:outline-brand">
            <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-azure-100 font-display text-xs leading-none font-bold text-brand-ink">
              JU
            </span>
            <span className="flex flex-1 flex-col gap-0.5">
              <span className="font-display text-[11px] leading-[1.2] font-medium text-ink-3">
                Do mural
              </span>
              <span className="text-sm leading-normal font-bold text-ink">
                &ldquo;{state.fromMural}&rdquo;
              </span>
            </span>
            <Image src="/figma/icon-chev.svg" alt="" width={18} height={18} />
          </button>
        )}
      </div>

      <BottomNav active="Hoje" />
    </>
  );
}
