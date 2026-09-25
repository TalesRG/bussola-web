import Image from "next/image";
import Link from "next/link";
import { cn, textLink } from "../../_components/ui";
import { tag } from "../../agenda/_components/step";
export const heading =
  "font-display text-base leading-[1.2] font-bold text-ink";
export const card = "flex flex-col gap-3 rounded-[18px] border border-line p-4";
export const caption = "text-xs leading-normal text-ink-3";
export function Icon({ file, size = 20 }: { file: string; size?: number }) {
  return (
    <Image
      src={`/figma/rotina/${file}.svg`}
      alt=""
      width={size}
      height={size}
      style={{ width: size, height: size }}
      className="shrink-0"
    />
  );
}
export function Check({
  checked,
  small = false,
}: {
  checked: boolean;
  small?: boolean;
}) {
  return (
    <span
      aria-hidden
      className={cn(
        "flex shrink-0 items-center justify-center rounded-lg",
        small ? "size-[22px]" : "size-6",
        checked ? "bg-brand" : "border-2 border-line-muted bg-white",
      )}
    >
      {checked && (
        <Icon file={small ? "96501" : "9d27f"} size={small ? 14 : 16} />
      )}
    </span>
  );
}
export function Badge({ children }: { children: string }) {
  return (
    <span
      className={cn(
        tag,
        "shrink-0",
        children === "Prova"
          ? "bg-amber-50 text-amber-800"
          : children === "Entrega"
            ? "border border-brand-line bg-white text-brand-ink"
            : "bg-subtle text-ink-2",
      )}
    >
      {children}
    </span>
  );
}
export function FormHeader({ title }: { title: string }) {
  return (
    <header className="grid grid-cols-[1fr_auto_1fr] items-center px-5 pt-6">
      <Link href="/rotina" className={textLink}>
        Cancelar
      </Link>
      <h1 className="text-sm font-bold">{title}</h1>
      <span />
    </header>
  );
}
export function Segments({
  options,
  value,
  onChange,
}: {
  options: string[];
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <div
      role="tablist"
      aria-label="Visualização"
      className="flex gap-1 rounded-full bg-subtle p-1"
    >
      {options.map((option) => (
        <button
          key={option}
          type="button"
          role="tab"
          aria-selected={value === option}
          onClick={() => onChange(option)}
          className={cn(
            "h-[38px] min-w-0 flex-1 rounded-full font-display text-sm font-bold focus-visible:outline-2 focus-visible:outline-brand",
            value === option
              ? "border border-line bg-white text-ink"
              : "text-ink-2",
          )}
        >
          {option}
        </button>
      ))}
    </div>
  );
}
