import Image from "next/image";
import Link from "next/link";
import { AutoAdvance } from "./_components/auto-advance";
import { Screen } from "./_components/ui";

// E01 · Abertura
export default function Abertura() {
  return (
    <Screen>
      <AutoAdvance href="/inicio" delay={2000} />
      <Link
        href="/inicio"
        replace
        className="flex flex-1 flex-col items-center justify-center gap-2 text-white"
      >
        <Image
          src="/figma/compass.svg"
          alt=""
          width={390}
          height={360}
          priority
          className="-mt-5 -mb-2.5"
        />
        <h1 className="font-display text-[46px] leading-[1.12] font-bold">
          bússola
        </h1>
        <p className="text-base leading-normal text-white/85">
          Bem-estar estudantil · UnB
        </p>
      </Link>
    </Screen>
  );
}
