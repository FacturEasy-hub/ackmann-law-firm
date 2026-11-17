import { useTranslations } from "next-intl";
import { siteConfig } from "@/lib/config";

const focusRing =
  "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-foreground";

/**
 * Stacked above ChatWidget's launcher (bottom-6), same size/shadow/accent
 * color so the two read as one family of floating actions, not two
 * competing bubbles.
 */
export function WhatsAppButton() {
  const t = useTranslations("nav");

  return (
    <a
      href={`https://wa.me/${siteConfig.whatsappIntl.replace(/\D/g, "")}`}
      target="_blank"
      rel="noreferrer noopener"
      aria-label={t("whatsapp")}
      className={`fixed bottom-24 end-6 z-40 flex h-14 w-14 items-center justify-center rounded-full bg-[#25D366] text-white shadow-[0_16px_40px_-12px_rgba(21,46,37,0.5)] transition-transform hover:scale-105 ${focusRing}`}
    >
      <svg aria-hidden="true" viewBox="0 0 24 24" className="h-6 w-6 fill-current">
        <path d="M12.01 2C6.48 2 2 6.48 2 12.01c0 1.98.57 3.83 1.56 5.39L2 22l4.75-1.52a9.96 9.96 0 0 0 5.26 1.5h.01c5.52 0 10-4.48 10-10S17.53 2 12.01 2Zm0 18.13c-1.63 0-3.17-.44-4.49-1.22l-.32-.19-3.07.98.98-2.99-.2-.31a8.1 8.1 0 0 1-1.25-4.4c0-4.5 3.66-8.16 8.16-8.16s8.17 3.66 8.17 8.16-3.67 8.13-8.16 8.13Zm4.52-6.11c-.25-.12-1.47-.72-1.7-.81-.23-.08-.39-.12-.56.13-.17.25-.64.81-.78.97-.14.17-.29.19-.54.06-.25-.12-1.04-.38-1.98-1.21-.73-.65-1.23-1.46-1.37-1.71-.14-.25-.02-.38.11-.5.11-.11.25-.29.37-.43.12-.14.17-.25.25-.41.08-.17.04-.31-.02-.44-.06-.12-.56-1.34-.76-1.84-.2-.48-.41-.42-.56-.43h-.48c-.17 0-.44.06-.67.31-.23.25-.87.85-.87 2.08 0 1.23.89 2.41 1.02 2.58.12.17 1.76 2.69 4.27 3.77.6.26 1.06.41 1.43.53.6.19 1.14.16 1.57.1.48-.07 1.47-.6 1.68-1.18.21-.58.21-1.07.14-1.18-.06-.1-.23-.16-.48-.28Z" />
      </svg>
    </a>
  );
}
