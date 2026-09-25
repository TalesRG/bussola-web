import Image from "next/image";
import Link from "next/link";
import {
  BlueTop,
  Carinhas,
  CvvLine,
  Screen,
  Sheet,
  primaryButton,
} from "../_components/ui";

const FEATURES = [
  {
    icon: "/figma/icon-clip.svg",
    bg: "bg-lilac",
    title: "Check-in de 2 minutos",
    text: "A cada 15 dias, para perceber os sinais cedo",
  },
  {
    icon: "/figma/icon-cal.svg",
    bg: "bg-teal",
    title: "Rotina sem sobrecarga",
    text: "Sua agenda com limite saudável de estudo",
  },
  {
    icon: "/figma/icon-heart.svg",
    bg: "bg-yellow",
    title: "Ajuda quando precisar",
    text: "Da pausa guiada até a conversa com a DASU",
  },
];

// E02 · Página inicial
export default function PaginaInicial() {
  return (
    <Screen>
      <BlueTop className="gap-4 pb-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Image src="/figma/marca-lg.svg" alt="" width={28} height={28} />
            <span className="font-display text-[22px] leading-[1.3] font-bold">
              bússola
            </span>
          </div>
          <Link
            href="/cadastro"
            className="font-display text-sm leading-none font-bold text-white/90 hover:text-white"
          >
            Cadastrar
          </Link>
        </div>

        <div aria-hidden className="relative h-[190px] w-[342px] self-center">
          <Carinhas size="lg" className="top-3.5 -left-6" />
          <Image
            src="/figma/ilustracao-calendario.svg"
            loading="eager"
            alt=""
            width={195}
            height={180}
            className="absolute top-0 left-24"
          />
          <Image
            src="/figma/ilustracao-pessoa-home.svg"
            alt=""
            width={161.46}
            height={149.04}
            className="absolute top-[34px] left-[196px]"
          />
        </div>

        <h1 className="font-display text-[34px] leading-[1.12] font-bold">
          Cuidar da cabeça também faz parte do curso
        </h1>
        <p className="text-base leading-normal text-white/90">
          A Bússola percebe quando o semestre começa a pesar e mostra o próximo
          passo, do tamanho do problema.
        </p>
      </BlueTop>

      <Sheet>
        <ul className="flex flex-col gap-[18px]">
          {FEATURES.map((f) => (
            <li key={f.title} className="flex items-center gap-3.5">
              <div
                className={`flex size-11 shrink-0 items-center justify-center rounded-[14px] ${f.bg}`}
              >
                <Image src={f.icon} alt="" width={22} height={22} />
              </div>
              <div className="flex flex-1 flex-col gap-0.5 leading-normal">
                <p className="text-sm font-bold text-ink">{f.title}</p>
                <p className="text-xs text-ink-3">{f.text}</p>
              </div>
            </li>
          ))}
        </ul>

        <Link href="/login" className={primaryButton}>
          Entrar com a conta UnB
        </Link>

        <div className="flex items-start gap-1.5">
          <Image
            src="/figma/icon-warning-sm.svg"
            alt=""
            width={14}
            height={14}
            className="shrink-0"
          />
          <p className="flex-1 text-xs leading-normal text-ink-3">
            Suas respostas são só suas. A UnB vê apenas números anônimos.
          </p>
        </div>

        <CvvLine />
      </Sheet>
    </Screen>
  );
}
