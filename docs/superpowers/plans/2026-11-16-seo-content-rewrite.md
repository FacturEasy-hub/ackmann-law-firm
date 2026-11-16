# Ackmann Law Firm — SEO/Content Rewrite Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Bring every page's content, metadata, internal linking, and structured data into alignment with the client's cahier des charges (content/SEO brief), without touching visual design, by rewriting message content, adding missing i18n keys, and wiring up cross-linking + schema.org data that currently doesn't exist.

**Architecture:** Pure content/i18n/metadata change. No new components, no new pages, no CSS/design touches. Three categories of file: (1) `messages/{en,fr,he}.json` content keys — rewritten, added, or removed per task; (2) a handful of `page.tsx` / component call sites that need to read a *new* key instead of an existing one (because one existing key is currently overloaded for two different jobs — short nav label vs. long SEO H1); (3) three small code additions: a `next.config.ts` redirect, an `expertise-links.ts` internal-linking map, and a FAQ block + `FAQPage` JSON-LD on one page.

**Tech Stack:** Next.js 16 (App Router), next-intl, TypeScript. No new dependencies.

**Spec:** `C:\Users\benja\Downloads\Cahier_des_charges_Ackmann_Law_Firm_V1_SEO.docx` (client's brief, read 2026-11-16) — sections cited below are this document's own numbered sections. The read-only audit that maps every current page against it was delivered in-conversation on 2026-11-16 (not saved to a file); its findings are restated inline per task below.

## Global Constraints

- **Design is out of scope.** No file under `app/globals.css`, no Tailwind className changes for layout/color/spacing, no component restructuring. Every task below touches *only* `messages/*.json` content, metadata strings in `generateMetadata`, JSON-LD data objects, and the two call-site reads named in Task 1 and Task 9. This directly contradicts the brief's own section 43 ("ne pas refaire le design") being written against a design this project no longer has — flagged to the client, not something this plan resolves; this plan simply avoids making it worse.
- **French is the reference language** (brief section 42). Every task's FR string is pinned verbatim from the brief where the brief gives one. EN and HE must carry the same facts and the same target keyword (the brief's own EN/HE keyword lists, quoted per task) — not a literal translation of the FR sentence.
- **Never claim Jonathan Ackmann was a Bank of Israel regulator or employee** (brief section 5) — applies to every rewritten sentence touching KPMG/Bank of Israel/regulatory experience.
- **Never promise a result** (brief section 9, "Ne jamais promettre un résultat") — applies to every dispute/complaint-process sentence (bank complaints, פניות הציבור, credit-data corrections).
- **No fabricated reviews, ratings, awards, or prices** in any JSON-LD (brief section 38).
- **No new pages.** The credit-data page and the real-estate page the brief mentions as "possible later" (sections 12, 22) are explicitly deferred — this plan folds that content into existing pages (Banking, Private Clients) instead.
- Every task that edits `messages/en.json` / `fr.json` / `he.json` must keep the three files' key *shape* identical (same nesting, same array lengths) — a later task (Task 11) greps for key-parity across the three files as a validation gate.

## Review Focus

- **A locale file falls out of sync** (e.g. a key added to `fr.json` but not `en.json`/`he.json`) — next-intl fails that locale's render at runtime, not at build time, for the one route touched. Task 11's key-parity grep step exists specifically for this.
- **The Financial Regulation merge breaks an already-indexed URL with no redirect** — Task 4's redirect step and Task 11's `curl`-equivalent check exist specifically for this.
- **A rewritten expertise page accidentally re-introduces language the brief tells us to avoid** (e.g. "structuration de garanties" sneaking back into Banking, or "AML avancé" into Compliance) — each content task's own "forbidden phrase" grep step exists specifically for this.
- **The Hero eyebrow fix regresses the RTL (Hebrew) layout** — the fix only swaps a hardcoded string for a translated one inside an existing `<Eyebrow>`, so the risk is a translation key typo, not layout; Task 1's step 3 checks all three locales render.
- **Internal links use directional CSS incompatible with Hebrew RTL** — Task 9 reuses the existing `TextLink` component (already RTL-safe elsewhere in this codebase) rather than introducing new directional markup.

---

## File Structure

