"use client";

import { useEffect, useRef, useState } from "react";
import type { Video } from "../_lib/data";

export function usePlayback(video: Video, initialTime = 0) {
  const media = useRef<HTMLVideoElement>(null);
  const [time, setTime] = useState(initialTime);
  const [playing, setPlaying] = useState(false);
  const [captions, setCaptions] = useState(true);
  const [speed, setSpeed] = useState(1);
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (!playing || video.src) return;
    const timer = window.setTimeout(() => {
      const next = Math.min(time + speed, video.duration);
      setTime(next);
      if (next >= video.duration) setPlaying(false);
    }, 1000);
    return () => window.clearTimeout(timer);
  }, [playing, speed, time, video.duration, video.src]);

  useEffect(() => {
    if (!media.current) return;
    media.current.playbackRate = speed;
    for (const track of Array.from(media.current.textTracks))
      track.mode = captions ? "showing" : "hidden";
  }, [captions, speed]);

  const seek = (value: number) => {
    const next = Math.max(0, Math.min(value, video.duration));
    setTime(next);
    if (media.current) media.current.currentTime = next;
  };

  const toggle = async () => {
    if (playing && time < video.duration) {
      media.current?.pause();
      setPlaying(false);
      return;
    }
    if (time >= video.duration) seek(0);
    if (media.current) {
      try {
        await media.current.play();
      } catch {
        setMessage("Não foi possível reproduzir o vídeo. Tente novamente.");
        return;
      }
    } else {
      setMessage("Prévia ilustrativa. O vídeo ainda não está disponível.");
    }
    setPlaying(true);
  };

  const attachMedia = (element: HTMLVideoElement | null) => {
    media.current = element;
  };
  return {
    attachMedia,
    time,
    playing: playing && time < video.duration,
    captions,
    setCaptions,
    speed,
    setSpeed,
    message,
    seek,
    toggle,
    setTime,
    setPlaying,
  };
}

export function Media({
  video,
  playback,
  className,
}: {
  video: Video;
  playback: ReturnType<typeof usePlayback>;
  className?: string;
}) {
  return (
    <video
      ref={(element) => playback.attachMedia(element)}
      src={video.src}
      className={className}
      playsInline
      preload="metadata"
      onTimeUpdate={(event) =>
        playback.setTime(event.currentTarget.currentTime)
      }
      onEnded={() => playback.setPlaying(false)}
      onPause={() => playback.setPlaying(false)}
      onPlay={() => playback.setPlaying(true)}
    >
      {video.captionsSrc && (
        <track
          default
          kind="captions"
          srcLang="pt-BR"
          label="Português"
          src={video.captionsSrc}
        />
      )}
    </video>
  );
}
