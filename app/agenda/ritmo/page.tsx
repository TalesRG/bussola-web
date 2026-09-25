"use client";

import Image from "next/image";
import Link from "next/link";
import type { CSSProperties } from "react";
import { cn, primaryButton } from "../../_components/ui";
import { useAppState, type Rhythm } from "@/app/_lib/state";
import {
  StepContent,
  StepFooter,
  StepHeader,
  StepTitle,
  tag,
} from "../_components/step";
import { Switch } from "@/app/_components/switch";

const PEAKS: { value: Rhythm["peak"]; hint: string }[] = [
  { value: "Manhã", hint: "antes das 12h" },
  { value: "Tarde", hint: "12h às 18h" },
  { value: "Noite", hint: "depois das 18h" },
];

const LIGHT_DAYS = ["S", "T", "Q", "Q", "S", "Sáb", "Dom"];
const LIGHT_DAY_NAMES = ["Segunda", "Terça", "Quarta", "Quinta", "Sexta", "Sábado", "Domingo"];

const MIN_HOURS = 2;
const MAX_HOURS = 8;
const RECOMMENDED_HOURS = 5;

const REMINDERS: { key: keyof Rhythm["reminders"]; label: string }[] = [
  { key: "beforeBlock", label: "15 min antes de cada bloco" },
  { key: "weeklySummary", label: "Resumo da semana no domingo" },
  { key: "heavyWeek", label: "Aviso de semana pesada" },
];

const sectionTitle = "font-display text-base leading-[1.2] font-bold text-ink";

// A04 · Seu ritmo
export default function SeuRitmo() {
  const { rhythm, setRhythm } = useAppState();
  const update = (patch: Partial<Rhythm>) =>
    setRhythm((prev) => ({ ...prev, ...patch }));

  const fill = ((rhythm.maxHours - MIN_HOURS) / (MAX_HOURS - MIN_HOURS)) * 100;

  return (
    <>
      <StepHeader backHref="/agenda/rotina" label="Passo 4 de 4" total={4} done={4} />

      <StepContent className="gap-[22px]">
        <StepTitle title="Qual é o seu ritmo?">
          Usamos isso para sugerir blocos de estudo na hora em que você rende.
        </StepTitle>

        <fieldset className="flex flex-col gap-[22px]">
          <legend className={cn(sectionTitle, "mb-[22px]")}>
            Quando você rende mais?
          </legend>
          <div role="radiogroup" className="flex gap-2">
            {PEAKS.map(({ value, hint }) => {
              const selected = rhythm.peak === value;
              return (
                <button
                  key={value}
                  type="button"
                  role="radio"
                  aria-checked={selected}
                  onClick={() => update({ peak: value })}
                  className={cn(
                    "flex flex-1 flex-col items-center gap-0.5 rounded-2xl px-2 py-3.5 transition focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand",
                    selected
                      ? "border-[1.5px] border-brand bg-brand-soft"
                      : "border border-line bg-surface hover:border-line-muted",
                  )}
                >
                  <span
                    className={cn(
                      "text-sm leading-normal font-bold",
                      selected ? "text-brand-ink" : "text-ink",
                    )}
                  >
                    {value}
                  </span>
                  <span className="font-display text-[11px] leading-[1.2] font-medium text-ink-3">
                    {hint}
                  </span>
                </button>
              );
            })}
          </div>
        </fieldset>

        <div className="flex flex-col gap-2.5">
          <div className="flex items-center justify-between font-display font-bold">
            <label htmlFor="max-horas" className="text-base leading-[1.2] text-ink">
              Estudar no máximo por dia
            </label>
            <output htmlFor="max-horas" className="text-[22px] leading-[1.3] text-brand-ink">
              {rhythm.maxHours}h
            </output>
          </div>
          <input
            id="max-horas"
            type="range"
            min={MIN_HOURS}
            max={MAX_HOURS}
            step={1}
            value={rhythm.maxHours}
            onChange={(e) => update({ maxHours: Number(e.target.value) })}
            aria-valuetext={`${rhythm.maxHours} horas`}
            className="range-slider"
            style={{ "--fill": `${fill}%` } as CSSProperties}
          />
          <div className="flex justify-between font-display text-[11px] leading-[1.2] font-medium text-ink-3">
            <span>{MIN_HOURS}h</span>
            <span>{RECOMMENDED_HOURS}h · recomendado</span>
            <span>{MAX_HOURS}h</span>
          </div>
        </div>

        <label className="flex cursor-pointer items-center gap-3 rounded-[14px] border border-line p-3.5">
          <Image src="/figma/agenda/icon-clock-20.svg" alt="" width={20} height={20} />
          <span className="flex flex-1 flex-col gap-0.5 leading-normal">
            <span className="text-sm font-bold text-ink">Hora de desligar</span>
            <span className="text-xs text-ink-3">Nada de estudo depois disso</span>
          </span>
          <input
            type="time"
            value={rhythm.shutdown}
            onChange={(e) => update({ shutdown: e.target.value })}
            className={`${tag} cursor-pointer bg-brand-soft text-brand-ink outline-none focus-visible:ring-2 focus-visible:ring-brand [&::-webkit-calendar-picker-indicator]:hidden`}
          />
        </label>

        <fieldset className="flex flex-col gap-[22px]">
          <legend className="mb-[22px] flex flex-col gap-0.5">
            <span className={sectionTitle}>Um dia leve por semana</span>
            <span className="text-xs leading-normal text-ink-3">
              Sem blocos de estudo sugeridos
            </span>
          </legend>
          <div role="radiogroup" className="flex gap-1.5">
            {LIGHT_DAYS.map((d, i) => {
              const selected = rhythm.lightDay === i;
              return (
                <button
                  key={i}
                  type="button"
                  role="radio"
                  aria-checked={selected}
                  aria-label={LIGHT_DAY_NAMES[i]}
                  onClick={() => update({ lightDay: i })}
                  className={cn(
                    "flex h-10 min-w-0 flex-1 items-center justify-center rounded-full font-display text-sm leading-none font-bold transition focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand",
                    selected
                      ? "bg-brand text-white"
                      : "border border-line bg-surface text-ink hover:border-line-muted",
                  )}
                >
                  {d}
                </button>
              );
            })}
          </div>
        </fieldset>

        <section className="flex flex-col gap-3">
          <h2 className={sectionTitle}>Lembretes</h2>
          {REMINDERS.map(({ key, label }) => (
            <div key={key} className="flex items-center gap-3">
              <p className="flex-1 text-sm leading-normal text-ink">{label}</p>
              <Switch
                label={label}
                checked={rhythm.reminders[key]}
                onChange={(v) =>
                  update({ reminders: { ...rhythm.reminders, [key]: v } })
                }
              />
            </div>
          ))}
        </section>
      </StepContent>

      <StepFooter>
        <Link href="/agenda/pronta" className={primaryButton}>
          Confirmar
        </Link>
      </StepFooter>
    </>
  );
}
