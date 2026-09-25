"use client";
import {
  createContext,
  useContext,
  useState,
  type Dispatch,
  type SetStateAction,
  type ReactNode,
} from "react";
import { INITIAL_ENTRIES, type Entry } from "./data";
type Routine = {
  priorities: string[];
  planned: boolean;
  entries: Entry[];
  day: number;
  lastBatch: string | null;
};
const Context = createContext<{
  routine: Routine;
  setRoutine: Dispatch<SetStateAction<Routine>>;
} | null>(null);
export function RoutineProvider({ children }: { children: ReactNode }) {
  const [routine, setRoutine] = useState<Routine>({
    priorities: ["prova", "relatorio", "lista"],
    planned: false,
    entries: INITIAL_ENTRIES,
    day: 2,
    lastBatch: null,
  });
  return <Context value={{ routine, setRoutine }}>{children}</Context>;
}
export function useRoutine() {
  const context = useContext(Context);
  if (!context) throw new Error("RoutineProvider ausente");
  return context;
}
