"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAppState } from "../../_lib/state";
import { cn, primaryButton, secondaryButtonLg, textLink } from "../../_components/ui";
import { StepFooter, StepHeader, tag } from "../../agenda/_components/step";
import { DIMENSIONS, OPTIONS, QUESTIONS } from "../_lib/quiz";

export function QuestionView({ index }: { index: number }) {
  const router = useRouter();
  const { answers, setAnswers } = useAppState();
  const question = QUESTIONS[index];
  const answer = answers[index];
  const isLast = index === QUESTIONS.length - 1;
  const previousHref = index === 0 ? "/check-in" : `/check-in/${index}`;

  function choose(value: number) {
    setAnswers((prev) => prev.map((a, i) => (i === index ? value : a)));
  }

  function next() {
    router.push(isLast ? "/check-in/resultado" : `/check-in/${index + 2}`);
  }

  return (
    <>
      <StepHeader
        backHref={previousHref}
        label={`Pergunta ${index + 1} de ${QUESTIONS.length}`}
        total={QUESTIONS.length}
        done={index + 1}
        action={
          <Link href="/home" className={textLink}>
            Sair
          </Link>
        }
      />
      <div className="px-5 pt-3.5">
        <span className={cn(tag, "bg-brand-soft px-3 py-1.5 text-brand-ink")}>
          {DIMENSIONS[question.dimension].label}
        </span>
      </div>

      <div className="flex flex-1 flex-col gap-5 px-5 pt-6 pb-5">
        <fieldset className="flex flex-col gap-5">
          <legend className="mb-5 flex flex-col gap-2">
            <span className="text-sm leading-normal text-ink-3">Nas últimas 2 semanas…</span>
            <span className="font-display text-[22px] leading-[1.3] font-bold text-ink">
              {question.text}
            </span>
          </legend>
          <div role="radiogroup" className="flex flex-col gap-2.5">
            {OPTIONS.map((label, value) => {
              const selected = answer === value;
              return (
                <button
                  key={label}
                  type="button"
                  role="radio"
                  aria-checked={selected}
                  onClick={() => choose(value)}
                  className={cn(
                    "flex h-14 items-center gap-3 rounded-2xl p-4 text-left text-base leading-normal text-ink transition focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand",
                    selected
                      ? "border-[1.5px] border-brand bg-brand-soft font-bold"
                      : "border border-line bg-surface hover:border-line-muted",
                  )}
                >
                  {selected ? (
                    <Image src="/figma/quiz/radio-on.svg" alt="" width={22} height={22} />
                  ) : (
                    <span className="size-[22px] shrink-0 rounded-full border-2 border-line-muted bg-surface" />
                  )}
                  {label}
                </button>
              );
            })}
          </div>
        </fieldset>

        {isLast ? (
          <p className="flex items-center gap-2 text-xs leading-normal text-ink-3">
            <Image src="/figma/agenda/icon-check-dark-16.svg" alt="" width={16} height={16} />
            Última pergunta. Obrigado pela sinceridade.
          </p>
        ) : question.dimension === "conexao" ? (
          <div className="flex flex-col gap-1.5 rounded-[14px] bg-brand-soft p-3.5">
            <p className="flex items-center gap-2 text-sm leading-normal font-bold text-brand-ink">
              <Image src="/figma/quiz/icon-warning-brand-18.svg" alt="" width={18} height={18} />
              Por que perguntamos isso?
            </p>
            <p className="text-xs leading-normal text-ink-2">
              Se afastar do curso é um dos três sinais de burnout, junto com a
              exaustão e a sensação de não dar conta.
            </p>
          </div>
        ) : (
          <p className="flex items-center gap-2 text-xs leading-normal text-ink-3">
            <Image src="/figma/agenda/icon-warning-16.svg" alt="" width={16} height={16} />
            Não existe resposta certa. Responda o que for mais próximo.
          </p>
        )}
      </div>

      <StepFooter>
        <div className="flex gap-3">
        <Link href={previousHref} className={cn(secondaryButtonLg, "w-[110px]")}>
          Voltar
        </Link>
        <button
          type="button"
          onClick={next}
          disabled={answer === null}
          className={cn(primaryButton, "flex-1")}
        >
          {isLast ? "Ver meu resultado" : "Próxima"}
        </button>
        </div>
      </StepFooter>
    </>
  );
}
