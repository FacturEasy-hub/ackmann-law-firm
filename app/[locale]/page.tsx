import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Hero } from "@/components/sections/Hero";
import { MethodSection } from "@/components/sections/MethodSection";
import { PracticeList } from "@/components/sections/PracticeList";
import { FounderSection } from "@/components/sections/FounderSection";
import { ContactCTA } from "@/components/sections/ContactCTA";
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

  return (
    <main>
      <Hero />
      <MethodSection />
      <PracticeList />
      <FounderSection />
      <ContactCTA />
    </main>
  );
}
