"use client";

import { useRouter } from "next/navigation";
import { cn, primaryButton } from "../../../_components/ui";
import { Check } from "../../../rotina/_components/ui";
import {
  display,
  heading,
  Icon,
  StepTop,
  StickyFooter,
  StoryCard,
} from "../../_components/ui";
import { IDENTITIES } from "../../_lib/data";
import { useMural } from "../../_lib/state";

const NEXT_STEPS = [
  "A equipe da DASU lê sua história em até 3 dias úteis",
  "Se precisar de algum ajuste, a gente te avisa antes",
  "Você pode editar ou apagar quando quiser",
];

/** ~200 palavras por minuto, como nos cards do mural. */
const readingTime = (text: string) =>
  `${Math.max(1, Math.ceil(text.trim().split(/\s+/).filter(Boolean).length / 200))} min`;

// H04 · Como você quer aparecer (passo 2).
export default function Page() {
  const router = useRouter();
  const { draft, setDraft, submit } = useMural();
  const identity = IDENTITIES.find((i) => i.key === draft.identidade) ?? IDENTITIES[0];
  const text = draft.partes.join(" ");

  return (
    <>
      <StepTop step={2} backHref="/mural/contar" />

      <form
        id="publicar"
        onSubmit={(e) => {
          e.preventDefault();
          if (!draft.concordo) return;
          submit();
          router.push("/mural/contar/enviada");
        }}
        className="flex flex-col gap-[22px] p-5"
      >
        <h1 className={display}>Como você quer aparecer?</h1>

        <div role="radiogroup" aria-label="Identificação" className="flex flex-col gap-2.5">
          {IDENTITIES.map((option) => {
            const selected = option.key === draft.identidade;
            return (
              <button
                key={option.key}
                type="button"
                role="radio"
                aria-checked={selected}
                onClick={() => setDraft((d) => ({ ...d, identidade: option.key }))}
                className={cn(
                  "flex items-center gap-3 rounded-2xl p-4 text-left transition focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand",
                  selected
                    ? "border-[1.5px] border-brand bg-brand-soft"
                    : "border border-line bg-surface hover:border-line-muted",
                )}
              >
                {selected ? (
                  <Icon src="/figma/mural/radio-on-22.svg" size={22} />
                ) : (
                  <span className="size-[22px] shrink-0 rounded-[11px] border-2 border-line-muted bg-surface" />
                )}
                <span className="flex min-w-0 flex-1 flex-col gap-0.5 leading-normal">
                  <span className="text-sm font-bold text-ink">{option.label}</span>
                  <span className="text-xs text-ink-3">Aparece como: {option.autor}</span>
                </span>
              </button>
            );
          })}
        </div>

        <section className="flex flex-col gap-2.5">
          <h2 className={heading}>Prévia no mural</h2>
          <StoryCard
            tema={draft.temas[0] ?? "Sem tema"}
            leitura={readingTime(text)}
            titulo={draft.titulo.trim() || "Sua história"}
            trecho={draft.partes.find((p) => p.trim() !== "") ?? ""}
            autor={identity.autor}
            iniciais={identity.iniciais}
            ajudou="Nova história"
          />
        </section>

        <section className="flex flex-col gap-2.5 rounded-2xl bg-surface-muted p-4">
          <h2 className="text-sm leading-normal font-bold text-ink">
            O que acontece depois
          </h2>
          <ol className="flex flex-col gap-2.5">
            {NEXT_STEPS.map((step, i) => (
              <li key={step} className="flex items-center gap-2.5">
                <span className="flex size-6 shrink-0 items-center justify-center rounded-full border border-line bg-surface font-display text-xs leading-none font-bold text-brand-ink">
                  {i + 1}
                </span>
                <span className="flex-1 text-xs leading-normal text-ink-2">{step}</span>
              </li>
            ))}
          </ol>
        </section>

        <label className="flex cursor-pointer items-start gap-3">
          <input
            type="checkbox"
            checked={draft.concordo}
            onChange={(e) => setDraft((d) => ({ ...d, concordo: e.target.checked }))}
            className="peer sr-only"
          />
          <span className="rounded-lg peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-brand">
            <Check checked={draft.concordo} />
          </span>
          <span className="flex-1 text-xs leading-normal text-ink-2">
            Li e concordo com as regras do mural e autorizo a publicação após a
            revisão.
          </span>
        </label>
      </form>

      <StickyFooter>
        <button
          type="submit"
          form="publicar"
          disabled={!draft.concordo}
          className={primaryButton}
        >
          Enviar para revisão
        </button>
      </StickyFooter>
    </>
  );
}
