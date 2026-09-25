"use client";

import Image from "next/image";
import Link from "next/link";
import { cn, primaryButton, textLink } from "../../_components/ui";
import {
  BLOCK_HOURS,
  GRID_HOURS,
  MEALS_AND_BREAKS_HOURS,
  SLEEP_ROW,
  TRAJETO,
  TRAJETO_HOURS_PER_BLOCK,
  WEEKDAY_NAMES,
  swatchOf,
} from "../_lib/data";
import { cellKey, useAppState } from "@/app/_lib/state";
import { StepContent, StepFooter } from "../_components/step";

const WEEKDAYS_COUNT = 5;
const WINDOW_HOURS = WEEKDAYS_COUNT * (GRID_HOURS[SLEEP_ROW] - GRID_HOURS[0]);

// A05 · Agenda pronta
export default function AgendaPronta() {
  const { cells, categories, classCells } = useAppState();

  // Horas por categoria de segunda a sexta, das 6h às 22h.
  const busyByDay = Array(WEEKDAYS_COUNT).fill(0);
  const hours: Record<string, number> = {};
  let classHours = 0;
  for (let day = 0; day < WEEKDAYS_COUNT; day++) {
    for (let row = 0; row < SLEEP_ROW; row++) {
      const key = cellKey(day, row);
      if (classCells.has(key)) {
        classHours += BLOCK_HOURS;
        busyByDay[day] += BLOCK_HOURS;
      } else if (cells[key]) {
        const h = cells[key] === TRAJETO ? TRAJETO_HOURS_PER_BLOCK : BLOCK_HOURS;
        hours[cells[key]] = (hours[cells[key]] ?? 0) + h;
        busyByDay[day] += h;
      }
    }
  }
  const committed =
    classHours + Object.values(hours).reduce((a, b) => a + b, 0);
  const breaks = Math.min(MEALS_AND_BREAKS_HOURS, WINDOW_HOURS - committed);
  const free = WINDOW_HOURS - committed - breaks;

  const segments = [
    { name: "Aulas", hours: classHours, swatch: "bg-line-muted" },
    ...categories
      .filter((c) => hours[c])
      .map((c) => ({ name: c, hours: hours[c], swatch: swatchOf(c) })),
    { name: "Livre", hours: free, swatch: "bg-brand" },
    { name: "Refeições e pausas", hours: breaks, swatch: "bg-subtle" },
  ];

  const busiest = busyByDay
    .map((h, day) => ({ h, day }))
    .sort((a, b) => b.h - a.h)
    .slice(0, 2)
    .sort((a, b) => a.day - b.day);
  const busyDaysHaveClassAndInternship = busiest.every(({ day }) =>
    [...Array(SLEEP_ROW).keys()].some((r) => classCells.has(cellKey(day, r))) &&
    [...Array(SLEEP_ROW).keys()].some((r) => cells[cellKey(day, r)] === "Estágio"),
  );

  return (
    <>
      <StepContent className="gap-[22px] pt-12">
        <div className="flex flex-col items-center gap-2.5 text-center">
          <div className="flex size-[88px] items-center justify-center rounded-full bg-brand-soft">
            <div className="flex size-14 items-center justify-center rounded-full bg-brand">
              <Image src="/figma/agenda/icon-check-white-28.svg" alt="" width={28} height={28} />
            </div>
          </div>
          <h1 className="font-display text-[32px] leading-[38px] font-bold text-ink">
            Sua agenda está pronta
          </h1>
          <p className="text-base leading-normal text-ink-2">
            Das 6h às 22h, de segunda a sexta, é assim que seu tempo se divide:
          </p>
        </div>

        <section className="flex flex-col gap-3 rounded-[20px] border border-brand-line bg-brand-soft p-[18px]">
          <p className="flex items-end gap-2">
            <span className="font-display text-[32px] leading-[38px] font-bold text-brand-ink">
              {free}h
            </span>
            <span className="text-base leading-normal text-ink-2">
              livres para estudar
            </span>
          </p>
          <div aria-hidden className="flex h-3.5 gap-0.5 overflow-hidden rounded-full">
            {segments
              .filter((s) => s.hours > 0)
              .map((s) => (
                <div key={s.name} className={s.swatch} style={{ flexGrow: s.hours }} />
              ))}
          </div>
          <ul className="flex flex-col gap-1.5">
            {segments.map((s) => (
              <li key={s.name} className="flex items-center gap-2">
                <span className={cn("size-2.5 rounded-[3px]", s.swatch)} />
                <span className="flex-1 text-xs leading-normal text-ink-2">{s.name}</span>
                <span className="font-display text-xs leading-none font-bold text-ink">
                  {s.hours}h
                </span>
              </li>
            ))}
          </ul>
        </section>

        {busiest[0]?.h > 0 && (
          <div className="flex items-start gap-3 rounded-2xl bg-amber-50 p-3.5">
            <Image src="/figma/agenda/icon-warning-amber-20.svg" alt="" width={20} height={20} className="shrink-0" />
            <div className="flex flex-1 flex-col gap-0.5 leading-normal">
              <p className="text-sm font-bold text-ink">
                {WEEKDAY_NAMES[busiest[0].day]} e{" "}
                {WEEKDAY_NAMES[busiest[1].day].toLowerCase()} são seus dias
                mais cheios
              </p>
              <p className="text-xs text-ink-2">
                {busyDaysHaveClassAndInternship && "Aula de manhã e estágio à tarde. "}
                Vamos evitar blocos longos de estudo nesses dias.
              </p>
            </div>
          </div>
        )}
      </StepContent>

      <StepFooter className="gap-2">
        <Link href="/agenda/check-in" className={primaryButton}>
          Continuar
        </Link>
        {/* TODO: tela da agenda completa. */}
        <button type="button" className={`${textLink} self-center py-1`}>
          Ver agenda completa
        </button>
      </StepFooter>
    </>
  );
}
