"use client";

import Link from "next/link";
import { useState } from "react";
import { BottomNav } from "../_components/bottom-nav";
import { cn, primaryButtonMd, secondaryButton } from "../_components/ui";
import {
  Avatar,
  caption,
  CrisisLine,
  FilterChips,
  Icon,
  Intro,
  MuralTop,
  StoryCard,
  tag,
} from "./_components/ui";
import { FEED_THEMES, STORIES, type Story } from "./_lib/data";

const storyHref = (s: Story) => (s.detail ? `/mural/historias/${s.id}` : undefined);

export function StoriesFeed() {
  const [theme, setTheme] = useState("Todas");
  const visible = STORIES.filter((s) => theme === "Todas" || s.tema === theme);
  const featured = visible.find((s) => s.featured);
  const others = visible.filter((s) => !s.featured);

  return (
    <>
      <div className="flex flex-col gap-5 px-5 pt-6 pb-4">
        <MuralTop active="Histórias" />
        <Intro title="Quem já passou por isso">
          Histórias reais de estudantes da UnB que enfrentaram momentos difíceis
          e encontraram um caminho.
        </Intro>
        <FilterChips
          label="Temas"
          options={FEED_THEMES}
          value={theme}
          onChange={setTheme}
        />

        {featured && <Featured story={featured} />}

        <section aria-labelledby="mais-historias" className="flex flex-col gap-3">
          <div className="flex items-center justify-between font-display font-bold">
            <h2 id="mais-historias" className="text-xl leading-[1.2] text-ink">
              Mais histórias
            </h2>
            <span className="text-sm leading-none text-brand-ink">
              Mais recentes
            </span>
          </div>
          {others.length > 0 ? (
            others.map((s) => (
              <StoryCard
                key={s.id}
                tema={s.tema}
                leitura={s.leitura}
                titulo={s.titulo}
                trecho={s.trecho}
                autor={`${s.nome} · ${s.curso}`}
                iniciais={s.iniciais}
                ajudou={`${s.ajudaram} pessoas se sentiram ajudadas`}
                href={storyHref(s)}
              />
            ))
          ) : (
            <p className="text-sm leading-normal text-ink-3">
              Ainda não há outras histórias sobre {theme.toLowerCase()}.
            </p>
          )}
        </section>

        <section className="flex flex-col gap-3 rounded-[22px] border border-line p-5">
          <div className="flex items-center gap-3">
            <span className="flex size-11 shrink-0 items-center justify-center rounded-full bg-brand-soft">
              <Icon src="/figma/mural/page-edit-22.svg" size={22} />
            </span>
            <div className="flex flex-1 flex-col gap-0.5">
              <h2 className="font-display text-base leading-[1.2] font-bold text-ink">
                Sua história pode ajudar alguém
              </h2>
              <p className="text-xs leading-normal text-ink-3">
                Você escolhe se aparece com nome ou de forma anônima.
              </p>
            </div>
          </div>
          <Link href="/mural/contar" className={secondaryButton}>
            Contar minha história
          </Link>
        </section>

        <CrisisLine />
      </div>

      <BottomNav active="Mural" />
    </>
  );
}

function Featured({ story }: { story: Story }) {
  return (
    <section
      aria-label="Destaque da semana"
      className="flex flex-col gap-3.5 rounded-[22px] border border-brand-line bg-brand-soft p-5"
    >
      <div className="flex items-center justify-between">
        <span className={cn(tag, "bg-surface text-brand-ink")}>
          DESTAQUE DA SEMANA
        </span>
        <span className={caption}>{story.leitura}</span>
      </div>
      <h2 className="font-display text-[22px] leading-[1.3] font-bold text-ink">
        &quot;{story.titulo}&quot;
      </h2>
      <p className="text-sm leading-normal text-ink-2">{story.trecho}</p>
      <div className="flex items-center gap-2.5">
        <Avatar initials={story.iniciais} size={40} strong />
        <div className="flex min-w-0 flex-1 flex-col leading-normal">
          <span className="text-sm font-bold text-ink">{story.nome}</span>
          <span className="text-xs text-ink-3">
            {story.curso} · {story.semestre}
          </span>
        </div>
        <span className={cn(tag, "shrink-0 bg-surface text-brand-ink")}>
          {story.tema}
        </span>
      </div>
      {story.detail && (
        <Link href={`/mural/historias/${story.id}`} className={primaryButtonMd}>
          Ler história
        </Link>
      )}
    </section>
  );
}
