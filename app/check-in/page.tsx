"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAppState } from "../_lib/state";
import { BackButton } from "../_components/back-button";
import { primaryButton, textLink } from "../_components/ui";
import { Overline } from "../agenda/_components/step";
import { QUESTIONS } from "./_lib/quiz";

const PROMISES = [
  { icon: "/figma/quiz/icon-clock.svg", title: "Leva uns 2 minutos", text: "Responda pensando nas últimas 2 semanas" },
  { icon: "/figma/quiz/icon-check.svg", title: "Só você vê suas respostas", text: "Nada é enviado à universidade sem sua permissão" },
  { icon: "/figma/quiz/icon-warning.svg", title: "Não é diagnóstico", text: "É um ponto de partida para cuidar de você" },
];

// Q01 · Início do check-in
export default function InicioCheckIn() {
  const router = useRouter();
  const { setAnswers } = useAppState();

  function start() {
    setAnswers(QUESTIONS.map(() => null));
    router.push("/check-in/1");
  }

  return (
    <>
      <header className="px-5 pt-6">
        <BackButton fallbackHref="/home" variant="light" />
      </header>

      <div className="flex flex-1 flex-col gap-6 px-5 pt-6 pb-6">
        <div aria-hidden className="relative mx-auto size-[170px]">
          <Image src="/figma/quiz/bateria-fundo.svg" alt="" width={170} height={170} priority />
          <div className="absolute top-14 left-[25px] flex h-[58px] w-28 gap-[5px] rounded-[14px] border-3 border-brand p-1.5">
            <div className="flex-1 rounded-md bg-brand" />
            <div className="flex-1 rounded-md bg-brand-line" />
            <div className="flex-1 rounded-md bg-brand-line" />
          </div>
          <div className="absolute top-[75px] left-[139px] h-5 w-1.5 rounded-[3px] bg-brand" />
        </div>

        <div className="flex flex-col gap-2.5">
          <Overline>Check-in · 2 minutos</Overline>
          <h1 className="font-display text-[32px] leading-[38px] font-bold text-ink">
            Como está sua energia com a faculdade?
          </h1>
          <p className="text-base leading-normal text-ink-2">
            {QUESTIONS.length} perguntas rápidas sobre as últimas 2 semanas.
            Ajudam a perceber sinais de burnout cedo, antes de virar uma bola de
            neve.
          </p>
        </div>

        <ul className="flex flex-col gap-3.5">
          {PROMISES.map((p) => (
            <li key={p.title} className="flex items-center gap-3">
              <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-brand-soft">
                <Image src={p.icon} alt="" width={20} height={20} />
              </span>
              <span className="flex flex-1 flex-col gap-0.5 leading-normal">
                <span className="text-sm font-bold text-ink">{p.title}</span>
                <span className="text-xs text-ink-3">{p.text}</span>
              </span>
            </li>
          ))}
        </ul>

        <div className="flex flex-col items-center gap-3">
          <button type="button" onClick={start} className={primaryButton}>
            Começar
          </button>
          <Link href="/home" className={`${textLink} py-1`}>
            Agora não
          </Link>
        </div>

        <a
          href="tel:188"
          className="flex items-center gap-2.5 rounded-[14px] border border-line bg-surface-muted p-3.5 hover:bg-subtle"
        >
          <Image src="/figma/quiz/icon-phone-18.svg" alt="" width={18} height={18} />
          <span className="flex-1 text-xs leading-normal text-ink-2">
            Precisa falar com alguém agora? Ligue 188 (CVV), 24 h.
          </span>
        </a>
      </div>
    </>
  );
}
