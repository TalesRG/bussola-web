"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { cn } from "./cn";

export function BackButton({
  fallbackHref,
  variant = "onBrand",
}: {
  fallbackHref: string;
  variant?: "onBrand" | "light";
}) {
  const router = useRouter();

  return (
    <button
      type="button"
      aria-label="Voltar"
      onClick={() =>
        window.history.length > 1 ? router.back() : router.push(fallbackHref)
      }
      className={cn(
        "flex size-10 shrink-0 items-center justify-center rounded-full transition focus-visible:outline-2",
        variant === "onBrand"
          ? "bg-white/16 hover:bg-white/24 focus-visible:outline-white"
          : "border border-line hover:bg-surface-muted focus-visible:outline-brand",
      )}
    >
      <Image
        src={variant === "onBrand" ? "/figma/icon-back.svg" : "/figma/agenda/icon-back-dark.svg"}
        alt=""
        width={20}
        height={20}
      />
    </button>
  );
}
