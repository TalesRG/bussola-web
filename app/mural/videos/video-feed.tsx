"use client";

import Link from "next/link";
import { useState } from "react";
import { BottomNav } from "../../_components/bottom-nav";
import { cn, textLink } from "../../_components/ui";
import {
  Avatar,
  FilterChips,
  focusRing,
  Icon,
  Intro,
  MuralTop,
} from "../_components/ui";
import { asset, Thumbnail, VideoCard, VideoTag } from "./_components/ui";
import { SHORTS, THEMES, VIDEOS, videoHref } from "./_lib/data";

export function VideoFeed() {
  const [theme, setTheme] = useState("Todos");
  const featured = VIDEOS[0];
  const matches = VIDEOS.filter(
    (video) => theme === "Todos" || video.themes.includes(theme),
  );
  const sections = [
    { title: "Para dias de prova", theme: "Provas" },
    { title: "Primeiro ano na UnB", theme: "Primeiro ano" },
  ];
  const shorts =
    theme === "Todos" ? SHORTS : matches.filter((video) => video.short);
  return (
    <>
      <div className="flex flex-col gap-[22px] pt-6 pb-4">
        <div className="flex flex-col gap-[18px] px-5">
          <MuralTop active="Vídeos" />
          <Intro title="Ouça de quem já passou por isso">
            Vídeos curtos de estudantes da UnB. Todos com legenda e transcrição.
          </Intro>
          <FilterChips
            label="Temas dos vídeos"
            options={THEMES}
            value={theme}
            onChange={setTheme}
          />
          {matches.includes(featured) && (
            <Link
              href={videoHref(featured)}
              className={cn("flex flex-col gap-3 rounded-2xl", focusRing)}
            >
              <Thumbnail video={featured} variant="featured" />
              <div className="flex items-start gap-3">
                <Avatar initials="MA" size={40} strong />
                <div className="flex min-w-0 flex-1 flex-col items-start gap-1">
                  <VideoTag active>DESTAQUE DA SEMANA</VideoTag>
                  <h2 className="font-display text-base leading-[1.2] font-bold">
                    {featured.title}
                  </h2>
                  <p className="text-xs leading-normal text-ink-3">
                    Marina · Engenharia Civil · revisado pela DASU
                  </p>
                </div>
              </div>
            </Link>
          )}
        </div>
        {(theme === "Todos"
          ? sections
          : [{ title: `Vídeos sobre ${theme.toLowerCase()}`, theme }]
        ).map((section) => {
          const items = matches.filter(
            (video) =>
              !video.short &&
              video.id !== "marina" &&
              video.themes.includes(section.theme),
          );
          return (
            items.length > 0 && (
              <section
                key={section.theme}
                className="flex flex-col gap-3"
                aria-label={section.title}
              >
                <div className="flex items-center justify-between gap-2 px-5">
                  <h2 className="font-display text-xl leading-[1.2] font-bold">
                    {section.title}
                  </h2>
                  {theme === "Todos" && (
                    <button
                      className={textLink}
                      onClick={() => setTheme(section.theme)}
                      aria-label={`Ver todos: ${section.title}`}
                    >
                      Ver todos
                    </button>
                  )}
                </div>
                <div className="flex snap-x scroll-px-5 gap-3 overflow-x-auto px-5 pb-1 [scrollbar-width:none]">
                  {items.map((video) => (
                    <VideoCard key={video.id} video={video} />
                  ))}
                </div>
              </section>
            )
          );
        })}
        {shorts.length > 0 && (
          <section className="flex flex-col gap-3" aria-label="Em 1 minuto">
            <div className="flex items-center gap-2 px-5">
              <h2 className="font-display text-xl leading-[1.2] font-bold">
                Em 1 minuto
              </h2>
              <VideoTag>Curtos</VideoTag>
            </div>
            <div className="flex gap-2.5 overflow-x-auto px-5 pb-1 [scrollbar-width:none]">
              {shorts.map((video) => (
                <Link
                  key={video.id}
                  href={videoHref(video)}
                  className={cn(
                    "flex w-[110px] shrink-0 flex-col gap-1.5 rounded-2xl",
                    focusRing,
                  )}
                >
                  <Thumbnail video={video} variant="short" />
                  <h3 className="text-xs leading-normal">{video.title}</h3>
                </Link>
              ))}
            </div>
          </section>
        )}
        <div className="px-5">
          <Link
            href="/mural/videos/gravar"
            className={cn(
              "flex items-center gap-3 rounded-[22px] border border-line p-4",
              focusRing,
            )}
          >
            <span className="flex size-11 shrink-0 items-center justify-center rounded-full bg-brand-soft">
              <Icon src={"/figma/videos/page-edit.png"} size={22} />
            </span>
            <span className="flex min-w-0 flex-1 flex-col gap-0.5">
              <span className="text-sm leading-normal font-bold">
                Grave um recado para quem está começando
              </span>
              <span className="text-xs leading-normal text-ink-3">
                Até 2 min. Pode aparecer ou só usar a voz.
              </span>
            </span>
            <Icon src={asset("ab074")} size={18} />
          </Link>
        </div>
      </div>
      <BottomNav active="Mural" />
    </>
  );
}
