import { useTranslations } from "next-intl";
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { Reveal } from "@/components/motion/Reveal";

const stepKeys = ["study", "strategy", "lead"] as const;

/**
 * A real sequence (study → strategy → execution), so numbering here encodes
 * order the reader needs, unlike the icon-free SignaturePillars grid above
 * it, which lists parallel domains rather than steps.
 */
export function MethodSection() {
  const t = useTranslations("method");

  return (
    <Section className="border-b border-border">
      <Container className="flex flex-col gap-10">
        <Eyebrow>{t("eyebrow")}</Eyebrow>
        <Reveal className="grid gap-10 md:grid-cols-3 md:gap-8">
          {stepKeys.map((key, index) => (
            <div key={key} className="flex flex-col gap-3">
              <span className="text-eyebrow tracking-[0.2em] text-accent">
                {String(index + 1).padStart(2, "0")}
              </span>
              <h3 className="font-[family-name:var(--font-display)] text-h3">
                {t(`steps.${key}.title`)}
              </h3>
              <p className="max-w-xs text-sm text-muted">
                {t(`steps.${key}.body`)}
              </p>
            </div>
          ))}
        </Reveal>
      </Container>
    </Section>
  );
}
