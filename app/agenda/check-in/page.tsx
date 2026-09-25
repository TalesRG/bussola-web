"use client";

import Image from "next/image";
import Link from "next/link";
import { CvvLine, primaryButton, textLink } from "../../_components/ui";
import { useAppState } from "@/app/_lib/state";
import { QUESTIONS } from "@/app/check-in/_lib/quiz";
import {
  Overline,
  StepContent,
  StepFooter,
  StepHeader,
  StepTitle,
  tag,
} from "../_components/step";

const PROMISES = [
  { icon: "/figma/agenda/icon-clock-brand-16.svg", text: "Leva uns 2 minutos" },
  { icon: "/figma/agenda/icon-check-dark-16.svg", text: "Só você vê suas respostas" },
  { icon: "/figma/agenda/icon-warning-16-dark.svg", text: "Não é diagnóstico: é um ponto de partida" },
];

// A05b · Primeiro check-in (última etapa)
export default function PrimeiroCheckIn() {
  const { rhythm } = useAppState();

  const outcomes = [
    {
      label: "Sinais leves",
      tone: "bg-brand-soft text-brand-ink",
      text: `Sua semana segue como montamos, com o limite de ${rhythm.maxHours}h por dia.`,
    },
    {
      label: "Sinais de alerta",
      tone: "bg-amber-50 text-amber-800",
      text: "Sugerimos uma semana mais leve e um dia sem estudo.",
    },
    {
      label: "Sinais fortes",
      tone: "bg-amber-100 text-amber-800",
      text: "Antes de tudo, oferecemos uma conversa com a DASU.",
    },
  ];

  return (
    <>
      <StepHeader
        backHref="/agenda/pronta"
        label="Última etapa"
        total={5}
        done={4}
        pendingTint
      />

      <StepContent className="gap-[22px]">
        <div aria-hidden className="relative mx-auto size-[130px]">
          <Image src="/figma/agenda/bateria-fundo.svg" alt="" width={130} height={130} />
          <div className="absolute top-[41px] left-[17px] flex h-12 w-[92px] gap-1 rounded-xl border-3 border-brand p-[5px]">
            {[0, 1, 2].map((i) => (
              <div key={i} className="flex-1 rounded-[5px] bg-brand-line" />
            ))}
          </div>
          <div className="absolute top-[57px] left-[111px] h-4 w-[5px] rounded-[3px] bg-brand" />
        </div>

        <div className="flex flex-col gap-2.5">
          <Overline>Primeiro check-in · {QUESTIONS.length} perguntas</Overline>
          <StepTitle title="Como você está chegando neste semestre?">
            Pense nas últimas 2 semanas. Não existe resposta certa, e só você vê
            o que responder.
          </StepTitle>
        </div>

        <section className="flex flex-col gap-3 rounded-[20px] border border-line p-4">
          <h2 className="font-display text-base leading-[1.2] font-bold text-ink">
            O que muda na sua semana
          </h2>
          {outcomes.map((o) => (
            <div key={o.label} className="flex items-start gap-3">
              <span className={`${tag} w-[118px] shrink-0 ${o.tone}`}>{o.label}</span>
              <p className="flex-1 text-xs leading-normal text-ink-2">{o.text}</p>
            </div>
          ))}
        </section>

        <ul className="flex flex-col gap-3">
          {PROMISES.map((p) => (
            <li key={p.text} className="flex items-center gap-3">
              <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-brand-soft">
                <Image src={p.icon} alt="" width={16} height={16} />
              </span>
              <span className="flex-1 text-sm leading-normal text-ink">{p.text}</span>
            </li>
          ))}
        </ul>
      </StepContent>

      <StepFooter className="gap-2.5">
        <Link href="/check-in/1" className={primaryButton}>
          Começar
        </Link>
        <Link href="/home" className={`${textLink} self-center py-1`}>
          Fazer depois
        </Link>
        <CvvLine icon="/figma/agenda/icon-phone.svg" />
      </StepFooter>
    </>
  );
}
