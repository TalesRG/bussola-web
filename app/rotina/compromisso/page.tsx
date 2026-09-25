"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  cn,
  Field,
  input,
  inputBox,
  primaryButton,
  textLink,
} from "../../_components/ui";
import {
  StepContent,
  StepFooter,
  Overline,
} from "../../agenda/_components/step";
import { card, caption, FormHeader, Icon } from "../_components/ui";
import {
  DATES,
  DAY_NAMES,
  minutes,
  overlaps,
  parseAppointment,
  time,
  type Slot,
} from "../_lib/data";
import { useSchedule } from "../_lib/use-schedule";
import { levelOf, scoreAnswers } from "../../check-in/_lib/quiz";
export default function AppointmentPage() {
  const [text, setText] = useState("Dentista quinta às 15h");
  const [details, setDetails] = useState({
    title: "Dentista",
    day: 3,
    start: 900,
    end: 960,
    type: "Pessoal",
    repeat: false,
  });
  const [editing, setEditing] = useState<string | null>(null);
  const [choice, setChoice] = useState<string | null>(null);
  const [parsed, setParsed] = useState(true);
  const { busy, setRoutine, rhythm, hours, answers } = useSchedule();
  const router = useRouter();
  const valid =
    !!details.title.trim() &&
    details.day >= 0 &&
    details.day <= 6 &&
    details.start >= 0 &&
    details.end <= 1440 &&
    details.end > details.start;
  const conflicts = valid ? busy.filter((b) => overlaps(details, b)) : [];
  const slotKey = (s: Slot) => `${s.day}-${s.start}`;
  const alternatives: Slot[] = [];
  if (conflicts.length) {
    const candidates = [
      { day: 4, start: 960 },
      { day: 3, start: 780 },
      ...Array.from({ length: 5 }, (_, d) =>
        Array.from({ length: 12 }, (_, h) => ({
          day: d + 2,
          start: 480 + h * 60,
        })),
      ).flat(),
    ];
    for (const c of candidates) {
      const slot = { ...c, end: c.start + details.end - details.start };
      if (
        slot.end > 1380 ||
        alternatives.some((s) => slotKey(s) === slotKey(slot)) ||
        busy.some((b) => overlaps(slot, b))
      )
        continue;
      alternatives.push(slot);
      if (alternatives.length === 2) break;
    }
  }
  const chosen =
    choice === "keep"
      ? details
      : (alternatives.find((s) => slotKey(s) === choice) ??
        (choice === null ? alternatives[0] : undefined));
  const target = conflicts.length ? chosen : details;
  const scores = scoreAnswers(answers);
  const studyBlocked =
    details.type === "Estudo" &&
    !!target &&
    ((!!scores && levelOf(scores) === "fortes") ||
      target.day === rhythm.lightDay ||
      target.end > Math.min(1380, minutes(rhythm.shutdown)) ||
      target.end - target.start > 90 ||
      hours[target.day] + (target.end - target.start) / 60 > rhythm.maxHours);
  function update<K extends keyof typeof details>(
    key: K,
    value: (typeof details)[K],
  ) {
    setDetails((d) => ({ ...d, [key]: value }));
    setChoice(null);
  }
  function understand(value: string) {
    setText(value);
    const result = parseAppointment(value);
    setParsed(result.day !== null && result.start !== null && !!result.title);
    setDetails((d) => ({
      ...d,
      title: result.title,
      day: result.day ?? -1,
      start: result.start ?? -1,
      end: result.start === null ? -1 : result.start + 60,
      type: result.type,
      repeat: result.repeat,
    }));
    setChoice(null);
  }
  function save(event: React.FormEvent) {
    event.preventDefault();
    if (!valid || !target || studyBlocked) return;
    const batch = crypto.randomUUID();
    setRoutine((r) => ({
      ...r,
      lastBatch: batch,
      day: target.day,
      entries: [
        ...r.entries,
        {
          ...target,
          id: batch,
          batch,
          title: details.title.trim(),
          detail: details.type,
          kind: details.type === "Estudo" ? "study" : "personal",
          repeat: details.repeat,
        },
      ],
    }));
    router.push("/rotina");
  }
  const fields = [
    ["title", "O quê", details.title || "Definir título"],
    [
      "day",
      "Quando",
      details.day >= 0
        ? `${DAY_NAMES[details.day]}, ${23 + details.day} de setembro`
        : "Definir data",
    ],
    [
      "start",
      "Horário",
      details.start >= 0
        ? `${time(details.start)} – ${time(details.end)}`
        : "Definir horário",
    ],
    ["type", "Tipo", details.type],
    ["repeat", "Repetir", details.repeat ? "Toda semana" : "Não repete"],
  ];
  return (
    <form onSubmit={save} className="flex flex-1 flex-col">
      <FormHeader title="Novo compromisso" />
      <StepContent>
        <Field
          label="Escreva do seu jeito"
          htmlFor="appointment-text"
          hint={
            "Ex.: “estudar física sábado de manhã”, “reunião do PET toda terça 19h”"
          }
        >
          <div
            className={inputBox
              .replace("border-line", "border-brand")
              .replace("bg-surface-muted", "bg-white")}
          >
            <input
              id="appointment-text"
              className={input}
              value={text}
              maxLength={180}
              onChange={(e) => understand(e.target.value)}
            />
          </div>
        </Field>
        <section className={card}>
          <Overline>Entendemos assim</Overline>
          {fields.map(([key, label, value]) => (
            <div key={key}>
              <button
                type="button"
                onClick={() => setEditing(editing === key ? null : key)}
                aria-expanded={editing === key}
                className="flex w-full items-center justify-between gap-2 text-left text-sm"
              >
                <span className="shrink-0 text-ink-3">{label}</span>
                <span className="flex items-center gap-1.5 text-right font-bold">
                  {value}
                  <Icon file="2ee7c" size={16} />
                </span>
              </button>
              {editing === key && (
                <div className="mt-2">
                  {key === "title" ? (
                    <input
                      aria-label="Título do compromisso"
                      required
                      value={details.title}
                      onChange={(e) => update("title", e.target.value)}
                      className={cn(inputBox, "w-full")}
                    />
                  ) : key === "day" ? (
                    <select
                      aria-label="Data do compromisso"
                      value={details.day}
                      onChange={(e) => update("day", Number(e.target.value))}
                      className={cn(inputBox, "w-full")}
                    >
                      <option value={-1}>Escolha o dia</option>
                      {DATES.map((date, i) => (
                        <option value={i} key={date}>
                          {DAY_NAMES[i]}, {23 + i} de setembro
                        </option>
                      ))}
                    </select>
                  ) : key === "start" ? (
                    <div className="grid grid-cols-2 gap-2">
                      <Field label="Início" htmlFor="appointment-start">
                        <input
                          id="appointment-start"
                          type="time"
                          required
                          value={details.start >= 0 ? time(details.start) : ""}
                          onChange={(e) =>
                            update("start", minutes(e.target.value))
                          }
                          className="min-w-0 rounded-lg border border-line p-2"
                        />
                      </Field>
                      <Field label="Fim" htmlFor="appointment-end">
                        <input
                          id="appointment-end"
                          type="time"
                          required
                          value={details.end >= 0 ? time(details.end) : ""}
                          onChange={(e) =>
                            update("end", minutes(e.target.value))
                          }
                          className="min-w-0 rounded-lg border border-line p-2"
                        />
                      </Field>
                    </div>
                  ) : key === "type" ? (
                    <select
                      aria-label="Tipo do compromisso"
                      value={details.type}
                      onChange={(e) => update("type", e.target.value)}
                      className={cn(inputBox, "w-full")}
                    >
                      {["Pessoal", "Estudo", "Trabalho", "Saúde"].map((t) => (
                        <option key={t}>{t}</option>
                      ))}
                    </select>
                  ) : (
                    <select
                      aria-label="Repetição"
                      value={details.repeat ? "weekly" : "none"}
                      onChange={(e) =>
                        update("repeat", e.target.value === "weekly")
                      }
                      className={cn(inputBox, "w-full")}
                    >
                      <option value="none">Não repete</option>
                      <option value="weekly">Toda semana</option>
                    </select>
                  )}
                </div>
              )}
            </div>
          ))}
          {(!parsed || !valid) && (
            <p role="status" className="text-xs text-amber-800">
              Confira os campos acima e defina um título, dia e horário válido
              antes de salvar.
            </p>
          )}
        </section>
        {!!conflicts.length && (
          <section className={cn(card, "gap-2.5 border-amber-100 bg-amber-50")}>
            <div className="flex items-center gap-2.5">
              <Icon file="855a8" />
              <h2 className="text-sm font-bold">
                Conflita com{" "}
                {conflicts.some((c) => c.title === "Estágio")
                  ? "o estágio (14h–18h)"
                  : conflicts[0].title}
              </h2>
            </div>
            <p className="text-xs text-ink-2">
              Quer marcar mesmo assim ou procurar outro horário?
            </p>
            <div
              role="radiogroup"
              aria-label="Horários alternativos"
              className="flex flex-col gap-2"
            >
              {alternatives.map((s, i) => (
                <button
                  key={slotKey(s)}
                  type="button"
                  role="radio"
                  aria-checked={!!target && slotKey(target) === slotKey(s)}
                  onClick={() => setChoice(slotKey(s))}
                  className={cn(
                    "flex items-center gap-2.5 rounded-[14px] border bg-white p-3 text-left",
                    target && slotKey(target) === slotKey(s)
                      ? "border-brand"
                      : "border-line",
                  )}
                >
                  {target && slotKey(target) === slotKey(s) ? (
                    <Icon file="1ba8c" />
                  ) : (
                    <span className="size-5 shrink-0 rounded-full border-2 border-line-muted" />
                  )}
                  <span>
                    <strong className="block text-sm">
                      {DAY_NAMES[s.day]}, {23 + s.day} · {time(s.start)}
                    </strong>
                    <span className={caption}>
                      {i === 1 && s.day === 3 && s.start === 780
                        ? "Antes do estágio"
                        : "Você está livre"}
                    </span>
                  </span>
                </button>
              ))}
            </div>
            <button
              type="button"
              aria-pressed={choice === "keep"}
              className={cn(textLink, "self-start text-left leading-normal")}
              onClick={() => setChoice("keep")}
            >
              Manter {DAY_NAMES[details.day]?.toLowerCase()}{" "}
              {time(details.start).replace(":00", "h")} mesmo assim
            </button>
            {choice === "keep" && (
              <p role="status" className="text-xs text-amber-800">
                O compromisso será salvo com o conflito. Os outros horários
                serão mantidos.
              </p>
            )}
          </section>
        )}
        <p className="flex items-start gap-2 text-xs leading-normal text-ink-3">
          <Icon file="b9a0f" size={16} />O estudo planejado para esse horário é
          remanejado com a sua aprovação.
        </p>
      </StepContent>
      {studyBlocked && (
        <p role="status" className="px-5 pb-4 text-sm text-amber-800">
          Esse bloco não cabe nos seus limites de estudo ou nas recomendações do
          check-in. Revise o dia e o horário.
        </p>
      )}
      <StepFooter>
        <button
          className={primaryButton}
          disabled={!valid || !target || studyBlocked}
          type="submit"
        >
          {target && valid
            ? `Salvar na ${DAY_NAMES[target.day].toLowerCase()}, ${time(target.start)}`
            : "Salvar compromisso"}
        </button>
      </StepFooter>
    </form>
  );
}
