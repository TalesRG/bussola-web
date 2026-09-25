import Image from "next/image";
import Link from "next/link";
import { cn } from "./cn";

// `icon` é a versão inativa; `activeIcon` a da aba atual, quando muda.
const ITEMS = [
  {
    label: "Hoje",
    icon: "/figma/rotina/21f4f.svg",
    activeIcon: "/figma/home/nav-hoje.svg",
    href: "/home",
  },
  {
    label: "Rotina",
    icon: "/figma/home/nav-rotina.svg",
    activeIcon: "/figma/rotina/912ad.svg",
    href: "/rotina",
  },
  {
    label: "Mural",
    icon: "/figma/home/nav-mural.svg",
    activeIcon: "/figma/mural/nav-mural-ativo.svg",
    href: "/mural",
  },
  // TODO: tela de Campus.
  { label: "Campus", icon: "/figma/home/nav-campus.svg" },
];

/** Navegação flutuante com o botão de Apoio sempre à mão. */
export function BottomNav({ active }: { active: string }) {
  return (
    <nav
      aria-label="Principal"
      className="sticky bottom-0 flex items-center gap-3 bg-surface/95 px-5 pt-2.5 pb-4 backdrop-blur"
    >
      <ul className="flex h-[68px] flex-1 items-center justify-between rounded-full border border-line bg-surface px-3 py-2">
        {ITEMS.map((item) => {
          const current = item.label === active;
          const content = (
            <>
              <span
                className={cn(
                  "flex h-[30px] items-center justify-center rounded-full",
                  current ? "w-12 bg-brand-soft" : "w-8",
                )}
              >
                <Image
                  src={(current && item.activeIcon) || item.icon}
                  alt=""
                  width={20}
                  height={20}
                />
              </span>
              <span
                className={cn(
                  "font-display text-[11px] leading-[1.2] font-medium",
                  current ? "text-brand-ink" : "text-ink-3",
                )}
              >
                {item.label}
              </span>
            </>
          );
          const className =
            "flex w-[52px] flex-col items-center gap-0.5 rounded-xl focus-visible:outline-2 focus-visible:outline-brand";
          return (
            <li key={item.label}>
              {item.href ? (
                <Link
                  href={item.href}
                  aria-current={current ? "page" : undefined}
                  className={className}
                >
                  {content}
                </Link>
              ) : (
                <button type="button" className={className}>
                  {content}
                </button>
              )}
            </li>
          );
        })}
      </ul>
      <a
        href={active === "Hoje" ? "#apoio" : "/home#apoio"}
        className="flex flex-col items-center gap-1 rounded-full focus-visible:outline-2 focus-visible:outline-brand"
      >
        <span className="flex size-[60px] items-center justify-center rounded-full border border-brand-line bg-brand-soft">
          <Image src="/figma/home/nav-apoio.svg" alt="" width={24} height={24} />
        </span>
        <span className="font-display text-[11px] leading-[1.2] font-medium text-ink-2">
          Apoio
        </span>
      </a>
    </nav>
  );
}
