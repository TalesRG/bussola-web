import Link from "next/link";
import { notFound } from "next/navigation";
import { PageHeader } from "../../../_components/page-header";
import { cn, primaryButtonSm, secondaryButtonMd } from "../../../_components/ui";
import { SaveButton } from "../../_components/save-button";
import {
  Avatar,
  caption,
  display,
  heading,
  Hint,
  Icon,
  overline,
  SourceBadge,
  tag,
} from "../../_components/ui";
import { DEADLINES, findStory } from "../../_lib/data";
import { AddToAgenda } from "./add-to-agenda";

// Par de botões de 44px lado a lado: padding menor (16px) para caber "Falar com a DASU".
const pair = (button: string) => cn(button.replace("px-5", "px-4"), "min-w-0 flex-1");

// Texto completo dos avisos que abrem em tela própria.
const DETAILS: Record<
  string,
  { fonte: string; publicado: string; prazo: string; intro: string; passos: string[]; historia: string }
> = {
  trancamento: {
    fonte: "Coordenação de Graduação · Engenharia Civil",
    publicado: "Publicado em 20 de setembro",
    prazo: "Até 10 de outubro · faltam 16 dias",
    intro:
      "Se o semestre ficou pesado demais, trancar uma disciplina pode ser uma forma de cuidar de você. Muita gente faz isso e se forma do mesmo jeito.",
    passos: [
      "Confira as regras do seu curso no SIGAA, em Ensino › Trancamento",
      "Veja como fica sua carga no próximo semestre",
      "Faça o pedido até 10 de outubro",
    ],
    historia: "julia",
  },
};

export function generateStaticParams() {
  return Object.keys(DETAILS).map((id) => ({ id }));
}

export const dynamicParams = false;

// AV02 · Aviso aberto.
export default async function Page(props: PageProps<"/mural/avisos/[id]">) {
  const { id } = await props.params;
  const notice = DEADLINES.find((n) => n.id === id);
  const detail = DETAILS[id];
  if (!notice || !detail) notFound();
  const story = findStory(detail.historia);

  return (
    <>
      <PageHeader
        title="Avisos"
        backHref="/mural/avisos"
        titleAs="p"
        action={
          <SaveButton
            id={notice.id}
            icon="/figma/mural/book-stack-18.svg"
            iconSize={18}
            label="Salvar aviso"
          />
        }
      />
      <article className="flex flex-col gap-5 px-5 pt-5 pb-8">
        <div className="flex items-center gap-2.5">
          <SourceBadge sigla={notice.sigla} tone={notice.tone} />
          <div className="flex min-w-0 flex-1 flex-col">
            <span className="text-xs leading-normal text-ink">{detail.fonte}</span>
            <span className={caption}>{detail.publicado}</span>
          </div>
        </div>

        <header className="flex flex-col gap-3">
          <div className="flex gap-2">
            <span className={cn(tag, "bg-amber-50 text-amber-800")}>Prazo</span>
            <span className={cn(tag, "bg-subtle text-ink-2")}>{detail.prazo}</span>
          </div>
          <h1 className={display}>{notice.titulo}</h1>
        </header>

        <p className="text-base leading-normal text-ink-2">{detail.intro}</p>

        <section className="flex flex-col gap-3 rounded-[18px] border border-line p-4">
          <h2 className={heading}>Como fazer</h2>
          <ol className="flex flex-col gap-3">
            {detail.passos.map((passo, i) => (
              <li key={passo} className="flex items-start gap-2.5">
                <span className="flex size-6 shrink-0 items-center justify-center rounded-full bg-brand-soft font-display text-xs leading-none font-bold text-brand-ink">
                  {i + 1}
                </span>
                <span className="flex-1 text-sm leading-normal text-ink-2">{passo}</span>
              </li>
            ))}
          </ol>
        </section>

        <section className="flex flex-col gap-3 rounded-[18px] border border-brand-line bg-brand-soft p-4">
          <h2 className={heading}>Antes de decidir, converse com alguém</h2>
          <p className="text-xs leading-normal text-ink-2">
            Não precisa decidir sozinho(a). A coordenação tira dúvidas sobre
            regras; a DASU ajuda a pensar no que é melhor para você.
          </p>
          <div className="flex gap-2">
            <Link href="/home#apoio" className={pair(primaryButtonSm)}>
              Falar com a DASU
            </Link>
            <a
              href="https://sigaa.unb.br"
              target="_blank"
              rel="noreferrer"
              className={pair(secondaryButtonMd)}
            >
              Coordenação
            </a>
          </div>
        </section>

        {story && (
          // TODO: abrir a história quando ela tiver texto completo.
          <div className="flex items-center gap-3 rounded-2xl border border-line p-3.5">
            <Avatar initials={story.iniciais} size={36} />
            <div className="flex min-w-0 flex-1 flex-col gap-0.5 font-bold">
              <span className={cn(overline, "text-ink-3")}>DO MURAL</span>
              <span className="text-sm leading-normal text-ink">
                &quot;{story.titulo}&quot;
              </span>
            </div>
            <Icon src="/figma/icon-chev.svg" size={18} />
          </div>
        )}

        <AddToAgenda id={notice.id} />

        <Hint>
          A Bússola só repassa avisos oficiais. Em caso de dúvida sobre regras,
          vale o que está no SIGAA.
        </Hint>
      </article>
    </>
  );
}
