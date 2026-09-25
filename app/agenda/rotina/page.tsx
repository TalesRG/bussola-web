"use client";

import Image from "next/image";
import Link from "next/link";
import { useRef, useState, type PointerEvent } from "react";
import { cn, primaryButton, textLink } from "../../_components/ui";
import {
  CATEGORIES,
  GRID_HOURS,
  SLEEP_ROW,
  TRAJETO,
  WEEKDAYS,
  swatchOf,
} from "../_lib/data";
import { cellKey, useAppState } from "@/app/_lib/state";
import {
  StepContent,
  StepFooter,
  StepHeader,
  StepTitle,
} from "../_components/step";

const pad = (n: number) => String(n).padStart(2, "0");

// A03 · Mapear a vida fora da faculdade
export default function MapearRotina() {
  const { categories, setCategories, cells, setCells, classCells } = useAppState();
  const [active, setActive] = useState<string | null>(categories[0] ?? null);
  const dragMode = useRef<"paint" | "erase" | null>(null);

  const locked = (key: string, row: number) =>
    row === SLEEP_ROW || classCells.has(key);

  function paint(key: string) {
    if (!active || !dragMode.current) return;
    const mode = dragMode.current;
    setCells((prev) => {
      if (mode === "erase") {
        if (prev[key] !== active) return prev;
        const next = { ...prev };
        delete next[key];
        return next;
      }
      return prev[key] === active ? prev : { ...prev, [key]: active };
    });
  }

  function cellAt(x: number, y: number) {
    const el = document.elementFromPoint(x, y)?.closest<HTMLElement>("[data-cell]");
    return el && !el.dataset.locked ? el.dataset.cell! : null;
  }

  function handlePointerDown(e: PointerEvent<HTMLDivElement>) {
    const key = cellAt(e.clientX, e.clientY);
    if (!key || !active) return;
    e.preventDefault();
    e.currentTarget.setPointerCapture(e.pointerId);
    dragMode.current = cells[key] === active ? "erase" : "paint";
    paint(key);
  }

  function handlePointerMove(e: PointerEvent<HTMLDivElement>) {
    if (!dragMode.current) return;
    const key = cellAt(e.clientX, e.clientY);
    if (key) paint(key);
  }

  function toggleWithKeyboard(key: string) {
    if (!active) return;
    dragMode.current = cells[key] === active ? "erase" : "paint";
    paint(key);
    dragMode.current = null;
  }

  function handleChip(name: string) {
    if (!categories.includes(name)) {
      setCategories((prev) => [...prev, name]);
      setActive(name);
    } else if (active !== name) {
      setActive(name);
    } else {
      // Tocar de novo no tipo ativo remove o tipo e o que foi pintado com ele.
      const rest = categories.filter((c) => c !== name);
      setCategories(rest);
      setCells((prev) =>
        Object.fromEntries(Object.entries(prev).filter(([, c]) => c !== name)),
      );
      setActive(rest[0] ?? null);
    }
  }

  return (
    <>
      <StepHeader
        backHref="/agenda/turmas"
        label="Passo 3 de 4"
        total={4}
        done={3}
        action={
          <Link href="/agenda/ritmo" className={textLink}>
            Pular
          </Link>
        }
      />

      <StepContent className="gap-[18px]">
        <StepTitle title="E fora da faculdade?">
          Estágio, trajeto, trabalho, quem você cuida. Assim a gente não sugere
          estudo na hora errada.
        </StepTitle>

        <div className="flex flex-wrap gap-2">
          {CATEGORIES.map(({ name }) => {
            const selected = categories.includes(name);
            return (
              <button
                key={name}
                type="button"
                aria-pressed={selected}
                onClick={() => handleChip(name)}
                className={cn(
                  "rounded-full border px-3 py-[9px] font-display text-sm leading-none font-bold transition focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand",
                  selected
                    ? "border-brand bg-brand-soft text-brand-ink"
                    : "border-line bg-surface text-ink hover:border-line-muted",
                )}
              >
                {name === "Outro" && !selected ? "+ Outro" : name}
              </button>
            );
          })}
        </div>

        <div className="flex items-center gap-2.5 rounded-[14px] bg-brand-soft p-3">
          <span
            className={cn("size-3.5 shrink-0 rounded", active ? swatchOf(active) : "bg-subtle")}
          />
          <p className="flex-1 text-sm leading-normal font-bold text-ink">
            {active ? `Pintando: ${active}` : "Nada selecionado"}
          </p>
          <p className="text-xs leading-normal text-ink-3">
            {active ? "Toque e arraste na grade" : "Escolha um tipo acima"}
          </p>
        </div>

        <div
          role="grid"
          aria-label="Grade semanal"
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={() => (dragMode.current = null)}
          onPointerCancel={() => (dragMode.current = null)}
          className="flex touch-none flex-col gap-[3px] select-none"
        >
          <div role="row" className="flex gap-[3px]">
            <div className="w-[26px] shrink-0" />
            {WEEKDAYS.map((d) => (
              <div
                key={d}
                role="columnheader"
                className="flex-1 text-center font-display text-[11px] leading-[1.2] font-medium text-ink-3"
              >
                {d}
              </div>
            ))}
          </div>

          {GRID_HOURS.map((hour, row) => (
            <div key={hour} role="row" className="flex gap-[3px]">
              <div
                role="rowheader"
                className="flex size-[26px] shrink-0 items-center font-display text-[11px] leading-[1.2] font-medium text-ink-3"
              >
                {pad(hour)}h
              </div>
              {WEEKDAYS.map((day, col) => {
                const key = cellKey(col, row);
                const isClass = classCells.has(key);
                const isSleep = row === SLEEP_ROW;
                const category = cells[key];
                const label = isSleep ? "zz" : isClass ? "aula" : null;
                return (
                  <button
                    key={key}
                    type="button"
                    role="gridcell"
                    data-cell={key}
                    data-locked={locked(key, row) || undefined}
                    disabled={locked(key, row)}
                    aria-label={`${day} ${pad(hour)}h: ${isSleep ? "descanso" : isClass ? "aula" : (category ?? "livre")}`}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" || e.key === " ") {
                        e.preventDefault();
                        toggleWithKeyboard(key);
                      }
                    }}
                    className={cn(
                      "flex h-[26px] min-w-0 flex-1 items-center justify-center rounded-md font-display text-[11px] leading-[1.2] font-medium text-ink-3 focus-visible:outline-2 focus-visible:outline-brand",
                      isSleep
                        ? "bg-subtle"
                        : isClass
                          ? "bg-line-muted"
                          : category
                            ? swatchOf(category)
                            : "border border-subtle bg-surface",
                      !locked(key, row) && active && "cursor-pointer",
                    )}
                  >
                    {label}
                  </button>
                );
              })}
            </div>
          ))}
        </div>

        <div className="flex flex-wrap gap-x-3 gap-y-1.5">
          {[
            { name: "Aulas (SIGAA)", swatch: "bg-line-muted" },
            ...categories.map((name) => ({ name, swatch: swatchOf(name) })),
            { name: "Descanso", swatch: "bg-subtle" },
          ].map(({ name, swatch }) => (
            <p
              key={name}
              className="flex items-center gap-1.5 font-display text-[11px] leading-[1.2] font-medium text-ink-2"
            >
              <span className={cn("size-2.5 rounded-[3px]", swatch)} />
              {name}
            </p>
          ))}
        </div>

        {categories.includes(TRAJETO) && (
          <div className="flex items-center gap-2.5 rounded-[14px] bg-surface-muted p-3">
            <Image src="/figma/agenda/icon-clock-16.svg" alt="" width={16} height={16} className="shrink-0" />
            <p className="flex-1 text-xs leading-normal text-ink-2">
              Seu trajeto leva 1h por viagem? Contamos isso como tempo ocupado,
              não como tempo livre.
            </p>
          </div>
        )}
      </StepContent>

      <StepFooter>
        <Link href="/agenda/ritmo" className={primaryButton}>
          Continuar
        </Link>
      </StepFooter>
    </>
  );
}
