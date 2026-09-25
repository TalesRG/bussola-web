import Image from "next/image";
import { BlueTop, Screen, TopBar } from "../_components/ui";
import { LoginForm } from "./login-form";

// E03 · Login
export default function Login() {
  return (
    <Screen>
      <BlueTop className="gap-3 pb-5">
        <TopBar backHref="/inicio" />
        <div className="flex items-center gap-2">
          <div className="flex flex-1 flex-col gap-2">
            <h1 className="font-display text-[32px] leading-[1.12] font-bold">
              Entre com sua conta UnB
            </h1>
            <p className="text-sm leading-normal text-white/90">
              A mesma matrícula e senha do SIGAA.
            </p>
          </div>
          <div aria-hidden className="relative h-[140px] w-[120px] shrink-0">
            <Image
              src="/figma/ilustracao-pessoa-login.svg"
              alt=""
              width={163.8}
              height={151.2}
              loading="eager"
              className="absolute -top-3 -left-[22px] max-w-none"
            />
          </div>
        </div>
      </BlueTop>

      <LoginForm />
    </Screen>
  );
}
