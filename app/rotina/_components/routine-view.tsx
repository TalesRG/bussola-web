"use client";
import { Fragment, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { BottomNav } from "../../_components/bottom-nav";
import { useAppState } from "../../_lib/state";
import { cn, primaryButton, textLink } from "../../_components/ui";
import { StepHeader, StepFooter, tag } from "../../agenda/_components/step";
import { formatHours } from "../../semana/_lib/week";
import { useRoutine } from "../_lib/state";
import { plannedHours, PRIORITIES, DAYS, DAY_NAMES, time } from "../_lib/data";
import { heading, card, caption, Icon, Check, Segments, Badge } from "./ui";
export function RoutineView({ planning = false }: { planning?: boolean }) {
  const { routine, setRoutine } = useRoutine();
  const { rhythm } = useAppState();
  const [view, setView] = useState(planning ? "Semana" : "Dia");
  const [adding, setAdding] = useState(false);
  const router = useRouter();
  const hours = plannedHours(routine.entries);
  const entries = routine.entries
    .filter((e) => e.day === routine.day)
    .sort((a, b) => a.start - b.start);
  function done(id: string) {
    setRoutine((r) => ({
      ...r,
      entries: r.entries.map((e) =>
        e.id === id ? { ...e, done: !e.done } : e,
      ),
    }));
  }
  return (
    <>
      {planning && (
        <StepHeader
          label="Passo 2 de 2"
          backHref="/rotina/planejar"
          total={2}
          done={2}
          action={
            <Link className={textLink} href="/rotina">
              Pular
            </Link>
          }
        />
      )}
      <div
        className={cn(
          "flex flex-1 flex-col gap-5 px-5 pb-4",
          planning ? "pt-8" : "pt-6",
        )}
      >
        <header className="flex items-center justify-between">
          <div>
            <h1 className="font-display text-[22px] leading-[1.3] font-bold">
              Rotina
            </h1>
            <p className={caption}>Semana 12 · 23 a 29 de set.</p>
          </div>
          <div className="flex items-center gap-2.5">
            <Link
              href="/rotina/planejar"
              aria-label="Planejar a semana"
              className="flex size-10 items-center justify-center rounded-full border border-line"
            >
              <Icon file="c668c" />
            </Link>
            <button
              aria-label="Adicionar"
              aria-expanded={adding}
              onClick={() => setAdding(!adding)}
              className="size-11 rounded-full bg-brand font-display text-2xl text-white"
            >
              +
            </button>
          </div>
        </header>
        {adding && (
          <div className={card}>
            <Link href="/rotina/tarefa" className={textLink}>
              Nova tarefa
            </Link>
            <Link href="/rotina/compromisso" className={textLink}>
              Novo compromisso
            </Link>
          </div>
        )}
        {routine.lastBatch && (
          <div
            role="status"
            className="flex items-center justify-between gap-3 rounded-xl bg-brand-soft p-3 text-sm"
          >
            <span>Adicionado à sua rotina.</span>
            <button
              className={textLink}
              onClick={() =>
                setRoutine((r) => ({
                  ...r,
                  entries: r.entries.filter((e) => e.batch !== r.lastBatch),
                  lastBatch: null,
                }))
              }
            >
              Desfazer
            </button>
          </div>
        )}
        <Segments options={["Dia", "Semana"]} value={view} onChange={setView} />
        {view === "Semana" ? (
          <>
            <div className="flex gap-2">
              {[
                [formatHours(hours.reduce((a, b) => a + b, 0)), "de estudo"],
                ["16h", "de aulas"],
                [rhythm.lightDay >= 0 ? "1" : "0", "dia leve"],
              ].map(([value, label]) => (
                <div
                  key={label}
                  className="flex-1 rounded-[14px] bg-surface-muted p-3"
                >
                  <p className="font-display text-[22px] font-bold">{value}</p>
                  <p className={caption}>{label}</p>
                </div>
              ))}
            </div>
            <section className={cn(card, "rounded-[20px]")}>
              <div className="flex items-center justify-between">
                <h2 className={heading}>Estudo por dia</h2>
                <span className={cn(tag, "bg-subtle text-ink-2")}>
                  limite: {rhythm.maxHours}h
                </span>
              </div>
              <div className="relative flex h-[130px] items-end gap-1.5">
                <Image
                  src="/figma/rotina/2ebd1.svg"
                  alt=""
                  width={316}
                  height={1}
                  className="absolute top-[23px] left-0 max-w-full"
                />
                {DAYS.map((day, i) => (
                  <button
                    key={day}
                    onClick={() => {
                      setRoutine((r) => ({ ...r, day: i }));
                      setView("Dia");
                    }}
                    aria-label={`${DAY_NAMES[i]}: ${formatHours(hours[i])}`}
                    className="z-10 flex min-w-0 flex-1 flex-col items-center gap-1 font-display text-[11px] leading-[1.2]"
                  >
                    <span>{hours[i] ? formatHours(hours[i]) : "–"}</span>
                    <span
                      className={cn(
                        "w-full rounded-t-md rounded-b-[2px]",
                        hours[i]
                          ? hours[i] > rhythm.maxHours
                            ? "bg-amber-500"
                            : "bg-brand"
                          : "bg-subtle",
                      )}
                      style={{
                        height: Math.max(3, Math.min(hours[i], 6) * 16),
                      }}
                    />
                    <span
                      className={
                        i === rhythm.lightDay ? "text-brand-ink" : "text-ink-3"
                      }
                    >
                      {day}
                    </span>
                    <span className="flex h-1.5 items-start">
                      {i < 5 && (
                        <Image
                          src={`/figma/rotina/${i < 3 ? "01a7f" : "7bc3d"}.svg`}
                          alt=""
                          width={i < 3 ? 12 : 5}
                          height={6}
                        />
                      )}
                    </span>
                  </button>
                ))}
              </div>
              <p className="flex flex-wrap items-center gap-2 font-display text-[11px] text-ink-3">
                <span className="size-2.5 rounded-sm bg-brand" /> Estudo{" "}
                <span>· Aulas (● = 2h)</span>
                <span>
                  ·{" "}
                  {rhythm.lightDay >= 0
                    ? `${DAY_NAMES[rhythm.lightDay]}: dia leve`
                    : "Sem dia leve definido"}
                </span>
              </p>
            </section>
            <section className="flex flex-col gap-2.5">
              <h2 className={heading}>Provas e entregas</h2>
              {[
                [
                  "QUI",
                  "26",
                  "Relatório de Física · parte 2",
                  "23:59 · 2 blocos planejados",
                  "Entrega",
                ],
                [
                  "SEX",
                  "27",
                  "Prova de Cálculo II",
                  "10h · 3 blocos de revisão",
                  "Prova",
                ],
                [
                  "SEX",
                  "27",
                  "Lista 4 de Física",
                  "23:59 · feito na segunda",
                  "Entrega",
                ],
                [
                  "SEM",
                  "–",
                  "Leitura de Química, cap. 5",
                  "Sem prazo",
                  "Estudo",
                ],
                [
                  "EM",
                  "2s",
                  "Seminário de Humanidades",
                  "Apresentação em 2 semanas",
                  "Preparar",
                ],
              ]
                .filter((item) =>
                  routine.priorities.some(
                    (id) =>
                      PRIORITIES.find((p) => p.id === id)?.title === item[2],
                  ),
                )
                .map(([day, date, title, detail, type]) => (
                  <div
                    key={title}
                    className="flex items-center gap-3 rounded-2xl border border-line p-3"
                  >
                    <span
                      className={cn(
                        "flex h-[52px] w-12 shrink-0 flex-col items-center justify-center rounded-xl font-display",
                        type === "Prova"
                          ? "bg-amber-50 text-amber-800"
                          : "bg-brand-soft text-brand-ink",
                      )}
                    >
                      <span className="text-[11px]">{day}</span>
                      <strong className="text-xl">{date}</strong>
                    </span>
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-bold">{title}</p>
                      <p className={caption}>{detail}</p>
                    </div>
                    <Badge>{type}</Badge>
                  </div>
                ))}
            </section>
            <section className="flex flex-col gap-2.5 rounded-[18px] bg-surface-muted p-4">
              <h2 className={heading}>Hábitos protegidos</h2>
              {[
                `Sem estudo depois das ${rhythm.shutdown.replace(":00", "h")}`,
                "Pausa de 10 min a cada 1h30",
                ...(rhythm.lightDay >= 0
                  ? [`${DAY_NAMES[rhythm.lightDay]} livre`]
                  : []),
              ].map((label) => (
                <div
                  key={label}
                  className="flex items-center gap-2.5 text-sm text-ink-2"
                >
                  <span className="flex size-5 items-center justify-center rounded-full bg-brand">
                    <Icon file="5afe8" size={12} />
                  </span>
                  {label}
                </div>
              ))}
            </section>
          </>
        ) : (
          <>
            <div className="flex gap-1" aria-label="Dias da semana">
              {DAYS.map((day, i) => (
                <button
                  key={day}
                  aria-pressed={routine.day === i}
                  onClick={() => setRoutine((r) => ({ ...r, day: i }))}
                  className={cn(
                    "flex h-[60px] min-w-0 flex-1 flex-col items-center justify-center gap-1 rounded-xl",
                    routine.day === i ? "bg-brand text-white" : "text-ink",
                  )}
                >
                  <span className="text-[10px]">{day[0]}</span>
                  <strong className="text-sm">{23 + i}</strong>
                  <span
                    className={cn(
                      "h-1 w-6 rounded-full",
                      routine.day === i
                        ? "bg-white"
                        : hours[i]
                          ? "bg-brand"
                          : "bg-subtle",
                    )}
                  />
                </button>
              ))}
            </div>
            <section className="flex flex-col gap-2 rounded-[14px] bg-surface-muted p-3.5">
              <div className="flex items-center justify-between">
                <h2 className="text-sm font-bold">
                  {DAY_NAMES[routine.day]}, {23 + routine.day} de setembro
                </h2>
                <span className="text-xs font-bold text-brand-ink">
                  {formatHours(hours[routine.day])} de {rhythm.maxHours}h
                </span>
              </div>
              <div className="h-2 rounded-full bg-subtle">
                <div
                  className="h-2 rounded-full bg-brand"
                  style={{
                    width: `${Math.min(100, (hours[routine.day] / rhythm.maxHours) * 100)}%`,
                  }}
                />
              </div>
              <p className={caption}>
                {entries.filter((e) => e.kind === "class").length} aulas ·{" "}
                {entries.filter((e) => e.kind === "study").length} blocos de
                estudo · {entries.filter((e) => e.kind === "delivery").length}{" "}
                entrega
              </p>
            </section>
            <div className="flex flex-col gap-2">
              {entries.map((entry) => (
                <Fragment key={entry.id}>
                  <div className="flex items-start gap-2.5">
                    <div className="w-11 shrink-0 font-display text-xs leading-none">
                      <strong>{time(entry.start)}</strong>
                      {entry.end > entry.start && (
                        <p className="text-[11px] leading-[1.2] text-ink-3">
                          {time(entry.end)}
                        </p>
                      )}
                    </div>
                    <div
                      className={cn(
                        "flex min-w-0 flex-1 items-center gap-2.5 rounded-[14px] border p-3",
                        entry.kind === "study"
                          ? "border-brand-line bg-brand-soft"
                          : entry.kind === "delivery"
                            ? "border-amber-100 bg-amber-50"
                            : entry.kind === "class"
                              ? "border-transparent bg-surface-muted"
                              : "border-line",
                      )}
                    >
                      {entry.kind === "study" && (
                        <button
                          type="button"
                          aria-label={`Concluir ${entry.title}`}
                          role="checkbox"
                          aria-checked={!!entry.done}
                          onClick={() => done(entry.id)}
                        >
                          <Check checked={!!entry.done} small />
                        </button>
                      )}
                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-bold">{entry.title}</p>
                        <p className={caption}>
                          {entry.detail}
                          {entry.repeat ? " · Toda semana" : ""}
                        </p>
                      </div>
                      {entry.kind === "class" && (
                        <span className="rounded-full bg-white px-2 py-1 font-display text-[11px] font-bold text-ink-3">
                          SIGAA
                        </span>
                      )}
                      {entry.kind === "delivery" && <Badge>Entrega</Badge>}
                    </div>
                  </div>
                  {entry.id === "lista" && (
                    <>
                      <div className="flex items-center gap-2">
                        <span className={cn(tag, "bg-brand text-white")}>
                          Agora 15:32
                        </span>
                        <span className="h-0.5 flex-1 bg-brand" />
                      </div>
                      <p className="ml-[54px] flex items-center gap-1.5 text-xs text-ink-3">
                        <Icon file="ed065" size={14} />
                        Pausa de 10 min · respiração guiada
                      </p>
                    </>
                  )}
                </Fragment>
              ))}
              {entries.length === 0 && (
                <p className="rounded-2xl border border-line p-5 text-sm text-ink-2">
                  Nenhum compromisso adicionado neste dia. Use + para adicionar.
                </p>
              )}
              <div className="flex gap-2.5">
                <strong className="w-11 shrink-0 font-display text-xs">
                  {rhythm.shutdown}
                </strong>
                <div className="flex-1 rounded-[14px] bg-surface-muted p-3">
                  <p className="text-sm font-bold text-ink-2">
                    Hora de desligar
                  </p>
                  <p className={caption}>
                    Sem estudo depois das {rhythm.shutdown.replace(":00", "h")}
                  </p>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
      {planning ? (
        <StepFooter>
          <button
            className={primaryButton}
            onClick={() => {
              setRoutine((r) => ({ ...r, planned: true }));
              router.push("/rotina");
            }}
          >
            Concluir
          </button>
        </StepFooter>
      ) : (
        <BottomNav active="Rotina" />
      )}
    </>
  );
}
