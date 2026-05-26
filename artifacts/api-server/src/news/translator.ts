import Anthropic from "@anthropic-ai/sdk";
import type { RawNewsItem, NewsItem } from "./types";
import { logger } from "../lib/logger";

const TTL_MS = 15 * 60 * 1000;
const MAX_ENTRIES = 200;

interface CacheEntry {
  value: Pick<NewsItem, "titleZh" | "summaryZh" | "takeawaysZh">;
  expires: number;
}

const cache = new Map<string, CacheEntry>();

function getClient(): Anthropic | null {
  const baseURL = process.env.AI_INTEGRATIONS_ANTHROPIC_BASE_URL;
  const apiKey = process.env.AI_INTEGRATIONS_ANTHROPIC_API_KEY;
  if (!baseURL || !apiKey) return null;
  return new Anthropic({ baseURL, apiKey });
}

const SYSTEM_PROMPT = `你是一名资深金融编辑，专为中文交易者重写英文金融快讯。
要求：
1. 输出必须是合法 JSON：{"titleZh": string, "summaryZh": string, "takeawaysZh": string[3]}。
2. 标题 ≤ 28 字，简体中文，带画面感和方向性，不要照抄英文。
3. 摘要 60-100 字，逻辑导图式提炼"事件 + 数据 + 市场反应"，不是逐句翻译。
4. takeawaysZh 必须 3 条，每条 ≤ 25 字，分别对应：核心事件、关键数据、对相关品种的影响。
5. 严禁使用任何 markdown 标记、代码块、解释性前后缀。只返回 JSON。
6. 任何专有名词（央行/品种/机构名）按行业惯例翻译，例如 ECB → 欧洲央行，BOJ → 日本央行。`;

function fallback(raw: RawNewsItem): Pick<NewsItem, "titleZh" | "summaryZh" | "takeawaysZh"> {
  const tickers = raw.tickers.join(" / ") || "—";
  return {
    titleZh: "中文快讯生成中，请稍后刷新",
    summaryZh: "AI 翻译服务暂时不可用，正在重试。请稍后刷新页面查看完整中文摘要。",
    takeawaysZh: [
      "翻译服务暂时不可用",
      `相关品种：${tickers}`,
      "可点击下方「查看原文」阅读英文原稿",
    ],
  };
}

async function translateOne(raw: RawNewsItem): Promise<Pick<NewsItem, "titleZh" | "summaryZh" | "takeawaysZh">> {
  const client = getClient();
  if (!client) return fallback(raw);

  try {
    const msg = await client.messages.create({
      model: "claude-haiku-4-5",
      max_tokens: 8192,
      system: SYSTEM_PROMPT,
      messages: [
        {
          role: "user",
          content: `分类：${raw.category}\n相关品种：${raw.tickers.join(", ") || "无"}\n来源：${raw.sourceLabel}\n\n英文原文标题：${raw.titleEn}\n英文原文正文：${raw.bodyEn}\n\n请输出 JSON。`,
        },
      ],
    });
    const block = msg.content[0];
    const text = block && block.type === "text" ? block.text : "";
    const jsonStart = text.indexOf("{");
    const jsonEnd = text.lastIndexOf("}");
    if (jsonStart < 0 || jsonEnd <= jsonStart) throw new Error("no json in response");
    const parsed = JSON.parse(text.slice(jsonStart, jsonEnd + 1));
    if (
      typeof parsed.titleZh !== "string" ||
      typeof parsed.summaryZh !== "string" ||
      !Array.isArray(parsed.takeawaysZh)
    ) {
      throw new Error("invalid shape");
    }
    return {
      titleZh: parsed.titleZh,
      summaryZh: parsed.summaryZh,
      takeawaysZh: parsed.takeawaysZh.slice(0, 3).map(String),
    };
  } catch (err) {
    logger.warn({ err, id: raw.id }, "translate failed; using fallback");
    return fallback(raw);
  }
}

export async function rewriteToChinese(raw: RawNewsItem): Promise<NewsItem> {
  const now = Date.now();
  const hit = cache.get(raw.id);
  if (hit && hit.expires > now) {
    logger.debug({ id: raw.id }, "translate cache hit");
    // Refresh recency: re-insert moves key to the most-recently-used position.
    cache.delete(raw.id);
    cache.set(raw.id, hit);
    return { ...raw, ...hit.value };
  }
  if (hit) cache.delete(raw.id);

  const value = await translateOne(raw);
  cache.set(raw.id, { value, expires: now + TTL_MS });

  // Evict least-recently-used entries (oldest insertion order after recency refresh).
  while (cache.size > MAX_ENTRIES) {
    const lruKey = cache.keys().next().value;
    if (lruKey === undefined) break;
    cache.delete(lruKey);
  }

  return { ...raw, ...value };
}

export async function rewriteAll(items: RawNewsItem[]): Promise<NewsItem[]> {
  const out: NewsItem[] = [];
  for (let i = 0; i < items.length; i += 4) {
    const batch = items.slice(i, i + 4);
    const results = await Promise.all(batch.map(rewriteToChinese));
    out.push(...results);
  }
  return out;
}
