import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { useLocale, useTranslations } from "next-intl";
import { Link } from "@/lib/i18n/navigation";
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { ContactCTA } from "@/components/sections/ContactCTA";
import { JsonLd } from "@/components/seo/JsonLd";
import { siteConfig } from "@/lib/config";
import { practiceAreaSlugs } from "@/lib/practice-areas";
import { buildMetadata } from "@/lib/seo";

type EducationEntry = { degree: string; institution: string; years: string };
type ExperienceEntry = { name: string; description: string };

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "founder" });
  const tJonathan = await getTranslations({
    locale,
    namespace: "jonathanPage",
  });
  return buildMetadata({
    locale,
    path: "/jonathan-ackmann",
    title: `${siteConfig.founderName} — ${t("title")}`,
    description: tJonathan("bioExtended"),
  });
}

export default async function JonathanPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  const t = await getTranslations({ locale, namespace: "jonathanPage" });
  const tFounder = await getTranslations({ locale, namespace: "founder" });
  const education = t.raw("education") as EducationEntry[];
  const languages = t.raw("languages") as string[];

  return (
    <main>
      {/* Person JSON-LD — grounded only in facts already shown on this
          page (SPEC.md Section 26/32: no fabricated credentials).
          knowsLanguage/hasCredential add structure around facts already
          rendered as text below (languages list, bar number/admission
          date via founder.bar) — no new claims. */}
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "Attorney",
          name: siteConfig.founderName,
          jobTitle: tFounder("title"),
          worksFor: { "@type": "LegalService", name: siteConfig.firmName },
          url: `${siteConfig.canonicalBaseUrl}/${locale}/jonathan-ackmann`,
          sameAs: [siteConfig.googleBusinessProfileUrl],
          alumniOf: education.map((entry) => ({
            "@type": "CollegeOrUniversity",
            name: entry.institution,
          })),
          knowsLanguage: languages,
          hasCredential: {
            "@type": "EducationalOccupationalCredential",
            credentialCategory: "license",
            recognizedBy: {
              "@type": "Organization",
              name: `${siteConfig.barCountry} Bar Association`,
            },
            identifier: siteConfig.barNumber,
            dateCreated: siteConfig.admissionDate,
          },
        }}
      />
      <JonathanContent />
      <ContactCTA />
    </main>
  );
}

function JonathanContent() {
  const locale = useLocale();
  const t = useTranslations("jonathanPage");
  const tFounder = useTranslations("founder");
  const tExpertise = useTranslations("expertise");

  const education = t.raw("education") as EducationEntry[];
  const experience = t.raw("experience") as ExperienceEntry[];
  const languages = t.raw("languages") as string[];

  // siteConfig.admissionDate is "YYYY-MM" — formatted natively per locale
  // (no date library needed for a single static value).
  const admittedDate = new Intl.DateTimeFormat(locale, {
    year: "numeric",
    month: "long",
  }).format(new Date(`${siteConfig.admissionDate}-01`));

  return (
    <>
      {/* Portrait deferred with Hero/FounderSection — no approved photography yet. */}
      <Section className="pb-4 pt-6 md:pt-8">
        <Container className="flex flex-col gap-6">
          <Eyebrow>{tFounder("eyebrow")}</Eyebrow>
          <h1 className="max-w-3xl font-[family-name:var(--font-display)] text-h1">
            {siteConfig.founderName}
          </h1>
          <p className="text-sm text-muted">
            {tFounder("title")} —{" "}
            {tFounder("bar", { number: siteConfig.barNumber })}
          </p>
          <p className="max-w-xl text-body-lg text-foreground/80">
            {t("bioExtended")}
          </p>
        </Container>
      </Section>

      <Section className="bg-surface">
        <Container className="grid gap-12 md:grid-cols-2 md:gap-16">
          <div>
            <h2 className="font-[family-name:var(--font-display)] text-h3">
              {t("educationTitle")}
            </h2>
            <ul className="mt-6 flex flex-col gap-4">
              {education.map((entry) => (
                <li key={entry.degree}>
                  <p className="text-body-lg">{entry.degree}</p>
                  <p className="text-sm text-muted">
                    {entry.institution} · {entry.years}
                  </p>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h2 className="font-[family-name:var(--font-display)] text-h3">
              {t("experienceTitle")}
            </h2>
            <ul className="mt-6 flex flex-col gap-4">
              {experience.map((entry) => (
                <li key={entry.name}>
                  <p className="text-body-lg">{entry.name}</p>
                  <p className="text-sm text-muted">{entry.description}</p>
                </li>
              ))}
            </ul>
          </div>
        </Container>
      </Section>

      <Section>
        <Container className="grid gap-12 md:grid-cols-2 md:gap-16">
          <div>
            <h2 className="font-[family-name:var(--font-display)] text-h3">
              {t("barTitle")}
            </h2>
            <p className="mt-6 text-body-lg text-foreground/80">
              {t("barBody", {
                number: siteConfig.barNumber,
                date: admittedDate,
              })}
            </p>
          </div>

          <div>
            <h2 className="font-[family-name:var(--font-display)] text-h3">
              {t("languagesTitle")}
            </h2>
            <p className="mt-6 text-body-lg text-foreground/80">
              {languages.join(" · ")}
            </p>
          </div>
        </Container>
      </Section>

      <Section className="bg-surface">
        <Container>
          <h2 className="font-[family-name:var(--font-display)] text-h3">
            {t("practiceAreasTitle")}
          </h2>
          <div className="mt-6 flex flex-wrap gap-x-6 gap-y-3">
            {practiceAreaSlugs.map((slug) => (
              <Link
                key={slug}
                href={`/expertise/${slug}`}
                className="text-sm text-muted underline decoration-transparent underline-offset-4 transition-colors hover:text-foreground hover:decoration-foreground focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-foreground"
              >
                {tExpertise(`items.${slug}`)}
              </Link>
            ))}
          </div>
        </Container>
      </Section>
    </>
  );
}
