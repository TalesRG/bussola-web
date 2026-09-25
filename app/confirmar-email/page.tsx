import Image from "next/image";
import { BlueTop, Screen, TopBar } from "../_components/ui";
import { CodeForm } from "./code-form";

// C02 · Confirmar e-mail
export default async function ConfirmarEmail(
  props: PageProps<"/confirmar-email">,
) {
  const { email } = await props.searchParams;
  const address = typeof email === "string" && email ? email : null;

  return (
    <Screen>
      <BlueTop className="gap-3.5 pb-6">
        <TopBar backHref="/cadastro" />

        <div aria-hidden className="relative h-[150px] w-[342px] self-center">
          <div className="absolute top-5 left-[86px] h-[116px] w-[170px] rounded-[14px] bg-paper" />
          <Image
            src="/figma/envelope-aba.svg"
            loading="eager"
            alt=""
            width={170}
            height={64}
            className="absolute top-[22px] left-[86px]"
          />
          <Image
            src="/figma/envelope-coracao.svg"
            alt=""
            width={23.4}
            height={23.4}
            className="absolute top-[58px] left-[155px]"
          />
          <Image src="/figma/star-1.svg" alt="" width={16} height={16} className="absolute top-6 left-[62px]" />
          <Image src="/figma/star-2.svg" alt="" width={12} height={12} className="absolute top-3 left-[270px]" />
          <Image src="/figma/star-3.svg" alt="" width={18} height={18} className="absolute top-[110px] left-[280px]" />
          <Image src="/figma/star-4.svg" alt="" width={12} height={12} className="absolute top-[118px] left-[50px]" />
        </div>

        <h1 className="font-display text-[34px] leading-[1.12] font-bold">
          Confira seu e-mail
        </h1>
        <p className="text-base leading-normal text-white/90">
          Enviamos um código de 6 dígitos para{" "}
          {address ?? "seu e-mail @aluno.unb.br"}
        </p>
      </BlueTop>

      <CodeForm />
    </Screen>
  );
}
