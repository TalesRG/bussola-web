// Semana de exemplo para "Reorganizar a semana" (Q08–Q09).

export const WEEK_LIMIT = 5;
export const WEEK_DAYS = ["Seg", "Ter", "Qua", "Qui", "Sex"];
export const WEEK_DAY_NAMES = ["Segunda", "Terça", "Quarta", "Quinta", "Sexta"];
export const WEEK_LABEL = "Semana 12 · 3 entregas e 1 prova";

/** Horas de estudo planejadas por dia, antes das mudanças. */
export const BASE_HOURS = [2, 6.5, 5, 3, 1.5];

export type Change = {
  id: string;
  title: string;
  hours: number;
  from: number;
  /** `null` = vai para a semana seguinte. */
  to: number | null;
  toLabel: string;
  reason: string;
  newSlot: string;
  needsProfessor?: boolean;
};

export const CHANGES: Change[] = [
  {
    id: "calculo",
    title: "Revisar cap. 3 · Cálculo II",
    hours: 1.5,
    from: 1,
    to: 3,
    toLabel: "Qui",
    reason: "Terça passa do limite; quinta tem espaço à tarde.",
    newSlot: "Quinta, 14h–15h30 · lembrete 15 min antes",
  },
  {
    id: "lista",
    title: "Lista 4 · Física",
    hours: 1,
    from: 2,
    to: 0,
    toLabel: "Seg",
    reason: "Adiantar para segunda deixa a quarta mais tranquila.",
    newSlot: "Segunda, 16h–17h",
  },
  {
    id: "relatorio",
    title: "Relatório de Física · parte 3",
    hours: 0.5,
    from: 4,
    to: null,
    toLabel: "Seg (dia 29)",
    reason: "Opcional: precisa do ok do professor.",
    newSlot: "Segunda, dia 29 · próxima semana",
    needsProfessor: true,
  },
];

export const DEFAULT_SELECTED = ["calculo", "lista"];

export function hoursAfter(selected: string[]) {
  const hours = [...BASE_HOURS];
  for (const c of CHANGES) {
    if (!selected.includes(c.id)) continue;
    hours[c.from] -= c.hours;
    if (c.to !== null) hours[c.to] += c.hours;
  }
  return hours;
}

/** 4.5 → "4,5h" */
export const formatHours = (h: number) => `${String(h).replace(".", ",")}h`;

/** 1.5 → "1h30", 1 → "1h", 0.5 → "30 min" */
export function formatDuration(h: number) {
  const whole = Math.floor(h);
  const minutes = Math.round((h - whole) * 60);
  if (whole === 0) return `${minutes} min`;
  return minutes ? `${whole}h${minutes}` : `${whole}h`;
}
