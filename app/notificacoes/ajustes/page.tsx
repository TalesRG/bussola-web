"use client";

import Image from "next/image";
import type { ReactNode } from "react";
import { useAppState, type NotificationPrefs, type Rhythm } from "../../_lib/state";
import { PageHeader } from "../../_components/page-header";
import { Switch } from "../../_components/switch";
import { Screen, cn } from "../../_components/ui";

const timeInput =
  "w-[38px] bg-transparent text-center outline-none focus-visible:underline [&::-webkit-calendar-picker-indicator]:hidden";

// N02 · Ajustes de notificações: discrição, silêncio e limite diário.
export default function AjustesNotificacoes() {
  const { notificationPrefs: prefs, setNotificationPrefs, rhythm, setRhythm } = useAppState();
  const set = (patch: Partial<NotificationPrefs>) =>
    setNotificationPrefs((prev) => ({ ...prev, ...patch }));
  const setReminder = (key: keyof Rhythm["reminders"], v: boolean) =>
    setRhythm((prev) => ({ ...prev, reminders: { ...prev.reminders, [key]: v } }));

  return (
    <div className="flex flex-1 flex-col bg-surface">
      <Screen tone="light">
        <PageHeader title="Ajustes de notificações" backHref="/notificacoes" />

        <div className="flex flex-1 flex-col gap-5 px-5 pt-4 pb-6">
          <section className="flex flex-col gap-2 rounded-[20px] bg-subtle p-3.5">
            <h2 className="text-[10px] leading-none font-bold tracking-[1.5px] text-ink-3 uppercase">
              Como aparece na tela bloqueada
            </h2>
            <div className="flex items-center gap-2.5 rounded-2xl bg-surface p-3" aria-live="polite">
              <Image src="/figma/home/marca-28.svg" alt="" width={28} height={28} />
              <div className="flex flex-1 flex-col gap-0.5">
                <div className="flex justify-between">
                  <span className="text-xs leading-normal text-ink">Bússola</span>
                  <span className="font-display text-[11px] leading-[1.2] font-medium text-ink-3">
                    agora
                  </span>
                </div>
                <p className="text-sm leading-normal text-ink-2">
                  {prefs.discreet
                    ? "Você tem uma novidade no app"
                    : "Seu check-in está disponível"}
                </p>
              </div>
            </div>
          </section>

          <Row
            label={<span className="font-bold">Texto discreto na tela bloqueada</span>}
            hint={`Ninguém vê "check-in" ou "DASU" por cima do seu ombro`}
          >
            <Switch
              label="Texto discreto na tela bloqueada"
              checked={prefs.discreet}
              onChange={(v) => set({ discreet: v })}
            />
          </Row>

          <Group title="Check-in">
            <Row label="Lembrete a cada 15 dias">
              <Switch
                label="Lembrete a cada 15 dias"
                checked={prefs.checkinReminder}
                onChange={(v) => set({ checkinReminder: v })}
              />
            </Row>
          </Group>

          <Group title="Rotina">
            <Row label="15 min antes de cada bloco">
              <Switch
                label="15 min antes de cada bloco"
                checked={rhythm.reminders.beforeBlock}
                onChange={(v) => setReminder("beforeBlock", v)}
              />
            </Row>
            <Row label="Resumo da semana no domingo">
              <Switch
                label="Resumo da semana no domingo"
                checked={rhythm.reminders.weeklySummary}
                onChange={(v) => setReminder("weeklySummary", v)}
              />
            </Row>
            <Row label="Aviso de semana pesada" hint="Pelo calendário de provas do curso">
              <Switch
                label="Aviso de semana pesada"
                checked={rhythm.reminders.heavyWeek}
                onChange={(v) => setReminder("heavyWeek", v)}
              />
            </Row>
          </Group>

          <Group title="Apoio">
            <Row label="Conversas com a DASU" hint="Confirmações e mudanças de horário">
              <span className="font-display text-xs leading-none font-bold text-ink-3">
                Sempre
              </span>
            </Row>
          </Group>

          <Group title="Mural">
            <Row label="Quando sua história for publicada">
              <Switch
                label="Quando sua história for publicada"
                checked={prefs.storyPublished}
                onChange={(v) => set({ storyPublished: v })}
              />
            </Row>
            <Row label="Novas histórias nos seus temas">
              <Switch
                label="Novas histórias nos seus temas"
                checked={prefs.newStories}
                onChange={(v) => set({ newStories: v })}
              />
            </Row>
          </Group>

          <section className="flex flex-col gap-3 rounded-[18px] border border-line p-4">
            <h2 className="font-display text-base leading-[1.2] font-bold text-ink">Silêncio</h2>
            <div className="flex items-center gap-3">
              <div className="flex flex-1 flex-col gap-0.5 leading-normal">
                <p className="text-sm text-ink">Não perturbe</p>
                <p className="text-xs text-ink-3">Nenhum aviso nesse horário</p>
              </div>
              <div className="flex items-center gap-1 rounded-full bg-brand-soft px-2.5 py-1.5 font-display text-xs leading-none font-bold text-brand-ink">
                <input
                  type="time"
                  aria-label="Início do não perturbe"
                  value={prefs.quietStart}
                  onChange={(e) => set({ quietStart: e.target.value })}
                  className={timeInput}
                />
                –
                <input
                  type="time"
                  aria-label="Fim do não perturbe"
                  value={prefs.quietEnd}
                  onChange={(e) => set({ quietEnd: e.target.value })}
                  className={timeInput}
                />
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="flex flex-1 flex-col gap-0.5 leading-normal">
                <p className="text-sm text-ink">No máximo 2 avisos por dia</p>
                <p className="text-xs text-ink-3">O resto espera na central de notificações</p>
              </div>
              <Switch
                label="No máximo 2 avisos por dia"
                checked={prefs.dailyLimit}
                onChange={(v) => set({ dailyLimit: v })}
              />
            </div>
          </section>
        </div>
      </Screen>
    </div>
  );
}

function Group({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="flex flex-col rounded-[18px] border border-line px-4 py-1">
      <h2 className="pt-3 pb-1 font-display text-base leading-[1.2] font-bold text-ink">
        {title}
      </h2>
      <div className="flex flex-col [&>*]:py-3 [&>*:not(:last-child)]:border-b [&>*:not(:last-child)]:border-subtle">
        {children}
      </div>
    </section>
  );
}

function Row({
  label,
  hint,
  children,
}: {
  label: ReactNode;
  hint?: string;
  children: ReactNode;
}) {
  return (
    <div className={cn("flex items-center gap-3")}>
      <div className="flex flex-1 flex-col gap-0.5 leading-normal">
        <p className="text-sm text-ink">{label}</p>
        {hint && <p className="text-xs text-ink-3">{hint}</p>}
      </div>
      {children}
    </div>
  );
}
