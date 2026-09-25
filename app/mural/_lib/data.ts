// Conteúdo de exemplo do Mural (Figma "Histórias" e "Avisos").

export const FEED_THEMES = ["Todas", "Ansiedade", "Burnout", "Reprovação", "Solidão"];

export const STORY_THEMES = [
  "Ansiedade",
  "Burnout",
  "Reprovação",
  "Solidão",
  "Longe de casa",
  "Finanças",
  "Trancamento",
];

export type Reaction = "ajudou" | "identifiquei" | "obrigado";

export const REACTIONS: { key: Reaction; label: string; icon: string }[] = [
  { key: "ajudou", label: "Me ajudou", icon: "/figma/home/n-heart.svg" },
  { key: "identifiquei", label: "Me identifiquei", icon: "/figma/mural/community-20.svg" },
  { key: "obrigado", label: "Obrigado", icon: "/figma/mural/emoji-20.svg" },
];

type StoryDetail = {
  aconteceu: string;
  ajudou: string[];
  diria: string;
  recursos: { icon: string; title: string; sub: string; href?: string }[];
  /** Contagem sem a reação de quem está lendo. */
  reacoes: Record<Reaction, number>;
};

export type Story = {
  id: string;
  tema: string;
  leitura: string;
  titulo: string;
  trecho: string;
  nome: string;
  curso: string;
  semestre?: string;
  iniciais: string;
  ajudaram: number;
  featured?: boolean;
  /** Só histórias com o texto completo abrem em tela própria. */
  detail?: StoryDetail;
};

export const STORIES: Story[] = [
  {
    id: "marina",
    tema: "Reprovação",
    leitura: "4 min",
    titulo: "Reprovei em Cálculo 1 duas vezes. Hoje sou monitora.",
    trecho:
      "Eu achava que não era capaz de fazer engenharia. Pedir ajuda na monitoria foi o primeiro passo, e o mais difícil.",
    nome: "Marina",
    curso: "Engenharia Civil",
    semestre: "7º semestre",
    iniciais: "MA",
    ajudaram: 312,
    featured: true,
    detail: {
      aconteceu:
        "No primeiro ano eu estudava sozinha, de madrugada, e travava nas provas. Depois da segunda reprovação, pensei em trocar de curso. Eu tinha vergonha de contar para a minha família.",
      ajudou: [
        'Ir à monitoria mesmo achando que "já devia saber"',
        "Estudar em dupla duas vezes por semana",
        "Conversar com a DASU sobre a ansiedade de prova",
      ],
      diria:
        "Reprovar não diz quem você é. Pedir ajuda cedo teria me poupado um ano de sofrimento.",
      recursos: [
        {
          icon: "/figma/mural/book-stack-brand-20.svg",
          title: "Monitoria de Cálculo 1",
          sub: "Seg a qui, 14h–18h · ICC Sul",
        },
        {
          icon: "/figma/mural/chat-20.svg",
          title: "Conversar com a DASU",
          sub: "Acolhimento gratuito · presencial ou online",
          href: "/home#apoio",
        },
      ],
      reacoes: { ajudou: 311, identifiquei: 198, obrigado: 87 },
    },
  },
  {
    id: "lucas",
    tema: "Ansiedade",
    leitura: "3 min",
    titulo: "Achei que era só eu que travava nas provas",
    trecho: "No 2º semestre eu tinha crises antes de toda prova. O que mudou foi…",
    nome: "Lucas",
    curso: "Ciência da Computação",
    iniciais: "LS",
    ajudaram: 86,
  },
  {
    id: "anonimo-ri",
    tema: "Solidão",
    leitura: "5 min",
    titulo: "Mudei de Belém para Brasília e passei um semestre sem amigos",
    trecho:
      "Eu almoçava sozinho todo dia no RU. Uma roda de conversa da DASU mudou isso…",
    nome: "Anônimo",
    curso: "Relações Internacionais",
    iniciais: "?",
    ajudaram: 142,
  },
  {
    id: "julia",
    tema: "Burnout",
    leitura: "3 min",
    titulo: "Tranquei uma matéria e não foi o fim do mundo",
    trecho:
      "Eu estava com 7 disciplinas e dormindo 4 horas. Reduzir foi a melhor decisão…",
    nome: "Júlia",
    curso: "Medicina",
    iniciais: "JU",
    ajudaram: 203,
  },
];

