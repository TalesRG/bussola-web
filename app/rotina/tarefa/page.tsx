"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ChipGroup } from "../../_components/chip-group";
import { Switch } from "../../_components/switch";
import {
  Field,
  inputBox,
  input,
  primaryButton,
  textLink,
  cn,
} from "../../_components/ui";
import {
  StepContent,
  StepFooter,
  Overline,
} from "../../agenda/_components/step";
import { levelOf, scoreAnswers } from "../../check-in/_lib/quiz";
import {
  Check,
  FormHeader,
  Segments,
  Icon,
  heading,
  card,
  caption,
} from "../_components/ui";
import {
  DATES,
  DAYS,
  DAY_NAMES,
  minutes,
  time,
  plannedHours,
  REPORT_RESERVATION,
} from "../_lib/data";
import { suggestSlots } from "../_lib/scheduling";
import { useSchedule } from "../_lib/use-schedule";
export default function TaskPage() {
  const [type, setType] = useState("Entrega");
  const [title, setTitle] = useState("Relatório de Física · parte 2");
  const [course, setCourse] = useState<string | null>("Física 2");
  const [other, setOther] = useState("");
  const [deadline, setDeadline] = useState(DATES[3]);
  const [deadlineTime, setDeadlineTime] = useState("23:59");
  const [duration, setDuration] = useState(120);
  const [split, setSplit] = useState(true);
  const [custom, setCustom] = useState(false);
  const [customDay, setCustomDay] = useState(2);
  const [excluded, setExcluded] = useState<string[]>([]);
  const [editingDate, setEditingDate] = useState(false);
  const { busy, rhythm, answers, routine, setRoutine } = useSchedule();
  const router = useRouter();
  const scores = scoreAnswers(answers);
  const paused = !!scores && levelOf(scores) === "fortes";
  const reservation =
    title.trim() === REPORT_RESERVATION.title &&
    !routine.entries.some((e) => e.reservationId === REPORT_RESERVATION.id);
  const hours = plannedHours(routine.entries, reservation);
  const slots = paused
    ? []
    : suggestSlots({
        duration,
        split,
        deadlineDay: DATES.indexOf(deadline),
        deadlineTime: minutes(deadlineTime),
        busy,
        hours,
        maxHours: rhythm.maxHours,
        shutdown: minutes(rhythm.shutdown),
        lightDay: rhythm.lightDay,
        startDay: custom ? customDay : 2,
      });
  const key = (day: number, start: number) => `${day}-${start}`;
  const selected = slots.filter((s) => !excluded.includes(key(s.day, s.start)));
  const complete =
    selected.length > 0 &&
    selected.reduce((sum, s) => sum + s.end - s.start, 0) === duration;
  function reset() {
    setExcluded([]);
  }
  function save(event: React.FormEvent) {
    event.preventDefault();
    if (!complete || !title.trim() || (course === "+ Outra" && !other.trim()))
      return;
    const batch = crypto.randomUUID();
    setRoutine((r) => ({
      ...r,
      lastBatch: batch,
      day: selected[0].day,
      entries: [
        ...r.entries,
        ...selected.map((s, i) => ({
          ...s,
          id: `${batch}-${i}`,
          batch,
          reservationId: reservation ? REPORT_RESERVATION.id : undefined,
          title: title.trim(),
          detail: `${course === "+ Outra" ? other : course} · ${type} · bloco ${i + 1} de ${selected.length}`,
          kind: "study" as const,
        })),
      ],
    }));
    router.push("/rotina");
  }
  return (
    <form onSubmit={save} className="flex flex-1 flex-col">
      <FormHeader title="Nova tarefa" />
      <StepContent>
        <Segments
          options={["Entrega", "Prova", "Estudo", "Pessoal"]}
          value={type}
          onChange={(value) => {
            if (value === "Pessoal") router.push("/rotina/compromisso");
            else setType(value);
          }}
        />
        <Field label="O que você precisa fazer?" htmlFor="task-title">
          <div
            className={inputBox
              .replace("border-line", "border-brand")
              .replace("bg-surface-muted", "bg-white")}
          >
            <input
              id="task-title"
              className={input}
              required
              maxLength={120}
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>
        </Field>
        <Field label="Disciplina">
          <div className="[&_[role=radio]]:px-3 [&_[role=radio]]:text-[13px]">
            <ChipGroup
              label="Disciplina"
              options={["Cálculo II", "Física 2", "Química", "+ Outra"]}
              value={course}
              onChange={setCourse}
            />
          </div>
          {course === "+ Outra" && (
            <input
              aria-label="Outra disciplina"
              required
              className={inputBox}
              value={other}
              onChange={(e) => setOther(e.target.value)}
            />
          )}
        </Field>
        <button
          type="button"
          aria-expanded={editingDate}
          onClick={() => setEditingDate(!editingDate)}
          className="flex items-center gap-3 rounded-[14px] border border-line p-3.5 text-left"
        >
          <Icon file="96218" />
          <span className="flex-1">
            <span className={caption}>Prazo</span>
            <strong className="block text-sm">
              {DAY_NAMES[DATES.indexOf(deadline)]},{" "}
              {23 + DATES.indexOf(deadline)} de setembro · {deadlineTime}
            </strong>
          </span>
          <Icon file="ab074" size={18} />
        </button>
        {editingDate && (
          <div className="grid grid-cols-2 gap-3">
            <Field label="Data" htmlFor="deadline">
              <input
                id="deadline"
                type="date"
                min={DATES[2]}
                max={DATES[6]}
                required
                value={deadline}
                onChange={(e) => {
                  setDeadline(e.target.value);
                  reset();
                }}
                className="min-w-0 rounded-xl border border-line p-2 text-sm"
              />
            </Field>
            <Field label="Hora" htmlFor="deadline-time">
              <input
                id="deadline-time"
                type="time"
                required
                value={deadlineTime}
                onChange={(e) => {
                  setDeadlineTime(e.target.value);
                  reset();
                }}
                className={inputBox}
              />
            </Field>
          </div>
        )}
        <section className="flex flex-col gap-2">
          <h2 className={heading}>Quanto tempo vai levar?</h2>
          <div className="flex gap-2" role="radiogroup" aria-label="Duração">
            {[30, 60, 120, 180].map((value, i) => (
              <button
                key={value}
                type="button"
                role="radio"
                aria-checked={duration === value}
                onClick={() => {
                  setDuration(value);
                  reset();
                }}
                className={cn(
                  "h-10 flex-1 rounded-full border font-display text-sm font-bold",
                  duration === value
                    ? "border-brand bg-brand text-white"
                    : "border-line",
                )}
              >
                {["30 min", "1h", "2h", "3h ou +"][i]}
              </button>
            ))}
          </div>
          <p className={caption}>
            Na dúvida, estime para mais. Sobra tempo é melhor que faltar.
          </p>
        </section>
        <div className="flex items-center gap-3">
          <div className="flex-1">
            <p className="text-sm font-bold">Dividir em blocos de até 1h30</p>
            <p className={caption}>Blocos menores cansam menos</p>
          </div>
          <Switch
            checked={split}
            onChange={(value) => {
              setSplit(value);
              reset();
            }}
            label="Dividir em blocos de até 1h30"
          />
        </div>
        <section className={cn(card, "border-brand-line bg-brand-soft")}>
          <Overline>Sugestão da Bússola</Overline>
          <h2 className={heading}>
            {slots.length
              ? `Encaixamos em ${slots.length} ${slots.length === 1 ? "bloco" : "blocos"}, antes do prazo`
              : paused
                ? "Agora, priorize descanso e apoio"
                : "Não encontramos espaço com esses limites"}
          </h2>
          {slots.map((slot) => (
            <button
              key={key(slot.day, slot.start)}
              type="button"
              role="checkbox"
              aria-checked={!excluded.includes(key(slot.day, slot.start))}
              onClick={() =>
                setExcluded((e) =>
                  e.includes(key(slot.day, slot.start))
                    ? e.filter((k) => k !== key(slot.day, slot.start))
                    : [...e, key(slot.day, slot.start)],
                )
              }
              className="flex items-center gap-3 rounded-[14px] bg-white p-3 text-left"
            >
              <Check
                checked={!excluded.includes(key(slot.day, slot.start))}
                small
              />
              <span>
                <strong className="block text-sm">
                  {DAYS[slot.day]} {23 + slot.day} · {time(slot.start)} –{" "}
                  {time(slot.end)}
                </strong>
                <span className={caption}>
                  dia fica com{" "}
                  {String(
                    hours[slot.day] +
                      slots
                        .filter((s) => s.day === slot.day)
                        .reduce((sum, s) => sum + (s.end - s.start) / 60, 0),
                  ).replace(".", ",")}
                  h de estudo
                </span>
              </span>
            </button>
          ))}
          {slots.length ? (
            <p className="flex items-start gap-2 text-xs leading-normal text-ink-2">
              <Icon file="19835" size={14} />
              Respeita seu limite de {rhythm.maxHours}h por dia e não passa das{" "}
              {rhythm.shutdown.replace(":00", "h")}.
            </p>
          ) : (
            <p className={caption}>
              {paused
                ? "As sugestões de estudo estão pausadas de acordo com seu check-in."
                : "Ajuste a duração ou o prazo. Tarefas acima de 1h30 precisam ser divididas."}
            </p>
          )}
          {paused ? (
            <Link className={textLink} href="/home#apoio">
              Buscar apoio
            </Link>
          ) : (
            <button
              type="button"
              className={cn(textLink, "self-start")}
              onClick={() => {
                setCustom(!custom);
                reset();
              }}
            >
              Escolher outros horários
            </button>
          )}
          {custom && (
            <Field label="Buscar horários a partir de" htmlFor="start-day">
              <select
                id="start-day"
                value={customDay}
                onChange={(e) => {
                  setCustomDay(Number(e.target.value));
                  reset();
                }}
                className={inputBox}
              >
                {DAYS.map(
                  (day, i) =>
                    i >= 2 && (
                      <option key={day} value={i}>
                        {DAY_NAMES[i]}, {23 + i}
                      </option>
                    ),
                )}
              </select>
            </Field>
          )}
          {slots.length > 0 && !complete && (
            <p role="status" className="text-xs text-amber-800">
              Selecione todos os blocos para reservar o tempo estimado.
            </p>
          )}
        </section>
      </StepContent>
      <StepFooter>
        <button
          type="submit"
          disabled={!complete || !title.trim()}
          className={primaryButton}
        >
          Adicionar à rotina
        </button>
      </StepFooter>
    </form>
  );
}
