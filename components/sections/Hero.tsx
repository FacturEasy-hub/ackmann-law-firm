import { useTranslations } from "next-intl";
import { Container } from "@/components/ui/Container";
import { ImagePlaceholder } from "@/components/ui/ImagePlaceholder";
import { Link } from "@/lib/i18n/navigation";

const focusRing =
  "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-foreground";

const boxClass = `flex min-h-[44px] flex-1 items-center justify-center border border-foreground/40 px-6 py-5 text-center text-sm uppercase tracking-[0.15em] text-foreground transition-colors hover:border-foreground ${focusRing}`;

/**
 * Full-bleed format (astenavocats.com) — photo background, dark gradient
 * for text contrast, centered column, equal-width bordered CTA boxes.
 * Asten's reference has 3 boxes; Ackmann only has two non-redundant
 * actions (firm / contact) once "open contact dialog" and "go to /contact"
 * stopped being different things worth a separate box each.
 * Colours stay Ackmann's own (replica/design/tokens.json): SPEC.md bans
 * navy+gold as a dominant palette, so the overlay uses --brand-navy (forest
 * pine, not literal navy) rather than Asten's actual navy/gold.
 * `surface-inverse` (same class the footer/ContactCTA use) remaps
 * --foreground/--muted/--accent to their pre-solved AA-safe light variants
 * — bare `text-accent` on a dark bg fails contrast otherwise (see that
 * class's own comment in globals.css).
 */
export function Hero() {
  const t = useTranslations("hero");

  return (
    <section id="home" className="surface-inverse relative isolate min-h-[85dvh]">
      <div className="absolute inset-0">
        <ImagePlaceholder
          label="Jerusalem — photography pending"
          src="/brand/placeholder-jerusalem.jpg"
          priority
          sizes="100vw"
          className="h-full w-full"
        />
      </div>
      {/* Flat overlay, not a fade: content is vertically centered and
          spans from the eyebrow near the top to the CTA boxes near the
          bottom, so a top-to-bottom gradient left the top third too light
          to read the eyebrow against the sky/rooftops in the photo. */}
      <div aria-hidden="true" className="absolute inset-0 bg-background/75" />

      <Container className="relative flex min-h-[85dvh] flex-col items-center justify-center gap-8 py-20 text-center text-foreground">
        <p className="text-eyebrow uppercase tracking-[0.2em] text-muted">
          {t("location")}
        </p>
        <h1 className="max-w-3xl font-[family-name:var(--font-display)] text-display">
          {t("title")}
        </h1>
        <p className="text-eyebrow uppercase tracking-[0.2em] text-accent">
          {t("tagline")}
        </p>
        <p className="max-w-xl text-body-lg text-foreground/85">
          {t("positioning")}
        </p>

        <div className="mt-4 flex w-full max-w-md flex-col gap-3 sm:flex-row">
          <Link href="/firm" className={boxClass}>
            {t("ctaPrimary")}
          </Link>
          <Link href="/contact" className={boxClass}>
            {t("ctaSecondary")}
          </Link>
        </div>
      </Container>
    </section>
  );
}
