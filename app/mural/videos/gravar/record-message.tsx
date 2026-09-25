"use client";

import { useEffect, useRef, useState } from "react";
import { PageHeader } from "../../../_components/page-header";
import { cn, primaryButton, secondaryButtonLg } from "../../../_components/ui";
import { display, focusRing, heading, Icon } from "../../_components/ui";
import { asset } from "../_components/ui";
import { formatTime } from "../_lib/data";

type Format = "video" | "audio";
type Clip = { url: string; name: string; format: Format };
const script = [
  "O que foi difícil para você?",
  "O que te ajudou a passar por isso?",
  "O que você diria para quem está nesse lugar agora?",
];
const tips = [
  "Lugar calmo e com luz de frente",
  "Não mostre nem cite outras pessoas",
  "Evite detalhes de autolesão; foque no que ajudou",
  "Legendas são geradas automaticamente e você pode revisar",
];

export function RecordMessage() {
  const [format, setFormat] = useState<Format>("video");
  const [recording, setRecording] = useState(false);
  const [busy, setBusy] = useState(false);
  const [seconds, setSeconds] = useState(0);
  const [clip, setClip] = useState<Clip | null>(null);
  const [error, setError] = useState("");
  const [caption, setCaption] = useState("");
  const recorder = useRef<MediaRecorder | null>(null);
  const stream = useRef<MediaStream | null>(null);
  const live = useRef<HTMLVideoElement>(null);
  const picker = useRef<HTMLInputElement>(null);
  const mounted = useRef(true);
  const request = useRef(0);

  useEffect(() => {
    mounted.current = true;
    return () => {
      mounted.current = false;
      if (recorder.current?.state === "recording") recorder.current.stop();
      stream.current?.getTracks().forEach((track) => track.stop());
    };
  }, []);

  useEffect(
    () => () => {
      if (clip) URL.revokeObjectURL(clip.url);
    },
    [clip],
  );

  useEffect(() => {
    if (!recording) return;
    const started = performance.now();
    const timer = window.setInterval(() => {
      const elapsed = Math.min(
        120,
        Math.floor((performance.now() - started) / 1000),
      );
      setSeconds(elapsed);
      if (elapsed >= 120 && recorder.current?.state === "recording")
        recorder.current.stop();
    }, 250);
    return () => window.clearInterval(timer);
  }, [recording]);

  async function startRecording() {
    setError("");
    if (
      !navigator.mediaDevices?.getUserMedia ||
      typeof MediaRecorder === "undefined"
    ) {
      setError(
        "Este navegador não permite gravar aqui. Você pode enviar um arquivo da galeria.",
      );
      return;
    }
    const token = ++request.current;
    setBusy(true);
    try {
      const capture = await navigator.mediaDevices.getUserMedia({
        audio: true,
        video: format === "video" ? { facingMode: "user" } : false,
      });
      if (!mounted.current || token !== request.current) {
        capture.getTracks().forEach((track) => track.stop());
        return;
      }
      stream.current = capture;
      if (live.current) live.current.srcObject = capture;
      const options =
        format === "video"
          ? ["video/webm;codecs=vp9,opus", "video/webm", "video/mp4"]
          : ["audio/webm", "audio/mp4"];
      const mimeType = options.find((type) =>
        MediaRecorder.isTypeSupported(type),
      );
      const current = new MediaRecorder(
        capture,
        mimeType ? { mimeType } : undefined,
      );
      recorder.current = current;
      const chunks: BlobPart[] = [];
      current.ondataavailable = (event) => {
        if (event.data.size > 0) chunks.push(event.data);
      };
      current.onstop = () => {
        capture.getTracks().forEach((track) => track.stop());
        if (!mounted.current || token !== request.current) return;
        setRecording(false);
        const blob = new Blob(chunks, { type: current.mimeType });
        if (!blob.size) {
          setError("A gravação ficou vazia. Tente novamente.");
          return;
        }
        const extension = current.mimeType.includes("mp4") ? "mp4" : "webm";
        setClip({
          url: URL.createObjectURL(blob),
          name: `meu-recado.${extension}`,
          format,
        });
      };
      current.onerror = () => {
        capture.getTracks().forEach((track) => track.stop());
        if (mounted.current) {
          setRecording(false);
          setError("Não foi possível concluir a gravação. Tente novamente.");
        }
      };
      setClip(null);
      setCaption("");
      setSeconds(0);
      current.start(250);
      setRecording(true);
    } catch (cause) {
      stream.current?.getTracks().forEach((track) => track.stop());
      if (!mounted.current) return;
      setError(
        cause instanceof DOMException && cause.name === "NotAllowedError"
          ? "Acesso à câmera ou ao microfone não autorizado. Permita o acesso no navegador ou envie da galeria."
          : "Não foi possível acessar a câmera ou o microfone. Verifique se o dispositivo está disponível ou envie da galeria.",
      );
    } finally {
      if (mounted.current && token === request.current) setBusy(false);
    }
  }

  async function selectFile(file?: File) {
    if (!file) return;
    setError("");
    const expected = format === "video" ? "video/" : "audio/";
    if (!file.type.startsWith(expected)) {
      setError(
        format === "video"
          ? "Escolha um arquivo de vídeo."
          : "Escolha um arquivo de áudio para usar só a sua voz.",
      );
      return;
    }
    if (file.size > 100 * 1024 * 1024) {
      setError("Escolha um arquivo de até 100 MB e 2 minutos.");
      return;
    }
    setBusy(true);
    const token = ++request.current;
    const url = URL.createObjectURL(file);
    const element = document.createElement(
      format === "video" ? "video" : "audio",
    );
    try {
      const duration = await new Promise<number>((resolve, reject) => {
        const timeout = window.setTimeout(
          () =>
            reject(
              new Error("Não foi possível verificar a duração deste arquivo."),
            ),
          10000,
        );
        element.onloadedmetadata = () => {
          // Gravações WebM podem não ter a duração no cabeçalho.
          if (element.duration === Infinity) {
            element.ontimeupdate = () => {
              if (!Number.isFinite(element.duration)) return;
              window.clearTimeout(timeout);
              element.ontimeupdate = null;
              resolve(element.duration);
            };
            element.currentTime = 1e10;
          } else {
            window.clearTimeout(timeout);
            resolve(element.duration);
          }
        };
        element.onerror = () => {
          window.clearTimeout(timeout);
          reject(
            new Error(
              "Este arquivo não pode ser reproduzido. Escolha outro formato.",
            ),
          );
        };
        element.preload = "metadata";
        element.src = url;
      });
      if (!Number.isFinite(duration) || duration <= 0)
        throw new Error(
          "Não foi possível verificar a duração. Escolha outro arquivo.",
        );
      if (duration > 120)
        throw new Error(
          "Seu recado pode ter até 2 minutos. Corte o arquivo e tente novamente.",
        );
      if (!mounted.current || token !== request.current) {
        URL.revokeObjectURL(url);
        return;
      }
      setClip({ url, name: file.name, format });
      setCaption("");
    } catch (cause) {
      URL.revokeObjectURL(url);
      if (mounted.current && token === request.current)
        setError(
          cause instanceof Error
            ? cause.message
            : "Não foi possível abrir o arquivo.",
        );
    } finally {
      element.removeAttribute("src");
      element.load();
      if (mounted.current && token === request.current) setBusy(false);
    }
  }

  return (
    <>
      <PageHeader
        title="Gravar um recado"
        backHref="/mural/videos"
        titleAs="p"
      />
      <div className="flex flex-col gap-[22px] p-5">
        <div className="flex flex-col gap-2">
          <h1 className={display}>Seu recado pode ser o empurrão de alguém</h1>
          <p className="text-base leading-normal text-ink-2">
            Até 2 minutos. Fale como se fosse para você mesmo(a) no primeiro
            semestre.
          </p>
        </div>
        <fieldset
          disabled={busy || recording}
          className="flex flex-col gap-2.5"
        >
          <legend className={cn(heading, "mb-2.5")}>
            Como você quer aparecer?
          </legend>
          <div className="grid grid-cols-2 gap-2.5">
            {(
              [
                {
                  key: "video",
                  title: "Com meu rosto",
                  detail: "Vídeo normal",
                  icon: "2e6b3",
                },
                {
                  key: "audio",
                  title: "Só minha voz",
                  detail: "Com ilustração e legenda",
                  icon: "2749d",
                },
              ] as const
            ).map((option) => (
              <label
                key={option.key}
                className={cn(
                  "relative flex cursor-pointer flex-col items-start gap-2 rounded-2xl border p-3.5",
                  format === option.key
                    ? "border-brand bg-brand-soft ring-[0.5px] ring-brand"
                    : "border-line",
                )}
              >
                <input
                  type="radio"
                  name="formato"
                  value={option.key}
                  checked={format === option.key}
                  onChange={() => {
                    setFormat(option.key);
                    setClip(null);
                    setError("");
                    setCaption("");
                  }}
                  className="peer sr-only"
                />
                <span className="flex size-10 items-center justify-center rounded-full bg-white peer-focus-visible:outline-2 peer-focus-visible:outline-brand">
                  <Icon src={asset(option.icon)} />
                </span>
                <span className="text-sm leading-normal font-bold">
                  {option.title}
                </span>
                <span className="text-xs leading-normal text-ink-3">
                  {option.detail}
                </span>
              </label>
            ))}
          </div>
        </fieldset>
        <section className="flex flex-col gap-3 rounded-2xl bg-surface-muted p-4">
          <h2 className={heading}>Um roteiro para ajudar</h2>
          <ol className="flex flex-col gap-3">
            {script.map((line, index) => (
              <li key={line} className="flex items-center gap-2.5">
                <span className="flex size-6 shrink-0 items-center justify-center rounded-full border border-line bg-white font-display text-xs leading-none font-bold text-brand-ink">
                  {index + 1}
                </span>
                <span className="text-sm leading-normal text-ink-2">
                  {line}
                </span>
              </li>
            ))}
          </ol>
        </section>
        <section className="flex flex-col gap-2.5">
          <h2 className={heading}>Antes de gravar</h2>
          <ul className="flex flex-col gap-2.5">
            {tips.map((tip) => (
              <li key={tip} className="flex items-start gap-2">
                <Icon src={asset("abe3a")} size={16} />
                <span className="flex-1 text-sm leading-normal text-ink-2">
                  {tip}
                </span>
              </li>
            ))}
          </ul>
        </section>
        <div className={cn("flex flex-col gap-3", !recording && "hidden")}>
          <video
            ref={live}
            autoPlay
            muted
            playsInline
            className={cn(
              "w-full rounded-2xl bg-ink",
              format === "audio" && "hidden",
            )}
          />
          <p
            role="status"
            className="text-center text-sm font-bold text-brand-ink"
          >
            Gravando {formatTime(seconds)} / 2:00
          </p>
        </div>
        <div className="flex flex-col gap-2.5">
          <button
            disabled={busy}
            className={primaryButton}
            onClick={() => {
              if (recording) recorder.current?.stop();
              else void startRecording();
            }}
          >
            {busy
              ? "Preparando…"
              : recording
                ? "Parar gravação"
                : "Gravar agora"}
          </button>
          <button
            disabled={busy || recording}
            className={cn(secondaryButtonLg, "w-full disabled:opacity-50")}
            onClick={() => picker.current?.click()}
          >
            Enviar da galeria
          </button>
          <input
            ref={picker}
            type="file"
            accept={format === "video" ? "video/*" : "audio/*"}
            className="hidden"
            aria-label="Selecionar recado da galeria"
            onChange={(event) => {
              void selectFile(event.target.files?.[0]);
              event.target.value = "";
            }}
          />
        </div>
        {error && (
          <p
            role="alert"
            className="rounded-xl bg-amber-50 p-3 text-sm text-amber-800"
          >
            {error}
          </p>
        )}
        {clip && (
          <section
            aria-label="Prévia do recado"
            className="flex flex-col gap-3 rounded-2xl border border-line p-4"
          >
            <h2 className={heading}>Revise seu recado</h2>
            {clip.format === "video" ? (
              <video
                key={clip.url}
                src={clip.url}
                controls
                playsInline
                className="w-full rounded-xl"
              />
            ) : (
              <audio
                key={clip.url}
                src={clip.url}
                controls
                className="w-full"
              />
            )}
            <label className="flex flex-col gap-2 text-sm font-bold">
              Transcrição do recado
              <textarea
                value={caption}
                onChange={(event) => setCaption(event.target.value)}
                placeholder="Escreva o que você disse no recado"
                className="min-h-28 rounded-xl border border-line p-3 text-sm font-normal outline-brand"
              />
            </label>
            <p className="text-xs leading-normal text-ink-3">
              Seu recado está apenas neste dispositivo. O envio para revisão e a
              geração automática de legendas ainda não estão disponíveis.
            </p>
            <a
              href={clip.url}
              download={clip.name}
              className={cn(secondaryButtonLg, "w-full text-sm")}
            >
              Salvar no dispositivo
            </a>
            {caption.trim() && (
              <a
                href={`data:text/plain;charset=utf-8,${encodeURIComponent(caption)}`}
                download="transcricao.txt"
                className={cn("text-center text-sm text-brand-ink", focusRing)}
              >
                Salvar transcrição
              </a>
            )}
            <button
              onClick={() => {
                setClip(null);
                setCaption("");
              }}
              className={cn(
                "self-center text-sm text-ink-3 underline",
                focusRing,
              )}
            >
              Apagar recado
            </button>
          </section>
        )}
        <p className="flex items-start gap-2 text-xs leading-normal text-ink-3">
          <Icon src={asset("b9a0f")} size={16} />
          <span>
            A DASU revisa todos os vídeos antes de publicar. Você pode apagar o
            seu quando quiser.
          </span>
        </p>
      </div>
    </>
  );
}
