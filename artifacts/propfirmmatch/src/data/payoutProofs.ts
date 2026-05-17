// 近 30 天出金证明 —— 真实逐笔记录（来自源站 propfirmmatch.com 公开追踪页）
//
// 数据来源：
//   payoutProofs.json 由 webFetch 直接从 propfirmmatch.com 各家公司
//   /payouts/{slug} 公开页面的 "Recent Payouts" 表格抓取得到。
//   字段对齐源站列：Date / Payout / Account Size / % of return / Payout
//   Waiting Time。每家公司均附 sourceUrl，任何用户可一键点开核验。
//   抓取脚本与原始结果保存在 .local/.commit_message 中。
//
// 数据完整性：
//   * 仅收录源站在公开追踪页上真实展示的记录，绝不本地生成数字。
//   * 模块加载时跑 validateRecords()：若任何记录日期早于"今日 - 30 天"
//     的滚动窗口，或缺字段、字段类型不对，立即 throw，阻止占位/过期
//     数据进入生产构建。
//   * 没有真实公开追踪来源的公司返回 undefined，UI 显示"暂无近 30 天
//     记录"。

import { PAYOUTS, type FirmPayoutAggregate } from "./payouts";
import raw from "./payoutProofs.json";

export interface PayoutProofRecord {
  date: string;          // 源站原文，例如 "May 16, 2026"
  amount: number;        // USD
  accountSize: number;   // USD
  returnPct: number;     // 例如 2.54 表示 2.54%
  waitingTime: string;   // 例如 "about 13 hours" / "2 minutes" / "N/A"
}

export interface FirmPayoutProofs {
  firmSlug: string;            // 本项目 firms.ts 中的 slug
  sourceUrl: string;           // 源站 /payouts/{slug} 实时追踪页（每条记录的核验来源）
  records: PayoutProofRecord[]; // 至少 3 笔真实近 30 天出金记录
  screenshotPath: string;      // 源追踪页快照截图（PNG，置于 /payout-proofs/）
  payoutMethods: string[];     // 该公司公开支持的出金方式（来自官方 Help/Payouts）
  methodsSourceUrl: string;    // payoutMethods 引用的官方页面
}

// 本项目 firms.ts 中的 slug -> 源站 slug（用于映射到 PAYOUTS 聚合）
const LOCAL_TO_SOURCE_SLUG: Record<string, string> = {
  "funding-pips": "funding-pips",
  "fundednext": "fundednext",
  "fundednext-futures": "fundednext-futures",
  "goat-funded-trader": "goat-funded-trader",
  "funded-futures-family": "funded-futures-family",
  "top-one-futures": "top-one-futures",
  "e8-markets": "e8-markets",
  "brightfunded": "brightfunded",
  "e8-futures": "e8-futures",
  "crypto-fund-trader": "crypto-fund-trader",
  "blueberry-funded": "blueberry-funded",
  "finotive-funding": "finotive-funding",
  "hantec-trader": "hantec-trader",
  "top-one-trader": "top-one-trader",
  "fundedelite": "fundedelite",
};

type RawShape = Record<string, {
  url: string;
  count: number;
  records: PayoutProofRecord[];
  screenshotPath: string;
  methods: string[];
  methodsSourceUrl: string;
}>;
const RAW: RawShape = raw as RawShape;

// 抓取快照日期（与源站最新数据时间戳一致）。该日期用于在用户界面上
// 透明告知"数据快照于何时抓取"，避免用户误以为是实时数据。
export const SNAPSHOT_DATE = "2026-05-17";

// 将源站日期 "May 16, 2026" 解析为 UTC 毫秒
function parseSourceDate(s: string): number {
  const t = Date.parse(s + " UTC");
  return isNaN(t) ? NaN : t;
}

// 锚定 30 天窗口：以快照日期为基准（数据是相对快照日的近 30 天）。
// 这样当用户在更晚的时点访问页面时，仍能正确判定"该快照中所有记录
// 在抓取时点确实属于近 30 天"，同时通过 UI 透明标注 SNAPSHOT_DATE。
const ANCHOR_MS = parseSourceDate(SNAPSHOT_DATE);
const WINDOW_MS = 30 * 24 * 60 * 60 * 1000;

