"use client";

import { useEffect, useRef, useState } from "react";
import { useLocale } from "next-intl";
import { usePathname, useRouter } from "@/lib/i18n/navigation";
import { routing } from "@/lib/i18n/routing";

// Endonyms + flag/code shown regardless of current locale.
const localeMeta: Record<
  (typeof routing.locales)[number],
  { flag: string; code: string; name: string }
> = {
  en: { flag: "🇬🇧", code: "EN", name: "English" },
  fr: { flag: "🇫🇷", code: "FR", name: "Français" },
  he: { flag: "🇮🇱", code: "HE", name: "עברית" },
};

export function LanguageSwitcher() {
  const locale = useLocale() as keyof typeof localeMeta;
  const pathname = usePathname();
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;

    function handlePointerDown(event: PointerEvent) {
      if (!rootRef.current?.contains(event.target as Node)) setOpen(false);
    }
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") setOpen(false);
    }

    document.addEventListener("pointerdown", handlePointerDown);
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("pointerdown", handlePointerDown);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [open]);

  const current = localeMeta[locale];

  return (
    <div ref={rootRef} className="relative">
      <button
        type="button"
        aria-haspopup="listbox"
        aria-expanded={open}
        onClick={() => setOpen((value) => !value)}
        className="flex items-center gap-1.5 text-sm text-foreground/80 transition-colors hover:text-foreground focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-foreground"
      >
        <span aria-hidden="true">{current.flag}</span>
        <span>{current.code}</span>
        <span
          aria-hidden="true"
          className={`inline-block text-xs transition-transform ${open ? "rotate-180" : ""}`}
        >
          ▾
        </span>
      </button>

      {open && (
        <ul
          role="listbox"
          aria-label="Language"
          className="absolute end-0 top-full z-20 mt-2 min-w-[9rem] rounded-md bg-background py-1 shadow-[0_16px_40px_-12px_rgba(21,46,37,0.3)]"
        >
          {routing.locales.map((l) => {
            const meta = localeMeta[l];
            const active = l === locale;
            return (
              <li key={l} role="option" aria-selected={active}>
                <button
                  type="button"
                  disabled={active}
                  onClick={() => {
                    setOpen(false);
                    router.replace(pathname, { locale: l });
                  }}
                  className={`flex w-full items-center gap-2 px-3 py-2 text-start text-sm transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-foreground ${
                    active
                      ? "text-foreground"
                      : "text-foreground/80 hover:bg-surface hover:text-foreground"
                  }`}
                >
                  <span aria-hidden="true">{meta.flag}</span>
                  <span>{meta.name}</span>
                </button>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
