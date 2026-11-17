import { useTranslations } from "next-intl";
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import { Eyebrow } from "@/components/ui/Eyebrow";

type Review = { author: string; text: string };

/**
 * Real Google reviews, transcribed by hand (SPEC.md has no CMS/API layer
 * for this — same static-content-per-locale pattern as practice areas).
 * Text is each review's authentic original language where available
 * (Hebrew for ben hcm/Elisheva Sotto, English for Jessica Adjedj), or
 * Google's own translation otherwise — never machine-retranslated.
 */
export function GoogleReviews() {
  const t = useTranslations("contactPage");
  const reviews = t.raw("reviews") as Review[];

  return (
    <Section>
      <Container className="flex flex-col gap-8">
        <div className="flex flex-col gap-3">
          <Eyebrow>{t("reviewsEyebrow")}</Eyebrow>
          <h2 className="font-[family-name:var(--font-display)] text-h2">
            {t("reviewsHeading")}
          </h2>
        </div>

        <div className="grid gap-8 md:grid-cols-3">
          {reviews.map((review) => (
            <figure key={review.author} className="flex flex-col gap-3">
              <div aria-label="5/5" className="text-accent">
                ★★★★★
              </div>
              <blockquote className="text-body-lg text-foreground/80">
                “{review.text}”
              </blockquote>
              <figcaption className="text-sm text-muted">
                {review.author}
              </figcaption>
            </figure>
          ))}
        </div>
      </Container>
    </Section>
  );
}
