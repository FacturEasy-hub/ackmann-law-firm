/**
 * Global site configuration — single source of truth for firm identity,
 * contact data and locale settings. Never duplicate these values elsewhere;
 * always import from here (see SPEC.md Section 10).
 */

export const supportedLocales = ["en", "fr", "he"] as const;
export type Locale = (typeof supportedLocales)[number];

export const defaultLocale: Locale = "en";

export const rtlLocales: readonly Locale[] = ["he"];

export function isRtl(locale: Locale): boolean {
  return rtlLocales.includes(locale);
}

export const siteConfig = {
  firmName: "Ackmann Law Firm",
  firmNameHebrew: "משרד עורכי דין אקמן",
  founderName: "Jonathan Ackmann",
  barNumber: "100674",
  barCountry: "Israel",
  admissionDate: "2024-12", // December 2024 — TODO: confirm exact day if needed

  // Contact — TODO: replace email with domain-based address once available.
  phone: "058-793-1228",
  phoneIntl: "+972-58-793-1228",
  // WhatsApp: same number as `phone` until confirmed otherwise (see SPEC.md Section 19).
  whatsapp: "058-793-1228",
  whatsappIntl: "+972587931228",
  email: "jonathan.ackmann@gmail.com",

  address: {
    line1: "105 Derech Beit Lehem",
    line2: "5th Floor",
    city: "Jerusalem",
    country: "Israel",
  },

  // Geocoded directly from the address above (not read off the Google
  // Business Profile pin, which is currently mislocated ~40km south —
  // see docs/SEO-GEO-AUDIT.md).
  geo: {
    latitude: 31.7506835,
    longitude: 35.2181525,
  },

  // Google Business Profile — CID-based Maps URL doubles as the `sameAs`
  // target and the "leave a review" link (opens straight to the review
  // composer). Confirm this CID still resolves if GBP is ever re-verified.
  googleBusinessProfileUrl: "https://www.google.com/maps?cid=5075037042310149195",

  // Populate as accounts are confirmed. Renderers must skip empty values —
  // never render a social icon when its link is empty.
  socialLinks: {
    linkedin: "",
    instagram: "",
    facebook: "",
    x: "",
  },

  defaultLocale,
  supportedLocales,

  // Environment-driven until the final domain is selected (SPEC.md Section 10 / 42).
  canonicalBaseUrl: process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000",
} as const;

export type SiteConfig = typeof siteConfig;
