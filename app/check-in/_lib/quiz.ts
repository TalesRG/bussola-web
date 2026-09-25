// Check-in de sinais de burnout (Q01–Q07).
// TODO(antes de lançar): validar itens e faixas com psicólogos da DASU.

import type { Level } from "@/app/home/data";

export type Dimension = "energia" | "conexao" | "dar-conta";

export const DIMENSIONS: Record<Dimension, { label: string }> = {
  energia: { label: "Energia" },
  conexao: { label: "Conexão com o curso" },
  "dar-conta": { label: "Sensação de dar conta" },
};

export type Question = {
  dimension: Dimension;
  text: string;
  /** Itens positivos ("consegui…") contam ao contrário: Nunca = 4. */
  inverted?: boolean;
};

export const QUESTIONS: Question[] = [
  { dimension: "energia", text: "Com que frequência você se sentiu esgotado(a) só de pensar na faculdade?" },
  { dimension: "energia", text: "Atrasei meu horário de deitar porque fiquei rolando o feed do celular ou usando redes sociais." },
  { dimension: "energia", text: "Acordei me sentindo exausto(a), com a sensação de que as horas de sono não foram suficientes para me recuperar." },
  { dimension: "energia", text: "Senti ansiedade ou a sensação de estar \"ficando para trás\" ao acompanhar a vida e a produtividade de colegas nas redes sociais." },
  { dimension: "conexao", text: "Com que frequência você se pegou pensando \"pra que serve tudo isso?\" sobre o seu curso?" },
  { dimension: "conexao", text: "Evitei interações e acabei me isolando de amigos ou pessoas que me fazem bem." },
  { dimension: "conexao", text: "Culpei-me de forma excessiva ou duvidei da minha capacidade intelectual ao enfrentar dificuldades em uma matéria ou prazo." },
  { dimension: "conexao", text: "Recorri a excessos (como comer muito, beber álcool, fumar ou maratonar séries) especificamente para aliviar a pressão da faculdade." },
  { dimension: "dar-conta", text: "Com que frequência você conseguiu se concentrar nos estudos quando precisou?", inverted: true },
  { dimension: "dar-conta", text: "Consegui dedicar pelo menos 15 minutos do meu dia a alguma atividade física ou movimento (como caminhada leve ou alongamento).", inverted: true },
];

export const OPTIONS = ["Nunca", "Raramente", "Às vezes", "Frequentemente", "Quase sempre"];

/** Cada dimensão é normalizada para 0–12, tenha ela quantos itens tiver. */
export const DIMENSION_MAX = 12;
const ALERT_DIMENSION = 9;

export type Scores = Record<Dimension, number>;

export function scoreAnswers(answers: (number | null)[]): Scores | null {
  if (answers.length !== QUESTIONS.length || answers.some((a) => a === null)) return null;
  const raw: Record<Dimension, { sum: number; items: number }> = {
    energia: { sum: 0, items: 0 },
    conexao: { sum: 0, items: 0 },
    "dar-conta": { sum: 0, items: 0 },
  };
  QUESTIONS.forEach((q, i) => {
    const value = answers[i]!;
    raw[q.dimension].sum += q.inverted ? OPTIONS.length - 1 - value : value;
    raw[q.dimension].items += 1;
  });
  const normalize = ({ sum, items }: { sum: number; items: number }) =>
    Math.round((sum / (items * (OPTIONS.length - 1))) * DIMENSION_MAX);
  return {
    energia: normalize(raw.energia),
    conexao: normalize(raw.conexao),
    "dar-conta": normalize(raw["dar-conta"]),
  };
}

/** 0–12 leves · 13–24 alerta · 25–36 fortes; dimensões ≥ 9 sobem o nível. */
export function levelOf(scores: Scores): Level {
  const values = Object.values(scores);
  const total = values.reduce((a, b) => a + b, 0);
  const high = values.filter((v) => v >= ALERT_DIMENSION).length;
  if (total >= 25 || high >= 2) return "fortes";
  if (total >= 13 || high === 1) return "alerta";
  return "leves";
}

export const isHigh = (score: number) => score >= ALERT_DIMENSION;

/** Resultados de exemplo do Figma, para `/check-in/resultado?exemplo=…`. */
export const EXAMPLES: Record<Level, Scores> = {
  leves: { energia: 3, conexao: 2, "dar-conta": 4 },
  alerta: { energia: 9, conexao: 7, "dar-conta": 6 },
  fortes: { energia: 11, conexao: 10, "dar-conta": 9 },
};
