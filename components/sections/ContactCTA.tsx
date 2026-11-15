import { useTranslations } from "next-intl";
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import { Button } from "@/components/ui/Button";
import { Reveal } from "@/components/motion/Reveal";

/**
 * SPEC.md Section 13/5.7 — restrained finish, one action, no "Book Now" /
 * "Free Consultation" language. `surface-inverse`: the one other deliberate
 * navy anchor besides the footer (private-banking reference: navy marks a
 * decisive moment, not every page). No `border-b`: Footer is the same navy
 * directly below, so a border would just split one dark zone into two.
 */
export function ContactCTA() {
  const t = useTranslations("contactCta");

  return (
    <Section className="surface-inverse bg-background">
      <Container>
        <Reveal className="flex flex-col items-start gap-6">
          <p className="max-w-lg text-h3 font-[family-name:var(--font-display)]">
            {t("statement")}
          </p>
          <Button href="/contact">{t("cta")}</Button>
        </Reveal>
      </Container>
    </Section>
  );
}
