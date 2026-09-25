import Image from "next/image";
import Link from "next/link";
import type { ReactNode } from "react";
import { cn } from "../../../_components/ui";
import { focusRing, Icon, tag } from "../../_components/ui";
import { formatTime, type Video, videoHref } from "../_lib/data";

// A exportação dos ícones isolados mantém o modo Clara da instância no Figma.
const iconExports: Record<string, string> = {
  "2e6b3": "face",
  "2749d": "voice",
  f12bf: "book-brand",
  "7d093": "book",
  a29f1: "heart",
  "2ccb3": "community",
  c8096: "emoji",
  "7706c": "community-dark",
  b9a0f: "warning",
};
export const asset = (name: string) =>
  iconExports[name]
    ? `/figma/videos/${iconExports[name]}.png`
    : `/figma/videos/${name}.svg`;

export function VideoTag({
  children,
  active = false,
}: {
  children: ReactNode;
  active?: boolean;
}) {
  return (
    <span
      className={cn(
        tag,
        active ? "bg-brand-soft text-brand-ink" : "bg-subtle text-ink-2",
      )}
    >
      {children}
    </span>
  );
}

const gradients = {
  blue: "linear-gradient(143deg, var(--color-azure-100), var(--color-azure-300) 71.429%)",
  gray: "linear-gradient(143deg, var(--color-subtle), var(--color-line) 71.429%)",
  amber:
    "linear-gradient(143deg, var(--color-amber-50), var(--color-amber-100) 71.429%)",
};

// Mantém as dimensões exportadas de cada SVG, incluindo a sombra do botão Play.
const portraits = {
  blue: { card: ["5bbbd", "856e1"], short: ["b1acf", "e94aa"] },
  gray: { card: ["c5fce", "a2d6b"], short: ["55740", "6ae80"] },
  amber: { card: ["c1725", "e57b2"], short: ["28ce9", "1d509"] },
};

export function Thumbnail({
  video,
  variant = "card",
}: {
  video: Video;
  variant?: "card" | "featured" | "short" | "next" | "player";
}) {
  const featured = variant === "featured";
  const short = variant === "short";
  const player = variant === "player";
  const next = variant === "next";
  const pair = featured
    ? ["d1e7a", "68e87"]
    : player
      ? ["2426e", "399eb"]
      : next
        ? ["d8f59", "7cb76"]
        : portraits[video.tone][short ? "short" : "card"];
  const head = featured
    ? 59.1
    : player
      ? 65.7
      : next
        ? 20.4
        : short
          ? 33
          : 37.2;
  const bodyWidth = featured
    ? 137.9
    : player
      ? 153.3
      : next
        ? 47.6
        : short
          ? 77
          : 86.8;
  const bodyHeight = featured
    ? 118.2
    : player
      ? 131.4
      : next
        ? 40.8
        : short
          ? 66
          : 74.4;
  const playSize = featured ? 84 : next ? 50 : short ? 56 : 64;
  return (
    <div
      className={cn(
        "relative shrink-0 overflow-hidden",
        player
          ? "h-[219px] w-full"
          : featured
            ? "h-[197px] w-full rounded-2xl"
            : next
              ? "h-[68px] w-[120px] rounded-[10px]"
              : short
                ? "h-[180px] w-[110px] rounded-2xl"
                : "h-[124px] w-[220px] rounded-2xl",
      )}
      style={{
        backgroundImage:
          featured || player
            ? "linear-gradient(143deg, var(--color-brand-soft), var(--color-brand-line) 71.429%)"
            : gradients[video.tone],
      }}
    >
      <Image
        src={asset(pair[0])}
        alt=""
        width={head}
        height={head}
        className="absolute top-[24%] left-1/2 max-w-none -translate-x-1/2"
      />
      <Image
        src={asset(pair[1])}
        alt=""
        width={bodyWidth}
        height={bodyHeight}
        className="absolute top-[60%] left-1/2 max-w-none -translate-x-1/2"
      />
      {!player && (
        <Image
          src={asset(
            featured ? "1e36b" : next ? "5b22f" : short ? "880c7" : "48e6d",
          )}
          alt=""
          width={playSize}
          height={playSize}
          className="absolute top-[calc(50%+4px)] left-1/2 max-w-none -translate-x-1/2 -translate-y-1/2"
        />
      )}
      {!player && (
        <span className="absolute right-2 bottom-2 rounded-md bg-ink/75 px-1.5 py-[3px] font-display text-xs leading-none font-bold text-white">
          {formatTime(video.duration)}
        </span>
      )}
      {!short && !player && !next && (
        <span className="absolute top-2 left-2 rounded-md bg-white px-1.5 py-[3px] font-display text-xs leading-none font-bold">
          CC
        </span>
      )}
    </div>
  );
}

export function VideoCard({ video }: { video: Video }) {
  return (
    <Link
      href={videoHref(video)}
      className={cn(
        "flex w-[220px] shrink-0 snap-start flex-col gap-2.5 rounded-2xl",
        focusRing,
      )}
    >
      <Thumbnail video={video} />
      <h3 className="text-sm leading-normal font-bold">{video.title}</h3>
      <p className="text-xs leading-normal text-ink-3">
        {video.name} · {video.course}
      </p>
    </Link>
  );
}

export function ResourceContent({
  title,
  description,
  icon = "f12bf",
}: {
  title: string;
  description: string;
  icon?: string;
}) {
  return (
    <>
      <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-brand-soft">
        <Icon src={asset(icon)} />
      </span>
      <span className="flex min-w-0 flex-1 flex-col gap-0.5">
        <span className="text-sm leading-normal font-bold">{title}</span>
        <span className="text-xs leading-normal text-ink-3">{description}</span>
      </span>
      <Icon src={asset("ab074")} size={18} />
    </>
  );
}
