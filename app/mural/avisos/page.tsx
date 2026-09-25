"use client";

import Link from "next/link";
import { useState } from "react";
import { BottomNav } from "../../_components/bottom-nav";
import { cn, primaryButtonSm, textLink } from "../../_components/ui";
import {
  caption,
  card,
  FilterChips,
  heading,
  Hint,
  Icon,
  Intro,
  MuralTop,
  ResourceRow,
  SourceBadge,
  tag,
} from "../_components/ui";
import {
  DEADLINES,
  HIGHLIGHT,
  NOTICE_FILTERS,
  SERVICES,
  type Notice,
} from "../_lib/data";
import { useMural } from "../_lib/state";

// AV01 · Mural › Avisos.
export default function Page() {
  const [filter, setFilter] = useState("Todos");
  const { saved, toggleSaved } = useMural();
  const matches = (item: { filtros: string[] }) =>
    filter === "Todos" || item.filtros.includes(filter);

  const deadlines = DEADLINES.filter(matches);
  const services = SERVICES.filter(matches);
  const highlightSaved = saved.includes(HIGHLIGHT.id);

  return (
    <>
      <div className="flex flex-col gap-[18px] px-5 pt-6 pb-4">
        <MuralTop active="Avisos" />
        <Intro title="Avisos para você">
          Da DASU, da sua coordenação e do campus. Só o que importa para o seu
          semestre.
        </Intro>
        <FilterChips
          label="Filtrar avisos"
          options={NOTICE_FILTERS}
          value={filter}
          onChange={setFilter}
          compact
        />

        {matches(HIGHLIGHT) && (
          <article className="flex flex-col gap-2.5 rounded-[20px] border border-brand-line bg-brand-soft p-4">
            <div className="flex items-center justify-between">
              <span className={cn(tag, "bg-surface text-brand-ink")}>IMPORTANTE</span>
              <span className={cn(tag, "border border-line bg-surface text-ink-2")}>
                {HIGHLIGHT.publico}
              </span>
            </div>
            <Source notice={HIGHLIGHT} />
            <h2 className="font-display text-xl leading-[1.2] font-bold text-ink">
              {HIGHLIGHT.titulo}
            </h2>
            <p className="text-sm leading-normal text-ink-2">{HIGHLIGHT.resumo}</p>
            <div className="flex items-center gap-3">
              <Link href="/home#apoio" className={cn(primaryButtonSm, "min-w-0 flex-1")}>
                Marcar conversa
              </Link>
              <button
                type="button"
                aria-pressed={highlightSaved}
                onClick={() => toggleSaved(HIGHLIGHT.id)}
                className={textLink}
              >
                {highlightSaved ? "Salvo" : "Salvar"}
              </button>
            </div>
          </article>
        )}

        {deadlines.length > 0 && (
          <section aria-labelledby="prazos" className="flex flex-col gap-2.5">
            <div className="flex items-center justify-between">
              <h2 id="prazos" className={heading}>
                Prazos
              </h2>
              {filter !== "Prazos" && (
                <button type="button" onClick={() => setFilter("Prazos")} className={textLink}>
                  Ver todos
                </button>
              )}
            </div>
            {deadlines.map((notice) => (
              <Deadline key={notice.id} notice={notice} />
            ))}
          </section>
        )}

        {services.length > 0 && (
          <section aria-labelledby="campus" className="flex flex-col gap-2.5">
            <h2 id="campus" className={heading}>
              Campus e serviços
            </h2>
            <div className={cn(card, "flex flex-col overflow-hidden")}>
              {services.map((s, i) => (
                <ResourceRow
                  key={s.id}
                  className={cn(i < services.length - 1 && "border-b border-subtle")}
                  leading={<SourceBadge sigla={s.sigla} tone={s.tone} />}
                  title={s.titulo}
                  sub={s.resumo}
                />
              ))}
            </div>
          </section>
        )}

        <Hint size={16} icon="/figma/mural/warning-16.svg">
          Por que estou vendo isso? Filtramos pelo seu curso e semestre. Nada aqui
          é enviado pela universidade sobre você.
        </Hint>
      </div>

      <BottomNav active="Mural" />
    </>
  );
}

function Source({ notice }: { notice: Notice }) {
  return (
    <div className="flex items-center gap-2.5">
      <SourceBadge sigla={notice.sigla} tone={notice.tone} />
      <div className="flex min-w-0 flex-1 flex-col">
        <span className="text-xs leading-normal text-ink">{notice.fonte}</span>
        <span className={caption}>{notice.data}</span>
      </div>
    </div>
  );
}

function Deadline({ notice }: { notice: Notice }) {
  const { inAgenda, addToAgenda } = useMural();
  const added = inAgenda.includes(notice.id);
  const href = notice.aberto ? `/mural/avisos/${notice.id}` : undefined;

  return (
    <article className={cn(card, "relative flex flex-col gap-2 p-3.5")}>
      <div className="flex items-center gap-2">
        <div className="min-w-0 flex-1">
          <Source notice={notice} />
        </div>
        <span className="flex size-2 shrink-0 items-center justify-center">
          <Icon src="/figma/home/n-dot.svg" size={8} />
          <span className="sr-only">Não lido</span>
        </span>
      </div>
      <div className="flex items-center gap-2">
        <h3 className="flex-1 text-sm leading-normal font-bold text-ink">
          {href ? (
            <Link
              href={href}
              className="after:absolute after:inset-0 after:rounded-[18px] focus-visible:outline-none focus-visible:after:outline-2 focus-visible:after:outline-brand"
            >
              {notice.titulo}
            </Link>
          ) : (
            notice.titulo
          )}
        </h3>
        <span className="inline-flex shrink-0 items-center gap-1 rounded-full bg-amber-50 px-2 py-1 font-display text-xs leading-none font-bold text-amber-800">
          <Icon src="/figma/mural/clock-amber-12.svg" size={12} />
          {notice.faltam}
        </span>
      </div>
      <p className="text-xs leading-normal text-ink-2">{notice.resumo}</p>
      {notice.aberto ? (
        <button
          type="button"
          disabled={added}
          onClick={() => addToAgenda(notice.id)}
          className={cn(textLink, "relative flex items-center gap-1.5 self-start disabled:text-ink-3 disabled:no-underline")}
        >
          <Icon src="/figma/mural/cal-brand-16.svg" size={16} />
          {added ? "Adicionado à agenda" : "Adicionar à agenda"}
        </button>
      ) : (
        // TODO: tela de inscrição no auxílio.
        <span className="flex items-center gap-1.5 self-start font-display text-sm leading-none font-bold text-brand-ink">
          <Icon src="/figma/mural/chev-brand-16.svg" size={16} />
          Ver como se inscrever
        </span>
      )}
    </article>
  );
}
