"use client";

import Image from "next/image";
import { useRef, useState } from "react";
import { PageHeader } from "../../../_components/page-header";
import { cn } from "../../../_components/ui";
import { Avatar, focusRing, Icon } from "../../_components/ui";
import { useMural } from "../../_lib/state";
import { Media, usePlayback } from "../_components/playback";
import { asset, VideoTag } from "../_components/ui";
import { formatTime, SHORTS, type Video } from "../_lib/data";

export function ShortVideos({ initialIndex }: { initialIndex: number }) {
  const [index, setIndex] = useState(initialIndex);
  const change = (direction: number) =>
    setIndex(
      (current) => (current + direction + SHORTS.length) % SHORTS.length,
    );
  return (
    <>
      <PageHeader
        title="Em 1 minuto"
        backHref="/mural/videos"
        action={
          <VideoTag>
            {index + 1} de {SHORTS.length}
          </VideoTag>
        }
      />
      <ShortVideo
        key={SHORTS[index].id}
        video={SHORTS[index]}
        change={change}
      />
    </>
  );
}

function ShortVideo({
  video,
  change,
}: {
  video: Video;
  change: (direction: number) => void;
}) {
  const playback = usePlayback(video, video.id === "ajuda" ? 24 : 0);
  const mural = useMural();
  const touch = useRef<number | null>(null);
  const key = `video:${video.id}`;
  const helped = (mural.reactions[key] ?? []).includes("ajudou");
  const identified = (mural.reactions[key] ?? []).includes("identifiquei");
  const saved = mural.saved.includes(key);
  const [transcript, setTranscript] = useState(false);
  return (
    <div className="flex flex-1 flex-col gap-4 px-5 pt-3 pb-6">
      <div
        tabIndex={0}
        role="group"
        aria-label="Vídeo curto. Use as setas para cima e para baixo para navegar."
        className={cn(
          "relative h-[540px] w-full shrink-0 touch-pan-x overflow-hidden rounded-[24px]",
          focusRing,
        )}
        style={{
          backgroundImage:
            "linear-gradient(116deg, var(--color-subtle), var(--color-brand-line) 71.429%)",
        }}
        onTouchStart={(event) => {
          touch.current = event.touches[0].clientY;
        }}
        onTouchEnd={(event) => {
          if (touch.current !== null) {
            const distance = touch.current - event.changedTouches[0].clientY;
            if (Math.abs(distance) > 60) change(distance > 0 ? 1 : -1);
          }
          touch.current = null;
        }}
        onKeyDown={(event) => {
          if (event.target !== event.currentTarget) return;
          if (event.key === "ArrowDown" || event.key === "ArrowUp") {
            event.preventDefault();
            change(event.key === "ArrowDown" ? 1 : -1);
          }
          if (event.key === " ") {
            event.preventDefault();
            void playback.toggle();
          }
        }}
      >
        {video.src ? (
          <Media
            video={video}
            playback={playback}
            className="absolute inset-0 h-full w-full object-cover"
          />
        ) : (
          <>
            <Image
              src={asset("ec4ef")}
              alt=""
              width={120}
              height={120}
              className="absolute top-[120px] left-1/2 max-w-none -translate-x-1/2"
            />
            <Image
              src={asset("38565")}
              alt=""
              width={260}
              height={240}
              className="absolute top-[270px] left-1/2 max-w-none -translate-x-1/2"
            />
          </>
        )}
        <button
          aria-label={
            playback.playing ? "Pausar vídeo curto" : "Reproduzir vídeo curto"
          }
          onClick={playback.toggle}
          className="absolute inset-0 rounded-[24px] focus-visible:outline-2 focus-visible:-outline-offset-4 focus-visible:outline-brand"
        />
        <input
          type="range"
          aria-label="Progresso do vídeo curto"
          min={0}
          max={video.duration}
          value={Math.floor(playback.time)}
          onChange={(event) => playback.seek(Number(event.target.value))}
          className="video-progress absolute top-4 right-4 left-4 w-[calc(100%-32px)]"
          style={{
            background: `linear-gradient(to right, var(--color-brand) ${(playback.time / video.duration) * 100}%, #ffffff99 0)`,
          }}
        />
        <button
          aria-label="Legendas"
          aria-pressed={playback.captions}
          onClick={() => playback.setCaptions(!playback.captions)}
          className={cn(
            "absolute top-8 left-4 rounded-md px-1.5 py-[3px] font-display text-xs leading-none font-bold",
            playback.captions ? "bg-white" : "bg-ink/70 text-white",
            focusRing,
          )}
        >
          CC
        </button>
        {playback.captions && !video.src && video.quote && (
          <p className="pointer-events-none absolute top-[440px] left-1/2 w-[260px] max-w-[calc(100%-40px)] -translate-x-1/2 rounded-lg bg-ink/80 px-3 py-2 text-center text-sm leading-normal text-white">
            &quot;{video.quote}&quot;
          </p>
        )}
        <div className="absolute top-[220px] right-3.5 flex flex-col gap-3.5">
          <button
            aria-label="Me ajudou"
            aria-pressed={helped}
            onClick={() => mural.toggleReaction(key, "ajudou")}
            className={cn(
              "flex flex-col items-center gap-0.5 rounded-full",
              focusRing,
            )}
          >
            <span
              className={cn(
                "flex size-11 items-center justify-center rounded-full",
                helped ? "bg-brand" : "bg-white",
              )}
            >
              <Icon src={asset(helped ? "8051e" : "a29f1")} />
            </span>
            <span className="font-display text-xs leading-none font-bold">
              {412 - (video.id === "ajuda" ? 1 : 0) + (helped ? 1 : 0)}
            </span>
          </button>
          <button
            aria-label="Me identifiquei"
            aria-pressed={identified}
            onClick={() => mural.toggleReaction(key, "identifiquei")}
            className={cn(
              "flex flex-col items-center gap-0.5 rounded-full",
              focusRing,
            )}
          >
            <span
              className={cn(
                "flex size-11 items-center justify-center rounded-full",
                identified ? "bg-brand-line" : "bg-white",
              )}
            >
              <Icon src={asset("7706c")} />
            </span>
            <span className="font-display text-xs leading-none font-bold">
              {230 + (identified ? 1 : 0)}
            </span>
          </button>
          <button
            aria-label="Salvar vídeo curto"
            aria-pressed={saved}
            onClick={() => mural.toggleSaved(key)}
            className={cn(
              "flex size-11 items-center justify-center rounded-full",
              saved ? "bg-brand-line" : "bg-white",
              focusRing,
            )}
          >
            <Icon src={asset("7d093")} />
          </button>
        </div>
      </div>
      <div className="flex items-center gap-3">
        <Avatar initials={video.initials} size={44} />
        <div className="flex min-w-0 flex-1 flex-col gap-0.5">
          <h1 className="font-display text-base leading-[1.2] font-bold">
            {video.title}
          </h1>
          <p className="text-xs leading-normal text-ink-3">
            {video.name} · {video.course} · {formatTime(video.duration)}
          </p>
        </div>
        <VideoTag active>{video.themes[0]}</VideoTag>
      </div>
      <button
        onClick={() => change(1)}
        className={cn(
          "rounded-lg text-center text-xs leading-normal text-ink-3",
          focusRing,
        )}
      >
        Deslize para cima para o próximo
      </button>
      {playback.message && (
        <p role="status" className="text-xs text-ink-3">
          {playback.message}
        </p>
      )}
      <div className="mt-auto flex items-center justify-between pt-3 text-xs text-brand-ink">
        <button className={focusRing} onClick={() => change(-1)}>
          Anterior
        </button>
        <button
          className={focusRing}
          onClick={() => setTranscript(!transcript)}
          aria-expanded={transcript}
        >
          Ler a transcrição
        </button>
        <button className={focusRing} onClick={() => change(1)}>
          Próximo
        </button>
      </div>
      {transcript && (
        <section className="rounded-2xl bg-surface-muted p-4 text-sm leading-normal">
          <h2 className="mb-2 font-bold">Transcrição</h2>
          {video.quote && <p>&quot;{video.quote}&quot;</p>}
          <p className="mt-2 text-xs text-ink-3">
            A transcrição completa estará disponível com o vídeo.
          </p>
        </section>
      )}
    </div>
  );
}
