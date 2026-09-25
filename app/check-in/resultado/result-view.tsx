"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import type { ReactNode } from "react";
import { useAppState } from "../../_lib/state";
import { PageHeader } from "../../_components/page-header";
import { Switch } from "../../_components/switch";
import {
  cn,
  primaryButton,
  secondaryButtonLg,
  textLink,
} from "../../_components/ui";
import { tag } from "../../agenda/_components/step";
import { LEVELS, type Level } from "../../home/data";
import {
  DIMENSIONS,
  DIMENSION_MAX,
  EXAMPLES,
  QUESTIONS,
  isHigh,
  levelOf,
  scoreAnswers,
  type Dimension,
  type Scores,
} from "../_lib/quiz";

const COPY: Record<Level, { title: string; body: string }> = {
  leves: {
    title: "Sua energia está em dia",
    body: "Você tem se sentido com fôlego para a faculdade. Cansaço em semana de prova é normal, e você parece estar dando conta.",
  },
  alerta: {
    title: "Sua energia está baixando",
    body: "O cansaço e a distância do curso apareceram com frequência. Isso é comum no meio do semestre, e dá para agir cedo.",
  },
  fortes: {
    title: "Você está carregando muito sozinho",
    body: "Suas respostas mostram exaustão intensa e distância do curso. Isso não é fraqueza nem falta de esforço: é sinal de que você merece apoio agora.",
  },
};

const METER: { level: Level; label: string; fill: string }[] = [
  { level: "leves", label: "Leves", fill: "bg-brand" },
  { level: "alerta", label: "Alerta", fill: "bg-amber-500" },
  { level: "fortes", label: "Fortes", fill: "bg-amber-800" },
];

const sectionTitle = "font-display text-base leading-[1.2] font-bold text-ink";

export function ResultView({ example }: { example?: Level }) {
  const router = useRouter();
  const { answers, setAnswers } = useAppState();
  const scores = example ? EXAMPLES[example] : scoreAnswers(answers);

  function redo() {
    setAnswers(QUESTIONS.map(() => null));
    router.push("/check-in/1");
  }

  const header = (
    <PageHeader
      titleAs="p"
      title="Seu resultado"
      backHref="/home"
      action={
        <button type="button" onClick={redo} className={textLink}>
          Refazer
        </button>
      }
    />
  );

  if (!scores) {
    const firstMissing = answers.findIndex((a) => a === null);
    return (
      <>
        {header}
        <div className="flex flex-1 flex-col items-start gap-4 p-5">
          <h1 className="font-display text-2xl leading-[1.3] font-bold text-ink">
            Faltam algumas respostas
          </h1>
          <p className="text-base leading-normal text-ink-2">
            Responda todas as perguntas para ver seu resultado.
          </p>
          <Link href={`/check-in/${firstMissing + 1}`} className={primaryButton}>
            Continuar o check-in
          </Link>
        </div>
      </>
    );
  }

  const level = levelOf(scores);

  return (
    <>
      {header}
      <div className="flex flex-1 flex-col gap-[22px] p-5">
        <section className="flex flex-col items-start gap-2.5">
          <span className={cn(tag, "px-3 py-1.5 uppercase", LEVELS[level].chip)}>
            {LEVELS[level].label}
          </span>
          <h1 className="font-display text-[32px] leading-[38px] font-bold text-ink">
            {COPY[level].title}
          </h1>
          <p className="text-base leading-normal text-ink-2">{COPY[level].body}</p>
        </section>

        <Meter level={level} />

        {level === "fortes" ? (
          <>
            <section className="flex flex-col gap-3 rounded-[20px] border border-brand-line bg-brand-soft p-[18px]">
              <div className="flex items-center gap-3">
                <span className="flex size-11 shrink-0 items-center justify-center rounded-full bg-surface">
                  <Image src="/figma/quiz/icon-heart.svg" alt="" width={22} height={22} />
                </span>
                <div className="flex flex-1 flex-col gap-0.5">
                  <h2 className={sectionTitle}>Converse com alguém da DASU</h2>
                  <p className="text-xs leading-normal text-ink-2">
                    Próximo horário: amanhã, 10h · gratuito
                  </p>
                </div>
              </div>
              {/* TODO: agenda da DASU. */}
              <button type="button" className={primaryButton}>
                Ver disponibilidade
              </button>
            </section>

            <section className="flex flex-col gap-3 rounded-[20px] border border-line p-[18px]">
              <h2 className={sectionTitle}>Se estiver muito difícil agora</h2>
              <p className="text-sm leading-normal text-ink-2">
                O CVV atende 24 h, de graça, por telefone ou chat.
              </p>
              <a href="tel:188" className={cn(secondaryButtonLg, "w-full")}>
                <Image src="/figma/quiz/icon-phone-22.svg" alt="" width={22} height={22} />
                Ligar para o 188
              </a>
            </section>

            <DimensionScores scores={scores} />

            {/* TODO: fluxo para contar a alguém de confiança. */}
            <button type="button" className={cn(textLink, "flex items-center gap-2.5 text-left")}>
              <Image src="/figma/quiz/icon-community.svg" alt="" width={20} height={20} />
              Quer ajuda para contar a alguém de confiança?
            </button>
          </>
        ) : (
          <>
            <DimensionScores scores={scores} />
            {level === "leves" ? <LightActions /> : <AlertActions />}
          </>
        )}

        <p className="flex items-start gap-2 text-xs leading-normal text-ink-3">
          <Image src="/figma/agenda/icon-warning-16.svg" alt="" width={16} height={16} className="shrink-0" />
          Este resultado não é um diagnóstico. Suas respostas ficam só com você.
        </p>
      </div>
    </>
  );
}

