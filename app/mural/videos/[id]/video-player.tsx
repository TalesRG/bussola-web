"use client";

import Link from "next/link";
import { useState } from "react";
import { PageHeader } from "../../../_components/page-header";
import { cn } from "../../../_components/ui";
import { SaveButton } from "../../_components/save-button";
import { Avatar, focusRing, heading, Icon } from "../../_components/ui";
import { Media, usePlayback } from "../_components/playback";
import { VideoReactions } from "../_components/reactions";
import { asset, ResourceContent, Thumbnail, VideoTag } from "../_components/ui";
import {
  CHAPTERS,
  formatTime,
  type Video,
  VIDEOS,
  videoHref,
} from "../_lib/data";

export function VideoPlayer({ video }: { video: Video }) {
  const playback = usePlayback(video, video.id === "marina" ? 154 : 0);
  const [transcript, setTranscript] = useState(false);
  const [resource, setResource] = useState(false);
  const chapters = video.id === "marina" ? CHAPTERS : [];
  const chapterIndex = chapters.findLastIndex(
    (chapter) => chapter.time <= playback.time,
  );
  const next = VIDEOS[video.id === "lucas" ? 0 : 1];
  return (
    <>
      <PageHeader
        title="Vídeos"
        backHref="/mural/videos"
        action={
          <SaveButton
            id={`video:${video.id}`}
            icon={asset("7d093")}
            label="Salvar vídeo"
          />
        }
      />
      <section className="mt-3" aria-label="Player do vídeo">
        <div className="relative">
          {video.src ? (
            <Media
              video={video}
              playback={playback}
              className="h-[219px] w-full bg-ink object-contain"
            />
          ) : (
            <Thumbnail video={video} variant="player" />
          )}
          {!video.src && playback.captions && video.quote && (
            <p className="absolute top-[150px] left-1/2 w-max max-w-[calc(100%-40px)] -translate-x-1/2 rounded-md bg-ink/80 px-2.5 py-1.5 text-center text-xs leading-normal text-white">
              &quot;{video.quote}&quot;
            </p>
          )}
        </div>
        <div className="flex flex-col gap-2 px-5 py-2.5">
          <input
            type="range"
            min={0}
            max={video.duration}
            value={Math.floor(playback.time)}
            onChange={(event) => playback.seek(Number(event.target.value))}
            aria-label="Progresso do vídeo"
            className="video-progress w-full"
            style={{
              background: `linear-gradient(to right, var(--color-brand) ${(playback.time / video.duration) * 100}%, var(--color-subtle) 0)`,
            }}
          />
          <div className="flex h-6 items-center justify-between">
            <div className="flex items-center gap-3.5">
              <button
                onClick={playback.toggle}
                aria-label={
                  playback.playing ? "Pausar vídeo" : "Reproduzir vídeo"
                }
                className={cn(
                  "flex size-[22px] items-center justify-center",
                  focusRing,
                )}
              >
                {playback.playing ? (
                  <Icon src={asset("3dcdc")} size={22} />
                ) : (
                  <span aria-hidden className="text-lg text-ink">
                    ▶
                  </span>
                )}
              </button>
              <span className="font-display text-xs leading-none font-bold text-ink-2">
                {formatTime(playback.time)} / {formatTime(video.duration)}
              </span>
            </div>
            <div className="flex gap-2">
              <button
                aria-label="Legendas"
                aria-pressed={playback.captions}
                onClick={() => playback.setCaptions(!playback.captions)}
                className={cn(
                  "rounded-full px-2.5 py-[5px] font-display text-xs leading-none font-bold",
                  playback.captions
                    ? "bg-brand text-white"
                    : "bg-subtle text-ink-2",
                  focusRing,
                )}
              >
                CC
              </button>
              <button
                aria-label={`Velocidade de reprodução: ${playback.speed}x`}
                onClick={() =>
                  playback.setSpeed(
                    playback.speed === 2
                      ? 0.75
                      : playback.speed === 0.75
                        ? 1
                        : playback.speed + 0.25,
                  )
                }
                className={cn(
                  "rounded-full border border-line px-2.5 py-[5px] font-display text-xs leading-none font-bold",
                  focusRing,
                )}
              >
                {playback.speed}x
              </button>
            </div>
          </div>
          {playback.message && (
            <p role="status" className="text-xs text-ink-3">
              {playback.message}
            </p>
          )}
        </div>
      </section>
      <div className="flex flex-col gap-5 px-5 pt-4 pb-6">
        <div className="flex flex-col gap-2.5">
          <div className="flex gap-2">
            <VideoTag active>
              {video.id === "marina" ? "Reprovação" : video.themes[0]}
            </VideoTag>
            <VideoTag>Legendado</VideoTag>
          </div>
          <h1 className="font-display text-[22px] leading-[1.3] font-bold">
            {video.title}
          </h1>
          <div className="flex items-center gap-2.5">
            <Avatar initials={video.initials} size={40} strong />
            <div>
              <p className="text-sm leading-normal font-bold">{video.name}</p>
              <p className="text-xs leading-normal text-ink-3">
                {video.course}
                {video.id === "marina" && " · 7º semestre"} · revisado pela DASU
              </p>
            </div>
          </div>
        </div>
        {chapters.length > 0 && (
          <section className="flex flex-col gap-2.5" aria-label="Capítulos">
            <h2 className={heading}>Capítulos</h2>
            {chapters.map((chapter, index) => (
              <button
                key={chapter.time}
                onClick={() => playback.seek(chapter.time)}
                aria-current={index === chapterIndex ? "true" : undefined}
                className={cn(
                  "flex items-center gap-3 rounded-xl px-3 py-2.5 text-left",
                  index === chapterIndex &&
                    "bg-brand-soft font-bold text-brand-ink",
                  focusRing,
                )}
              >
                <span
                  className={cn(
                    "rounded-full px-2.5 py-[5px] font-display text-xs leading-none font-bold",
                    index === chapterIndex
                      ? "bg-brand text-white"
                      : "bg-subtle text-ink-2",
                  )}
                >
                  {formatTime(chapter.time)}
                </span>
                <span className="text-sm leading-normal">{chapter.title}</span>
              </button>
            ))}
          </section>
        )}
        <section>
          <button
            onClick={() => setTranscript(!transcript)}
            aria-expanded={transcript}
            aria-controls="video-transcript"
            className={cn(
              "flex w-full items-center gap-3 rounded-2xl border border-line p-3.5 text-left",
              focusRing,
            )}
          >
            <ResourceContent
              title="Ler a transcrição"
              description="Para assistir sem som ou reler depois"
            />
          </button>
          {transcript && (
            <div
              id="video-transcript"
              className="mt-3 rounded-2xl bg-surface-muted p-4 text-sm leading-normal"
            >
              <h2 className="mb-2 font-bold">Transcrição</h2>
              {video.quote && <p className="mb-2">&quot;{video.quote}&quot;</p>}
              <p className="text-ink-3">
                A transcrição completa estará disponível com o vídeo.
              </p>
            </div>
          )}
        </section>
        <VideoReactions id={video.id} />
        {video.id === "marina" && (
          <button
            onClick={() => setResource(!resource)}
            aria-expanded={resource}
            className={cn(
              "flex items-center gap-3 rounded-2xl bg-surface-muted p-3.5 text-left",
              focusRing,
            )}
          >
            <ResourceContent
              title="Citado no vídeo: Monitoria de Cálculo 1"
              description="Seg a qui, 14h–18h · ICC Sul"
            />
          </button>
        )}
        {resource && (
          <section className="rounded-2xl border border-line p-4 text-sm leading-normal">
            <h2 className="font-bold">Monitoria de Cálculo 1</h2>
            <p className="mt-2 text-ink-2">
              Segunda a quinta, das 14h às 18h, no ICC Sul.
            </p>
            <Link
              href="/rotina"
              className="mt-3 inline-block font-bold text-brand-ink"
            >
              Ver minha rotina
            </Link>
          </section>
        )}
        <section className="flex flex-col gap-2.5">
          <h2 className={heading}>A seguir</h2>
          <Link
            href={videoHref(next)}
            className={cn("flex items-center gap-3 rounded-xl", focusRing)}
          >
            <Thumbnail video={next} variant="next" />
            <div className="flex min-w-0 flex-1 flex-col gap-0.5">
              <h3 className="text-sm leading-normal font-bold">{next.title}</h3>
              <p className="text-xs leading-normal text-ink-3">
                {next.name} · {next.course}
              </p>
            </div>
          </Link>
        </section>
      </div>
    </>
  );
}
