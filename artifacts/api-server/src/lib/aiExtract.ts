import Anthropic from "@anthropic-ai/sdk";

const EXTRACT_SCHEMA_INSTRUCTIONS = `You are an expert at extracting structured promo/offer data from prop trading firm websites.

You will be given the visible text content of a firm's pricing or promotion page. Return ONLY a single JSON object (no prose, no markdown fences) matching this schema:

{
  "discountPercent": number | null,      // e.g. 90 for 90% off; null if not advertised
  "code": string | null,                 // promo code, uppercase; null if none
  "label": string | null,                // short marketing label, e.g. "Black Friday", "Limited Time"
  "validUntil": string | null,           // ISO 8601 date if a deadline is mentioned, else null
  "applicablePlans": string[],           // e.g. ["25K","50K","100K"]; empty array if not specified
  "summary": string,                     // 1-sentence Chinese summary of the offer
  "confidence": number                   // 0..1 your confidence that the extracted data is accurate
}

Rules:
- If discount appears as a range (e.g. "up to 90%"), use the largest number.
- If multiple codes are listed, pick the one with highest discount.
- If you can't find any offer at all, set discountPercent=null, code=null, confidence<=0.3.
- Never invent codes. If unsure, return null and lower confidence.
- summary must be in Chinese (Simplified) regardless of source language.`;

export interface ExtractedOffer {
  discountPercent: number | null;
  code: string | null;
  label: string | null;
  validUntil: string | null;
  applicablePlans: string[];
  summary: string;
  confidence: number;
}

export async function extractOfferFromText(text: string): Promise<ExtractedOffer> {
  const baseURL = process.env.AI_INTEGRATIONS_ANTHROPIC_BASE_URL;
  const apiKey = process.env.AI_INTEGRATIONS_ANTHROPIC_API_KEY;
  if (!baseURL || !apiKey) {
    throw new Error("Anthropic AI integration not configured");
  }

  const client = new Anthropic({ apiKey, baseURL });

  const trimmed = text.length > 20000 ? text.slice(0, 20000) + "\n…[truncated]" : text;

  const response = await client.messages.create({
    model: "claude-haiku-4-5",
    max_tokens: 1024,
    system: EXTRACT_SCHEMA_INSTRUCTIONS,
    messages: [
      {
        role: "user",
        content: `Page content:\n\n${trimmed}\n\nReturn the JSON now.`,
      },
    ],
  });

  const block = response.content.find((b: any) => b.type === "text") as any;
  if (!block) throw new Error("No text block in AI response");
  const raw = (block.text as string).trim();
  const jsonMatch = raw.match(/\{[\s\S]*\}/);
  if (!jsonMatch) throw new Error("AI response did not contain JSON");
  const parsed = JSON.parse(jsonMatch[0]) as ExtractedOffer;

  return {
    discountPercent: typeof parsed.discountPercent === "number" ? parsed.discountPercent : null,
    code: parsed.code ? String(parsed.code).trim().toUpperCase() : null,
    label: parsed.label ? String(parsed.label).trim() : null,
    validUntil: parsed.validUntil ? String(parsed.validUntil) : null,
    applicablePlans: Array.isArray(parsed.applicablePlans) ? parsed.applicablePlans.map(String) : [],
    summary: parsed.summary ? String(parsed.summary).trim() : "",
    confidence: typeof parsed.confidence === "number" ? Math.max(0, Math.min(1, parsed.confidence)) : 0.5,
  };
}

export function textFromHtml(html: string): string {
  return html
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, " ")
    .replace(/<style\b[^<]*(?:(?!<\/style>)<[^<]*)*<\/style>/gi, " ")
    .replace(/<!--[\s\S]*?-->/g, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/\s+/g, " ")
    .trim();
}
