import type { PracticeAreaSlug } from "./practice-areas";

/**
 * Cross-links between expertise detail pages (cahier des charges Section
 * 34) — rendered on each detail page as descriptive TextLinks, never
 * "cliquez ici".
 */
export const relatedSlugs: Partial<Record<PracticeAreaSlug, PracticeAreaSlug[]>> = {
  "banking-finance": ["compliance", "private-clients"],
  compliance: ["corporate-commercial"],
  "private-clients": ["banking-finance"],
  "dispute-resolution": ["banking-finance"],
  "corporate-commercial": ["compliance"],
};
