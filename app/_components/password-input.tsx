"use client";

import { useState, type ComponentProps } from "react";
import { input, inputBox, textLink } from "./ui";

export function PasswordInput(props: Omit<ComponentProps<"input">, "type">) {
  const [visible, setVisible] = useState(false);

  return (
    <div className={inputBox}>
      <input {...props} type={visible ? "text" : "password"} className={input} />
      <button
        type="button"
        onClick={() => setVisible((v) => !v)}
        aria-pressed={visible}
        className={textLink}
      >
        {visible ? "Ocultar" : "Mostrar"}
      </button>
    </div>
  );
}
