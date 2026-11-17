import { useTranslations } from "next-intl";
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { TextLink } from "@/components/ui/TextLink";
import { JsonLd } from "@/components/seo/JsonLd";

type FaqItem = { question: string; answer: string };

const focusRing =
  "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-foreground";

/**
 * astenavocats.com format: FAQ accordion + "still have questions" CTA.
 * Native <details>/<summary> — no JS accordion needed, keyboard/screen
 * reader support comes from the platform. Questions are practical/firm
 * orientation only (languages, location, process), not legal-advice
 * content, matching the chatbot's own "orientation, never legal advice"
 * scope — the firm practices 6 varied areas, so a single borrowed legal
 * FAQ would misrepresent the others rather than inform.
 */
export function FaqHome() {
  const t = useTranslations("homepage.faq");
  const tContact = useTranslations("contactCta");
  const items = t.raw("items") as FaqItem[];

  return (
    <Section id="faq">
      <Container className="flex flex-col gap-8">
        <div className="flex flex-col gap-3">
          <Eyebrow>{t("eyebrow")}</Eyebrow>
          <h2 className="font-[family-name:var(--font-display)] text-h2">
            {t("heading")}
          </h2>
        </div>

        <JsonLd
          data={{
            "@context": "https://schema.org",
            "@type": "FAQPage",
            mainEntity: items.map((item) => ({
              "@type": "Question",
              name: item.question,
              acceptedAnswer: { "@type": "Answer", text: item.answer },
            })),
          }}
        />

        <div className="flex flex-col divide-y divide-border border-y border-border">
          {items.map((item) => (
            <details key={item.question} className="group py-5">
              <summary
                className={`flex cursor-pointer list-none items-center justify-between gap-4 text-h4 font-[family-name:var(--font-display)] ${focusRing}`}
              >
                {item.question}
                <span aria-hidden="true" className="shrink-0 text-accent">
                  <span className="inline-block transition-transform group-open:rotate-45">
                    +
                  </span>
                </span>
              </summary>
              <p className="mt-3 max-w-2xl text-body-lg text-foreground/80">
                {item.answer}
              </p>
            </details>
          ))}
        </div>

        <div className="flex flex-wrap items-center gap-4">
          <p className="text-body-lg">{t("ctaQuestion")}</p>
          <TextLink href="/contact">{tContact("cta")}</TextLink>
        </div>
      </Container>
    </Section>
  );
}
