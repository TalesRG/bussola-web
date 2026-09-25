"use client";

import Image from "next/image";
import Link from "next/link";
import { cn, primaryButton, textLink } from "../../_components/ui";
import { COURSES, EXAMS, longSchedule } from "../_lib/data";
import { useAppState } from "@/app/_lib/state";
import {
  StepContent,
  StepFooter,
  StepHeader,
  StepTitle,
  tag,
} from "../_components/step";
import { Switch } from "@/app/_components/switch";

// A02 · Conferir aulas importadas
export default function ConferirTurmas() {
  const { enabled, setEnabled } = useAppState();

  const kept = COURSES.filter((c) => enabled[c.code]);
  const removed = COURSES.filter((c) => !enabled[c.code]);
  const exams = EXAMS.filter((e) => enabled[e.code]);
  const nameOf = (code: string) => COURSES.find((c) => c.code === code)!.name;

  return (
    <>
      <StepHeader backHref="/agenda/montar" label="Passo 2 de 4" total={4} done={2} />

      <StepContent>
        <StepTitle title="Confira suas turmas">
          Encontramos {COURSES.length} turmas na sua matrícula (SIGAA ou
          comprovante). Desmarque o que você não está cursando de fato.
        </StepTitle>

        <ul className="overflow-hidden rounded-[18px] border border-line">
          {COURSES.map((c) => {
            const on = enabled[c.code];
            return (
              <li
                key={c.code}
                className="flex items-center gap-3 border-b border-subtle p-3.5 last:border-b-0"
              >
                <div className="flex min-w-0 flex-1 flex-col gap-0.5">
                  <p
                    className={cn(
                      "text-sm leading-normal font-bold",
                      on ? "text-ink" : "text-ink-3",
                    )}
                  >
                    {c.name}
                  </p>
                  <p className="text-xs leading-normal text-ink-2">
                    {longSchedule(c)}
                  </p>
                  <p className="font-display text-[11px] leading-[1.2] font-medium text-ink-3">
                    {c.code} · Turma {c.section}
                  </p>
                </div>
                <Switch
                  checked={on}
                  label={`Estou cursando ${c.name}`}
                  onChange={(v) => setEnabled((prev) => ({ ...prev, [c.code]: v }))}
                />
              </li>
            );
          })}
        </ul>

        {removed.length > 0 && (
          <div className="flex items-center gap-2.5 rounded-[14px] bg-surface-muted p-3">
            <Image src="/figma/agenda/icon-warning-16.svg" alt="" width={16} height={16} className="shrink-0" />
            <p className="flex-1 text-xs leading-normal text-ink-2">
              {removed.length === 1
                ? `${removed[0].name} desmarcada: você trancou? Ela não vai ocupar sua agenda.`
                : `${removed.length} turmas desmarcadas: elas não vão ocupar sua agenda.`}
            </p>
          </div>
        )}

        <section id="provas" className="flex scroll-mt-4 flex-col gap-2.5">
          <div className="flex items-center justify-between">
            <h2 className="font-display text-base leading-[1.2] font-bold text-ink">
              Provas do calendário
            </h2>
            <span className={`${tag} bg-amber-50 text-amber-800`}>
              {exams.length} {exams.length === 1 ? "encontrada" : "encontradas"}
            </span>
          </div>
          {exams.map((e) => (
            <p key={`${e.code}-${e.label}`} className="flex items-center gap-3">
              <span className={`${tag} bg-subtle text-ink-2`}>{e.date}</span>
              <span className="flex-1 text-sm leading-normal text-ink">
                {e.label} · {nameOf(e.code)}
              </span>
            </p>
          ))}
        </section>

        {/* TODO: tela para corrigir/adicionar aula. */}
        <button type="button" className={`${textLink} flex items-center gap-2 self-start`}>
          <Image src="/figma/agenda/icon-page-edit-16.svg" alt="" width={16} height={16} />
          Algo errado? Corrigir ou adicionar aula
        </button>
      </StepContent>

      <StepFooter>
        <Link
          href="/agenda/rotina"
          aria-disabled={kept.length === 0}
          className={cn(primaryButton, kept.length === 0 && "pointer-events-none opacity-50")}
        >
          Confirmar {kept.length} {kept.length === 1 ? "turma" : "turmas"}
        </Link>
      </StepFooter>
    </>
  );
}