function Meter({ level }: { level: Level }) {
  return (
    <div className="flex flex-col gap-2" aria-label={`Nível: ${LEVELS[level].label}`}>
      <div className="flex gap-1.5">
        {METER.map((m) => (
          <div
            key={m.level}
            className={cn("h-2.5 flex-1 rounded-full", m.level === level ? m.fill : "bg-subtle")}
          />
        ))}
      </div>
      <div className="flex gap-1.5">
        {METER.map((m) => (
          <p
            key={m.level}
            className={cn(
              "flex-1 text-center font-display",
              m.level === level
                ? cn("text-xs leading-none font-bold", m.level === "leves" ? "text-brand-ink" : "text-amber-800")
                : "text-[11px] leading-[1.2] font-medium text-ink-3",
            )}
          >
            {m.label}
          </p>
        ))}
      </div>
    </div>
  );
}

function DimensionScores({ scores }: { scores: Scores }) {
  return (
    <section className="flex flex-col gap-3.5 rounded-[18px] border border-line p-[18px]">
      <h2 className={sectionTitle}>Onde apareceram os sinais</h2>
      {(Object.keys(DIMENSIONS) as Dimension[]).map((d) => {
        const high = isHigh(scores[d]);
        return (
          <div key={d} className="flex flex-col gap-1.5">
            <div className="flex items-start justify-between">
              <span className="text-sm leading-normal text-ink-2">{DIMENSIONS[d].label}</span>
              <span className={cn("font-display text-xs leading-none font-bold", high ? "text-amber-800" : "text-ink")}>
                {scores[d]} de {DIMENSION_MAX}
              </span>
            </div>
            <div
              role="meter"
              aria-label={DIMENSIONS[d].label}
              aria-valuemin={0}
              aria-valuemax={DIMENSION_MAX}
              aria-valuenow={scores[d]}
              className="h-2 overflow-hidden rounded-full bg-subtle"
            >
              <div
                className={cn("h-full rounded-full", high ? "bg-amber-500" : "bg-brand")}
                style={{ width: `${(scores[d] / DIMENSION_MAX) * 100}%` }}
              />
            </div>
          </div>
        );
      })}
    </section>
  );
}

function ActionRow({
  icon,
  title,
  text,
  href,
}: {
  icon: string;
  title: string;
  text: string;
  href?: string;
}) {
  const content: ReactNode = (
    <>
      <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-brand-soft">
        <Image src={icon} alt="" width={20} height={20} />
      </span>
      <span className="flex flex-1 flex-col gap-0.5 leading-normal">
        <span className="text-sm font-bold text-ink">{title}</span>
        <span className="text-xs text-ink-3">{text}</span>
      </span>
      <Image src="/figma/icon-chev.svg" alt="" width={18} height={18} />
    </>
  );
  const className =
    "flex items-center gap-3 rounded-2xl border border-line p-3.5 text-left transition hover:bg-surface-muted focus-visible:outline-2 focus-visible:outline-brand";
  return href ? (
    <Link href={href} className={className}>
      {content}
    </Link>
  ) : (
    // TODO: pausa guiada e roda de conversa.
    <button type="button" className={className}>
      {content}
    </button>
  );
}

function LightActions() {
  const { notificationPrefs, setNotificationPrefs } = useAppState();
  return (
    <>
      <section className="flex flex-col gap-2.5">
        <h2 className={sectionTitle}>Para continuar assim</h2>
        <ActionRow icon="/figma/quiz/icon-wind.svg" title="Pausa guiada de 2 min" text="Bom para dias de prova" />
        <ActionRow icon="/figma/quiz/icon-cal.svg" title="Sua semana, no seu ritmo" text="Veja se a carga está equilibrada" href="/agenda/ritmo" />
      </section>

      <div className="flex items-center gap-3 rounded-2xl bg-surface-muted p-3.5">
        <div className="flex flex-1 flex-col gap-0.5 leading-normal">
          <p className="text-sm font-bold text-ink">Refazer em 2 semanas</p>
          <p className="text-xs text-ink-3">Te lembramos com uma notificação discreta</p>
        </div>
        <Switch
          label="Refazer em 2 semanas"
          checked={notificationPrefs.checkinReminder}
          onChange={(v) => setNotificationPrefs((p) => ({ ...p, checkinReminder: v }))}
        />
      </div>

      <Link href="/home" className={primaryButton}>
        Voltar ao início
      </Link>
    </>
  );
}

function AlertActions() {
  return (
    <>
      <section className="flex flex-col gap-2.5">
        <h2 className={sectionTitle}>O que pode ajudar esta semana</h2>
        <ActionRow icon="/figma/quiz/icon-cal.svg" title="Reorganizar a semana" text="Mover uma entrega e dormir melhor" href="/semana/reorganizar" />
        <ActionRow icon="/figma/quiz/icon-wind.svg" title="Pausa guiada de 2 min" text="Quando a cabeça estiver cheia" />
        <ActionRow icon="/figma/quiz/icon-community.svg" title="Roda de conversa hoje, 18h" text="Com outros estudantes, sem pressão" />
      </section>

      <div className="flex flex-col gap-2.5">
        <Link href="/home#apoio" className={primaryButton}>
          Buscar Apoio
        </Link>
        <Link href="/semana/reorganizar" className={cn(secondaryButtonLg, "w-full")}>
          Reorganizar semana
        </Link>
      </div>
    </>
  );
}
