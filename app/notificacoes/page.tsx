"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { useAppState } from "../_lib/state";
import { PageHeader } from "../_components/page-header";
import { Screen, cn, textLink } from "../_components/ui";
import {
  FILTERS,
  GROUPS,
  NOTIFICATIONS,
  type AppNotification,
  type NotificationFilter,
} from "./data";

const pill =
  "inline-flex items-center justify-center rounded-full px-3 py-[7px] font-display text-sm leading-none font-bold transition focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand";

// N01 · Notificações (abre pelo sino da Home)
export default function Notificacoes() {
  const { unread, setUnread, notificationPrefs } = useAppState();
  const [filter, setFilter] = useState<NotificationFilter | "todas">("todas");

  const markRead = (id: string) => setUnread((prev) => prev.filter((u) => u !== id));
  const visible = NOTIFICATIONS.filter((n) => filter === "todas" || n.filter === filter);

  const quiet = `nada depois das ${notificationPrefs.quietStart.replace(":00", "h")}`;
  const limit = notificationPrefs.dailyLimit ? " e no máximo 2 avisos por dia" : "";

  return (
    <div className="flex flex-1 flex-col bg-surface">
      <Screen tone="light">
        <PageHeader
          title="Notificações"
          backHref="/home"
          action={
            <Link href="/notificacoes/ajustes" className={textLink}>
              Ajustes
            </Link>
          }
        />

        <div className="flex flex-1 flex-col gap-[18px] px-5 pt-4 pb-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <h2 className="font-display text-[22px] leading-[1.3] font-bold text-ink">
                Novidades
              </h2>
              {unread.length > 0 && (
                <span className="rounded-full bg-brand px-2 py-1 font-display text-xs leading-none font-bold text-white">
                  {unread.length} {unread.length === 1 ? "nova" : "novas"}
                </span>
              )}
            </div>
            {unread.length > 0 && (
              <button type="button" onClick={() => setUnread([])} className={textLink}>
                Marcar como lidas
              </button>
            )}
          </div>

          <div role="radiogroup" aria-label="Filtrar notificações" className="flex flex-wrap gap-2">
            {FILTERS.map((f) => {
              const selected = f.value === filter;
              return (
                <button
                  key={f.value}
                  type="button"
                  role="radio"
                  aria-checked={selected}
                  onClick={() => setFilter(f.value)}
                  className={cn(
                    "rounded-full px-3.5 py-2 font-display text-sm leading-none font-bold transition focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand",
                    selected
                      ? "bg-brand text-white"
                      : "border border-line bg-surface text-ink hover:border-line-muted",
                  )}
                >
                  {f.label}
                </button>
              );
            })}
          </div>

          {GROUPS.map((g) => {
            const items = visible.filter((n) => n.group === g.value);
            if (items.length === 0) return null;
            return (
              <section key={g.value} aria-label={g.label} className="flex flex-col gap-2">
                <h3 className="text-[10px] leading-none font-bold tracking-[1.5px] text-ink-3 uppercase">
                  {g.label}
                </h3>
                {items.map((n) => (
                  <NotificationCard
                    key={n.id}
                    notification={n}
                    isUnread={unread.includes(n.id)}
                    onRead={() => markRead(n.id)}
                  />
                ))}
              </section>
            );
          })}

          {visible.length === 0 && (
            <p className="py-8 text-center text-sm leading-normal text-ink-3">
              Nada por aqui.
            </p>
          )}

          <div className="flex items-start gap-2.5 rounded-[14px] bg-surface-muted p-3.5">
            <Image src="/figma/agenda/icon-warning-16.svg" alt="" width={16} height={16} className="shrink-0" />
            <p className="flex-1 text-xs leading-normal text-ink-2">
              Sem cobrança: {quiet}
              {limit}.
            </p>
          </div>
        </div>
      </Screen>
    </div>
  );
}

function NotificationCard({
  notification: n,
  isUnread,
  onRead,
}: {
  notification: AppNotification;
  isUnread: boolean;
  onRead: () => void;
}) {
  // Ícone branco some num cartão branco depois de lido.
  const iconBg = !isUnread && n.iconBg === "bg-surface" ? "bg-brand-soft" : n.iconBg;

  return (
    <article
      className={cn(
        "flex items-start gap-3 rounded-2xl border p-3.5",
        isUnread ? "border-brand-line bg-brand-soft" : "border-line bg-surface",
      )}
    >
      <span className={cn("flex size-10 shrink-0 items-center justify-center rounded-full", iconBg)}>
        <Image src={n.icon} alt="" width={20} height={20} />
      </span>
      <div className="flex min-w-0 flex-1 flex-col gap-1">
        <div className="flex items-center gap-2">
          <h4 className="flex-1 text-sm leading-normal font-bold text-ink">{n.title}</h4>
          <span className="font-display text-[11px] leading-[1.2] font-medium text-ink-3">
            {n.time}
          </span>
          {isUnread && (
            <Image src="/figma/home/n-dot.svg" alt="Não lida" width={8} height={8} />
          )}
        </div>
        <p className="text-xs leading-normal text-ink-2">{n.body}</p>
        {(n.action || n.later) && (
          <div className="flex items-center gap-2.5 pt-1">
            {n.action &&
              (n.action.href ? (
                <Link
                  href={n.action.href}
                  onClick={onRead}
                  className={cn(pill, n.action.primary ? "bg-brand text-white hover:brightness-110" : "border border-brand-line bg-surface text-brand-ink")}
                >
                  {n.action.label}
                </Link>
              ) : (
                // TODO: planejar semanas, detalhes da conversa, desfazer reorganização.
                <button
                  type="button"
                  onClick={onRead}
                  className={cn(pill, "border border-brand-line bg-surface text-brand-ink hover:border-brand")}
                >
                  {n.action.label}
                </button>
              ))}
            {n.later && (
              <button
                type="button"
                onClick={onRead}
                className="font-display text-sm leading-none font-bold text-ink-3 hover:text-ink-2"
              >
                {n.later}
              </button>
            )}
          </div>
        )}
      </div>
    </article>
  );
}
