import { useTranslations } from "next-intl";
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { TextLink } from "@/components/ui/TextLink";
import { Reveal } from "@/components/motion/Reveal";
import { ImagePlaceholder } from "@/components/ui/ImagePlaceholder";
import { siteConfig } from "@/lib/config";

/**
 * SPEC.md Section 13/5.5. Portrait is a placeholder (no approved
 * photography yet — see components/sections/Hero.tsx). Bio text is
 * grounded strictly in SPEC.md Section 15's confirmed experience (KPMG,
 * public-sector work, Bank Leumi) — no invented years-of-experience claim.
 *
 * No `border-b`: the warm/organic direction separates sections by soft
 * shadow + the `radius-organic` portrait frame rather than a ruled line
 * (see Hero.tsx's doc comment for the same recurring corner motif).
 */
export function FounderSection() {
  const t = useTranslations("founder");

  return (
    <Section>
      <Container>
        <Reveal className="grid gap-10 md:grid-cols-[1fr_1.2fr] md:items-center md:gap-16">
          <ImagePlaceholder
            label="Jonathan Ackmann — portrait pending"
            aspectRatio="4/5"
            className="radius-organic order-last shadow-[0_24px_60px_-24px_rgba(21,46,37,0.3)] md:order-first"
          />
          <div className="flex flex-col items-start gap-6">
            <Eyebrow>{t("eyebrow")}</Eyebrow>
            <h2 className="font-[family-name:var(--font-display)] text-h2">
              {siteConfig.founderName}
            </h2>
            <p className="text-sm text-muted">
              {t("title")} — {t("bar", { number: siteConfig.barNumber })}
            </p>
            <p className="max-w-xl text-body-lg text-foreground/80">
              {t("bio")}
            </p>
            <TextLink href="/jonathan-ackmann">{t("cta")}</TextLink>
          </div>
        </Reveal>
      </Container>
    </Section>
  );
}
