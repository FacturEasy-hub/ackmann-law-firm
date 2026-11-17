"use server";

import { siteConfig } from "@/lib/config";

export type ChatMessage = { role: "user" | "assistant"; content: string };
export type ChatResult = { status: "ok"; reply: string } | { status: "error" };

const MAX_HISTORY = 20;
const MAX_MESSAGE_LENGTH = 500;

// The free-tier models hallucinate a plausible-looking but wrong phone
// number if asked to recall one from "general knowledge" — ground every
// prompt with the real one so there's nothing to invent.
const PHONE = siteConfig.phone;

const SYSTEM_PROMPTS: Record<string, string> = {
  fr: `Tu es l'assistant d'accueil du site d'Ackmann Law Firm, cabinet d'avocats indépendant à Jérusalem (droit bancaire, commercial, conformité, dossiers France-Israël). Réponds en français, uniquement sur le cabinet, ses domaines d'intervention et la prise de contact. Le numéro du cabinet est ${PHONE} — n'en invente jamais un autre. Si on te demande un fait simple déjà connu (numéro de téléphone, adresse, langues parlées), réponds-le directement, tout de suite, sans poser de question avant. Pour une question de fond sur un dossier/domaine juridique, avance par étapes, une seule chose à la fois, jamais plusieurs paragraphes d'un coup : (1) si le sujet n'est pas clair, demande d'abord brièvement de quel domaine ou situation il s'agit (bancaire, société/commercial, conformité, administratif, litige, clients privés) ; (2) une fois le sujet identifié, dis en une phrase si et pourquoi le cabinet intervient dans ce domaine ; (3) propose alors de poursuivre via la page /contact ou le téléphone ${PHONE}. Ne donne jamais de conseil juridique sur une situation personnelle, ne promets aucun résultat. Si la question sort de ce cadre, dis-le poliment et réoriente vers le contact.`,
  en: `You are the welcome assistant for Ackmann Law Firm's website, an independent law firm in Jerusalem (banking, commercial law, compliance, France-Israel matters). Answer in English, only about the firm, its practice areas, and how to get in touch. The firm's phone number is ${PHONE} — never invent a different one. If asked a simple known fact (phone number, address, languages spoken), answer it directly, right away, with no question first. For a substantive question about a legal matter/area, move forward one step at a time, never several paragraphs at once: (1) if the topic isn't clear, first briefly ask which area or situation it concerns (banking, corporate/commercial, compliance, administrative, disputes, private clients); (2) once the topic is identified, say in one sentence whether and why the firm handles it; (3) then suggest continuing via the /contact page or ${PHONE}. Never give legal advice on a personal situation and never promise an outcome. If a question falls outside this scope, say so politely and redirect to contact.`,
  he: `אתה עוזר הקבלה של אתר Ackmann Law Firm, משרד עורכי דין עצמאי בירושלים (דין בנקאי, מסחרי, ציות ותיקים צרפת-ישראל). ענה בעברית, רק על המשרד, תחומי העיסוק שלו ודרכי יצירת קשר. מספר הטלפון של המשרד הוא ${PHONE} — לעולם אל תמציא מספר אחר. אם שואלים אותך עובדה פשוטה וידועה (טלפון, כתובת, שפות), ענה עליה ישירות ומיד, בלי לשאול שאלה קודם. לשאלה מהותית על תחום/דיון משפטי, התקדם שלב אחד בכל פעם, לעולם לא כמה פסקאות בבת אחת: (1) אם הנושא לא ברור, שאל תחילה בקצרה לאיזה תחום או מצב מדובר (בנקאות, חברות/מסחרי, ציות, מנהלי, סכסוכים, לקוחות פרטיים); (2) לאחר זיהוי הנושא, אמור במשפט אחד אם ומדוע המשרד עוסק בו; (3) הצע להמשיך דרך עמוד /contact או ${PHONE}. לעולם אל תיתן ייעוץ משפטי למצב אישי ואל תבטיח תוצאה. אם השאלה חורגת מהתחום הזה, אמור זאת בנימוס והפנה ליצירת קשר.`,
};

/**
 * OVHcloud AI Endpoints first (anonymous tier, EU-hosted, 2 requests/min
 * per IP), LLM7.io as fallback (anonymous tier, ~250 requests/hour) when
 * OVHcloud's tighter per-minute limit is hit. Both work with **no account
 * and no API key** — the option chosen when the client only had a ChatGPT
 * account, not an OpenRouter/Groq/OpenAI API key. Send no `Authorization`
 * header for either: OVHcloud's anonymous tier specifically rejects any
 * Bearer value, so there's no "optional key" fallback shape here like
 * other free providers have. Both free tiers are smaller than OpenRouter's
 * — this is a V1/demo feature, not production-grade capacity; say so if
 * traffic grows.
 */
async function callProvider(
  baseUrl: string,
  model: string,
  messages: { role: string; content: string }[],
): Promise<string | null> {
  try {
    const res = await fetch(`${baseUrl}/chat/completions`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      // 500, not 300: both OVHcloud and LLM7.io's free models are reasoning
      // models that spend tokens thinking before the visible reply — a
      // live test came back empty at 300 once the system prompt (longer
      // in fr/he) pushed reasoning past the cap.
      body: JSON.stringify({ model, messages, max_tokens: 500 }),
    });
    if (!res.ok) return null;
    const data = (await res.json()) as {
      choices?: { message?: { content?: string } }[];
    };
    return data.choices?.[0]?.message?.content?.trim() || null;
  } catch {
    return null;
  }
}

export async function sendChatMessage(
  history: ChatMessage[],
  locale: string,
): Promise<ChatResult> {
  // Trust nothing from the client beyond shape/length — same philosophy as
  // the contact form's own server-side sanitization.
  const trimmedHistory = history
    .slice(-MAX_HISTORY)
    .map((m) => ({
      role: m.role,
      content: m.content.slice(0, MAX_MESSAGE_LENGTH),
    }));

  const systemPrompt = SYSTEM_PROMPTS[locale] ?? SYSTEM_PROMPTS.en;
  const messages = [{ role: "system", content: systemPrompt }, ...trimmedHistory];

  const ovhReply = await callProvider(
    "https://oai.endpoints.kepler.ai.cloud.ovh.net/v1",
    "gpt-oss-120b",
    messages,
  );
  if (ovhReply) return { status: "ok", reply: ovhReply };

  const llm7Reply = await callProvider(
    "https://api.llm7.io/v1",
    "gpt-oss:20b",
    messages,
  );
  if (llm7Reply) return { status: "ok", reply: llm7Reply };

  return { status: "error" };
}