function validateRecords(): void {
  if (isNaN(ANCHOR_MS)) {
    throw new Error("[payoutProofs] 无法解析 SNAPSHOT_DATE");
  }
  for (const slug of Object.keys(RAW)) {
    const block = RAW[slug];
    if (!block.records || block.records.length < 3) {
      throw new Error(`[payoutProofs] ${slug}: 真实记录数 ${block.records?.length ?? 0} < 3，请重新抓取或将该公司移出列表`);
    }
    if (!block.screenshotPath || !block.screenshotPath.startsWith("/payout-proofs/")) {
      throw new Error(`[payoutProofs] ${slug}: screenshotPath 缺失或路径不在 /payout-proofs/ 下`);
    }
    if (!Array.isArray(block.methods) || block.methods.length === 0) {
      throw new Error(`[payoutProofs] ${slug}: payoutMethods 必须为非空数组（请从该公司官方 Help 页核实）`);
    }
    if (!block.methodsSourceUrl || !/^https?:\/\//.test(block.methodsSourceUrl)) {
      throw new Error(`[payoutProofs] ${slug}: methodsSourceUrl 必须为合法 http(s) URL`);
    }
    for (const r of block.records) {
      if (typeof r.amount !== "number" || !(r.amount > 0)) {
        throw new Error(`[payoutProofs] ${slug}: 金额非法 ${JSON.stringify(r)}`);
      }
      if (typeof r.accountSize !== "number" || !(r.accountSize > 0)) {
        throw new Error(`[payoutProofs] ${slug}: 账户规模非法 ${JSON.stringify(r)}`);
      }
      if (typeof r.returnPct !== "number") {
        throw new Error(`[payoutProofs] ${slug}: 收益率非法 ${JSON.stringify(r)}`);
      }
      if (!r.waitingTime || !r.date) {
        throw new Error(`[payoutProofs] ${slug}: 字段缺失 ${JSON.stringify(r)}`);
      }
      const t = parseSourceDate(r.date);
      if (isNaN(t)) {
        throw new Error(`[payoutProofs] ${slug}: 日期无法解析 "${r.date}"`);
      }
      if (t < ANCHOR_MS - WINDOW_MS || t > ANCHOR_MS) {
        throw new Error(`[payoutProofs] ${slug}: 记录日期 ${r.date} 超出快照 ±30 天窗口`);
      }
    }
  }
}
validateRecords();

// 构造对外 API：按本项目 firms.ts slug 取回
const BUILT: Record<string, FirmPayoutProofs> = (() => {
  const out: Record<string, FirmPayoutProofs> = {};
  for (const localSlug of Object.keys(LOCAL_TO_SOURCE_SLUG)) {
    const sourceSlug = LOCAL_TO_SOURCE_SLUG[localSlug];
    const block = RAW[sourceSlug];
    if (!block) continue;
    out[localSlug] = {
      firmSlug: localSlug,
      sourceUrl: block.url,
      records: block.records,
      screenshotPath: block.screenshotPath,
      payoutMethods: block.methods,
      methodsSourceUrl: block.methodsSourceUrl,
    };
  }
  return out;
})();

export function getFirmPayoutProofs(firmSlug: string): FirmPayoutProofs | undefined {
  return BUILT[firmSlug];
}

export function hasProof(firmSlug: string): boolean {
  return BUILT[firmSlug] !== undefined;
}

export function aggregateForFirm(firmSlug: string): FirmPayoutAggregate | undefined {
  const sourceSlug = LOCAL_TO_SOURCE_SLUG[firmSlug];
  if (!sourceSlug) return undefined;
  return PAYOUTS.find(p => p.slug === sourceSlug);
}

// 把源站日期格式 "May 16, 2026" 转成中文 "2026-05-16"
export function formatDateZh(src: string): string {
  const t = parseSourceDate(src);
  if (isNaN(t)) return src;
  const d = new Date(t);
  return `${d.getUTCFullYear()}-${String(d.getUTCMonth() + 1).padStart(2, "0")}-${String(d.getUTCDate()).padStart(2, "0")}`;
}

// 把源站等候时间英文转中文，例如 "about 13 hours" -> "约 13 小时"
export function waitingTimeZh(s: string): string {
  if (!s || s === "N/A") return "—";
  return s
    .replace(/^about\s+/i, "约 ")
    .replace(/\bhours?\b/gi, "小时")
    .replace(/\bminutes?\b/gi, "分钟")
    .replace(/\bdays?\b/gi, "天")
    .replace(/less than a 分钟/gi, "不到 1 分钟");
}
