"use client";

import {
  createContext,
  useContext,
  useMemo,
  useState,
  type Dispatch,
  type ReactNode,
  type SetStateAction,
} from "react";
import { COURSES, GRID_HOURS } from "@/app/agenda/_lib/data";
import { QUESTIONS } from "@/app/check-in/_lib/quiz";
import { DEFAULT_SELECTED } from "@/app/semana/_lib/week";

export type Cells = Record<string, string>;
export const cellKey = (day: number, row: number) => `${day}-${row}`;

export type Rhythm = {
  peak: "Manhã" | "Tarde" | "Noite";
  maxHours: number;
  shutdown: string;
  lightDay: number;
  reminders: { beforeBlock: boolean; weeklySummary: boolean; heavyWeek: boolean };
};

export type UploadedFile = { name: string; size: number };

/** Reorganização da semana (Q08–Q09). */
export type WeekPlan = {
  selected: string[];
  /** Mudanças aplicadas; `null` enquanto nada foi aplicado. */
  applied: string[] | null;
  protectNight: boolean;
  breakReminder: boolean;
};

/** Ajustes de notificações (N02). Os lembretes de rotina ficam em `rhythm.reminders`. */
export type NotificationPrefs = {
  discreet: boolean;
  checkinReminder: boolean;
  storyPublished: boolean;
  newStories: boolean;
  quietStart: string;
  quietEnd: string;
  dailyLimit: boolean;
};

const rowOf = (hour: number) => GRID_HOURS.indexOf(hour);

// Estado inicial igual ao exemplo do Figma.
const initialCells: Cells = {};
for (let day = 0; day < 5; day++) {
  initialCells[cellKey(day, rowOf(6))] = "Trajeto";
  initialCells[cellKey(day, rowOf(18))] = "Trajeto";
}
for (const day of [1, 3]) {
  initialCells[cellKey(day, rowOf(14))] = "Estágio";
  initialCells[cellKey(day, rowOf(16))] = "Estágio";
}

type AppContext = {
  enabled: Record<string, boolean>;
  setEnabled: Dispatch<SetStateAction<Record<string, boolean>>>;
  categories: string[];
  setCategories: Dispatch<SetStateAction<string[]>>;
  cells: Cells;
  setCells: Dispatch<SetStateAction<Cells>>;
  rhythm: Rhythm;
  setRhythm: Dispatch<SetStateAction<Rhythm>>;
  upload: UploadedFile | null;
  setUpload: Dispatch<SetStateAction<UploadedFile | null>>;
  /** "dia-linha" das aulas das turmas marcadas */
  classCells: Set<string>;
  notificationPrefs: NotificationPrefs;
  setNotificationPrefs: Dispatch<SetStateAction<NotificationPrefs>>;
  /** Ids das notificações ainda não lidas (ver app/notificacoes/data.ts). */
  unread: string[];
  setUnread: Dispatch<SetStateAction<string[]>>;
  /** Respostas do check-in, índice da opção (0–4) por pergunta. */
  answers: (number | null)[];
  setAnswers: Dispatch<SetStateAction<(number | null)[]>>;
  weekPlan: WeekPlan;
  setWeekPlan: Dispatch<SetStateAction<WeekPlan>>;
};

const Context = createContext<AppContext | null>(null);

export function AppProvider({ children }: { children: ReactNode }) {
  const [enabled, setEnabled] = useState<Record<string, boolean>>(() =>
    Object.fromEntries(COURSES.map((c) => [c.code, c.code !== "ECO0019"])),
  );
  const [categories, setCategories] = useState(["Estágio", "Trajeto"]);
  const [cells, setCells] = useState(initialCells);
  const [rhythm, setRhythm] = useState<Rhythm>({
    peak: "Tarde",
    maxHours: 5,
    shutdown: "23:00",
    lightDay: 5,
    reminders: { beforeBlock: true, weeklySummary: true, heavyWeek: true },
  });
  const [upload, setUpload] = useState<UploadedFile | null>(null);
  const [notificationPrefs, setNotificationPrefs] = useState<NotificationPrefs>({
    discreet: true,
    checkinReminder: true,
    storyPublished: true,
    newStories: false,
    quietStart: "23:00",
    quietEnd: "08:00",
    dailyLimit: true,
  });
  const [unread, setUnread] = useState(["checkin", "semanas-pesadas"]);
  const [answers, setAnswers] = useState<(number | null)[]>(() =>
    QUESTIONS.map(() => null),
  );
  const [weekPlan, setWeekPlan] = useState<WeekPlan>({
    selected: DEFAULT_SELECTED,
    applied: null,
    protectNight: true,
    breakReminder: false,
  });

  const classCells = useMemo(() => {
    const set = new Set<string>();
    for (const c of COURSES) {
      if (!enabled[c.code]) continue;
      for (const day of c.days) set.add(cellKey(day, rowOf(c.start)));
    }
    return set;
  }, [enabled]);

  return (
    <Context
      value={{
        enabled,
        setEnabled,
        categories,
        setCategories,
        cells,
        setCells,
        rhythm,
        setRhythm,
        upload,
        setUpload,
        classCells,
        notificationPrefs,
        setNotificationPrefs,
        unread,
        setUnread,
        answers,
        setAnswers,
        weekPlan,
        setWeekPlan,
      }}
    >
      {children}
    </Context>
  );
}

export function useAppState() {
  const ctx = useContext(Context);
  if (!ctx) throw new Error("useAppState precisa estar dentro de <AppProvider>");
  return ctx;
}
