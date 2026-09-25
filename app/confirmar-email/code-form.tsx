"use client";

import Image from "next/image";
import Link from "next/link";
import {
  useEffect,
  useRef,
  useState,
  type ClipboardEvent,
  type KeyboardEvent,
} from "react";
import {
  CvvLine,
  Notice,
  Sheet,
  cn,
  primaryButton,
  textLink,
} from "../_components/ui";

const LENGTH = 6;
const RESEND_SECONDS = 60;

export function CodeForm() {
  const [digits, setDigits] = useState<string[]>(Array(LENGTH).fill(""));
  const [focused, setFocused] = useState<number | null>(0);
  const [secondsLeft, setSecondsLeft] = useState(RESEND_SECONDS);
  const inputs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    if (secondsLeft <= 0) return;
    const id = setTimeout(() => setSecondsLeft((s) => s - 1), 1000);
    return () => clearTimeout(id);
  }, [secondsLeft]);

  function fill(from: number, value: string) {
    const chars = value.replace(/\D/g, "").slice(0, LENGTH - from).split("");
    if (chars.length === 0) return;
    setDigits((prev) => {
      const next = [...prev];
      chars.forEach((c, i) => (next[from + i] = c));
      return next;
    });
    inputs.current[Math.min(from + chars.length, LENGTH - 1)]?.focus();
  }

  function handleKeyDown(index: number, event: KeyboardEvent<HTMLInputElement>) {
    if (event.key === "Backspace" && !digits[index] && index > 0) {
      event.preventDefault();
      setDigits((prev) => prev.map((d, i) => (i === index - 1 ? "" : d)));
      inputs.current[index - 1]?.focus();
    } else if (event.key === "ArrowLeft" && index > 0) {
      inputs.current[index - 1]?.focus();
    } else if (event.key === "ArrowRight" && index < LENGTH - 1) {
      inputs.current[index + 1]?.focus();
    }
  }

  function handlePaste(index: number, event: ClipboardEvent<HTMLInputElement>) {
    event.preventDefault();
    fill(index, event.clipboardData.getData("text"));
  }

  function confirm() {
    // TODO: validar o código e seguir para os combinados (E04).
  }

  function resend() {
    // TODO: pedir novo código ao backend.
    setSecondsLeft(RESEND_SECONDS);
  }

  const complete = digits.every(Boolean);
  const minutes = Math.floor(secondsLeft / 60);
  const seconds = String(secondsLeft % 60).padStart(2, "0");

  return (
    <Sheet className="gap-5 pt-7">
      <form action={confirm} className="contents">
        <fieldset>
          <legend className="mb-5 text-sm leading-normal font-bold text-ink">
            Código de confirmação
          </legend>
          <div className="flex gap-2">
            {digits.map((digit, i) => {
              const active = focused === i;
              return (
                <input
                  key={i}
                  ref={(el) => {
                    inputs.current[i] = el;
                  }}
                  value={digit}
                  inputMode="numeric"
                  autoComplete={i === 0 ? "one-time-code" : "off"}
                  aria-label={`Dígito ${i + 1}`}
                  autoFocus={i === 0}
                  onFocus={(e) => {
                    setFocused(i);
                    e.target.select();
                  }}
                  onBlur={() => setFocused(null)}
                  onChange={(e) => {
                    const value = e.target.value.replace(/\D/g, "");
                    if (value === "") {
                      setDigits((prev) => prev.map((d, j) => (j === i ? "" : d)));
                    } else {
                      // Autopreenchimento do SMS/e-mail chega com o código inteiro.
                      fill(i, value.length > 2 ? value : value.slice(-1));
                    }
                  }}
                  onKeyDown={(e) => handleKeyDown(i, e)}
                  onPaste={(e) => handlePaste(i, e)}
                  className={cn(
                    "h-[58px] w-0 min-w-0 flex-1 rounded-[14px] text-center font-display text-2xl leading-[1.3] font-bold text-ink caret-brand outline-none",
                    active
                      ? "border-2 border-brand bg-surface-muted"
                      : digit
                        ? "border border-line bg-surface"
                        : "border border-line bg-surface-muted",
                  )}
                />
              );
            })}
          </div>
        </fieldset>

        <div className="flex items-center justify-between">
          {secondsLeft > 0 ? (
            <p className="flex items-center gap-1.5 text-xs leading-normal text-ink-3">
              <Image src="/figma/icon-clock.svg" alt="" width={14} height={14} />
              Reenviar em {minutes}:{seconds}
            </p>
          ) : (
            <button type="button" onClick={resend} className={textLink}>
              Reenviar código
            </button>
          )}
          <Link href="/cadastro" className={textLink}>
            Trocar e-mail
          </Link>
        </div>

        <button type="submit" disabled={!complete} className={primaryButton}>
          Confirmar
        </button>
      </form>

      <Notice tone="yellow">
        Não chegou? Olhe a caixa de spam ou a aba &quot;Outros&quot; do e-mail
        @aluno.
      </Notice>

      <CvvLine />
    </Sheet>
  );
}
