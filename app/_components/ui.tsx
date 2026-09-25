import Image from "next/image";
import type { ComponentProps, ReactNode } from "react";
import { BackButton } from "./back-button";
import { cn } from "./cn";

export { cn };

const primaryBase =
  "flex w-full shrink-0 items-center justify-center rounded-[14px] bg-brand px-5 font-display leading-none font-bold text-white transition hover:brightness-110 active:brightness-95 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand disabled:opacity-50";

export const primaryButton = `${primaryBase} h-[54px] text-xl`;
export const primaryButtonSm = `${primaryBase} h-11 text-sm`;
export const primaryButtonMd = `${primaryBase} h-12 text-sm`;

const secondaryBase =
  "flex shrink-0 items-center justify-center gap-2.5 rounded-[14px] border-[1.5px] border-brand bg-surface px-5 font-display leading-none font-bold text-brand-ink transition hover:bg-brand-soft focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand";

export const secondaryButton = `${secondaryBase} h-12 w-full text-sm`;
export const secondaryButtonSm = `${secondaryBase} h-10 self-start text-sm`;
/** 54px, sem largura: combine com w-full ou uma largura fixa. */
export const secondaryButtonLg = `${secondaryBase} h-[54px] text-xl`;

export const textLink =
  "font-display text-sm leading-none font-bold text-brand-ink hover:underline focus-visible:underline focus-visible:outline-none";

/** Coluna mobile (390px) centralizada sobre o fundo azul. */
export function Screen({
  children,
  tone = "brand",
}: {
  children: ReactNode;
  tone?: "brand" | "light";
}) {
  return (
    <main
      className={cn(
        "mx-auto flex w-full max-w-[390px] flex-1 flex-col overflow-x-clip",
        tone === "brand" ? "bg-brand" : "bg-surface",
      )}
    >
      {children}
    </main>
  );
}

export function BlueTop({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <header className={cn("flex flex-col px-6 pt-6 text-white", className)}>
      {children}
    </header>
  );
}

/** Folha branca com cantos arredondados que ocupa o resto da tela. */
export function Sheet({
  children,
  className,
  ...props
}: ComponentProps<"div">) {
  return (
    <div
      className={cn(
        "flex flex-1 flex-col gap-[18px] rounded-t-[28px] bg-surface px-6 pt-6 pb-8",
        className,
      )}
      {...props}
    >
      {children}
    </div>
  );
}

export function TopBar({ backHref }: { backHref: string }) {
  return (
    <div className="flex items-center justify-between">
      <BackButton fallbackHref={backHref} />
      <div className="flex items-center gap-2">
        <Image src="/figma/marca.svg" alt="" width={24} height={24} />
        <span className="font-display text-base leading-[1.2] font-bold">
          bússola
        </span>
      </div>
      <div className="w-10" aria-hidden />
    </div>
  );
}

export function Field({
  label,
  hint,
  aside,
  htmlFor,
  children,
}: {
  label: string;
  hint?: ReactNode;
  aside?: ReactNode;
  htmlFor?: string;
  children: ReactNode;
}) {
  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-start justify-between">
        <label
          htmlFor={htmlFor}
          className="text-sm leading-normal font-bold text-ink"
        >
          {label}
        </label>
        {aside}
      </div>
      {children}
      {hint && <p className="text-xs leading-normal text-ink-3">{hint}</p>}
    </div>
  );
}

export const inputBox =
  "flex items-center gap-2.5 rounded-[14px] border border-line bg-surface-muted px-4 py-[15px] focus-within:border-brand focus-within:ring-[0.5px] focus-within:ring-brand";

export const input =
  "min-w-0 flex-1 bg-transparent text-base leading-normal text-ink outline-none placeholder:text-ink-3";

export function Notice({
  tone,
  children,
}: {
  tone: "lilac" | "yellow";
  children: ReactNode;
}) {
  return (
    <div
      className={cn(
        "flex items-start gap-2.5 rounded-[14px] p-3.5",
        tone === "lilac" ? "bg-lilac-light" : "bg-yellow-light",
      )}
    >
      <Image
        src="/figma/icon-warning.svg"
        alt=""
        width={18}
        height={18}
        className="shrink-0"
      />
      <p className="flex-1 text-xs leading-normal text-ink-2">{children}</p>
    </div>
  );
}

export function CvvLine({ icon = "/figma/icon-phone.svg" }: { icon?: string }) {
  return (
    <a
      href="tel:188"
      className="flex items-center justify-center gap-2 text-xs leading-normal text-ink-3 hover:text-ink-2"
    >
      <Image src={icon} alt="" width={14} height={14} />
      Precisa de ajuda agora? CVV 188, 24h
    </a>
  );
}

/* Nuvem de carinhas: posições do Figma na escala "lg" (célula 19.32px). */
const FACE_POSITIONS: [number, number][] = [
  [48.3, 16.8], [69.3, 8.4], [92.4, 12.6], [109.2, 23.1],
  [39.9, 39.9], [60.9, 33.6], [81.9, 35.7], [102.9, 46.2],
  [29.4, 63], [52.5, 58.8], [73.5, 56.7], [94.5, 67.2], [115.5, 63],
  [35.7, 86.1], [56.7, 81.9], [79.8, 79.8], [100.8, 90.3], [121.8, 86.1],
  [60.9, 105], [84, 102.9], [107.1, 111.3], [128.1, 107.1], [90.3, 123.9],
];

const FACES = {
  lg: {
    scale: 1,
    files: [
      "28059", "e8058", "2d0eb", "a0cb8", "9b53f", "2d0eb", "b3c4a", "87da4",
      "9cef2", "c7b94", "85222", "a18d1", "8407c", "3d06c", "c9179", "822ee",
      "fa9a2", "04afe", "1dd03", "8bbaa", "7cfed", "2531a", "621a8",
    ],
  },
  sm: {
    scale: 16.56 / 19.32,
    files: [
      "6f905", "5dbdd", "28f55", "cb26c", "4cbe3", "28f55", "0152c", "5549a",
      "7c35c", "2c8a4", "58bb9", "7d43b", "1cba3", "a3682", "25ee1", "7d439",
      "b459e", "44908", "1ca69", "cd59f", "bd5be", "69a3f", "fc879",
    ],
  },
};

export function Carinhas({
  size,
  className,
}: {
  size: keyof typeof FACES;
  className?: string;
}) {
  const { scale, files } = FACES[size];
  const face = 19.32 * scale;
  return (
    <div
      aria-hidden
      className={cn("absolute", className)}
      style={{ width: 163.8 * scale, height: 151.2 * scale }}
    >
      {FACE_POSITIONS.map(([x, y], i) => (
        <Image
          key={i}
          src={`/figma/carinhas/${size}/${files[i]}.svg`}
          alt=""
          width={face}
          height={face}
          className="absolute"
          style={{ left: x * scale, top: y * scale }}
        />
      ))}
    </div>
  );
}
