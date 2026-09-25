"use client";

import Image from "next/image";

export function Switch({
  checked,
  onChange,
  label,
}: {
  checked: boolean;
  onChange: (checked: boolean) => void;
  label: string;
}) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={label}
      onClick={() => onChange(!checked)}
      className="shrink-0 rounded-full focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand"
    >
      <Image
        src={checked ? "/figma/agenda/toggle-on.svg" : "/figma/agenda/toggle-off.svg"}
        alt=""
        width={48}
        height={28}
      />
    </button>
  );
}
