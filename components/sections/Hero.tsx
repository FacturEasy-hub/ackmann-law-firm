import { useTranslations } from "next-intl";
import { Container } from "@/components/ui/Container";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { Button } from "@/components/ui/Button";
import { ContactForm } from "@/components/forms/ContactForm";

/**
 * SPEC.md Section 13/5.1 — near one viewport in height, but capped with
 * `min-h` (not a hard 100vh) so mobile URL-bar chrome doesn't create
 * scroll/viewport glitches. Editorial portrait/architecture image is
 * deferred: no approved photography exists yet (SPEC.md Section 42 keeps
 * "final approved photography" explicitly open) — the single-column
 * text-first layout works without it and won't need restructuring once an
 * image is supplied.
 *
 * `hero.positioning` (messages/*.json) is a provisional slogan, not final
 * brand copy — SPEC.md Section 21 explicitly keeps this open and lists it
 * among the Section 42 open decisions. Swap the message value when a final
 * slogan is approved; no component change needed.
 *
 * The inline contact form is a deliberate exception to the "one action"
 * restraint elsewhere (ContactCTA) — discussed and agreed directly with the
 * client. It stays unstyled as a card (no border/shadow box) so it reads as
 * an extension of the hero copy, not a lead-gen widget bolted on.
 */
export function Hero() {
  const t = useTranslations("hero");

  return (
    <section className="border-b border-border py-24">
      <Container className="grid gap-12 md:grid-cols-[1.3fr_1fr] md:items-start">
        <div className="flex flex-col items-start gap-6">
          <Eyebrow>Jerusalem, Israel</Eyebrow>
          <h1 className="font-[family-name:var(--font-display)] text-display">
            {t("title")}
          </h1>
          <p className="max-w-xl text-body-lg text-foreground/80">
            {t("positioning")}
          </p>
          <div className="flex gap-4 pt-4">
            <Button href="/firm" variant="primary">
              {t("ctaPrimary")}
            </Button>
            <Button href="/contact" variant="secondary">
              {t("ctaSecondary")}
            </Button>
          </div>
        </div>
        <div className="flex flex-col gap-5 border-t border-border pt-8 md:border-s md:border-t-0 md:ps-10 md:pt-0">
          <div>
            <p className="font-[family-name:var(--font-display)] text-h4">
              {t("contactHeading")}
            </p>
            <p className="mt-1 text-sm text-muted">{t("contactSub")}</p>
          </div>
          <ContactForm />
        </div>
      </Container>
    </section>
  );
}
