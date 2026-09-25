import Image from "next/image";
import Link from "next/link";
import {
  primaryButton,
  primaryButtonSm,
  secondaryButtonSm,
  textLink,
} from "../../_components/ui";
import { ENROLLMENT } from "../_lib/data";
import {
  Overline,
  StepContent,
  StepFooter,
  StepHeader,
  StepTitle,
} from "../_components/step";

const iconTile =
  "flex size-11 shrink-0 items-center justify-center rounded-xl";

// A01 · Montar sua agenda — de onde vem
export default function MontarAgenda() {
  return (
    <>
      <StepHeader backHref="/login"label="Passo 1 de 4" total={4} done={1} />

      <StepContent>
        <StepTitle title="Vamos montar sua agenda">
          A gente puxa o que já existe. Você só completa o que nenhum sistema
          sabe sobre a sua vida.
        </StepTitle>

        <section className="flex flex-col gap-3 rounded-[18px] border border-brand-line bg-brand-soft p-4">
          <div className="flex items-center gap-3">
            <div className={`${iconTile} bg-surface`}>
              <Image src="/figma/agenda/icon-book-stack.svg" alt="" width={22} height={22} />
            </div>
            <div className="flex flex-1 flex-col gap-0.5">
              <Overline>Recomendado</Overline>
              <h2 className="text-sm leading-normal font-bold text-ink">
                Aulas do SIGAA
              </h2>
            </div>
          </div>
          <p className="text-xs leading-normal text-ink-2">
            Disciplinas, horários e salas deste semestre
          </p>
          {/* TODO: autenticar no SIGAA antes de importar as turmas. */}
          <Link
            href="/agenda/turmas"
            className={primaryButtonSm}
          >
            Entre com sua conta UnB
          </Link>
        </section>

        <Link
          href="/agenda/comprovante"
          className="flex items-center gap-3 rounded-[18px] border border-dashed border-brand-line bg-surface p-4 transition hover:bg-brand-soft/50"
        >
          <div className={`${iconTile} bg-brand-soft`}>
            <Image src="/figma/agenda/icon-clip.svg" alt="" width={22} height={22} />
          </div>
          <div className="flex flex-1 flex-col gap-0.5">
            <p className="text-[10px] leading-none font-bold tracking-[1.5px] text-ink-3">
              Prefere não conectar?
            </p>
            <p className="text-sm leading-normal font-bold text-ink">
              Enviar comprovante de matrícula
            </p>
            <p className="text-xs leading-normal text-ink-3">
              PDF do SIGAA ou foto. Lemos suas disciplinas e horários.
            </p>
          </div>
          <Image src="/figma/icon-chev.svg" alt="" width={18} height={18} />
        </Link>

        <section className="flex flex-col gap-3 rounded-[18px] border border-brand-line bg-brand-soft p-4">
          <div className="flex items-center gap-3">
            <div className={`${iconTile} bg-surface`}>
              <Image src="/figma/agenda/icon-cal.svg" alt="" width={22} height={22} />
            </div>
            <div className="flex flex-1 flex-col gap-0.5">
              <Overline>Automático</Overline>
              <h2 className="text-sm leading-normal font-bold text-ink">
                Provas do seu curso
              </h2>
            </div>
          </div>
          <p className="text-xs leading-normal text-ink-2">
            Calendário de avaliações de {ENROLLMENT.program}
          </p>
          <div className="flex items-center justify-between">
            <p className="flex items-center gap-1.5 text-xs leading-normal text-brand-ink">
              <span className="flex size-5 items-center justify-center rounded-full bg-brand">
                <Image src="/figma/agenda/icon-check-white-12.svg" alt="" width={12} height={12} />
              </span>
              Aparecem depois que suas aulas entram
            </p>
            <Link href="/agenda/turmas#provas" className={textLink}>
              Rever
            </Link>
          </div>
        </section>

        <section className="flex flex-col gap-3 rounded-[18px] border border-line bg-surface p-4">
          <div className="flex items-center gap-3">
            <div className={`${iconTile} bg-brand-soft`}>
              <Image src="/figma/agenda/icon-clock-22.svg" alt="" width={22} height={22} />
            </div>
            <div className="flex flex-1 flex-col gap-0.5">
              <Overline tone="muted">Opcional</Overline>
              <h2 className="text-sm leading-normal font-bold text-ink">
                Agenda do celular
              </h2>
            </div>
          </div>
          <p className="text-xs leading-normal text-ink-2">
            Google ou Apple. Só lemos os horários ocupados, não os títulos
          </p>
          {/* TODO: conectar Google Calendar / Apple Calendar (só livre/ocupado). */}
          <button type="button" className={secondaryButtonSm}>
            Conectar
          </button>
        </section>

        {/* TODO: tela de adicionar aula à mão / foto da grade. */}
        <Link
          href="/agenda/turmas"
          className="flex items-center gap-3 rounded-[18px] border border-line p-4 transition hover:bg-surface-muted"
        >
          <div className={`${iconTile} bg-subtle`}>
            <Image src="/figma/agenda/icon-page-edit.svg" alt="" width={22} height={22} />
          </div>
          <div className="flex flex-1 flex-col gap-0.5 leading-normal">
            <p className="text-sm font-bold text-ink">Prefiro adicionar à mão</p>
            <p className="text-xs text-ink-3">
              Ou tire uma foto da sua grade horária
            </p>
          </div>
          <Image src="/figma/icon-chev.svg" alt="" width={18} height={18} />
        </Link>

        <div className="flex items-start gap-2">
          <Image src="/figma/agenda/icon-warning-16.svg" alt="" width={16} height={16} className="shrink-0" />
          <p className="flex-1 text-xs leading-normal text-ink-3">
            Seus dados ficam no seu aparelho. A universidade só vê números
            agregados e anônimos.
          </p>
        </div>
      </StepContent>

      <StepFooter>
        <Link href="/agenda/turmas" className={primaryButton}>
          Continuar
        </Link>
      </StepFooter>
    </>
  );
}
