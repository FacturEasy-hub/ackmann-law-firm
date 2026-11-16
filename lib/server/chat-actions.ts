"use server";

export type ChatMessage = { role: "user" | "assistant"; content: string };
export type ChatResult = { status: "ok"; reply: string } | { status: "error" };

const MAX_HISTORY = 20;
const MAX_MESSAGE_LENGTH = 500;

const SYSTEM_PROMPTS: Record<string, string> = {
  fr: "Tu es l'assistant d'accueil du site d'Ackmann Law Firm, cabinet d'avocats indépendant à Jérusalem (droit bancaire, commercial, conformité, dossiers France-Israël). Réponds brièvement, en français, uniquement sur le cabinet, ses domaines d'intervention et la prise de contact. Ne donne jamais de conseil juridique sur une situation personnelle, ne promets aucun résultat : oriente systématiquement vers la page /contact ou le téléphone du cabinet pour toute question de fond. Si la question sort de ce cadre, dis-le poliment et réoriente vers le contact.",
  en: "You are the welcome assistant for Ackmann Law Firm's website, an independent law firm in Jerusalem (banking, commercial law, compliance, France-Israel matters). Answer briefly, in English, only about the firm, its practice areas, and how to get in touch. Never give legal advice on a personal situation and never promise an outcome — always direct substantive questions to the /contact page or the firm's phone number. If a question falls outside this scope, say so politely and redirect to contact.",
  he: "אתה עוזר הקבלה של אתר Ackmann Law Firm, משרד עורכי דין עצמאי בירושלים (דין בנקאי, מסחרי, ציות ותיקים צרפת-ישראל). ענה בקצרה, בעברית, רק על המשרד, תחומי העיסוק שלו ודרכי יצירת קשר. לעולם אל תיתן ייעוץ משפטי למצב אישי ואל תבטיח תוצאה — הפנה תמיד שאלות מהותיות לעמוד /contact או למספר הטלפון של המשרד. אם השאלה חורגת מהתחום הזה, אמור זאת בנימוס והפנה ליצירת קשר.",
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
