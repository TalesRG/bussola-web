"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useAppState } from "../../_lib/state";
import { PageHeader } from "../../_components/page-header";
import { Switch } from "../../_components/switch";
import { cn, primaryButton, textLink } from "../../_components/ui";
import { StepFooter, tag } from "../../agenda/_components/step";
import {
  BASE_HOURS,
  CHANGES,
  WEEK_DAYS,
  WEEK_DAY_NAMES,
  WEEK_LABEL,
  WEEK_LIMIT,
  formatDuration,
  formatHours,
  hoursAfter,
} from "../_lib/week";

const PX_PER_HOUR = 16;
const DAY_LABEL = 13;
const GAP = 6;

// Q08 · Reorganizar a semana (vem de: sinais de alerta → "Reorganizar a semana")
export default function ReorganizarSemana() {
  const router = useRouter();
  const { weekPlan, setWeekPlan, rhythm } = useAppState();
  const { selected } = weekPlan;
  const after = hoursAfter(selected);

  const total = (hours: number[]) => hours.reduce((a, b) => a + b, 0);
  const stillOver = after.some((h) => h > WEEK_LIMIT);
  const drops = BASE_HOURS.flatMap((before, d) =>
    before > WEEK_LIMIT && after[d] < before
      ? [`${WEEK_DAY_NAMES[d]} cai de ${formatHours(before)} para ${formatHours(after[d])}.`]
      : [],
  );
  const totalNote =
    total(after) === total(BASE_HOURS)
      ? `Total da semana continua ${formatHours(total(BASE_HOURS))}.`
      : `Total da semana: ${formatHours(total(after))}; o resto vai para a próxima semana.`;

  function toggle(id: string) {
    setWeekPlan((p) => ({
      ...p,
      selected: p.selected.includes(id)
        ? p.selected.filter((s) => s !== id)
        : [...p.selected, id],
    }));
  }

  function apply() {
    setWeekPlan((p) => ({ ...p, applied: p.selected }));
    router.push("/semana/reorganizada");
  }

  return (
    <>
      <PageHeader title="Reorganizar a semana" titleAs="p" backHref="/home" />

      <div className="flex flex-1 flex-col gap-[22px] p-5">
        <section className="flex flex-col items-start gap-2">
          <span className={cn(tag, "bg-amber-50 text-amber-800 uppercase")}>{WEEK_LABEL}</span>
          <h1 className="font-display text-[32px] leading-[38px] font-bold text-ink">
            Vamos deixar sua semana mais leve
          </h1>
          <p className="text-base leading-normal text-ink-2">
            Sugerimos 2 mudanças para nenhum dia passar do limite saudável de{" "}
            {WEEK_LIMIT}h de estudo. Você decide o que aplicar.
          </p>
        </section>

        <section className="flex flex-col gap-3.5 rounded-[20px] border border-line p-[18px]">
          <div className="flex items-center justify-between">
            <h2 className="font-display text-base leading-[1.2] font-bold text-ink">Horas por dia</h2>
            <div className="flex items-center gap-3 font-display text-[11px] leading-[1.2] font-medium text-ink-3">
              <span className="flex items-center gap-1.5">
                <span className="size-2.5 rounded-[3px] border border-line-muted bg-subtle" />
                Antes
              </span>
              <span className="flex items-center gap-1.5">
                <span className="size-2.5 rounded-[3px] bg-brand" />
                Depois
              </span>
            </div>
          </div>

          <div
            role="img"
            aria-label={WEEK_DAYS.map(
              (d, i) => `${d}: ${formatHours(BASE_HOURS[i])} antes, ${formatHours(after[i])} depois`,
            ).join("; ")}
            className="relative flex h-[150px] items-end gap-2"
          >
            {WEEK_DAYS.map((day, i) => {
              const over = BASE_HOURS[i] > WEEK_LIMIT;
              return (
                <div key={day} className="flex min-w-0 flex-1 flex-col items-center gap-1.5">
                  <span className="font-display text-xs leading-none font-bold text-ink">
                    {formatHours(after[i])}
                  </span>
                  <div className="flex items-end gap-1">
                    <div
                      className={cn(
                        "w-[18px] rounded-t-md rounded-b-[2px] border border-dashed",
                        over ? "border-amber-500 bg-amber-100" : "border-line-muted bg-subtle",
                      )}
                      style={{ height: BASE_HOURS[i] * PX_PER_HOUR }}
                    />
                    <div
                      className="w-[18px] rounded-t-md rounded-b-[2px] bg-brand transition-[height]"
                      style={{ height: after[i] * PX_PER_HOUR }}
                    />
                  </div>
                  <span
                    className={cn(
                      "font-display text-[11px] leading-[1.2] font-medium",
                      over ? "text-amber-800" : "text-ink-3",
                    )}
                  >
                    {day}
                  </span>
                </div>
              );
            })}
            <Image
              src="/figma/quiz/limite.svg"
              alt=""
              width={312}
              height={1}
              className="pointer-events-none absolute left-0 h-px w-full"
              style={{ bottom: DAY_LABEL + GAP + WEEK_LIMIT * PX_PER_HOUR }}
            />
          </div>

          <p className="flex items-center gap-2 text-xs leading-normal text-ink-2">
            <Image
              src={stillOver ? "/figma/agenda/icon-warning-16.svg" : "/figma/agenda/icon-check-dark-16.svg"}
              alt=""
              width={16}
              height={16}
              className="shrink-0"
            />
            {[...drops, totalNote].join(" ")}
          </p>
        </section>

        <section className="flex flex-col gap-3">
          <h2 className="font-display text-xl leading-[1.2] font-bold text-ink">Mudanças sugeridas</h2>
          {CHANGES.map((c) => {
            const on = selected.includes(c.id);
            return (
              <label
                key={c.id}
                className={cn(
                  "flex cursor-pointer items-start gap-3 rounded-[18px] border p-4 transition",
                  on ? "border-brand-line bg-brand-soft" : "border-line bg-surface hover:border-line-muted",
                )}
              >
                <input
                  type="checkbox"
                  checked={on}
                  onChange={() => toggle(c.id)}
                  className="peer sr-only"
                />
                <span
                  className={cn(
                    "flex size-6 shrink-0 items-center justify-center rounded-lg peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-brand",
                    on ? "bg-brand" : "border-2 border-line-muted bg-surface",
                  )}
                >
                  {on && <Image src="/figma/icon-check-checkbox.svg" alt="" width={16} height={16} />}
                </span>
                <span className="flex min-w-0 flex-1 flex-col items-start gap-2">
                  <span className="flex w-full items-center justify-between gap-2">
                    <span className="text-sm leading-normal font-bold text-ink">{c.title}</span>
                    <span className={cn(tag, "border border-line bg-surface text-ink-2")}>
                      {formatDuration(c.hours)}
                    </span>
                  </span>
                  <span className="flex items-center gap-1.5" aria-label={`De ${WEEK_DAY_NAMES[c.from]} para ${c.toLabel}`}>
                    <span className={cn(tag, "bg-subtle text-ink-2")}>{WEEK_DAYS[c.from]}</span>
                    <Image src="/figma/quiz/icon-chev-16.svg" alt="" width={16} height={16} />
                    <span className={cn(tag, on ? "bg-brand text-white" : "bg-subtle text-ink-2")}>
                      {c.toLabel}
                    </span>
                  </span>
                  <span className="text-xs leading-normal text-ink-3">{c.reason}</span>
                  {c.needsProfessor && (
                    // TODO: montar a mensagem para o professor.
                    <button type="button" className={cn(textLink, "flex items-center gap-1.5")}>
                      <Image src="/figma/agenda/icon-page-edit-16.svg" alt="" width={16} height={16} />
                      Pedir mais prazo ao professor
                    </button>
                  )}
                </span>
              </label>
            );
          })}
        </section>

        <section className="flex flex-col gap-3.5 rounded-[18px] border border-line p-4">
          <h2 className="font-display text-base leading-[1.2] font-bold text-ink">Proteger seu descanso</h2>
          <div className="flex items-center gap-3">
            <div className="flex flex-1 flex-col gap-0.5 leading-normal">
              <p className="text-sm font-bold text-ink">
                Sem estudo depois das {rhythm.shutdown.replace(":00", "h")}
              </p>
              <p className="text-xs text-ink-3">Blocos novos não serão marcados à noite</p>
            </div>
            <Switch
              label="Sem estudo à noite"
              checked={weekPlan.protectNight}
              onChange={(v) => setWeekPlan((p) => ({ ...p, protectNight: v }))}
            />
          </div>
          <div className="flex items-center gap-3">
            <div className="flex flex-1 flex-col gap-0.5 leading-normal">
              <p className="text-sm font-bold text-ink">Pausa de 10 min a cada 1h30</p>
              <p className="text-xs text-ink-3">Com lembrete da pausa guiada</p>
            </div>
            <Switch
              label="Pausa de 10 min a cada 1h30"
              checked={weekPlan.breakReminder}
              onChange={(v) => setWeekPlan((p) => ({ ...p, breakReminder: v }))}
            />
          </div>
        </section>
      </div>

      <StepFooter className="gap-2.5 pt-3.5">
        <div className="flex items-center gap-2 text-xs leading-normal">
          <Image
            src={stillOver ? "/figma/agenda/icon-warning-16.svg" : "/figma/agenda/icon-check-dark-16.svg"}
            alt=""
            width={16}
            height={16}
          />
          <span className="flex-1 text-ink-2">
            {stillOver ? `Ainda há dias acima de ${WEEK_LIMIT}h` : `Nenhum dia acima de ${WEEK_LIMIT}h`}
          </span>
          <span className="font-display leading-none font-bold text-ink-3">
            {selected.length} de {CHANGES.length} selecionadas
          </span>
        </div>
        <button type="button" onClick={apply} disabled={selected.length === 0} className={primaryButton}>
          Aplicar {selected.length} {selected.length === 1 ? "mudança" : "mudanças"}
        </button>
        {/* TODO: edição manual da semana. */}
        <button type="button" className={cn(textLink, "self-center py-1")}>
          Ajustar manualmente
        </button>
      </StepFooter>
    </>
  );
}
