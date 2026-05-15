// One-shot script: translate firm aiSummary + offerDescription + consistencyRules.rule + leverage[]
// to Chinese via Anthropic. Writes artifacts/propfirmmatch/src/data/firms.zh.ts.
//
// Run from repo root:
//   node scripts/translate-firms.mjs

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import Anthropic from "@anthropic-ai/sdk";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");
const FIRMS_TS = path.join(ROOT, "artifacts/propfirmmatch/src/data/firms.ts");
const ENRICHED = path.join(ROOT, "clone-data/enriched.json");
const OUT = path.join(ROOT, "artifacts/propfirmmatch/src/data/firms.zh.ts");

const baseURL = process.env.AI_INTEGRATIONS_ANTHROPIC_BASE_URL;
const apiKey = process.env.AI_INTEGRATIONS_ANTHROPIC_API_KEY;
if (!baseURL || !apiKey) {
  console.error("Missing AI_INTEGRATIONS_ANTHROPIC_BASE_URL / API_KEY");
  process.exit(1);
}
const client = new Anthropic({ baseURL, apiKey });
const MODEL = "claude-haiku-4-5";

// ---- Extract source data ----
const enriched = JSON.parse(fs.readFileSync(ENRICHED, "utf8"));
const firmsSrc = fs.readFileSync(FIRMS_TS, "utf8");

// Pull (slug, name, offerDescription) trios from the firms array literal.
const offerMap = {};
const nameMap = {};
const re = /slug:\s*"([^"]+)"[\s\S]*?name:\s*"([^"]+)"[\s\S]*?offerDescription:\s*"([^"]*)"/g;
let m;
while ((m = re.exec(firmsSrc)) !== null) {
  offerMap[m[1]] = m[3];
  nameMap[m[1]] = m[2];
}

// Pull consistencyRules from firms.ts ENRICHMENT[slug] when enriched.json lacks them.
function extractConsistencyFromFirmsTs(slug) {
  // Find "<slug>": { ... consistencyRules: [ ... ], ... }
  const slugRe = new RegExp(`"${slug}"\\s*:\\s*\\{`);
  const m = slugRe.exec(firmsSrc);
  if (!m) return [];
  // Find nearest "consistencyRules" within next 8000 chars
  const window = firmsSrc.slice(m.index, m.index + 8000);
  const cm = /consistencyRules"?\s*:\s*(\[[\s\S]*?\])/m.exec(window);
  if (!cm) return [];
  try {
    // The array is JSON-like (TS literal with quoted keys per ENRICHMENT block style)
    return JSON.parse(cm[1]);
  } catch {
    return [];
  }
}

// Build per-firm payload from enriched.json + offer + firms.ts fallback.
const payloads = Object.keys(enriched).map((slug) => {
  const e = enriched[slug];
  const cr = (e.consistencyRules && e.consistencyRules.length > 0)
    ? e.consistencyRules
    : extractConsistencyFromFirmsTs(slug);
  return {
    slug,
    name: nameMap[slug] || slug,
    aiSummary: e.aiSummary || "",
    offerDescription: offerMap[slug] || "",
    consistencyRules: cr.map((c) => ({ program: c.program, rule: c.rule })),
    leverage: e.leverage || [],
  };
});

const totalRules = payloads.reduce((a, p) => a + p.consistencyRules.length, 0);
console.log(`[translate] consistency rules: ${totalRules} across ${payloads.filter(p=>p.consistencyRules.length>0).length} firms`);

console.log(`[translate] ${payloads.length} firms; model=${MODEL}`);

const SYSTEM = `你是一名金融翻译，将自营交易公司（prop firm）的英文资料意译为简体中文。
要求：
1. 不要直译，保持营销文案的简洁与流畅，去除冗余套话。
2. 金融术语采用大陆通用译法：drawdown→回撤；profit target→盈利目标；profit split→分润比例；leverage→杠杆；payout→出金；challenge→挑战赛；evaluation→评估；1-Step/2-Step/Instant→一阶段/两阶段/即时入金；funded→签约；reset→重置；prop firm→自营公司；scaling plan→资金扩账计划。
3. 品牌名、平台名（NinjaTrader、TradingView、Tradovate、Rithmic、Quantower、CME、CBOT 等）保留英文。
4. 金额与账户档位（$50K、$100K、$10,000）保留原样。
5. 折扣表述：英文 "X% off" 必须译为 "X% 折扣" 或 "立减 X%" 或 "享 X% 优惠"；【严禁】使用中文"X折"形式（中文里"7折"=70%付款=30%off，与原意相反）。例：90% off → "立减 90%" 或 "9 折优惠"中"9 折"是错的，必须写"90% 折扣"。
6. 输出前自行检查所有中文是否存在错别字（例如"环保境"应为"环境"），逐字校对。
7. 严格输出 JSON，不要 markdown 代码块、不要解释。`;

