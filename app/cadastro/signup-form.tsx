"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { ChipGroup } from "../_components/chip-group";
import { PasswordInput } from "../_components/password-input";
import {
  CvvLine,
  Field,
  Sheet,
  cn,
  input,
  inputBox,
  primaryButton,
  textLink,
} from "../_components/ui";

const COURSES = [
  "Administração",
  "Arquitetura e Urbanismo",
  "Ciência da Computação",
  "Direito",
  "Enfermagem",
  "Engenharia de Software",
  "Engenharia Elétrica",
  "Letras",
  "Medicina",
  "Pedagogia",
  "Psicologia",
];

const SEMESTERS = ["1º", "2º", "3º", "4º", "5º", "6º", "7º", "8º+"];
const PRONOUNS = ["Ela", "Ele", "Elu", "Prefiro não dizer"];

const UNB_EMAIL = /^[^\s@]+@aluno\.unb\.br$/i;

const PASSWORD_RULES = [
  { label: "8 caracteres ou mais", test: (p: string) => p.length >= 8 },
  { label: "Pelo menos 1 número", test: (p: string) => /\d/.test(p) },
  { label: "Pelo menos 1 letra maiúscula", test: (p: string) => /[A-Z]/.test(p) },
];

export function SignupForm() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [semester, setSemester] = useState<string | null>(null);
  const [pronoun, setPronoun] = useState<string | null>(null);
  const [password, setPassword] = useState("");

  const emailValid = UNB_EMAIL.test(email);
  const passwordValid = PASSWORD_RULES.every((r) => r.test(password));

  // `action` (e não onSubmit) evita que um envio antes da hidratação
  // mande a senha na URL via GET.
  function createAccount() {
    if (!emailValid || !semester || !passwordValid) return;
    // TODO: criar a conta no backend antes de pedir a confirmação.
    router.push(`/confirmar-email?email=${encodeURIComponent(email)}`);
  }

  return (
    <Sheet>
      <form action={createAccount} className="contents">
        <Field
          label="Como quer ser chamado(a)?"
          htmlFor="nome"
          hint="Pode ser um apelido. Só você vê."
        >
          <div className={inputBox}>
            <input
              id="nome"
              name="nome"
              required
              autoComplete="nickname"
              placeholder="Ana"
              className={input}
            />
          </div>
        </Field>

        <Field
          label="E-mail institucional"
          htmlFor="email"
          hint="Serve só para confirmar que você é estudante da UnB."
        >
          <div className={inputBox}>
            <input
              id="email"
              name="email"
              type="email"
              required
              autoComplete="email"
              placeholder="nome@aluno.unb.br"
              value={email}
              onChange={(e) => setEmail(e.target.value.trim())}
              aria-invalid={email !== "" && !emailValid}
              className={input}
            />
            {emailValid && (
              <span className="flex size-[22px] shrink-0 items-center justify-center rounded-full bg-teal">
                <Image
                  src="/figma/icon-check-field.svg"
                  alt="E-mail válido"
                  width={14}
                  height={14}
                />
              </span>
            )}
          </div>
        </Field>

        <Field label="Curso" htmlFor="curso">
          <div className={cn(inputBox, "relative")}>
            <select
              id="curso"
              name="curso"
              required
              defaultValue=""
              className={cn(input, "cursor-pointer appearance-none pr-7")}
            >
              <option value="" disabled>
                Selecione seu curso
              </option>
              {COURSES.map((c) => (
                <option key={c}>{c}</option>
              ))}
            </select>
            <Image
              src="/figma/icon-chev.svg"
              alt=""
              width={18}
              height={18}
              className="pointer-events-none absolute right-4"
            />
          </div>
        </Field>

        <Field label="Semestre">
          <ChipGroup
            label="Semestre"
            options={SEMESTERS}
            value={semester}
            onChange={setSemester}
          />
        </Field>

        <Field
          label="Como prefere ser tratado(a)?"
          aside={
            <span className="font-display text-[11px] leading-[1.2] font-medium text-ink-3">
              Opcional
            </span>
          }
        >
          <ChipGroup
            label="Como prefere ser tratado(a)?"
            options={PRONOUNS}
            value={pronoun}
            onChange={setPronoun}
            allowDeselect
          />
        </Field>

        <Field label="Crie uma senha" htmlFor="senha">
          <PasswordInput
            id="senha"
            name="senha"
            required
            autoComplete="new-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <ul className="flex flex-col gap-1.5">
            {PASSWORD_RULES.map((rule) => {
              const ok = rule.test(password);
              return (
                <li key={rule.label} className="flex items-center gap-2">
                  {ok ? (
                    <span className="flex size-[18px] items-center justify-center rounded-full bg-teal">
                      <Image
                        src="/figma/icon-check-rule.svg"
                        alt=""
                        width={12}
                        height={12}
                      />
                    </span>
                  ) : (
                    <span className="size-[18px] rounded-full border-[1.5px] border-line-muted" />
                  )}
                  <span
                    className={cn(
                      "text-xs leading-normal",
                      ok ? "text-ink-2" : "text-ink-3",
                    )}
                  >
                    {rule.label}
                  </span>
                </li>
              );
            })}
          </ul>
        </Field>

        <button
          type="submit"
          disabled={!emailValid || !semester || !passwordValid}
          className={primaryButton}
        >
          Criar conta
        </button>
      </form>

      <p className="flex items-center justify-center gap-1.5 text-sm">
        <span className="leading-normal text-ink-2">Já tem conta?</span>
        <Link href="/login" className={textLink}>
          Entrar
        </Link>
      </p>

      <CvvLine />
    </Sheet>
  );
}
