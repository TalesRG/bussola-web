"use client";

import Image from "next/image";
import Link from "next/link";
import { useRef, useState, type DragEvent } from "react";
import { cn, primaryButton, textLink } from "../../_components/ui";
import { COURSES, ENROLLMENT, shortSchedule } from "../_lib/data";
import { useAppState } from "@/app/_lib/state";
import { StepContent, StepFooter, StepTitle } from "../_components/step";

const MAX_BYTES = 10 * 1024 * 1024;
const ACCEPT = "application/pdf,image/jpeg,image/png";

const PRIVACY = [
  "Lemos só disciplinas, horários e salas",
  "O arquivo é apagado logo depois da leitura",
  "Sua nota, CPF e endereço não são guardados",
];

function formatSize(bytes: number) {
  return bytes < 1024 * 1024
    ? `${Math.max(1, Math.round(bytes / 1024))} KB`
    : `${(bytes / 1024 / 1024).toFixed(1).replace(".", ",")} MB`;
}

export function ReceiptUpload() {
  const { upload, setUpload } = useAppState();
  const [error, setError] = useState<string | null>(null);
  const [dragging, setDragging] = useState(false);
  const fileInput = useRef<HTMLInputElement>(null);
  const cameraInput = useRef<HTMLInputElement>(null);

  function accept(file: File | undefined) {
    if (!file) return;
    if (!ACCEPT.split(",").includes(file.type)) {
      setError("Envie um PDF, JPG ou PNG.");
      return;
    }
    if (file.size > MAX_BYTES) {
      setError("O arquivo passa de 10 MB.");
      return;
    }
    setError(null);
    // TODO: enviar para leitura no backend; por enquanto usamos as turmas de exemplo.
    setUpload({ name: file.name, size: file.size });
  }

  function handleDrop(event: DragEvent<HTMLDivElement>) {
    event.preventDefault();
    setDragging(false);
    accept(event.dataTransfer.files[0]);
  }

  const isPdf = upload?.name.toLowerCase().endsWith(".pdf");

  return (
    <>
      <StepContent>
        <StepTitle title="Envie seu comprovante de matrícula">
          Puxamos suas turmas direto do comprovante. É o PDF que o SIGAA gera em
          Ensino › Comprovante de matrícula; uma foto nítida também serve.
        </StepTitle>

        <div
          onDragOver={(e) => {
            e.preventDefault();
            setDragging(true);
          }}
          onDragLeave={() => setDragging(false)}
          onDrop={handleDrop}
          className={cn(
            "flex flex-col items-center gap-2.5 rounded-[20px] border-[1.5px] border-dashed border-brand px-4 py-6 transition",
            dragging ? "bg-azure-100" : "bg-brand-soft",
          )}
        >
          <button
            type="button"
            onClick={() => fileInput.current?.click()}
            className="flex flex-col items-center gap-2.5 rounded-xl focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-brand"
          >
            <span className="flex size-[52px] items-center justify-center rounded-xl bg-surface">
              <Image src="/figma/agenda/icon-clip-26.svg" alt="" width={26} height={26} />
            </span>
            <span className="font-display text-base leading-[1.2] font-bold text-brand-ink">
              Escolher arquivo
            </span>
          </button>
          <p className="text-xs leading-normal text-ink-3">
            PDF, JPG ou PNG · até 10 MB
          </p>
          <div className="flex gap-2">
            {[
              { label: "Tirar foto", ref: cameraInput },
              { label: "Arquivos do celular", ref: fileInput },
            ].map(({ label, ref }) => (
              <button
                key={label}
                type="button"
                onClick={() => ref.current?.click()}
                className="rounded-full border border-brand-line bg-surface px-2.5 py-[5px] font-display text-xs leading-none font-bold text-brand-ink hover:border-brand"
              >
                {label}
              </button>
            ))}
          </div>
          <input
            ref={fileInput}
            type="file"
            accept={ACCEPT}
            className="sr-only"
            tabIndex={-1}
            onChange={(e) => accept(e.target.files?.[0])}
          />
          <input
            ref={cameraInput}
            type="file"
            accept="image/*"
            capture="environment"
            className="sr-only"
            tabIndex={-1}
            onChange={(e) => accept(e.target.files?.[0])}
          />
        </div>

        {error && (
          <p role="alert" className="-mt-2 text-xs leading-normal text-amber-800">
            {error}
          </p>
        )}

        {upload && (
          <section className="flex flex-col gap-3 rounded-[18px] border border-line p-4">
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-10 shrink-0 items-center justify-center rounded-[10px] bg-amber-50 font-display text-xs leading-none font-bold text-amber-800">
                {isPdf ? "PDF" : "IMG"}
              </div>
              <div className="flex min-w-0 flex-1 flex-col gap-0.5 leading-normal">
                <p className="text-sm font-bold break-words text-ink">
                  {upload.name}
                </p>
                <p className="text-xs text-ink-3">
                  {formatSize(upload.size)} · enviado agora
                </p>
              </div>
              <button
                type="button"
                onClick={() => fileInput.current?.click()}
                className={textLink}
              >
                Trocar
              </button>
            </div>

            <div className="flex items-center gap-2.5 rounded-xl bg-brand-soft p-3">
              <span className="flex size-[22px] shrink-0 items-center justify-center rounded-full bg-brand">
                <Image src="/figma/agenda/icon-check-white-14.svg" alt="" width={14} height={14} />
              </span>
              <div className="flex flex-1 flex-col gap-0.5 leading-normal">
                <p className="text-sm font-bold text-ink">
                  Encontramos {COURSES.length} turmas no seu comprovante
                </p>
                <p className="text-xs text-ink-2">
                  Semestre {ENROLLMENT.semester} · {ENROLLMENT.program} ·
                  matrícula {ENROLLMENT.id}
                </p>
              </div>
            </div>

            <ul>
              {COURSES.map((c) => (
                <li
                  key={c.code}
                  className="flex items-center gap-2.5 border-b border-subtle py-2.5 last:border-b-0"
                >
                  <span className="rounded-md bg-subtle px-1.5 py-[3px] font-display text-xs leading-none font-bold text-ink-2">
                    T{c.section}
                  </span>
                  <div className="flex min-w-0 flex-1 flex-col">
                    <p className="text-sm leading-normal font-bold text-ink">
                      {c.shortName}
                    </p>
                    <p className="font-display text-[11px] leading-[1.2] font-medium text-ink-3">
                      {c.code} · Turma {c.section}
                    </p>
                  </div>
                  <p className="text-xs leading-normal text-ink-2">
                    {shortSchedule(c)}
                  </p>
                </li>
              ))}
            </ul>
          </section>
        )}

        <section className="flex flex-col gap-2 rounded-2xl bg-surface-muted p-3.5">
          <h2 className="flex items-center gap-2 text-sm leading-normal font-bold text-ink">
            <Image src="/figma/agenda/icon-warning-16-dark.svg" alt="" width={16} height={16} />
            O que fazemos com o arquivo
          </h2>
          {PRIVACY.map((item) => (
            <p key={item} className="flex items-start gap-2 text-xs leading-normal text-ink-2">
              <Image src="/figma/agenda/icon-check-dark-14.svg" alt="" width={14} height={14} className="mt-0.5 shrink-0" />
              {item}
            </p>
          ))}
        </section>

        <p className="flex items-start gap-2 text-xs leading-normal text-ink-3">
          <Image src="/figma/agenda/icon-clock-16.svg" alt="" width={16} height={16} className="shrink-0" />
          Mudou a matrícula (ajuste ou trancamento)? É só enviar o novo
          comprovante.
        </p>
      </StepContent>

      <StepFooter>
        {upload ? (
          <Link href="/agenda/turmas" className={primaryButton}>
            Conferir turmas
          </Link>
        ) : (
          <button type="button" disabled className={primaryButton}>
            Conferir turmas
          </button>
        )}
      </StepFooter>
    </>
  );
}
