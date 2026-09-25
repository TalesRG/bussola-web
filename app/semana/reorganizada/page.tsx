"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAppState } from "../../_lib/state";
import { BackButton } from "../../_components/back-button";
import { cn, primaryButton, textLink } from "../../_components/ui";
import { tag } from "../../agenda/_components/step";
import { CHANGES, WEEK_DAYS, WEEK_LIMIT, formatHours, hoursAfter } from "../_lib/week";

// Q09 · Semana reorganizada (depois de "Aplicar mudanças")
export default function SemanaReorganizada() {
  const router = useRouter();
  const { weekPlan, setWeekPlan } = useAppState();
  const applied = weekPlan.applied;

  function undo() {
    setWeekPlan((p) => ({ ...p, applied: null }));
    router.push("/semana/reorganizar");
  }

  if (!applied) {
    return (
      <div className="flex flex-1 flex-col items-start gap-4 p-5 pt-6">
        <BackButton fallbackHref="/home" variant="light" />
        <h1 className="font-display text-2xl leading-[1.3] font-bold text-ink">
          Nenhuma mudança aplicada
        </h1>
        <Link href="/semana/reorganizar" className={primaryButton}>
          Reorganizar a semana
        </Link>
      </div>
    );
  }

  const hours = hoursAfter(applied);
  const changes = CHANGES.filter((c) => applied.includes(c.id));
  const pendingProfessor = CHANGES.find((c) => c.needsProfessor && !applied.includes(c.id));

  return (
    <>
      <header className="px-5 pt-6">
        <BackButton fallbackHref="/semana/reorganizar" variant="light" />
      </header>

      <div className="flex flex-1 flex-col gap-[22px] px-5 pt-3 pb-6">
        <section className="flex flex-col items-center gap-3 text-center">
          <div className="flex size-24 items-center justify-center rounded-full bg-brand-soft">
            <div className="flex size-[60px] items-center justify-center rounded-full bg-brand">
              <Image src="/figma/quiz/icon-check-white-30.svg" alt="" width={30} height={30} />
            </div>
          </div>
          <h1 className="font-display text-[32px] leading-[38px] font-bold text-ink">
            Pronto! Sua semana ficou mais leve
          </h1>
          <p className="text-base leading-normal text-ink-2">
            Atualizamos sua agenda no app. Nada foi enviado aos professores.
          </p>
        </section>

        <section className="flex flex-col gap-3 rounded-[20px] border border-line p-[18px]">
          <div className="flex items-center justify-between">
            <h2 className="font-display text-base leading-[1.2] font-bold text-ink">Sua nova semana</h2>
            <span className={cn(tag, "bg-subtle text-ink-2")}>limite: {WEEK_LIMIT}h</span>
          </div>
          {WEEK_DAYS.map((day, i) => (
            <div key={day} className="flex items-center gap-3">
              <span className="w-9 text-sm leading-normal font-bold text-ink">{day}</span>
              <div className="h-2 flex-1 overflow-hidden rounded-full bg-subtle">
                <div
                  className={cn("h-full rounded-full", hours[i] > WEEK_LIMIT ? "bg-amber-500" : "bg-brand")}
                  style={{ width: `${Math.min(1, hours[i] / WEEK_LIMIT) * 100}%` }}
                />
              </div>
              <span className="w-10 text-right font-display text-xs leading-none font-bold text-ink-2">
                {formatHours(hours[i])}
              </span>
            </div>
          ))}
        </section>

        <section className="flex flex-col gap-2.5">
          <h2 className="font-display text-base leading-[1.2] font-bold text-ink">O que mudou</h2>
          {changes.map((c) => (
            <div key={c.id} className="flex items-center gap-3 rounded-2xl border border-line p-3.5">
              <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-brand-soft">
                <Image src="/figma/quiz/icon-cal.svg" alt="" width={20} height={20} />
              </span>
              <span className="flex flex-1 flex-col gap-0.5 leading-normal">
                <span className="text-sm font-bold text-ink">{c.title}</span>
                <span className="text-xs text-ink-3">{c.newSlot}</span>
              </span>
            </div>
          ))}
        </section>

        {pendingProfessor && (
          // TODO: montar a mensagem para o professor.
          <button
            type="button"
            className="flex items-center gap-3 rounded-2xl bg-surface-muted p-3.5 text-left hover:bg-subtle"
          >
            <Image src="/figma/quiz/icon-page-edit.svg" alt="" width={20} height={20} />
            <span className="flex flex-1 flex-col gap-0.5 leading-normal">
              <span className="text-sm font-bold text-ink">Ainda quer mais prazo no relatório?</span>
              <span className="text-xs text-ink-3">A gente monta a mensagem; você revisa e envia.</span>
            </span>
            <Image src="/figma/icon-chev.svg" alt="" width={18} height={18} />
          </button>
        )}

        <div className="flex flex-col items-center gap-2.5">
          <Link href="/rotina" className={primaryButton}>
            Ver minha semana
          </Link>
          <button type="button" onClick={undo} className={cn(textLink, "py-1")}>
            Desfazer mudanças
          </button>
        </div>
      </div>
    </>
  );
}
