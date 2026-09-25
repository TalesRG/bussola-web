"use client";

import Link from "next/link";
import { cn, primaryButton, textLink } from "../../../_components/ui";
import { display, Icon } from "../../_components/ui";
import { useMural } from "../../_lib/state";

const time = new Intl.DateTimeFormat("pt-BR", { hour: "2-digit", minute: "2-digit" });

// H05 · História enviada.
export default function Page() {
  const { sentAt } = useMural();

  const steps = [
    // Sem `sentAt` (acesso direto), evita divergir a hora entre servidor e cliente.
    { title: "Enviada", sub: sentAt ? `Hoje, ${time.format(sentAt)}` : "Hoje", state: "done" },
    { title: "Em revisão pela DASU", sub: "Até 3 dias úteis", state: "current" },
    { title: "Publicada no mural", sub: "Você recebe uma notificação", state: "next" },
  ] as const;

  return (
    <div className="flex flex-1 flex-col items-center gap-6 px-5 pt-16 pb-8">
      <span className="flex size-[104px] items-center justify-center rounded-full bg-brand-soft">
        <span className="flex size-16 items-center justify-center rounded-full bg-brand">
          <Icon src="/figma/mural/heart-white-30.svg" size={30} />
        </span>
      </span>
      <h1 className={cn(display, "text-center")}>Obrigado por compartilhar</h1>
      <p className="text-center text-base leading-normal text-ink-2">
        Contar o que você viveu é um ato de coragem. Sua história pode ser
        exatamente o que alguém precisa ler hoje.
      </p>

      <ol aria-label="Status da história" className="w-full rounded-[20px] border border-line p-[18px]">
        {steps.map((step, i) => (
          <li
            key={step.title}
            aria-current={step.state === "current" ? "step" : undefined}
            className="flex items-start gap-3"
          >
            <span className="flex flex-col items-center">
              {step.state === "done" ? (
                <span className="flex size-6 items-center justify-center rounded-full bg-brand">
                  <Icon src="/figma/icon-check-field.svg" size={14} />
                </span>
              ) : step.state === "current" ? (
                <span className="size-6 rounded-full border-4 border-brand-line bg-brand" />
              ) : (
                <span className="size-6 rounded-full border-2 border-line-muted bg-surface" />
              )}
              {i < steps.length - 1 && (
                <span
                  className={cn(
                    "h-7 w-0.5",
                    step.state === "done" ? "bg-brand" : "bg-line",
                  )}
                />
              )}
            </span>
            <span
              className={cn(
                "flex flex-1 flex-col gap-0.5 leading-normal",
                i < steps.length - 1 && "pb-3",
                step.state === "next" ? "text-ink-3" : "text-ink",
              )}
            >
              <span className="text-sm font-bold">{step.title}</span>
              <span className="text-xs text-ink-3">{step.sub}</span>
            </span>
          </li>
        ))}
      </ol>

      <p className="flex w-full items-center gap-2.5 rounded-2xl bg-surface-muted p-3.5 text-xs leading-normal text-ink-2">
        <Icon src="/figma/mural/page-edit-18.svg" size={18} />
        <span className="flex-1">
          Você pode editar ou apagar sua história em Perfil › Minhas histórias.
        </span>
      </p>

      <div className="flex w-full flex-col items-center gap-3">
        <Link href="/mural" className={primaryButton}>
          Voltar ao mural
        </Link>
        <Link href="/mural#mais-historias" className={textLink}>
          Ler outras histórias
        </Link>
      </div>
    </div>
  );
}
