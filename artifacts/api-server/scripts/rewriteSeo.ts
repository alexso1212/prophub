// AI SEO 改写流水线（命令行脚本）。
// 用法：pnpm --filter @workspace/api-server exec tsx scripts/rewriteSeo.ts <input.json> <output.json>
// 输入：[{ id, sourceText }]
// 输出：[{ id, sourceText, rewritten: { intro, sections:[{h, p}], faq:[{q,a}] }, status: "draft" }]
// 输出文件需人工审核后再合并到正式数据源；不直接落库。

import Anthropic from "@anthropic-ai/sdk";
import { readFileSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";

interface InputItem {
  id: string;
  sourceText: string;
}

interface RewrittenSection {
  h: string;
  p: string;
}
interface RewrittenFaq {
  q: string;
  a: string;
}
interface RewrittenContent {
  intro: string;
  sections: RewrittenSection[];
  faq: RewrittenFaq[];
}

interface OutputItem extends InputItem {
  rewritten: RewrittenContent | null;
  error?: string;
  status: "draft" | "failed";
  generatedAt: string;
}

const SYSTEM = `你是中文金融科普编辑。请把用户给的"自营交易规则/科普原文"改写成结构化片段，要求：
1. 保留事实，禁止编造数字。
2. 用通俗比喻把抽象规则讲清楚（如把"最大回撤"比喻成"血条"）。
3. 输出包含：intro（80字内一句话总览）、3-5 个 sections（每段 h 短标题 + p 60-120 字正文）、3 条 FAQ（q&a 各 1 句）。
4. 全部中文，不要 markdown 符号。
5. 仅通过 emit_rewrite 工具返回结果，不要其它解释。`;

const TOOL_SCHEMA = {
  type: "object" as const,
  required: ["intro", "sections", "faq"] as const,
  properties: {
    intro: { type: "string" as const },
    sections: {
      type: "array" as const,
      items: {
        type: "object" as const,
        required: ["h", "p"] as const,
        properties: { h: { type: "string" as const }, p: { type: "string" as const } },
      },
    },
    faq: {
      type: "array" as const,
      items: {
        type: "object" as const,
        required: ["q", "a"] as const,
        properties: { q: { type: "string" as const }, a: { type: "string" as const } },
      },
    },
  },
};

async function rewriteOne(client: Anthropic, item: InputItem): Promise<OutputItem> {
  try {
    const resp = await client.messages.create({
      model: "claude-haiku-4-5",
      max_tokens: 1500,
      system: SYSTEM,
      tools: [
        {
          name: "emit_rewrite",
          description: "返回改写后的中文结构化内容",
          input_schema: TOOL_SCHEMA,
        },
      ],
      tool_choice: { type: "tool", name: "emit_rewrite" },
      messages: [{ role: "user", content: `原文：\n${item.sourceText}` }],
    });
    const toolUse = resp.content.find((c) => c.type === "tool_use");
    if (!toolUse || toolUse.type !== "tool_use") {
      throw new Error("No tool_use in response");
    }
    const data = toolUse.input as RewrittenContent;
    return {
      ...item,
      rewritten: data,
      status: "draft",
      generatedAt: new Date().toISOString(),
    };
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err);
    return {
      ...item,
      rewritten: null,
      error: msg,
      status: "failed",
      generatedAt: new Date().toISOString(),
    };
  }
}

async function main() {
  const inFile = process.argv[2];
  const outFile = process.argv[3];
  if (!inFile || !outFile) {
    console.error("Usage: tsx scripts/rewriteSeo.ts <input.json> <output.json>");
    process.exit(1);
  }
  const baseURL = process.env.AI_INTEGRATIONS_ANTHROPIC_BASE_URL;
  const apiKey = process.env.AI_INTEGRATIONS_ANTHROPIC_API_KEY;
  if (!baseURL || !apiKey) {
    console.error("Missing AI_INTEGRATIONS_ANTHROPIC_BASE_URL / _API_KEY");
    process.exit(1);
  }
  const items: InputItem[] = JSON.parse(readFileSync(resolve(inFile), "utf-8"));
  const client = new Anthropic({ baseURL, apiKey });

  const results: OutputItem[] = [];
  let i = 0;
  for (const item of items) {
    i++;
    console.log(`[${i}/${items.length}] rewriting ${item.id}…`);
    results.push(await rewriteOne(client, item));
    // Be nice to the API.
    await new Promise((r) => setTimeout(r, 500));
  }
  writeFileSync(resolve(outFile), JSON.stringify(results, null, 2), "utf-8");
  const ok = results.filter((r) => r.status === "draft").length;
  console.log(`Done. ${ok}/${results.length} succeeded. Output: ${outFile}`);
  console.log("⚠️ 人工审核后再合入正式数据源（如 src/data/rulesZh.ts）。");
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
