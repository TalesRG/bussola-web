// Dados de exemplo enquanto a importação do SIGAA/comprovante não existe.

export const WEEKDAYS = ["Seg", "Ter", "Qua", "Qui", "Sex", "Sáb", "Dom"];
export const WEEKDAY_NAMES = [
  "Segunda",
  "Terça",
  "Quarta",
  "Quinta",
  "Sexta",
  "Sábado",
  "Domingo",
];

/** Linhas da grade semanal: blocos de 2h das 6h às 22h (22h = sono). */
export const GRID_HOURS = [6, 8, 10, 12, 14, 16, 18, 20, 22];
export const SLEEP_ROW = GRID_HOURS.length - 1;
export const BLOCK_HOURS = 2;

export type Course = {
  code: string;
  section: string;
  name: string;
  shortName: string;
  days: number[];
  start: number;
  room: string;
};

export const COURSES: Course[] = [
  { code: "MAT0026", section: "B", name: "Cálculo II", shortName: "Cálculo II", days: [0, 2], start: 8, room: "ICC Sul A1-12" },
  { code: "IFD0172", section: "A", name: "Física 2", shortName: "Física 2", days: [1, 3], start: 8, room: "PJC sala 8" },
  { code: "IQD0123", section: "C", name: "Química Geral", shortName: "Química Geral", days: [0, 2], start: 10, room: "IQ sala 5" },
  { code: "ENC0034", section: "A", name: "Desenho Técnico", shortName: "Desenho Técnico", days: [1], start: 10, room: "SG-12 lab 3" },
  { code: "ECO0019", section: "D", name: "Introdução à Economia", shortName: "Intr. à Economia", days: [4], start: 14, room: "FACE sala 2" },
];

export const EXAMS = [
  { date: "27 set", label: "P1", code: "MAT0026" },
  { date: "03 out", label: "P1", code: "IFD0172" },
  { date: "16 out", label: "P2", code: "IQD0123" },
  { date: "17 out", label: "P2", code: "MAT0026" },
];

export const ENROLLMENT = {
  semester: "2026/2",
  program: "Engenharia Civil",
  id: "26/0123456",
};

const pad = (n: number) => String(n).padStart(2, "0");

/** "Seg Qua 08–10h" */
export function shortSchedule(c: Course) {
  return `${c.days.map((d) => WEEKDAYS[d]).join(" ")} ${pad(c.start)}–${pad(c.start + BLOCK_HOURS)}h`;
}

/** "Seg e Qua · 08:00–09:50 · ICC Sul A1-12" */
export function longSchedule(c: Course) {
  const days = c.days.map((d) => WEEKDAYS[d]).join(" e ");
  return `${days} · ${pad(c.start)}:00–${pad(c.start + BLOCK_HOURS - 1)}:50 · ${c.room}`;
}

/* Categorias pintadas na grade (A03) */
export const CATEGORIES = [
  { name: "Estágio", swatch: "bg-azure-300" },
  { name: "Trajeto", swatch: "bg-azure-100" },
  { name: "Trabalho", swatch: "bg-lilac" },
  { name: "Academia", swatch: "bg-teal" },
  { name: "Cuidar de alguém", swatch: "bg-yellow" },
  { name: "Outro", swatch: "bg-amber-100" },
];

export function swatchOf(category: string) {
  return CATEGORIES.find((c) => c.name === category)?.swatch ?? "bg-line-muted";
}

/** Trajeto leva ~1h por viagem, não o bloco de 2h inteiro. */
export const TRAJETO = "Trajeto";
export const TRAJETO_HOURS_PER_BLOCK = 1;

/** Estimativa fixa para refeições e pausas nos dias úteis (≈5h/dia). */
export const MEALS_AND_BREAKS_HOURS = 26;
