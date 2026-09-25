import { BlueTop, Carinhas, Screen, TopBar } from "../_components/ui";
import { SignupForm } from "./signup-form";

// C01 · Cadastro
export default function Cadastro() {
  return (
    <Screen>
      <BlueTop className="gap-3 pb-5">
        <TopBar backHref="/inicio" />
        <div className="flex items-center gap-2">
          <div className="flex flex-1 flex-col gap-2">
            <h1 className="font-display text-[34px] leading-[1.12] font-bold">
              Crie sua conta
            </h1>
            <p className="text-sm leading-normal text-white/90">
              Leva 1 minuto. Use seu e-mail @aluno.unb.br.
            </p>
          </div>
          <div aria-hidden className="relative h-[110px] w-[120px] shrink-0">
            <Carinhas size="sm" className="-top-1.5 -left-3.5" />
          </div>
        </div>
      </BlueTop>

      <SignupForm />
    </Screen>
  );
}
