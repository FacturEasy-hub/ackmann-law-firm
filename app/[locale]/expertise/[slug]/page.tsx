import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { useTranslations } from "next-intl";
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import { TextLink } from "@/components/ui/TextLink";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { JsonLd } from "@/components/seo/JsonLd";
import { ContactCTA } from "@/components/sections/ContactCTA";
import { ExpertiseHero } from "@/components/sections/ExpertiseHero";
import { routing } from "@/lib/i18n/routing";
import { buildMetadata } from "@/lib/seo";
import { relatedSlugs } from "@/lib/expertise-links";
import {
  practiceAreaSlugs,
  isPracticeAreaSlug,
  type PracticeAreaSlug,
} from "@/lib/practice-areas";

export function generateStaticParams() {
  return routing.locales.flatMap((locale) =>
    practiceAreaSlugs.map((slug) => ({ locale, slug })),
  );
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}): Promise<Metadata> {
  const { locale, slug } = await params;
  if (!isPracticeAreaSlug(slug)) return {};
  const t = await getTranslations({ locale, namespace: "expertise" });
  const tDetail = await getTranslations({
    locale,
    namespace: "expertiseDetail",
  });
  return buildMetadata({
    locale,
    path: `/expertise/${slug}`,
    title: tDetail.has(`${slug}.seoTitle`)
      ? tDetail(`${slug}.seoTitle`)
      : t(`items.${slug}`),
    description: tDetail(`${slug}.intro`),
  });
}

export default async function ExpertiseDetailPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  if (!isPracticeAreaSlug(slug)) {
    notFound();
  }
  setRequestLocale(locale);

  return (
    <main>
      <ExpertiseDetailContent slug={slug} />
      <ContactCTA />
    </main>
  );
}

function ExpertiseDetailContent({ slug }: { slug: PracticeAreaSlug }) {
  const t = useTranslations("expertise");
  const tDetail = useTranslations("expertiseDetail");

  const title = tDetail.has(`${slug}.h1`)
    ? tDetail(`${slug}.h1`)
    : t(`items.${slug}`);
  const keyMatters = tDetail.raw(`${slug}.keyMatters`) as string[];
  const services = tDetail.raw(`${slug}.services`) as string[];
  const faq = tDetail.has(`${slug}.faq`)
    ? (tDetail.raw(`${slug}.faq`) as { question: string; answer: string }[])
    : [];
  const related = relatedSlugs[slug] ?? [];

  return (
    <>
      {/* No "related insights" section: Phase 9's content model doesn't
          exist yet, so there's nothing to show — omitted rather than
          rendering an empty block. */}
      <ExpertiseHero
        slug={slug}
        title={title}
        intro={tDetail(`${slug}.intro`)}
      />

      <Section>
        <Container className="grid gap-12 md:grid-cols-2 md:gap-16">
          <div>
            <h2 className="font-[family-name:var(--font-display)] text-h3">
              {tDetail("keyMattersLabel")}
            </h2>
            <ul className="mt-6 flex flex-col gap-3">
              {keyMatters.map((item) => (
                <li key={item} className="text-body-lg text-foreground/80">
                  {item}
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h2 className="font-[family-name:var(--font-display)] text-h3">
              {tDetail("servicesLabel")}
            </h2>
            <ul className="mt-6 flex flex-col gap-3">
              {services.map((item) => (
                <li key={item} className="text-body-lg text-foreground/80">
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </Container>
      </Section>

      <Section className="bg-surface">
        <Container>
          <h2 className="font-[family-name:var(--font-display)] text-h3">
            {tDetail("approachLabel")}
          </h2>
          <p className="mt-6 max-w-2xl text-body-lg text-foreground/80">
            {tDetail(`${slug}.approach`)}
          </p>
        </Container>
      </Section>

      {faq.length > 0 && (
        <Section>
          <JsonLd
            data={{
              "@context": "https://schema.org",
              "@type": "FAQPage",
              mainEntity: faq.map((item) => ({
                "@type": "Question",
                name: item.question,
                acceptedAnswer: { "@type": "Answer", text: item.answer },
              })),
            }}
          />
          <Container className="flex flex-col gap-8">
            {faq.map((item) => (
              <div key={item.question}>
                <h2 className="font-[family-name:var(--font-display)] text-h4">
                  {item.question}
                </h2>
                <p className="mt-2 max-w-2xl text-body-lg text-foreground/80">
                  {item.answer}
                </p>
              </div>
            ))}
          </Container>
        </Section>
      )}

      {related.length > 0 && (
        <Section className="bg-surface">
          <Container className="flex flex-col gap-4">
            <Eyebrow>{tDetail("relatedLabel")}</Eyebrow>
            <div className="flex flex-wrap gap-6">
              {related.map((relatedSlug) => (
                <TextLink key={relatedSlug} href={`/expertise/${relatedSlug}`}>
                  {t(`items.${relatedSlug}`)}
                </TextLink>
              ))}
            </div>
          </Container>
        </Section>
      )}
    </>
  );
}
