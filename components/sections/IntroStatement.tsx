import { useTranslations } from "next-intl";
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import { TextLink } from "@/components/ui/TextLink";
import { Reveal } from "@/components/motion/Reveal";

/**
 * astenavocats.com format: centered statement block + single CTA below
 * the hero. Reuses firmPage.intro verbatim (already localized en/fr/he) —
 * no new marketing copy written for this block.
 */
export function IntroStatement() {
  const t = useTranslations("firmPage");

  return (
    <Section id="about" className="bg-surface">
      <Container className="flex flex-col items-center gap-6 text-center">
        <Reveal className="flex flex-col items-center gap-6">
          <p className="max-w-3xl text-body-lg text-foreground">{t("intro")}</p>
          <TextLink href="/firm">{t("eyebrow")}</TextLink>
        </Reveal>
      </Container>
    </Section>
  );
}
