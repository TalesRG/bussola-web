"use client";

import {
  createContext,
  useContext,
  useState,
  type Dispatch,
  type ReactNode,
  type SetStateAction,
} from "react";
import type { Identity, Reaction } from "./data";

/** Rascunho de "Contar minha história" (H03–H04). */
export type Draft = {
  temas: string[];
  titulo: string;
  partes: [string, string, string];
  identidade: Identity;
  concordo: boolean;
  salvo: boolean;
};

// Estado inicial igual ao exemplo do Figma.
const initialDraft: Draft = {
  temas: ["Ansiedade", "Solidão"],
  titulo: "",
  partes: [
    "Eu tinha crises de ansiedade antes das provas e comecei a faltar nas aulas de sexta…",
    "",
    "",
  ],
  identidade: "nome",
  concordo: true,
  salvo: false,
};

const emptyDraft: Draft = {
  temas: [],
  titulo: "",
  partes: ["", "", ""],
  identidade: "nome",
  concordo: false,
  salvo: false,
};

type MuralContext = {
  draft: Draft;
  setDraft: Dispatch<SetStateAction<Draft>>;
  /** Hora do último envio, para o status em H05. */
  sentAt: Date | null;
  submit: () => void;
  /** Reações de quem está lendo, por história. */
  reactions: Record<string, Reaction[]>;
  toggleReaction: (story: string, reaction: Reaction) => void;
  /** Ids de histórias e avisos salvos ou postos na agenda. */
  saved: string[];
  toggleSaved: (id: string) => void;
  inAgenda: string[];
  addToAgenda: (id: string) => void;
};

const Context = createContext<MuralContext | null>(null);

const toggle = <T,>(list: T[], item: T) =>
  list.includes(item) ? list.filter((i) => i !== item) : [...list, item];

export function MuralProvider({ children }: { children: ReactNode }) {
  const [draft, setDraft] = useState(initialDraft);
  const [sentAt, setSentAt] = useState<Date | null>(null);
  const [reactions, setReactions] = useState<Record<string, Reaction[]>>({
    marina: ["ajudou"],
  });
  const [saved, setSaved] = useState<string[]>([]);
  const [inAgenda, setInAgenda] = useState<string[]>([]);

  return (
    <Context
      value={{
        draft,
        setDraft,
        sentAt,
        submit: () => {
          setSentAt(new Date());
          setDraft(emptyDraft);
        },
        reactions,
        toggleReaction: (story, reaction) =>
          setReactions((r) => ({ ...r, [story]: toggle(r[story] ?? [], reaction) })),
        saved,
        toggleSaved: (id) => setSaved((s) => toggle(s, id)),
        inAgenda,
        addToAgenda: (id) =>
          setInAgenda((a) => (a.includes(id) ? a : [...a, id])),
      }}
    >
      {children}
    </Context>
  );
}

export function useMural() {
  const ctx = useContext(Context);
  if (!ctx) throw new Error("useMural precisa estar dentro de <MuralProvider>");
  return ctx;
}
