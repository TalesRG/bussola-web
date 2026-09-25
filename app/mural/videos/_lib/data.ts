// Conteúdo de demonstração do Figma. Os arquivos de mídia serão fornecidos pelo catálogo.
export type Video = {
  id: string;
  title: string;
  name: string;
  course: string;
  initials: string;
  duration: number;
  themes: string[];
  tone: "blue" | "gray" | "amber";
  short?: boolean;
  quote?: string;
  src?: string;
  captionsSrc?: string;
};

export const VIDEOS: Video[] = [
  {
    id: "marina",
    title: "Reprovei duas vezes em Cálculo 1. Hoje sou monitora",
    name: "Marina",
    course: "Engenharia Civil",
    initials: "MA",
    duration: 400,
    themes: ["Provas", "Reprovação"],
    tone: "blue",
    quote: "…e foi aí que eu entendi que pedir ajuda não era fraqueza.",
  },
  {
    id: "lucas",
    title: "Como parei de travar nas provas",
    name: "Lucas",
    course: "Computação",
    initials: "LU",
    duration: 228,
    themes: ["Provas", "Ansiedade"],
    tone: "blue",
  },
  {
    id: "bia",
    title: "Minha rotina na semana de provas",
    name: "Bia",
    course: "Farmácia",
    initials: "BI",
    duration: 310,
    themes: ["Provas"],
    tone: "gray",
  },
  {
    id: "davi",
    title: "Cheguei do interior sem conhecer ninguém",
    name: "Davi",
    course: "Agronomia",
    initials: "DA",
    duration: 270,
    themes: ["Primeiro ano", "Solidão"],
    tone: "amber",
  },
  {
    id: "carla",
    title: "O que eu queria saber no 1º semestre",
    name: "Carla",
    course: "Direito",
    initials: "CA",
    duration: 175,
    themes: ["Primeiro ano"],
    tone: "blue",
  },
  {
    id: "respira",
    title: "Respira antes da prova",
    name: "Lucas",
    course: "Computação",
    initials: "LU",
    duration: 58,
    themes: ["Provas"],
    tone: "blue",
    short: true,
  },
  {
    id: "ajuda",
    title: "Tudo bem pedir ajuda",
    name: "Júlia",
    course: "Medicina",
    initials: "JU",
    duration: 58,
    themes: ["Ansiedade"],
    tone: "gray",
    short: true,
    quote: "Tudo bem pedir ajuda. Eu demorei dois anos pra entender isso.",
  },
  {
    id: "um-dia",
    title: "Um dia de cada vez",
    name: "Davi",
    course: "Agronomia",
    initials: "DA",
    duration: 58,
    themes: ["Solidão"],
    tone: "amber",
    short: true,
  },
];

export const SHORTS = VIDEOS.filter((video) => video.short);
export const THEMES = [
  "Todos",
  "Provas",
  "Primeiro ano",
  "Ansiedade",
  "Solidão",
];
export const CHAPTERS = [
  { time: 0, title: "O começo difícil" },
  { time: 105, title: "Quando pensei em desistir" },
  { time: 150, title: "O que me ajudou" },
  { time: 290, title: "O que eu diria para você" },
];
export const formatTime = (seconds: number) =>
  `${Math.floor(seconds / 60)}:${String(Math.floor(seconds % 60)).padStart(2, "0")}`;
export const videoHref = (video: Video) =>
  video.short
    ? `/mural/videos/curtos?video=${video.id}`
    : `/mural/videos/${video.id}`;
