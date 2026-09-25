// Notificações de exemplo (N01).

export type NotificationFilter = "para-voce" | "rotina" | "mural";
export type NotificationGroup = "hoje" | "semana" | "anteriores";

export type AppNotification = {
  id: string;
  group: NotificationGroup;
  filter: NotificationFilter;
  icon: string;
  iconBg: string;
  title: string;
  time: string;
  body: string;
  action?: { label: string; href?: string; primary?: boolean };
  /** Texto do botão que só marca como lida. */
  later?: string;
};

export const FILTERS: { value: NotificationFilter | "todas"; label: string }[] = [
  { value: "todas", label: "Todas" },
  { value: "para-voce", label: "Para você" },
  { value: "rotina", label: "Rotina" },
  { value: "mural", label: "Mural" },
];

export const GROUPS: { value: NotificationGroup; label: string }[] = [
  { value: "hoje", label: "Hoje" },
  { value: "semana", label: "Esta semana" },
  { value: "anteriores", label: "Anteriores" },
];

export const NOTIFICATIONS: AppNotification[] = [
  {
    id: "checkin",
    group: "hoje",
    filter: "para-voce",
    icon: "/figma/home/n-clip.svg",
    iconBg: "bg-surface",
    title: "Seu check-in está disponível",
    time: "9:00",
    body: "Faz 15 dias do último. Leva 2 minutos.",
    action: { label: "Fazer check-in", href: "/check-in", primary: true },
    later: "Depois",
  },
  {
    id: "semanas-pesadas",
    group: "hoje",
    filter: "rotina",
    icon: "/figma/home/n-book-stack.svg",
    iconBg: "bg-amber-50",
    title: "Semanas pesadas à frente",
    time: "8:30",
    body: "Semanas 16 e 17 têm 4 provas no seu curso. Quer se planejar desde já?",
    action: { label: "Planejar" },
  },
  {
    id: "bloco",
    group: "hoje",
    filter: "rotina",
    icon: "/figma/home/n-clock.svg",
    iconBg: "bg-subtle",
    title: "Bloco de estudo em 15 min",
    time: "15:30",
    body: "Revisar cap. 2 · Cálculo II, às 15:45",
  },
  {
    id: "dasu",
    group: "semana",
    filter: "para-voce",
    icon: "/figma/home/n-heart.svg",
    iconBg: "bg-brand-soft",
    title: "Conversa com a DASU confirmada",
    time: "Ontem",
    body: "Quinta, 26 · 10h · presencial na Casa do Estudante.",
    action: { label: "Ver detalhes" },
  },
  {
    id: "roda",
    group: "semana",
    filter: "mural",
    icon: "/figma/home/n-community.svg",
    iconBg: "bg-subtle",
    title: "Alguém do seu curso vai à roda de conversa",
    time: "Seg",
    body: "Casa do Estudante, hoje às 18h. Você não vai chegar sozinho(a).",
  },
  {
    id: "historia",
    group: "semana",
    filter: "mural",
    icon: "/figma/home/n-page-edit.svg",
    iconBg: "bg-subtle",
    title: "Sua história foi publicada",
    time: "Seg",
    body: "Já ajudou 12 pessoas. Obrigado por compartilhar.",
  },
  {
    id: "reorganizada",
    group: "anteriores",
    filter: "rotina",
    icon: "/figma/home/n-cal.svg",
    iconBg: "bg-subtle",
    title: "Semana reorganizada",
    time: "20 set",
    body: "2 tarefas mudaram de dia. Você pode desfazer até domingo.",
    action: { label: "Desfazer" },
  },
];
