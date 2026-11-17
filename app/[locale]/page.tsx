import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Hero } from "@/components/sections/Hero";
import { IntroStatement } from "@/components/sections/IntroStatement";
import { MethodSection } from "@/components/sections/MethodSection";
import { ClientSegments } from "@/components/sections/ClientSegments";
import { PracticeList } from "@/components/sections/PracticeList";
import { FounderSection } from "@/components/sections/FounderSection";
import { FaqHome } from "@/components/sections/FaqHome";
import { ContactCTA } from "@/components/sections/ContactCTA";
import { SectionDots } from "@/components/navigation/SectionDots";
import { buildMetadata } from "@/lib/seo";
import { siteConfig } from "@/lib/config";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "hero" });
  return buildMetadata({
    locale,
    path: "",
    title: `${t("seoTitle")} | ${siteConfig.firmName}`,
    description: t("positioning"),
  });
}

export default async function HomePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale });

  const dotSections = [
    { id: "home", label: t("hero.title") },
    { id: "about", label: t("firmPage.eyebrow") },
    { id: "method", label: t("method.eyebrow") },
    { id: "clients", label: t("homepage.segments.eyebrow") },
    { id: "expertise", label: t("expertise.eyebrow") },
    { id: "team", label: t("founder.eyebrow") },
    { id: "faq", label: t("homepage.faq.eyebrow") },
  ];

  return (
    <main>
      <Hero />
      <IntroStatement />
      <MethodSection />
      <ClientSegments />
      <PracticeList id="expertise" />
      <FounderSection />
      <FaqHome />
      <ContactCTA id="contact" />
      <SectionDots sections={dotSections} />
    </main>
  );
}
