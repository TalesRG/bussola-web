"use client";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAppState } from "../../_lib/state";
import { Switch } from "../../_components/switch";
import { cn, primaryButton, textLink } from "../../_components/ui";
import {
  StepHeader,
  StepContent,
  StepTitle,
  StepFooter,
  Overline,
  tag,
} from "../../agenda/_components/step";
import { levelOf, scoreAnswers } from "../../check-in/_lib/quiz";
import { useRoutine } from "../_lib/state";
import { PRIORITIES } from "../_lib/data";
import { Badge, Check, Icon, heading, card, caption } from "../_components/ui";
export default function PlanPage() {
  const { routine, setRoutine } = useRoutine();
  const { rhythm, setRhythm, answers } = useAppState();
  const [selected, setSelected] = useState(routine.priorities);
  const [light, setLight] = useState(rhythm.lightDay === 5);
  const [message, setMessage] = useState("");
  const router = useRouter();
  const scores = scoreAnswers(answers);
  const level = scores ? levelOf(scores) : "alerta";
  function toggle(id: string) {
    if (selected.includes(id))
      setSelected(selected.filter((item) => item !== id));
    else if (selected.length < 3) setSelected([...selected, id]);
    else {
      setMessage(
        "Escolha até 3 prioridades. Desmarque uma para escolher outra.",
      );
      return;
    }
    setMessage("");
  }
  function save() {
    setRoutine((r) => ({ ...r, priorities: selected }));
    setRhythm((r) => ({ ...r, lightDay: light ? 5 : -1 }));
    router.push("/rotina/semana");
  }
  return (
    <>
      <StepHeader
        backHref="/home"
        label="Passo 1 de 2"
        total={2}
        done={1}
        action={
          <Link href="/rotina" className={textLink}>
            Pular
          </Link>
        }
      />
      <StepContent className="gap-[22px]">
        <div className="flex flex-col gap-2">
          <Overline>Semana 12 · 23 a 29 de setembro</Overline>
          <StepTitle title="O que é mais importante esta semana?">
            Escolha até 3. O resto pode esperar, e a gente encaixa sem apertar.
          </StepTitle>
        </div>
        <div className="flex gap-3 rounded-[18px] bg-amber-50 p-3.5">
          <Icon file="855a8" />
          <div className="flex flex-1 flex-col gap-0.5">
            <p className="text-sm font-bold">
              Seu último check-in: sinais{" "}
              {level === "alerta" ? "de alerta" : level}
            </p>
            <p className="text-xs leading-normal text-ink-2">
              {level === "fortes"
                ? "Vamos pausar as sugestões de estudo e priorizar descanso e apoio."
                : level === "leves"
                  ? "Você escolhe suas prioridades e mantém espaço para descansar."
                  : "Por isso vamos sugerir uma semana mais leve, com um dia sem estudo."}
            </p>
            {level === "fortes" && (
              <Link href="/home#apoio" className={textLink}>
                Buscar apoio
              </Link>
            )}
          </div>
        </div>
        <section className="flex flex-col gap-2.5">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <h2 className={heading}>Esta semana você tem</h2>
            <span
              aria-live="polite"
              className={cn(tag, "bg-brand-soft text-brand-ink")}
            >
              {selected.length} de 3 escolhidas
            </span>
          </div>
          {PRIORITIES.map((task) => (
            <button
              key={task.id}
              type="button"
              role="checkbox"
              aria-checked={selected.includes(task.id)}
              onClick={() => toggle(task.id)}
              className={cn(
                "flex items-center gap-3 rounded-2xl border p-3.5 text-left focus-visible:outline-2 focus-visible:outline-brand",
                selected.includes(task.id)
                  ? "border-brand-line bg-brand-soft"
                  : "border-line bg-white",
              )}
            >
              <Check checked={selected.includes(task.id)} />
              <span className="min-w-0 flex-1">
                <span className="block text-sm leading-normal font-bold">
                  {task.title}
                </span>
                <span className={caption}>{task.meta}</span>
              </span>
              <Badge>{task.type}</Badge>
            </button>
          ))}
          {message && (
            <p role="status" className="text-xs text-amber-800">
              {message}
            </p>
          )}
        </section>
        <section className={card}>
          <h2 className={heading}>Sua semana em horas</h2>
          <div className="flex h-3 gap-0.5 overflow-hidden rounded-full">
            <span className="flex-[16] bg-line-muted" />
            <span className="flex-[18] bg-brand" />
            <span className="flex-[4] bg-subtle" />
          </div>
          <div className="flex flex-wrap gap-3.5 font-display text-[11px] text-ink-2">
            {["16h de aula", "18h de estudo", "4h livres"].map((text, i) => (
              <span className="flex items-center gap-1.5" key={text}>
                <span
                  className={cn(
                    "size-2.5 rounded-[3px]",
                    ["bg-line-muted", "bg-brand", "bg-subtle"][i],
                  )}
                />
                {text}
              </span>
            ))}
          </div>
          <div className="flex items-center gap-3">
            <div className="flex-1">
              <p className="text-sm font-bold">Sábado sem estudo</p>
              <p className={caption}>
                Um dia leve por semana ajuda a recuperar a energia
              </p>
            </div>
            <Switch
              checked={light}
              onChange={setLight}
              label="Sábado sem estudo"
            />
          </div>
        </section>
      </StepContent>
      <StepFooter>
        <button className={primaryButton} onClick={save}>
          Montar minha semana
        </button>
      </StepFooter>
    </>
  );
}