- Modify: `messages/en.json`, `messages/fr.json`, `messages/he.json` — content keys (every content task)
- Modify: `components/sections/Hero.tsx` — read `hero.location` instead of a hardcoded string (Task 1)
- Modify: `app/[locale]/page.tsx` — homepage `generateMetadata` reads new `hero.seoTitle` key (Task 7)
- Modify: `lib/practice-areas.ts` — remove `"financial-regulation"` from `practiceAreaSlugs` (Task 4)
- Modify: `next.config.ts` — add `redirects()` for the retired `/expertise/financial-regulation` route (Task 4)
- Create: `lib/expertise-links.ts` — the brief's internal-linking map (section 34), consumed by the expertise detail page (Task 9)
- Modify: `app/[locale]/expertise/[slug]/page.tsx` — read new `expertiseDetail.<slug>.h1`/`seoTitle` keys instead of `expertise.items.<slug>` for metadata/H1 (Task 2's pattern, reused by Tasks 3/5/6/8); render the related-links block (Task 9); render the FAQ block + `FAQPage` JSON-LD for `banking-finance` only (Task 10)
- Modify: `components/sections/ExpertiseHero.tsx` — no signature change; still takes `title`/`intro` strings, now sourced from the new keys at the call site
- Modify: `app/[locale]/jonathan-ackmann/page.tsx` — `Person` → `Attorney` JSON-LD type (Task 6)

---

### Task 1: Fix the hardcoded, untranslated Hero eyebrow

**Files:**
- Modify: `components/sections/Hero.tsx:38` (currently `<Eyebrow>Jerusalem, Israel</Eyebrow>`)
- Modify: `messages/en.json`, `messages/fr.json`, `messages/he.json` — add `hero.location`

**Interfaces:**
- Produces: `hero.location` translation key, consumed by `Hero.tsx`'s existing `useTranslations("hero")` call (already in scope, no new hook needed).

- [ ] **Step 1: Add the key to all three locale files**, inside the existing `"hero"` object:
  - `fr.json`: `"location": "Jérusalem, Israël"`
  - `en.json`: `"location": "Jerusalem, Israel"`
  - `he.json`: `"location": "ירושלים, ישראל"`
- [ ] **Step 2: Replace the hardcoded string in `Hero.tsx`**: change `<Eyebrow>Jerusalem, Israel</Eyebrow>` to `<Eyebrow>{t("location")}</Eyebrow>` (the component already has `const t = useTranslations("hero");`).
- [ ] **Step 3: Verify all three locales render**: `npm run build` and confirm `/en`, `/fr`, `/he` all appear in the route output with no errors (this is the project's only available check — there is no dev-server-driven E2E harness in this repo).
- [ ] **Step 4: Commit.**

```bash
git add components/sections/Hero.tsx messages/en.json messages/fr.json messages/he.json
git commit -m "fix: translate hero location eyebrow per locale"
```

---

### Task 2: Rewrite Banking & Finance (brief's #1 SEO priority)

**Files:**
- Modify: `messages/fr.json`, `messages/en.json`, `messages/he.json` — key `expertiseDetail.banking-finance` (full rewrite) + new keys `expertiseDetail.banking-finance.seoTitle` and `.h1`
- Modify: `app/[locale]/expertise/[slug]/page.tsx` — `generateMetadata` and `ExpertiseDetailContent` read the new `.h1`/`.seoTitle` keys for this slug instead of `expertise.items.banking-finance`

**Interfaces:**
- Produces: the `expertiseDetail.<slug>.h1` / `.seoTitle` key *pattern* that Tasks 3, 5, 6, 8 reuse for their own slugs.
- Consumes: none (first task to touch this page).

- [ ] **Step 1: Rewrite `expertiseDetail.banking-finance` in `fr.json`**, replacing the current financing-centric copy. Required concepts (brief sections 9–12, verbatim where the brief gives exact wording):
  - `intro`: must introduce the page as covering relationships with Israeli banks, not financing deals.
  - `keyMatters` (replace all 3 current items — "Conventions de crédit et de financement", "Relations et litiges bancaires", "Transactions financières transfrontalières" — these first and third are exactly what brief section 9 says to reduce): new items must cover, each as one concise phrase: compte bloqué ou restreint ; refus de transfert et demandes de justificatifs de provenance des fonds ; réclamations bancaires (פניות הציבור) ; FATCA/CRS et documentation bancaire (W-8/W-9) ; données de crédit (מערכת נתוני אשראי) ; opérations bancaires France–Israël.
  - `services`: replace "Structuration de sûretés et garanties" (explicitly flagged to reduce, brief section 9) with services matching the new key matters — e.g. accompagnement précontentieux face à une banque, préparation de réclamations/פניות הציבור, analyse et demande de correction de données de crédit, assistance documentaire FATCA/CRS.
  - `approach`: must include the brief's required disclaimer concept from section 12 — the firm is not a US tax firm, a CPA/fiscalist is recommended when a question becomes genuinely fiscal — and must not promise an outcome (Global Constraints).
  - `seoTitle`: use the brief's exact FR title (section 10): `"Avocat en droit bancaire en Israël | Litiges bancaires"` (the firm name suffix is appended by the metadata step below, not duplicated here).
  - `h1`: use the brief's exact FR H1 (section 10): `"Droit bancaire et litiges avec les banques en Israël"`.
- [ ] **Step 2: Mirror the same structure into `en.json`**, anchored on the brief's EN keywords (section 10): primary `banking lawyer Israel` / `banking dispute Israel` / `bank account blocked Israel`. `seoTitle` ≈ "Banking Lawyer in Israel | Banking Disputes", `h1` ≈ "Banking Law and Bank Disputes in Israel". Same six key-matter concepts as Step 1, written as natural English, not translated FR.
- [ ] **Step 3: Mirror the same structure into `he.json`**, anchored on the brief's HE keywords (section 10): `עורך דין בנקאות` / `סכסוך עם בנק` / `חשבון בנק חסום`. Natural legal Hebrew, not a literal translation (Global Constraints).
- [ ] **Step 4: Update `app/[locale]/expertise/[slug]/page.tsx`** so that for every slug, `generateMetadata` and `ExpertiseDetailContent` read `tDetail(\`${slug}.h1\`)` for the on-page `<h1>` (via `ExpertiseHero`'s `title` prop) and `tDetail(\`${slug}.seoTitle\`)` for the metadata `title`, falling back to `t(\`items.${slug}\`)` for any slug that doesn't yet have `.h1`/`.seoTitle` (Tasks 3/5/6/8 add them for their own slugs; slugs not covered by any task keep using the short nav label as both, which is today's behavior and not a regression).
- [ ] **Step 5: Grep for forbidden phrases** — confirm none of these appear anywhere in the new `banking-finance` block in any of the three files: `sûret`, `garantie`, `leveraged`, `financement structuré`. `grep -i "sûret\|garantie\|leveraged\|financement structuré" messages/fr.json` should return no match inside the `banking-finance` object (a match elsewhere, e.g. a different slug, is fine and expected until Task 4).
- [ ] **Step 6: Run `npm run lint && npm run build`** — expect both to pass with no new errors.
- [ ] **Step 7: Commit.**

```bash
git add messages/en.json messages/fr.json messages/he.json "app/[locale]/expertise/[slug]/page.tsx"
git commit -m "feat: rewrite Banking & Finance around bank disputes, credit data, FATCA"
```

---

### Task 3: Merge Financial Regulation into Banking & Finance

**Files:**
- Modify: `lib/practice-areas.ts` — remove `"financial-regulation"` from `practiceAreaSlugs`
- Modify: `messages/en.json`, `messages/fr.json`, `messages/he.json` — remove `expertise.items.financial-regulation` and `expertiseDetail.financial-regulation`; fold its one defensible concept (données de crédit / obligations de reporting) into `expertiseDetail.banking-finance.keyMatters` if not already covered by Task 2
- Modify: `next.config.ts` — add a redirect

**Interfaces:**
- Consumes: Task 2's rewritten `banking-finance` block (this task folds any surviving Financial Regulation concept into it).
- Produces: nothing further consumes this task.

- [ ] **Step 1: Remove `"financial-regulation"` from the `practiceAreaSlugs` array** in `lib/practice-areas.ts`. This automatically removes it from `app/sitemap.ts`'s generated sitemap and from `generateStaticParams` in `app/[locale]/expertise/[slug]/page.tsx` (both already iterate `practiceAreaSlugs` — no edit needed in either file).
- [ ] **Step 2: Delete the `financial-regulation` key** from `expertise.items` and the `financial-regulation` object from `expertiseDetail` in all three locale files.
- [ ] **Step 3: Add a redirect in `next.config.ts`**, inside a new `redirects()` function alongside the existing `headers()`:

```ts
async redirects() {
  return [
    {
      source: "/:locale/expertise/financial-regulation",
      destination: "/:locale/expertise/banking-finance",
      permanent: true,
    },
  ];
},
```

- [ ] **Step 4: Verify the redirect** — `npm run build && npm run start`, then `curl -I http://localhost:3000/fr/expertise/financial-regulation` and confirm a `308` (permanent redirect) to `/fr/expertise/banking-finance`.
- [ ] **Step 5: Verify the old route is gone from the sitemap** — after the build, inspect the generated sitemap output (or re-run the `sitemap()` function's logic mentally against the now-6-entry `practiceAreaSlugs`) and confirm no `financial-regulation` URL remains.
- [ ] **Step 6: Commit.**

```bash
git add lib/practice-areas.ts messages/en.json messages/fr.json messages/he.json next.config.ts
git commit -m "refactor: merge Financial Regulation into Banking & Finance, add 301 redirect"
```

---

### Task 4: Rewrite Compliance

**Files:**
- Modify: `messages/fr.json`, `messages/en.json`, `messages/he.json` — key `expertiseDetail.compliance` + new `.seoTitle`/`.h1`

**Interfaces:**
- Consumes: Task 2's `.h1`/`.seoTitle` pattern (same shape, different slug) and `app/[locale]/expertise/[slug]/page.tsx`'s fallback-aware read from Task 2 Step 4 (no further code change needed here — the fallback already picks up any slug with these keys).

- [ ] **Step 1: Rewrite `expertiseDetail.compliance` in `fr.json`.** Current `keyMatters[0]` is `"Conformité anti-blanchiment et criminalité financière"` — brief section 16 says reduce "criminalité financière comme axe majeur" and "AML très avancé". Replace with concepts the brief lists as the real, defensible experience (section 16): FATCA, CRS, QI, revue documentaire, contrôles sur populations de comptes américains, vérification W-8/W-9, classification documentaire. Keep at most one light mention of AML/CRS reporting as a supporting item, not the lead.
  - `seoTitle`: brief's exact FR title (section 17): `"Compliance, FATCA & CRS en Israël"`.
  - `h1`: not given verbatim by the brief for this page — derive one consistent with the title and the brief's own phrase in section 16 ("Analyse réglementaire ciblée"): e.g. `"Conformité réglementaire, FATCA et CRS en Israël"`.
- [ ] **Step 2: Mirror into `en.json`**, anchored on brief section 17's EN keywords: `compliance lawyer Israel` / `FATCA Israel lawyer` / `CRS compliance Israel`.
- [ ] **Step 3: Mirror into `he.json`**, anchored on brief section 17's HE keywords: `עורך דין ציות רגולטורי` / `FATCA ישראל` / `CRS ישראל`.
- [ ] **Step 4: Grep for forbidden phrases** — confirm `criminalité financière` and `AML` do not appear as a lead/primary item; a single supporting mention of CRS/AML reporting obligations is acceptable, a dedicated "criminalité financière" key-matter item is not.
- [ ] **Step 5: Run `npm run lint && npm run build`.**
- [ ] **Step 6: Commit.**

```bash
git add messages/en.json messages/fr.json messages/he.json
git commit -m "feat: recenter Compliance on FATCA/QI/CRS documentary review"
```

---

### Task 5: Enrich Private Clients with succession and real-estate sub-sections

**Files:**
- Modify: `messages/fr.json`, `messages/en.json`, `messages/he.json` — key `expertiseDetail.private-clients` + new `.seoTitle`/`.h1`

- [ ] **Step 1: Rewrite `expertiseDetail.private-clients` in `fr.json`** to cover all four sub-areas the brief lists in section 19 (A–D), each as its own `keyMatters`/`services` line rather than the current generic 3-item list:
  - A. Banque et problématiques financières personnelles (compte bloqué, transfert international, FATCA/CRS/W-8/W-9, données de crédit — same register as Task 2, personal rather than general).
  - B. Dossiers France–Israël (démarches, procurations, représentation, coordination avec professionnels français/israéliens).
  - C. Successions et patrimoine — **must use the brief's required cautious framing verbatim** (section 19.C): *"Le cabinet accompagne certains dossiers successoraux et patrimoniaux comportant un élément israélien ou international et coordonne, lorsque nécessaire, l'intervention de professionnels spécialisés."* Include `צו ירושה` / `צו קיום צוואה` as named mechanisms, not as services the firm itself performs end-to-end.
  - D. Immobilier — acquisition/vente avec élément international, procurations, clients vivant à l'étranger.
  - `seoTitle`: brief does not give one verbatim for this page specifically — construct from section 20's primary keyword `avocat France Israël`: e.g. `"Avocat France–Israël | Clients privés"`.
  - `h1`: brief's exact FR H1 (section 20): `"Accompagnement juridique France–Israël"`.
- [ ] **Step 2: Mirror into `en.json`**, anchored on brief section 20's EN keywords: `France Israel lawyer` / `cross-border lawyer Israel` / `international private client lawyer Israel`. Succession sub-section anchored on section 21's EN keyword `inheritance lawyer Israel` with the same cautious framing as Step 1.C, translated faithfully in meaning (not word-for-word).
- [ ] **Step 3: Mirror into `he.json`**, anchored on section 20's HE keywords: `עורך דין צרפת ישראל` / `עורך דין דובר צרפתית`, succession sub-section anchored on section 21's `עורך דין ירושה` / `צו ירושה` / `צו קיום צוואה`.
- [ ] **Step 4: Grep for overpromising language** — confirm no sentence states the firm directly handles probate/succession procedures end-to-end; every succession sentence must include a coordination/referral qualifier (Global Constraints, brief section 19.C).
- [ ] **Step 5: Run `npm run lint && npm run build`.**
- [ ] **Step 6: Commit.**

```bash
git add messages/en.json messages/fr.json messages/he.json
git commit -m "feat: enrich Private Clients with succession and real-estate sub-sections"
```

---

### Task 6: Jonathan Ackmann — Attorney schema upgrade

**Files:**
- Modify: `app/[locale]/jonathan-ackmann/page.tsx` — JSON-LD `"@type"`

**Interfaces:**
- Consumes: none.
- Produces: nothing further consumes this.

No content rewrite — the audit found this page already the best-aligned with the brief (KPMG/FATCA/QI/CRS/W-8-W-9/credit-data/פניות הציבור already present, worded cautiously, no false Bank-of-Israel-employment claim). Brief section 38 lists `Attorney` as a target schema.org type; the page currently emits `"@type": "Person"`.

- [ ] **Step 1: Change `"@type": "Person"` to `"@type": "Attorney"`** in the `JsonLd` call in `app/[locale]/jonathan-ackmann/page.tsx`. `Attorney` is a schema.org subtype of `LocalBusiness`/`LegalService`-adjacent types, not of `Person` — add the existing fields (`name`, `jobTitle`, `worksFor`, `url`, `alumniOf`) as-is; schema.org tooling tolerates `Person`-shaped fields on `Attorney` since `Attorney` is commonly dual-typed in the wild, but if `npm run build`'s type-checking (this project has no runtime JSON-LD validator) raises no TypeScript error, no further change is needed — the `JsonLd` component's prop type is `{ data: object }`, untyped per-field, so this is a pure data-value change.
- [ ] **Step 2: Run `npm run lint && npm run build`.**
- [ ] **Step 3: Commit.**

```bash
git add "app/[locale]/jonathan-ackmann/page.tsx"
git commit -m "feat: use schema.org Attorney type for Jonathan Ackmann JSON-LD"
```

---

### Task 7: Homepage — keyword-first `<title>`, hero tagline line

**Files:**
- Modify: `messages/fr.json`, `messages/en.json`, `messages/he.json` — add `hero.seoTitle`, `hero.tagline`
- Modify: `app/[locale]/page.tsx` — `generateMetadata` uses `hero.seoTitle` instead of `hero.title`
- Modify: `components/sections/Hero.tsx` — render the new tagline line between the H1 and the positioning paragraph

**Interfaces:**
- Consumes: none.

Today, `hero.title` ("Ackmann Law Firm" / brand wordmark) is reused as *both* the on-page `<h1>` and the `<title>` tag. The brief's own recommended hero (section 7) keeps the brand name as the big line, but wants the actual `<title>` tag to lead with the keyword (section 8: `"Avocat francophone à Jérusalem | Ackmann Law Firm"`) and wants a tagline line ("Droit bancaire • Affaires • Conformité • France–Israël") between the brand name and the descriptive paragraph — neither of which the current single `hero.title` key can carry at once.

- [ ] **Step 1: Add two keys to `fr.json`'s `"hero"` object**:
  - `"seoTitle": "Avocat francophone à Jérusalem"` (brief section 8's exact primary keyword phrase — the metadata step below appends `" | Ackmann Law Firm"`, do not duplicate the firm name here).
  - `"tagline": "Droit bancaire • Affaires • Conformité • France–Israël"` (brief section 7, verbatim).
- [ ] **Step 2: Mirror into `en.json`**: `seoTitle` ≈ `"English-Speaking Lawyer in Jerusalem"` (brief section 8's EN keyword `English speaking lawyer Jerusalem`); `tagline` ≈ `"Banking • Business • Compliance • France–Israel"` (brief section 2's own stated EN translation of the positioning).
- [ ] **Step 3: Mirror into `he.json`**: `seoTitle` ≈ `"עורך דין דובר צרפתית בירושלים"` (brief section 8's HE keyword); `tagline` ≈ `"בנקאות • עסקים • ציות רגולטורי • צרפת–ישראל"`.
- [ ] **Step 4: Update `app/[locale]/page.tsx`'s `generateMetadata`** — change `title: t("title")` to `title: \`${t("seoTitle")} | ${siteConfig.firmName}\`` (import `siteConfig` from `@/lib/config` if not already imported in that file), and pass that same string through to `buildMetadata`'s `title` argument unchanged otherwise (the homepage already bypasses the title template per `lib/seo.ts`'s `path === ""` branch — this is exactly why the full firm-name suffix must be constructed here rather than relying on the template).
- [ ] **Step 5: Render the tagline in `Hero.tsx`** — add `<p className="text-eyebrow uppercase tracking-[0.1em] text-accent">{t("tagline")}</p>` immediately after the `<h1>` and before the positioning `<p>` (reuses existing `text-eyebrow`/`text-accent` utilities already defined in `app/globals.css` — no new CSS).
- [ ] **Step 6: Run `npm run lint && npm run build`**, then manually confirm (via the build's generated `<head>` or a quick `curl http://localhost:3000/fr | grep -o "<title>[^<]*</title>"` after `npm run start`) that the FR homepage's `<title>` reads `"Avocat francophone à Jérusalem | Ackmann Law Firm"`.
- [ ] **Step 7: Commit.**

```bash
git add messages/en.json messages/fr.json messages/he.json "app/[locale]/page.tsx" components/sections/Hero.tsx
git commit -m "feat: keyword-first homepage title, add hero tagline line"
```

---

### Task 8: Business & Commercial — title/H1 alignment

**Files:**
- Modify: `messages/fr.json`, `messages/en.json`, `messages/he.json` — key `expertiseDetail.corporate-commercial` + new `.seoTitle`/`.h1`

Audit finding: this page has no "forbidden phrase" problem (unlike Banking/Compliance) — it only needs the same `.seoTitle`/`.h1` split Tasks 2/4/5 introduced, plus the brief's one specific phrasing request (section 14).

- [ ] **Step 1: Add `seoTitle`/`h1` to `expertiseDetail.corporate-commercial` in `fr.json`** using the brief's exact strings (section 15): `seoTitle: "Avocat en droit commercial en Israël | Entreprises & contrats"`, `h1: "Droit commercial et accompagnement des entreprises"`.
- [ ] **Step 2: Insert the brief's recommended sentence (section 14, verbatim) into `intro` or `approach`**: *"Le cabinet accompagne notamment les entreprises et entrepreneurs qui ne disposent pas nécessairement d'un service juridique interne."* Do not use "Outside General Counsel" as the primary framing anywhere in this block (brief section 14 explicitly rules it out) — it does not currently appear, so this is a check, not a removal.
- [ ] **Step 3: Mirror `seoTitle`/`h1` and the same framing sentence's meaning into `en.json`**, anchored on brief section 15's EN keywords: `commercial lawyer Israel` / `business lawyer Israel`.
- [ ] **Step 4: Mirror into `he.json`**, anchored on section 15's HE keywords: `עורך דין מסחרי` / `עורך דין לעסקים`.
- [ ] **Step 5: Run `npm run lint && npm run build`.**
- [ ] **Step 6: Commit.**

```bash
git add messages/en.json messages/fr.json messages/he.json
git commit -m "feat: add SEO title/H1 and SME framing to Business & Commercial"
```

---

### Task 9: Internal cross-linking between expertise pages

**Files:**
- Create: `lib/expertise-links.ts`
- Modify: `app/[locale]/expertise/[slug]/page.tsx` — render the related links

**Interfaces:**
- Produces: `relatedSlugs: Record<PracticeAreaSlug, PracticeAreaSlug[]>`, consumed by `ExpertiseDetailContent`.
- Consumes: `PracticeAreaSlug` type from `lib/practice-areas.ts` (already exported).

Audit finding: zero cross-linking exists between expertise detail pages today. Brief section 34 specifies the exact map (minus the now-merged `financial-regulation`/treating "Corporate" as `corporate-commercial`):

- [ ] **Step 1: Create `lib/expertise-links.ts`** exporting:

```ts
import type { PracticeAreaSlug } from "./practice-areas";

export const relatedSlugs: Partial<Record<PracticeAreaSlug, PracticeAreaSlug[]>> = {
  "banking-finance": ["compliance", "private-clients"],
  "compliance": ["corporate-commercial"],
  "private-clients": ["banking-finance"],
  "dispute-resolution": ["banking-finance"],
  "corporate-commercial": ["compliance"],
};
```

(Brief section 34's six lines collapse to five map entries once "Banking → Compliance" and "Banking → Private Clients" combine into one array under `banking-finance`.)

- [ ] **Step 2: In `app/[locale]/expertise/[slug]/page.tsx`'s `ExpertiseDetailContent`**, after the existing "approach" `<Section>`, add a related-links block only when `relatedSlugs[slug]` is non-empty:

```tsx
{relatedSlugs[slug]?.length ? (
  <Section>
    <Container className="flex flex-wrap gap-6">
      {relatedSlugs[slug].map((related) => (
        <TextLink key={related} href={`/expertise/${related}`}>
          {t(`items.${related}`)}
        </TextLink>
      ))}
    </Container>
  </Section>
) : null}
```

Import `TextLink` from `@/components/ui/TextLink` and `relatedSlugs` from `@/lib/expertise-links` at the top of the file. This reuses `t` (already in scope from the `expertise` namespace) for descriptive anchor text — never "cliquez ici" (brief section 34).

- [ ] **Step 3: Run `npm run lint && npm run build`.**
- [ ] **Step 4: Manually verify** (reading the rendered page, not a script) that `/fr/expertise/banking-finance` shows links to Compliance and Private Clients, and that `/fr/expertise/compliance` shows a link to Business & Commercial.
- [ ] **Step 5: Commit.**

```bash
git add lib/expertise-links.ts "app/[locale]/expertise/[slug]/page.tsx"
git commit -m "feat: add internal cross-links between related expertise pages"
```

---

### Task 10: Banking FAQ + FAQPage structured data

**Files:**
- Modify: `messages/fr.json`, `messages/en.json`, `messages/he.json` — new `expertiseDetail.banking-finance.faq` array of `{question, answer}`
- Modify: `app/[locale]/expertise/[slug]/page.tsx` — render the FAQ block + `FAQPage` JSON-LD, `banking-finance` only

**Interfaces:**
- Consumes: Task 2's rewritten `banking-finance` block (this task extends it with one more field).

Brief section 33 gives four of its six FAQ questions as directly about banking (the other two — נתוני אשראי questions — also belong here per section 12). Brief section 38 lists `FAQPage` as a target schema type; none exists yet anywhere in the codebase.

- [ ] **Step 1: Add `expertiseDetail.banking-finance.faq` to `fr.json`** as an array of exactly these four Q/A pairs (questions verbatim from brief section 33 and 525-528; answers written new, one to three sentences, following the same "never promise a result" constraint as the rest of this page):
  1. "Que faire si ma banque bloque mon compte en Israël ?"
  2. "Une banque israélienne peut-elle demander la provenance des fonds ?"
  3. "Comment déposer une plainte auprès de la Banque d'Israël ?"
  4. "Qu'est-ce que le système נתוני אשראי ?"
- [ ] **Step 2: Mirror into `en.json`/`he.json`** — same four questions' meaning, EN/HE wording, same answers' meaning.
- [ ] **Step 3: In `app/[locale]/expertise/[slug]/page.tsx`**, when `slug === "banking-finance"`, render the FAQ list (plain `<dl>` or heading+paragraph pairs, matching the page's existing typographic patterns — no new UI component) and a `JsonLd` call with:

```ts
{
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: faq.map((item) => ({
    "@type": "Question",
    name: item.question,
    acceptedAnswer: { "@type": "Answer", text: item.answer },
  })),
}
```

- [ ] **Step 4: Run `npm run lint && npm run build`.**
- [ ] **Step 5: Commit.**

```bash
git add messages/en.json messages/fr.json messages/he.json "app/[locale]/expertise/[slug]/page.tsx"
git commit -m "feat: add Banking FAQ section with FAQPage structured data"
```

---

### Task 11: Validation (brief's own "Étape 5 — Validation")

**Files:** none modified — this task only runs checks.

- [ ] **Step 1: Lint** — `npm run lint`, expect zero errors.
- [ ] **Step 2: Typecheck + build** — `npm run build`, expect all routes listed in the output with no errors (75+ pages across 3 locales, per the build output pattern seen throughout this project's history).
- [ ] **Step 3: Key-parity check across locale files** — for each top-level and nested key path that exists in `fr.json`, confirm the same path exists in `en.json` and `he.json` (a one-off script is acceptable here, not a permanent test — e.g. `node -e "const a=require('./messages/fr.json'),b=require('./messages/en.json'),c=require('./messages/he.json'); ..."` walking the three objects and diffing key sets). Expect zero missing keys in either direction.
- [ ] **Step 4: Routes** — confirm the build output no longer lists `/expertise/financial-regulation` for any locale, and lists it as a 308 redirect target per Task 3 Step 4's `curl` check (re-run it here if not already captured).
- [ ] **Step 5: Links** — confirm (via the build output and a manual click-through on one locale) that every expertise detail page with a `relatedSlugs` entry renders its related links and that they resolve to real routes (no 404).
- [ ] **Step 6: Translations** — spot-check one sentence per task on `/he/expertise/banking-finance` and `/he/expertise/compliance` to confirm Hebrew renders RTL correctly and isn't a literal FR→HE string that reads awkwardly (qualitative read, not automatable here).
- [ ] **Step 7: Responsive** — this repo has no visual regression tooling; if a browser is available this session, check `/fr` and `/fr/expertise/banking-finance` at a mobile width. If no browser is available, note that explicitly rather than claiming it was checked.
- [ ] **Step 8: Metadata** — for the homepage and `banking-finance`, confirm via `curl ... | grep -o "<title>[^<]*</title>"` (or equivalent) that the `<title>` tag matches Task 7 Step 6 and Task 2's `seoTitle`, not the old brand-only / category-label strings.
- [ ] **Step 9: Sitemap** — confirm `app/sitemap.ts`'s output (inspect the built `/sitemap.xml` or trace the function against the post-Task-3 `practiceAreaSlugs`) has exactly 6 expertise URLs per locale, not 7, and no `financial-regulation` entry.
- [ ] **Step 10: Redirections** — re-run Task 3 Step 4's `curl -I` check as the final confirmation.
- [ ] **Step 11: Hreflang** — confirm (via page source or `buildMetadata`'s existing `alternates.languages` output, already wired for every page through `lib/seo.ts`) that `banking-finance`'s three locale URLs all cross-reference each other and that the retired `financial-regulation` alternates are gone.
- [ ] **Step 12: Final commit** (if Step 3's script is kept as a throwaway, delete it first — it's a one-off verification, not project code):

```bash
git status
# if the key-parity script was written to a file, remove it before this commit
git add -A
git commit -m "chore: validation pass for SEO/content rewrite"
```

---

## Self-Review

**1. Spec coverage:** Brief's priority order (Banking, Financial Regulation, Compliance, Private Clients, Jonathan Ackmann, Homepage, Business, SEO technique, FR/EN/HE) — all nine covered: Task 2 (Banking), Task 3 (Financial Regulation merge), Task 4 (Compliance), Task 5 (Private Clients), Task 6 (Jonathan Ackmann), Task 7 (Homepage), Task 8 (Business), Tasks 3/9/10 (SEO technique: redirect, internal links, structured data), every content task touches all three locale files (FR/EN/HE). Brief items explicitly deferred and named as such: credit-data dedicated page (section 12), real-estate dedicated page (section 22), article content (section 37), DPO page (section 18) — none created, per brief's own "don't create pages without clear need."
**2. Step scan:** every step names an exact file, an exact key, or an exact command; no step says "handle appropriately" without a concrete follow-on value. The one soft step (Task 11 Step 6, "qualitative read") is explicitly marked as non-automatable rather than disguised as a check.
**3. Type consistency:** `relatedSlugs` typed as `Partial<Record<PracticeAreaSlug, PracticeAreaSlug[]>>` in Task 9 Step 1 and read the same way in Step 2 — consistent. `.h1`/`.seoTitle` key names used identically across Tasks 2, 4, 5, 6 (well, Task 6 doesn't use them — correctly, since Jonathan Ackmann isn't an expertise-slug page), 8.
**4. Review Focus:** all five items above each have an owning task's step (locale desync → Task 11 Step 3; broken redirect → Task 3 Steps 3–4 and Task 11 Step 10; forbidden-phrase regression → each content task's own grep step; RTL regression → Task 1 Step 3 and Task 11 Step 6; directional-CSS in new links → Task 9 Step 2's reuse of the existing `TextLink`).
**5. Proportion:** this plan is long because the brief itself is long (45 numbered sections) and spans 11 independent content/code surfaces — but no task contains a full paragraph of final copy; every content step pins concepts, exact short strings the brief itself gives verbatim, and target keywords, leaving sentence-level phrasing to the implementer, consistent with the skill's "signature, not body" rule.
