"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { PasswordInput } from "../_components/password-input";
import {
  CvvLine,
  Field,
  Notice,
  Sheet,
  input,
  inputBox,
  primaryButton,
  secondaryButton,
  textLink,
} from "../_components/ui";

export function LoginForm() {
  const router = useRouter();
  const [login, setLogin] = useState("");
  const [keepSignedIn, setKeepSignedIn] = useState(true);

  // `action` (e não onSubmit) evita que um envio antes da hidratação
  // mande a senha na URL via GET.
  function signIn() {
    // TODO: autenticar com a conta UnB antes de seguir.
    router.push("/agenda/montar");
  }

  function sendCode() {
    const email = login.includes("@") ? login : "";
    router.push(
      `/confirmar-email${email ? `?email=${encodeURIComponent(email)}` : ""}`,
    );
  }

  return (
    <Sheet>
      <form action={signIn} className="contents">
        <Field
          label="Matrícula ou e-mail"
          htmlFor="login"
          hint="Ex.: 26/0123456 ou nome@aluno.unb.br"
        >
          <div className={inputBox}>
            <input
              id="login"
              name="login"
              required
              autoComplete="username"
              placeholder="26/0123456"
              value={login}
              onChange={(e) => setLogin(e.target.value)}
              className={input}
            />
          </div>
        </Field>

        <Field label="Senha" htmlFor="senha">
          <PasswordInput
            id="senha"
            name="senha"
            required
            autoComplete="current-password"
          />
        </Field>

        <div className="flex items-center justify-between">
          <label className="flex cursor-pointer items-center gap-2.5 text-sm leading-normal text-ink">
            <input
              type="checkbox"
              name="manter"
              checked={keepSignedIn}
              onChange={(e) => setKeepSignedIn(e.target.checked)}
              className="peer sr-only"
            />
            <span className="flex size-6 items-center justify-center rounded-lg border border-line bg-surface peer-checked:border-brand peer-checked:bg-brand peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-brand">
              {keepSignedIn && (
                <Image
                  src="/figma/icon-check-checkbox.svg"
                  alt=""
                  width={16}
                  height={16}
                />
              )}
            </span>
            Manter conectado
          </label>
          {/* TODO: fluxo de recuperação de senha */}
          <button type="button" className={textLink}>
            Esqueci a senha
          </button>
        </div>

        <button type="submit" className={primaryButton}>
          Entrar
        </button>
      </form>

      <div className="flex items-center gap-3">
        <div className="h-px flex-1 bg-line" />
        <span className="text-xs leading-normal text-ink-3">ou</span>
        <div className="h-px flex-1 bg-line" />
      </div>

      <button type="button" onClick={sendCode} className={secondaryButton}>
        Receber código no e-mail @aluno
      </button>

      <Notice tone="lilac">
        Não guardamos sua senha. A UnB não fica sabendo que você usa a Bússola.
      </Notice>

      <p className="flex items-center justify-center gap-1.5 text-sm">
        <span className="leading-normal text-ink-2">Primeira vez?</span>
        <Link href="/cadastro" className={textLink}>
          Criar conta
        </Link>
      </p>

      <CvvLine />
    </Sheet>
  );
}
