"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { cn, primaryButton, textLink } from "../../_components/ui";
import {
  caption,
  display,
  heading,
  Icon,
  StepTop,
  StickyFooter,
} from "../_components/ui";
import { STORY_THEMES } from "../_lib/data";
import { useMural, type Draft } from "../_lib/state";

const MAX_THEMES = 2;
const MAX_CHARS = 1200;

const PARTS = [
  {
    question: "O que você enfrentou?",
    placeholder: "Conte o que aconteceu com você…",
  },
  {
    question: "O que te ajudou?",
    placeholder: "Pessoas, lugares, hábitos, serviços da UnB…",
  },
  {
    question: "O que você diria a quem está passando por isso?",
    placeholder: "Uma frase que você gostaria de ter ouvido",
  },
];

const RULES = [
  "Não cite nomes de professores ou colegas",
  "Foque no que ajudou; evite detalhes de autolesão",
  "Se estiver em crise agora, fale com a DASU ou ligue 188",
];

const count = new Intl.NumberFormat("pt-BR");

// H03 · Contar minha história, passo 1.
export default function Page() {
  const router = useRouter();
  const { draft, setDraft } = useMural();
  const [active, setActive] = useState(0);

  const update = (patch: Partial<Draft>) =>
    setDraft((d) => ({ ...d, ...patch, salvo: false }));

  const toggleTheme = (theme: string) =>
    update({
      temas: draft.temas.includes(theme)
        ? draft.temas.filter((t) => t !== theme)
        : [...draft.temas, theme],
    });

  const canContinue =
    draft.temas.length > 0 && draft.partes.some((p) => p.trim() !== "");

  return (
    <>
      <StepTop
        step={1}
        backHref="/mural"
        action={
          <button
            type="button"
            onClick={() => setDraft((d) => ({ ...d, salvo: true }))}
            aria-live="polite"
            className={cn(textLink, draft.salvo && "text-ink-3 hover:no-underline")}
          >
            {draft.salvo ? "Rascunho salvo" : "Salvar rascunho"}
          </button>
        }
      />

      <form
        id="historia"
        onSubmit={(e) => {
          e.preventDefault();
          if (canContinue) router.push("/mural/contar/aparecer");
        }}
        className="flex flex-col gap-[22px] p-5"
      >
        <div className="flex flex-col gap-2">
          <h1 className={display}>Conte sua história</h1>
          <p className="text-base leading-normal text-ink-2">
            Não precisa ser perfeita. Seja sincero(a): é isso que ajuda quem está
            passando pelo mesmo.
          </p>
        </div>

        <fieldset className="flex flex-col gap-2.5">
          <legend className="mb-2.5 flex flex-col gap-0.5">
            <span className={heading}>Sobre o que é sua história?</span>
            <span className="text-xs leading-normal text-ink-3">
              Escolha até {MAX_THEMES} temas
            </span>
          </legend>
          <div className="flex flex-wrap gap-2">
            {STORY_THEMES.map((theme) => {
              const selected = draft.temas.includes(theme);
              const full = !selected && draft.temas.length >= MAX_THEMES;
              return (
                <button
                  key={theme}
                  type="button"
                  aria-pressed={selected}
                  disabled={full}
                  onClick={() => toggleTheme(theme)}
                  className={cn(
                    "flex items-center justify-center rounded-full border px-3.5 py-[9px] font-display text-sm leading-none font-bold transition focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand disabled:cursor-not-allowed",
                    selected
                      ? "border-brand bg-brand-soft text-brand-ink"
                      : "border-line bg-surface text-ink enabled:hover:border-line-muted",
                  )}
                >
                  {theme}
                </button>
              );
            })}
          </div>
        </fieldset>

        <div className="flex flex-col gap-2">
          <label htmlFor="titulo" className={heading}>
            Título
          </label>
          <input
            id="titulo"
            value={draft.titulo}
            onChange={(e) => update({ titulo: e.target.value })}
            placeholder='Ex.: "No primeiro semestre eu quase desisti"'
            maxLength={120}
            className="rounded-[14px] border border-line px-4 py-3.5 text-base leading-normal text-ink outline-none placeholder:text-ink-4 focus:border-brand focus:ring-[0.5px] focus:ring-brand"
          />
        </div>

        <fieldset className="flex flex-col gap-3">
          <legend className="mb-3 flex flex-col gap-0.5">
            <span className={heading}>Sua história em 3 partes</span>
            <span className="text-xs leading-normal text-ink-3">
              Use as perguntas como guia. Pode pular o que não quiser responder.
            </span>
          </legend>
          {PARTS.map((part, i) => {
            const isActive = i === active;
            const id = `parte-${i + 1}`;
            return (
              <div
                key={part.question}
                className={cn(
                  "flex flex-col gap-2 rounded-2xl p-3.5",
                  isActive
                    ? "border-[1.5px] border-brand"
                    : "border border-line",
                )}
              >
                <label htmlFor={id} className="flex items-center gap-2">
                  <span
                    className={cn(
                      "flex size-[22px] shrink-0 items-center justify-center rounded-full font-display text-xs leading-none font-bold",
                      isActive ? "bg-brand text-white" : "bg-subtle text-ink-2",
                    )}
                  >
                    {i + 1}
                  </span>
                  <span className="flex-1 text-sm leading-normal font-bold text-ink">
                    {part.question}
                  </span>
                </label>
                <textarea
                  id={id}
                  value={draft.partes[i]}
                  onFocus={() => setActive(i)}
                  onChange={(e) => {
                    const partes = [...draft.partes] as Draft["partes"];
                    partes[i] = e.target.value;
                    update({ partes });
                  }}
                  placeholder={part.placeholder}
                  maxLength={MAX_CHARS}
                  className={cn(
                    "w-full resize-none bg-transparent text-sm leading-normal text-ink outline-none placeholder:text-ink-4",
                    isActive ? "h-[76px]" : "h-[52px]",
                  )}
                />
                {isActive && (
                  <p className={cn(caption, "self-end")}>
                    {count.format(draft.partes[i].length)} / {count.format(MAX_CHARS)}
                  </p>
                )}
              </div>
            );
          })}
        </fieldset>

        <section className="flex flex-col gap-2.5 rounded-2xl bg-surface-muted p-4">
          <h2 className="flex items-center gap-2 text-sm leading-normal font-bold text-ink">
            <Icon src="/figma/mural/warning-18.svg" size={18} />
            Antes de escrever
          </h2>
          <ul className="flex flex-col gap-2.5">
            {RULES.map((rule) => (
              <li key={rule} className="flex items-start gap-2">
                <Icon src="/figma/agenda/icon-check-dark-14.svg" size={14} />
                <span className="flex-1 text-xs leading-normal text-ink-2">
                  {rule}
                </span>
              </li>
            ))}
          </ul>
        </section>
      </form>

      <StickyFooter>
        <button
          type="submit"
          form="historia"
          disabled={!canContinue}
          className={primaryButton}
        >
          Continuar
        </button>
      </StickyFooter>
    </>
  );
}
