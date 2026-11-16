import { useTranslations } from "next-intl";
import { Container } from "@/components/ui/Container";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { Button } from "@/components/ui/Button";
import { ContactDialog } from "@/components/forms/ContactDialog";
import { ImagePlaceholder } from "@/components/ui/ImagePlaceholder";

/**
 * Split layout — the format actually changes here, not just color: text
 * now sits on the page's own plain background in its own column, instead
 * of overlaid on a dark gradient across the photo. That overlay-band
 * pattern survived three palette changes unchanged in shape; this is the
 * first real structural break from it. Echoes the new logo's own
 * composition (icon on one side, wordmark/tagline calmly spaced on the
 * other, generous room around both) rather than text stacked on imagery.
 * The organic corner radius stays on the photo frame — the one motif kept
 * from the prior direction, shared with FounderSection/PracticeList.
 */
export function Hero() {
  const t = useTranslations("hero");

  return (
    <section className="py-10 md:py-16">
      <Container className="grid items-center gap-10 md:grid-cols-[1.1fr_1fr] md:gap-16">
        <div className="order-last flex flex-col items-start gap-6 md:order-first">
          <Eyebrow>{t("location")}</Eyebrow>
          <h1 className="font-[family-name:var(--font-display)] text-display">
            {t("title")}
          </h1>
          <p className="text-eyebrow uppercase tracking-[0.1em] text-accent">
            {t("tagline")}
          </p>
          <p className="max-w-xl text-body-lg text-foreground/85">
            {t("positioning")}
          </p>
          <div className="flex flex-wrap gap-4">
            <Button href="/firm" variant="primary">
              {t("ctaPrimary")}
            </Button>
            <Button href="/contact" variant="secondary">
              {t("ctaSecondary")}
            </Button>
          </div>
          <div className="mt-2 flex flex-wrap items-center gap-4 border-t border-border pt-6">
            <p className="text-sm text-muted">{t("contactSub")}</p>
            <ContactDialog />
          </div>
        </div>

        <div className="radius-organic relative aspect-[4/5] overflow-hidden shadow-[0_24px_60px_-24px_rgba(21,46,37,0.35)] md:aspect-[3/4]">
          <ImagePlaceholder
            label="Jerusalem — photography pending"
            className="absolute inset-0"
          />
        </div>
      </Container>
    </section>
  );
}
