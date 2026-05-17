import Anthropic from "@anthropic-ai/sdk";
import type { Tool, ToolChoiceTool, ToolUseBlock } from "@anthropic-ai/sdk/resources/messages";
import { z } from "zod";

// Runtime schema for what the model returns in the record_offer tool call.
// We validate before trusting it for DB writes.
const ExtractedOfferSchema = z.object({
  discountPercent: z.number().nullable(),
  code: z.string().nullable(),
  label: z.string().nullable(),
  validUntil: z.string().nullable(),
  applicablePlans: z.array(z.string()),
  summary: z.string(),
  confidence: z.number(),
});

const SYSTEM_PROMPT = `You extract structured promo/offer data from prop trading firm websites. Always call the \`record_offer\` tool with your findings. Rules:
- If a discount appears as a range (e.g. "up to 90%"), use the largest number.
- If multiple codes are listed, pick the one with highest discount.
- If no offer is found, set discountPercent=null, code=null, confidence<=0.3.
- Never invent codes. If unsure, return null and lower confidence.
- summary must be in Simplified Chinese regardless of source language.`;

const OFFER_TOOL: Tool = {
  name: "record_offer",
  description:
    "Record the structured promo/offer data extracted from the prop firm page. Must be called exactly once.",
  input_schema: {
    type: "object" as const,
    properties: {
      discountPercent: {
        type: ["number", "null"],
        description: "Discount percent, e.g. 90 for 90% off. null if not advertised.",
      },
      code: {
        type: ["string", "null"],
        description: "Promo code (will be uppercased). null if none.",
      },
      label: {
        type: ["string", "null"],
        description: "Short marketing label, e.g. 'Black Friday'. null if none.",
      },
      validUntil: {
        type: ["string", "null"],
        description: "ISO 8601 date if deadline mentioned, else null.",
      },
      applicablePlans: {
        type: "array",
        items: { type: "string" },
        description: "List of plan sizes like ['25K','50K']. Empty if not specified.",
      },
      summary: {
        type: "string",
        description: "One-sentence Simplified Chinese summary of the offer.",
      },
      confidence: {
        type: "number",
        description: "0..1 confidence that the extracted data is accurate.",
      },
    },
    required: [
      "discountPercent",
      "code",
      "label",
      "validUntil",
      "applicablePlans",
      "summary",
      "confidence",
    ],
  },
};

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
    system: SYSTEM_PROMPT,
    tools: [OFFER_TOOL],
    tool_choice: { type: "tool", name: "record_offer" } satisfies ToolChoiceTool,
    messages: [
      {
        role: "user",
        content: `Page content:\n\n${trimmed}\n\nCall record_offer with the extracted fields now.`,
      },
    ],
  });

  const toolBlock = response.content.find(
    (b): b is ToolUseBlock => b.type === "tool_use" && b.name === "record_offer",
  );
  if (!toolBlock) throw new Error("AI did not call record_offer tool");

  const parsed = ExtractedOfferSchema.safeParse(toolBlock.input);
  if (!parsed.success) {
    throw new Error(`AI tool output failed schema validation: ${parsed.error.message}`);
  }
  const data = parsed.data;

  return {
    discountPercent: data.discountPercent,
    code: data.code ? data.code.trim().toUpperCase() : null,
    label: data.label ? data.label.trim() : null,
    validUntil: data.validUntil,
    applicablePlans: data.applicablePlans,
    summary: data.summary.trim(),
    confidence: Math.max(0, Math.min(1, data.confidence)),
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
