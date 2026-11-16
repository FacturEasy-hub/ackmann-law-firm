import { useTranslations } from "next-intl";
import { Container } from "@/components/ui/Container";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { Button } from "@/components/ui/Button";
import { ContactDialog } from "@/components/forms/ContactDialog";
import { ImagePlaceholder } from "@/components/ui/ImagePlaceholder";

/**
 * "Framed, not full-bleed" direction: the photo sits inset inside the
 * page's own cream margin, like a print hung on a wall, rather than
 * running edge-to-edge — that full-bleed "plein cadre" treatment read as
 * cold-corporate-slab when boxed, and as cinematic-agency when the client
 * reviewed the capstan.fr-style full-viewport pass (both rejected). The
 * asymmetric organic corner radius (`--radius-organic`, see globals.css —
 * two soft rounded corners, two sharp) is reused on FounderSection's
 * portrait and PracticeList's preview panel as the site's one recurring
 * "hand-framed" motif, echoing the warm/organic style direction (soft
 * natural shadow, no hard ruled borders on elevated surfaces).
 *
 * `surface-inverse` flips Eyebrow/Button/text tokens to light-on-espresso
 * with no per-component overrides (see app/globals.css). The contact form
 * itself stays one tap away (ContactDialog) rather than sitting open in
 * the hero — client wants the first screen uncluttered.
 */
export function Hero() {
  const t = useTranslations("hero");

  return (
    <section className="relative pt-4 md:pt-6">
      <Container>
        <div className="radius-organic relative h-[48vh] min-h-[340px] max-h-[500px] overflow-hidden shadow-[0_24px_60px_-24px_rgba(43,27,18,0.35)] md:h-[52vh] md:max-h-[560px]">
          <ImagePlaceholder
            label="Jerusalem — photography pending"
            className="absolute inset-0"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-brand-navy via-brand-navy/45 to-brand-navy/10" />
          <div className="surface-inverse relative flex h-full flex-col justify-end px-6 pb-8 pt-10 md:px-10 md:pb-8">
            <Eyebrow>{t("location")}</Eyebrow>
            <h1 className="mt-4 max-w-2xl font-[family-name:var(--font-display)] text-display">
              {t("title")}
            </h1>
            <p className="mt-4 max-w-xl text-body-lg text-foreground/85">
              {t("positioning")}
            </p>
            <div className="mt-6 flex gap-4">
              <Button href="/firm" variant="primary">
                {t("ctaPrimary")}
              </Button>
              <Button href="/contact" variant="secondary">
                {t("ctaSecondary")}
              </Button>
            </div>
          </div>
        </div>
      </Container>

      <Container>
        <div className="relative z-10 -mt-8 flex max-w-xl flex-wrap items-center gap-4 rounded-xl bg-background px-6 py-4 shadow-[0_16px_40px_-16px_rgba(43,27,18,0.25)] md:-mt-10">
          <p className="text-sm text-muted">{t("contactSub")}</p>
          <ContactDialog />
        </div>
      </Container>
    </section>
  );
}
