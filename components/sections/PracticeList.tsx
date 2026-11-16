"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useTranslations } from "next-intl";
import { Link } from "@/lib/i18n/navigation";
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { TextLink } from "@/components/ui/TextLink";
import { Reveal } from "@/components/motion/Reveal";
import { ImagePlaceholder } from "@/components/ui/ImagePlaceholder";
import {
  practiceAreaSlugs,
  type PracticeAreaSlug,
} from "@/lib/practice-areas";

const focusRing =
  "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-foreground";

/**
 * One distinct generic stand-in photo per practice area (subject-matched,
 * not just "any photo") — all CC-licensed stock from Wikimedia Commons,
 * attributed in ImagePlaceholder.tsx's doc comment. `banking-finance` has
 * no clean subject-matched option yet (searches kept returning mislabeled
 * or people-identifiable photos) and falls back to the Jerusalem shot.
 */
const practiceImages: Record<PracticeAreaSlug, string> = {
  "banking-finance": "/brand/placeholder-jerusalem.jpg",
  "corporate-commercial": "/brand/practice-corporate.jpg",
  compliance: "/brand/practice-compliance.jpg",
  "administrative-public-law": "/brand/practice-admin.jpg",
  "dispute-resolution": "/brand/practice-dispute.jpg",
  "private-clients": "/brand/practice-private.jpg",
};

/**
 * SPEC.md Section 13/5.4 — editorial list, not icon cards. Rows have no
 * arrow glyph on purpose: a "→" would need to flip for RTL. No `border-b`
 * or `divide-y` ruled lines — the warm/organic direction separates rows
 * with a soft hover tint (`hover:bg-surface`) instead, and pairs the list
 * with a `radius-organic` preview panel (lg+) that cross-fades to
 * whichever row is hovered/focused.
 */
export function PracticeList({
  showHeader = true,
}: {
  /** Set to false on `/expertise` itself — that page already has its own
   * H1, so a "View all expertise" link back to the same page would be
   * self-referential. */
  showHeader?: boolean;
}) {
  const t = useTranslations("expertise");
  const [active, setActive] = useState<PracticeAreaSlug | null>(null);

  return (
    <Section>
      <Container className="flex flex-col gap-8">
        {showHeader && (
          <div className="flex items-baseline justify-between gap-4">
            <Eyebrow>{t("eyebrow")}</Eyebrow>
            <TextLink href="/expertise">{t("viewAll")}</TextLink>
          </div>
        )}
        <Reveal className="grid gap-10 lg:grid-cols-[1fr_320px] lg:items-start">
          <ul className="flex flex-col gap-1">
            {practiceAreaSlugs.map((slug) => (
              <li key={slug}>
                <Link
                  href={`/expertise/${slug}`}
                  onMouseEnter={() => setActive(slug)}
                  onMouseLeave={() => setActive(null)}
                  onFocus={() => setActive(slug)}
                  onBlur={() => setActive(null)}
                  className={`block rounded-lg px-4 py-5 text-h4 font-[family-name:var(--font-display)] transition-colors hover:bg-surface ${focusRing}`}
                >
                  {t(`items.${slug}`)}
                </Link>
              </li>
            ))}
          </ul>

          <div className="radius-organic sticky top-24 hidden aspect-[4/5] overflow-hidden shadow-[0_24px_60px_-24px_rgba(21,46,37,0.3)] lg:block">
            <AnimatePresence mode="wait">
              {active && (
                <motion.div
                  key={active}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.25, ease: "easeOut" }}
                  className="absolute inset-0"
                >
                  <ImagePlaceholder
                    label={t(`items.${active}`)}
                    src={practiceImages[active]}
                    className="h-full"
                  />
                </motion.div>
              )}
            </AnimatePresence>
            {!active && (
              <div className="h-full w-full bg-surface" aria-hidden="true" />
            )}
          </div>
        </Reveal>
      </Container>
    </Section>
  );
}
