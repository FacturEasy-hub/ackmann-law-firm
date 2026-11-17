"use client";

import { useRef, useState, useTransition } from "react";
import type { MouseEvent, FormEvent } from "react";
import { useTranslations, useLocale } from "next-intl";
import { Button } from "@/components/ui/Button";
import {
  sendChatMessage,
  type ChatMessage,
} from "@/lib/server/chat-actions";
import { practiceAreaSlugs } from "@/lib/practice-areas";

const focusRing =
  "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-foreground";

/**
 * Site-wide floating launcher, native <dialog> (showModal() gives focus
 * trap and Escape-to-close for free). Scope is
 * general orientation only, enforced server-side by the system prompt in
 * chat-actions.ts, not by anything in this component — never add a client
 * "jailbreak" guard here, it would be trivially bypassable and give a
 * false sense of safety.
 *
 * Ephemeral by design: messages live in component state only, nothing is
 * persisted, so closing the dialog or refreshing clears the conversation.
 */
export function ChatWidget() {
  const t = useTranslations("chat");
  const tExpertise = useTranslations("expertise");
  const locale = useLocale();
  const dialogRef = useRef<HTMLDialogElement>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [isPending, startTransition] = useTransition();

  function closeOnBackdropClick(event: MouseEvent<HTMLDialogElement>) {
    const rect = dialogRef.current?.getBoundingClientRect();
    if (!rect) return;
    const insideDialog =
      event.clientX >= rect.left &&
      event.clientX <= rect.right &&
      event.clientY >= rect.top &&
      event.clientY <= rect.bottom;
    if (!insideDialog) dialogRef.current?.close();
  }

  function sendMessage(text: string) {
    const trimmed = text.trim();
    if (!trimmed || isPending) return;

    const nextMessages: ChatMessage[] = [
      ...messages,
      { role: "user", content: trimmed },
    ];
    setMessages(nextMessages);
    setInput("");

    startTransition(async () => {
      const result = await sendChatMessage(nextMessages, locale);
      if (result.status === "ok") {
        setMessages((prev) => [
          ...prev,
          { role: "assistant", content: result.reply },
        ]);
      } else {
        setMessages((prev) => [
          ...prev,
          { role: "assistant", content: t("errorMessage") },
        ]);
      }
    });
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    sendMessage(input);
  }

  return (
    <>
      <button
        type="button"
        onClick={() => dialogRef.current?.showModal()}
        aria-label={t("openLabel")}
        className="fixed bottom-6 end-6 z-40 flex h-14 w-14 items-center justify-center rounded-full bg-accent text-background shadow-[0_16px_40px_-12px_rgba(21,46,37,0.5)] transition-transform hover:scale-105 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-foreground"
      >
        <span aria-hidden="true" className="text-2xl">
          💬
        </span>
      </button>

      <dialog
        ref={dialogRef}
        onClick={closeOnBackdropClick}
        className="h-[min(640px,80vh)] w-[calc(100%-2rem)] max-w-md rounded-xl bg-background p-0 shadow-[0_32px_80px_-24px_rgba(21,46,37,0.45)] backdrop:bg-brand-navy/60"
      >
        <div className="flex h-full flex-col">
          <div className="flex items-center justify-between border-b border-border px-6 py-4">
            <p className="font-[family-name:var(--font-display)] text-h4">
              {t("heading")}
            </p>
            <button
              type="button"
              aria-label={t("closeLabel")}
              onClick={() => dialogRef.current?.close()}
              className="flex h-8 w-8 items-center justify-center text-xl text-muted hover:text-foreground focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-foreground"
            >
              ×
            </button>
          </div>

          <div className="flex-1 overflow-y-auto px-6 py-4">
            <p className="text-sm text-muted">{t("disclaimer")}</p>

            {messages.length === 0 && (
              <div className="mt-4 flex flex-col gap-2">
                <p className="text-sm text-muted">{t("topicsPrompt")}</p>
                <div className="flex flex-wrap gap-2">
                  {practiceAreaSlugs.map((slug) => (
                    <button
                      key={slug}
                      type="button"
                      onClick={() => sendMessage(tExpertise(`items.${slug}`))}
                      className={`rounded-full border border-border px-3 py-1.5 text-sm transition-colors hover:border-accent hover:bg-surface ${focusRing}`}
                    >
                      {tExpertise(`items.${slug}`)}
                    </button>
                  ))}
                </div>
              </div>
            )}

            <div className="mt-4 flex flex-col gap-3">
              {messages.map((message, index) => (
                <p
                  key={index}
                  className={
                    message.role === "user"
                      ? "self-end rounded-lg bg-surface px-4 py-2 text-sm"
                      : "self-start text-sm text-foreground/85"
                  }
                >
                  {message.content}
                </p>
              ))}
              {isPending && <p className="text-sm text-muted">{t("typing")}</p>}
            </div>
          </div>

          <form
            onSubmit={handleSubmit}
            className="flex items-center gap-3 border-t border-border px-6 py-4"
          >
            <input
              type="text"
              value={input}
              onChange={(event) => setInput(event.target.value)}
              placeholder={t("placeholder")}
              maxLength={500}
              className="flex-1 border border-border bg-surface px-4 py-2 text-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-foreground"
            />
            <Button type="submit" disabled={isPending || !input.trim()}>
              {t("send")}
            </Button>
          </form>
        </div>
      </dialog>
    </>
  );
}