export const findStory = (id: string) => STORIES.find((s) => s.id === id);

export type Identity = "nome" | "curso" | "anonimo";

/** Como a autora aparece no mural, a partir do perfil (Home: Ana). */
export const IDENTITIES: {
  key: Identity;
  label: string;
  autor: string;
  iniciais: string;
}[] = [
  { key: "nome", label: "Primeiro nome e curso", autor: "Ana · Psicologia", iniciais: "AN" },
  { key: "curso", label: "Só o curso", autor: "Estudante de Psicologia", iniciais: "?" },
  { key: "anonimo", label: "Totalmente anônimo", autor: "Anônimo", iniciais: "?" },
];

/* ---------------------------------- Avisos --------------------------------- */

export const NOTICE_FILTERS = ["Todos", "DASU", "Seu curso", "Prazos", "Campus"];

export type SourceTone = "brand" | "soft" | "amber" | "subtle";

export type Notice = {
  id: string;
  sigla: string;
  tone: SourceTone;
  fonte: string;
  data: string;
  titulo: string;
  resumo: string;
  filtros: string[];
  faltam?: string;
  /** Só avisos com o texto completo abrem em tela própria. */
  aberto?: boolean;
};

export const HIGHLIGHT: Notice & { publico: string } = {
  id: "plantao",
  sigla: "DA",
  tone: "brand",
  fonte: "DASU · Diretoria de Atenção à Saúde",
  data: "Hoje, 9:00",
  titulo: "Plantão extra de acolhimento nas semanas 16 e 17",
  resumo:
    "Mais horários de conversa, presencial e online, de 13 a 24 de outubro. São as semanas com mais provas no seu curso.",
  filtros: ["DASU", "Seu curso"],
  publico: "Para Engenharia Civil",
};

export const DEADLINES: Notice[] = [
  {
    id: "auxilio",
    sigla: "AE",
    tone: "amber",
    fonte: "Assistência Estudantil · UnB",
    data: "22 set",
    titulo: "Inscrições para auxílio emergencial",
    resumo: "Para quem está com dificuldade financeira neste semestre.",
    filtros: ["Prazos"],
    faltam: "faltam 6 dias",
  },
  {
    id: "trancamento",
    sigla: "CG",
    tone: "subtle",
    fonte: "Coordenação de Graduação",
    data: "20 set",
    titulo: "Prazo para trancar disciplina",
    resumo:
      "Trancar não é fracassar. Se estiver em dúvida, converse antes de decidir.",
    filtros: ["Prazos", "Seu curso"],
    faltam: "faltam 16 dias",
    aberto: true,
  },
];

export const SERVICES: Pick<Notice, "id" | "sigla" | "tone" | "titulo" | "resumo" | "filtros">[] = [
  {
    id: "rodas",
    sigla: "DA",
    tone: "soft",
    titulo: "Rodas de conversa de outubro",
    resumo: "DASU · toda terça, 18h, Casa do Estudante",
    filtros: ["Campus", "DASU"],
  },
  {
    id: "bce",
    sigla: "BCE",
    tone: "subtle",
    titulo: "Salas de estudo em grupo liberadas",
    resumo: "Biblioteca Central · reserva pelo site, até 2h",
    filtros: ["Campus"],
  },
  {
    id: "ru",
    sigla: "RU",
    tone: "subtle",
    titulo: "Café da manhã reforçado na semana de provas",
    resumo: "Restaurante Universitário · 13 a 24 de outubro",
    filtros: ["Campus"],
  },
];
