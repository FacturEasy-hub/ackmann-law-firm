"use server";

export type ChatMessage = { role: "user" | "assistant"; content: string };
export type ChatResult =
  | { status: "ok"; reply: string }
  | { status: "unconfigured" }
  | { status: "error" };

const MAX_HISTORY = 20;
const MAX_MESSAGE_LENGTH = 500;

const SYSTEM_PROMPTS: Record<string, string> = {
  fr: "Tu es l'assistant d'accueil du site d'Ackmann Law Firm, cabinet d'avocats indépendant à Jérusalem (droit bancaire, commercial, conformité, dossiers France-Israël). Réponds brièvement, en français, uniquement sur le cabinet, ses domaines d'intervention et la prise de contact. Ne donne jamais de conseil juridique sur une situation personnelle, ne promets aucun résultat : oriente systématiquement vers la page /contact ou le téléphone du cabinet pour toute question de fond. Si la question sort de ce cadre, dis-le poliment et réoriente vers le contact.",
  en: "You are the welcome assistant for Ackmann Law Firm's website, an independent law firm in Jerusalem (banking, commercial law, compliance, France-Israel matters). Answer briefly, in English, only about the firm, its practice areas, and how to get in touch. Never give legal advice on a personal situation and never promise an outcome — always direct substantive questions to the /contact page or the firm's phone number. If a question falls outside this scope, say so politely and redirect to contact.",
  he: "אתה עוזר הקבלה של אתר Ackmann Law Firm, משרד עורכי דין עצמאי בירושלים (דין בנקאי, מסחרי, ציות ותיקים צרפת-ישראל). ענה בקצרה, בעברית, רק על המשרד, תחומי העיסוק שלו ודרכי יצירת קשר. לעולם אל תיתן ייעוץ משפטי למצב אישי ואל תבטיח תוצאה — הפנה תמיד שאלות מהותיות לעמוד /contact או למספר הטלפון של המשרד. אם השאלה חורגת מהתחום הזה, אמור זאת בנימוס והפנה ליצירת קשר.",
};

/**
 * OpenRouter first (one key, many free `:free` models — the "spread
 * across models" ask), Groq as fallback when OpenRouter's shared free
 * quota (50 requests/day across ALL free models) is exhausted. Both free
 * tiers are small — this is a V1/demo feature, not production-grade
 * capacity; say so if traffic grows.
 */
async function callProvider(
  baseUrl: string,
  apiKey: string,
  model: string,
  messages: { role: string; content: string }[],
): Promise<string | null> {
  try {
    const res = await fetch(`${baseUrl}/chat/completions`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ model, messages, max_tokens: 300 }),
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
  const openrouterKey = process.env.OPENROUTER_API_KEY;
  const groqKey = process.env.GROQ_API_KEY;

  if (!openrouterKey && !groqKey) {
    console.log("[chat] no provider configured — skipping request");
    return { status: "unconfigured" };
  }

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

  if (openrouterKey) {
    const reply = await callProvider(
      "https://openrouter.ai/api/v1",
      openrouterKey,
      "nvidia/nemotron-3.5-lightning:free",
      messages,
    );
    if (reply) return { status: "ok", reply };
  }

  if (groqKey) {
    const reply = await callProvider(
      "https://api.groq.com/openai/v1",
      groqKey,
      "openai/gpt-oss-20b",
      messages,
    );
    if (reply) return { status: "ok", reply };
  }

  return { status: "error" };
}
