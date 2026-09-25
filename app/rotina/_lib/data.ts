export const DAYS = ["Seg", "Ter", "Qua", "Qui", "Sex", "Sáb", "Dom"];
export const DAY_NAMES = [
  "Segunda",
  "Terça",
  "Quarta",
  "Quinta",
  "Sexta",
  "Sábado",
  "Domingo",
];
export const DATES = DAYS.map((_, i) => `2024-09-${23 + i}`); // Semana de exemplo do Figma.
export const BASE_HOURS = [3, 5, 4, 4.5, 1.5, 0, 0];
export const PRIORITIES = [
  {
    id: "prova",
    title: "Prova de Cálculo II",
    meta: "Sexta, 27 · 10h",
    type: "Prova",
  },
  {
    id: "relatorio",
    title: "Relatório de Física · parte 2",
    meta: "Entrega quinta, 26 · 23:59",
    type: "Entrega",
  },
  {
    id: "lista",
    title: "Lista 4 de Física",
    meta: "Entrega sexta, 27",
    type: "Entrega",
  },
  {
    id: "leitura",
    title: "Leitura de Química, cap. 5",
    meta: "Sem prazo",
    type: "Estudo",
  },
  {
    id: "seminario",
    title: "Seminário de Humanidades",
    meta: "Apresentação em 2 semanas",
    type: "Preparar",
  },
];
export type Slot = { day: number; start: number; end: number };
export type Entry = Slot & {
  id: string;
  title: string;
  detail: string;
  kind: "class" | "study" | "personal" | "delivery";
  done?: boolean;
  batch?: string;
  repeat?: boolean;
  reservationId?: string;
};
export const INITIAL_ENTRIES: Entry[] = [
  {
    id: "calculo-qua",
    day: 2,
    start: 480,
    end: 590,
    title: "Cálculo II",
    detail: "ICC Sul · AT-12",
    kind: "class",
  },
  {
    id: "fisica-qua",
    day: 2,
    start: 600,
    end: 710,
    title: "Física 2",
    detail: "PUC · sala 8",
    kind: "class",
  },
  {
    id: "almoco",
    day: 2,
    start: 720,
    end: 780,
    title: "Almoço",
    detail: "Horário protegido",
    kind: "personal",
  },
  {
    id: "lista",
    day: 2,
    start: 840,
    end: 930,
    title: "Lista 4 de Física",
    detail: "Adiantada de quarta para segunda: feita",
    kind: "study",
    done: true,
  },
  {
    id: "revisao",
    day: 2,
    start: 945,
    end: 1035,
    title: "Revisar cap. 2 · Cálculo II",
    detail: "Para a prova de sexta · bloco 1 de 3",
    kind: "study",
  },
  {
    id: "entrega",
    day: 2,
    start: 1080,
    end: 1080,
    title: "Relatório de Física · parte 1",
    detail: "Entrega às 23:59 · pronto para enviar",
    kind: "delivery",
  },
  {
    id: "roda",
    day: 2,
    start: 1140,
    end: 1200,
    title: "Roda de conversa (opcional)",
    detail: "Casa do Estudante · você marcou “Eu vou”",
    kind: "personal",
  },
];
export const time = (minutes: number) =>
  `${Math.floor(minutes / 60)
    .toString()
    .padStart(2, "0")}:${(minutes % 60).toString().padStart(2, "0")}`;
export const minutes = (value: string) => {
  const [h, m] = value.split(":").map(Number);
  return h * 60 + m;
};
export const overlaps = (a: Slot, b: Slot) =>
  a.day === b.day && a.start < b.end && a.end > b.start;
export function parseAppointment(text: string) {
  const normalized = text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
  const names = [
    "segunda",
    "terca",
    "quarta",
    "quinta",
    "sexta",
    "sabado",
    "domingo",
  ];
  const day = names.findIndex((name) => normalized.includes(name));
  const match = normalized.match(
    /\b([01]?\d|2[0-3])(?:h(?:(\d{2}))?|:(\d{2}))\b/,
  );
  const start = match
    ? Number(match[1]) * 60 + Number(match[2] || match[3] || 0)
    : normalized.includes("manha")
      ? 540
      : normalized.includes("tarde")
        ? 840
        : normalized.includes("noite")
          ? 1140
          : null;
  const title = text
    .split(
      /\b(?:segunda|terça|quarta|quinta|sexta|sábado|domingo|toda|todo)\b/i,
    )[0]
    .trim();
  return {
    title,
    day: day < 0 ? null : day,
    start,
    repeat: /\b(toda|todo)\b/.test(normalized),
    type: /estud|revis/.test(normalized) ? "Estudo" : "Pessoal",
  };
}

// O relatório já integra a estimativa semanal, mas seus blocos aguardam confirmação.
export const REPORT_RESERVATION = {
  id: "relatorio-parte-2",
  title: "Relatório de Física · parte 2",
  hours: [0, 0, 1, 1, 0, 0, 0],
};
export function plannedHours(entries: Entry[], releaseReservation = false) {
  const claimed =
    releaseReservation ||
    entries.some((e) => e.reservationId === REPORT_RESERVATION.id);
  return BASE_HOURS.map(
    (base, day) =>
      base -
      (claimed ? REPORT_RESERVATION.hours[day] : 0) +
      entries
        .filter((e) => e.batch && e.kind === "study" && e.day === day)
        .reduce((sum, e) => sum + (e.end - e.start) / 60, 0),
  );
}
