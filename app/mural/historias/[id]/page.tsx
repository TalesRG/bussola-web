import { notFound } from "next/navigation";
import { PageHeader } from "../../../_components/page-header";
import { cn } from "../../../_components/ui";
import { SaveButton } from "../../_components/save-button";
import {
  Avatar,
  display,
  heading,
  Icon,
  overline,
  ResourceRow,
  tag,
} from "../../_components/ui";
import { STORIES, findStory } from "../../_lib/data";
import { Reactions } from "./reactions";

export function generateStaticParams() {
  return STORIES.filter((s) => s.detail).map((s) => ({ id: s.id }));
}

export const dynamicParams = false;

// H02 · História aberta.
export default async function Page(props: PageProps<"/mural/historias/[id]">) {
  const { id } = await props.params;
  const story = findStory(id);
  const detail = story?.detail;
  if (!story || !detail) notFound();

  return (
    <>
      <PageHeader
        title="Histórias"
        backHref="/mural"
        titleAs="p"
        action={
          <SaveButton
            id={`historia-${story.id}`}
            icon="/figma/mural/book-stack-20.svg"
            label="Salvar história"
          />
        }
      />
      <article className="flex flex-col gap-5 px-5 pt-5 pb-8">
        <header className="flex flex-col gap-3">
          <div className="flex gap-2">
            <span className={cn(tag, "bg-brand-soft text-brand-ink")}>{story.tema}</span>
            <span className={cn(tag, "bg-subtle text-ink-2")}>
              {story.leitura} de leitura
            </span>
          </div>
          <h1 className={display}>{story.titulo}</h1>
          <div className="flex items-center gap-2.5">
            <Avatar initials={story.iniciais} size={44} strong />
            <div className="flex min-w-0 flex-1 flex-col leading-normal">
              <span className="text-sm font-bold text-ink">{story.nome}</span>
              <span className="text-xs text-ink-3">
                {story.curso} · {story.semestre} · revisada pela DASU
              </span>
            </div>
          </div>
        </header>

        <section className="flex flex-col gap-2">
          <h2 className={heading}>O que aconteceu</h2>
          <p className="text-base leading-normal text-ink-2">{detail.aconteceu}</p>
        </section>

        <section className="flex flex-col gap-3 rounded-[18px] bg-surface-muted p-[18px]">
          <h2 className={heading}>O que me ajudou</h2>
          <ul className="flex flex-col gap-3">
            {detail.ajudou.map((item) => (
              <li key={item} className="flex items-start gap-2.5">
                <span className="flex size-[22px] shrink-0 items-center justify-center rounded-full bg-brand">
                  <Icon src="/figma/icon-check-field.svg" size={14} />
                </span>
                <span className="flex-1 text-sm leading-normal text-ink-2">{item}</span>
              </li>
            ))}
          </ul>
        </section>

        <blockquote className="flex gap-3.5">
          <span aria-hidden className="w-1 shrink-0 rounded-[2px] bg-brand" />
          <div className="flex flex-1 flex-col gap-1.5">
            <p className={cn(overline, "text-brand-ink")}>O QUE EU DIRIA PARA VOCÊ</p>
            <p className="font-display text-xl leading-[1.2] font-bold text-ink">
              &quot;{detail.diria}&quot;
            </p>
          </div>
        </blockquote>

        <section className="flex flex-col gap-2.5">
          <h2 className={heading}>Recursos citados</h2>
          {detail.recursos.map((r) => (
            <ResourceRow
              key={r.title}
              className="rounded-2xl border border-line"
              leading={
                <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-brand-soft">
                  <Icon src={r.icon} />
                </span>
              }
              title={r.title}
              sub={r.sub}
              href={r.href}
            />
          ))}
        </section>

        <Reactions story={story.id} base={detail.reacoes} />
      </article>
    </>
  );
}
