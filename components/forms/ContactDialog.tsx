"use client";

import { useRef } from "react";
import type { MouseEvent } from "react";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/Button";
import { ContactForm } from "@/components/forms/ContactForm";

/**
 * Native <dialog> — showModal() gives us focus trap, Escape-to-close and
 * top-layer stacking for free, so the hero CTA doesn't need a bespoke
 * modal implementation. Only the backdrop-click-to-close needs manual JS
 * (the platform doesn't do that on its own).
 */
export function ContactDialog() {
  const t = useTranslations("hero");
  const dialogRef = useRef<HTMLDialogElement>(null);

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

  return (
    <>
      <Button type="button" onClick={() => dialogRef.current?.showModal()}>
        {t("contactHeading")}
      </Button>

      <dialog
        ref={dialogRef}
        onClick={closeOnBackdropClick}
        className="w-[calc(100%-2rem)] max-w-xl rounded-xl bg-background p-8 shadow-[0_32px_80px_-24px_rgba(21,46,37,0.45)] backdrop:bg-brand-navy/60 md:p-10"
      >
        <button
          type="button"
          aria-label={t("closeDialog")}
          onClick={() => dialogRef.current?.close()}
          className="absolute end-4 top-4 flex h-8 w-8 items-center justify-center text-xl text-muted hover:text-foreground focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-foreground"
        >
          ×
        </button>
        <p className="font-[family-name:var(--font-display)] text-h4">
          {t("contactHeading")}
        </p>
        <p className="mt-1 text-sm text-muted">{t("contactSub")}</p>
        <div className="mt-6">
          <ContactForm />
        </div>
      </dialog>
    </>
  );
}
