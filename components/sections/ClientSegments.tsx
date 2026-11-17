import { useTranslations } from "next-intl";
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { Reveal } from "@/components/motion/Reveal";
import { Link } from "@/lib/i18n/navigation";
import type { PracticeAreaSlug } from "@/lib/practice-areas";

const focusRing =
  "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-foreground";

/**
 * astenavocats.com format: 4-up client-segment cards on a dark panel, each
 * linking to the matching practice area. Segments are SPEC.md Section 3's
 * own target-audience groups, not invented client personas.
 */
const segmentSlugs: PracticeAreaSlug[] = [
  "corporate-commercial",
  "banking-finance",
  "private-clients",
  "administrative-public-law",
];

export function ClientSegments() {
  const t = useTranslations("homepage.segments");

  return (
    <Section id="clients" className="surface-inverse bg-background">
      <Container className="flex flex-col gap-10">
        <div className="flex flex-col gap-3">
          <Eyebrow>{t("eyebrow")}</Eyebrow>
          <h2 className="max-w-2xl font-[family-name:var(--font-display)] text-h2">
            {t("heading")}
          </h2>
        </div>

        <Reveal className="grid gap-6 md:grid-cols-2">
          {segmentSlugs.map((slug) => (
            <Link
              key={slug}
              href={`/expertise/${slug}`}
              className={`flex flex-col gap-3 rounded-lg border border-border p-6 transition-colors hover:border-accent ${focusRing}`}
            >
              <h3 className="font-[family-name:var(--font-display)] text-h4">
                {t(`items.${slug}.title`)}
              </h3>
              <p className="text-base text-muted">{t(`items.${slug}.body`)}</p>
            </Link>
          ))}
        </Reveal>
      </Container>
    </Section>
  );
}
