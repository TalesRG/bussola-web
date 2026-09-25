// Dados de exemplo da Home enquanto o check-in e as sugestões não existem.

import { QUESTIONS } from "@/app/check-in/_lib/quiz";

export const USER = { name: "Ana", initials: "AN" };

export type Level = "leves" | "alerta" | "fortes";

export const LEVELS: Record<Level, { label: string; chip: string }> = {
  leves: { label: "Sinais leves", chip: "bg-brand-soft text-brand-ink" },
  alerta: { label: "Sinais de alerta", chip: "bg-amber-50 text-amber-800" },
  fortes: { label: "Sinais fortes", chip: "bg-amber-100 text-amber-800" },
};

/** Ponto do check-in: `value` vai de 0 (base de "Leves") a 3 (topo de "Fortes"). */
export type TrendPoint = { week: number; value: number };

export type HomeState = {
  headline: string;
  action: {
    icon: string;
    title: string;
    meta: string;
    body: string;
    primary: { label: string; href?: string };
    dismissLabel: string;
  };
  level: Level;
  summary: string;
  trend: TrendPoint[];
  nextCheckin?: string;
  fromMural?: string;
};

export const HOME_STATES = {
  /** Principal · sinais de alerta: a Home gira em torno de uma próxima ação. */
  alerta: {
    headline: "Sua semana está puxada. Vamos por partes?",
    action: {
      icon: "/figma/agenda/icon-cal.svg",
      title: "Reorganizar a semana",
      meta: "1 minuto · sugestão pronta",
      body: "Terça tem 6,5h de estudo. Mover 2 tarefas deixa todos os dias abaixo de 5h.",
      primary: { label: "Continuar", href: "/semana/reorganizar" },
      dismissLabel: "Agora não",
    },
    level: "alerta",
    summary: "Energia baixando desde a semana 6. O que mais pesou: cansaço (9 de 12).",
    trend: [
      { week: 2, value: 0.67 },
      { week: 4, value: 0.92 },
      { week: 6, value: 1.25 },
      { week: 8, value: 1.67 },
      { week: 10, value: 1.5 },
    ],
    nextCheckin: "Próximo check-in em 2 dias",
    fromMural: "Tranquei uma matéria e não foi o fim do mundo",
  },
  /** Dia de check-in: a própria ação é o check-in. */
  "check-in": {
    headline: "Faz 15 dias do seu último check-in",
    action: {
      icon: "/figma/agenda/icon-clip.svg",
      title: "Como foram estas 2 semanas?",
      meta: `2 minutos · ${QUESTIONS.length} perguntas · só você vê`,
      body: "Suas respostas decidem o que a Home vai sugerir para você nos próximos dias.",
      primary: { label: "Fazer check-in", href: "/check-in" },
      dismissLabel: "Mais tarde",
    },
    level: "leves",
    summary: "No último check-in você estava com energia em dia.",
    trend: [
      { week: 2, value: 0.67 },
      { week: 4, value: 0.92 },
      { week: 6, value: 0.75 },
      { week: 8, value: 0.58 },
    ],
  },
} satisfies Record<string, HomeState>;

export type HomeStateKey = keyof typeof HOME_STATES;

export const COURSE_RADAR = {
  title: "Semanas 16 e 17 vão ser pesadas",
  body: "4 provas previstas no calendário de Engenharia Civil. Dá para se planejar desde já.",
};