function buildPrompt(p) {
  return `请把下面这家自营公司的英文资料意译成简体中文，输出严格符合 JSON Schema：
{
  "aiSummaryZh": string,           // 80-180 字的中文简介
  "offerDescriptionZh": string,    // 简短中文优惠说明，原文为空则留空字符串
  "consistencyRulesZh": [{ "program": string (英文保留), "rule": string (中文意译) }],
  "leverageZh": string[]           // 与原条目一一对应的中文条目；账户金额保留 $XK 写法
}

公司：${p.name}
原始数据 JSON：
${JSON.stringify({
  aiSummary: p.aiSummary,
  offerDescription: p.offerDescription,
  consistencyRules: p.consistencyRules,
  leverage: p.leverage,
}, null, 2)}`;
}

async function translateOne(p, attempt = 1) {
  try {
    const msg = await client.messages.create({
      model: MODEL,
      max_tokens: 8192,
      system: SYSTEM,
      messages: [{ role: "user", content: buildPrompt(p) }],
    });
    const block = msg.content[0];
    const text = block.type === "text" ? block.text : "";
    // Strip optional ```json fences just in case.
    const cleaned = text.trim().replace(/^```(?:json)?\s*/i, "").replace(/```$/, "").trim();
    const parsed = JSON.parse(cleaned);
    return { slug: p.slug, ...parsed };
  } catch (err) {
    if (attempt >= 5) throw err;
    const wait = 500 * 2 ** (attempt - 1);
    console.warn(`[retry ${attempt}] ${p.slug}: ${err.message}; sleep ${wait}ms`);
    await new Promise((r) => setTimeout(r, wait));
    return translateOne(p, attempt + 1);
  }
}

// Concurrency = 3 limiter
async function runPool(items, concurrency, fn) {
  const results = new Array(items.length);
  let idx = 0;
  async function worker() {
    while (idx < items.length) {
      const my = idx++;
      const item = items[my];
      const t0 = Date.now();
      try {
        results[my] = await fn(item);
        console.log(`  ✓ [${my + 1}/${items.length}] ${item.slug} (${Date.now() - t0}ms)`);
      } catch (e) {
        console.error(`  ✗ ${item.slug}: ${e.message}`);
        results[my] = { slug: item.slug, aiSummaryZh: "", offerDescriptionZh: "", consistencyRulesZh: [], leverageZh: [] };
      }
    }
  }
  await Promise.all(Array.from({ length: concurrency }, worker));
  return results;
}

const results = await runPool(payloads, 3, translateOne);

// ---- Emit firms.zh.ts ----
const banner = `// AUTO-GENERATED by scripts/translate-firms.mjs — do not edit by hand.
// Chinese translations for firm long-text fields.
`;
const map = {};
for (const r of results) {
  map[r.slug] = {
    aiSummaryZh: r.aiSummaryZh || "",
    offerDescriptionZh: r.offerDescriptionZh || "",
    consistencyRulesZh: r.consistencyRulesZh || [],
    leverageZh: r.leverageZh || [],
  };
}

const ts = `${banner}
export interface FirmZh {
  aiSummaryZh: string;
  offerDescriptionZh: string;
  consistencyRulesZh: { program: string; rule: string }[];
  leverageZh: string[];
}

export const FIRMS_ZH: Record<string, FirmZh> = ${JSON.stringify(map, null, 2)};

export function findFirmZh(slug: string): FirmZh | undefined {
  return FIRMS_ZH[slug];
}
`;

fs.writeFileSync(OUT, ts);
console.log(`\n[translate] wrote ${OUT}`);
console.log(`[translate] ${Object.keys(map).length} firms translated`);
