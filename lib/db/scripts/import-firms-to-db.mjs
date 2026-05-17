// One-shot: seed firms + initial published offers from firms.ts into the DB.
// Run from repo root:  node lib/db/scripts/import-firms-to-db.mjs
// (Script lives under lib/db/ so it can resolve `pg` from lib/db/node_modules.)
//
// Idempotent: uses upsert. Only inserts a published offer for a firm if none exists.

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import pg from "pg";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "../../..");
const FIRMS_TS = path.join(ROOT, "artifacts/propfirmmatch/src/data/firms.ts");

if (!process.env.DATABASE_URL) {
  console.error("DATABASE_URL not set");
  process.exit(1);
}

const { Pool } = pg;
const pool = new Pool({ connectionString: process.env.DATABASE_URL });

const src = fs.readFileSync(FIRMS_TS, "utf8");

// Brace-aware extractor: slice each top-level firm object literal from the array.
function sliceTopLevelObjects(s, startMarker) {
  const startIdx = s.indexOf(startMarker);
  if (startIdx === -1) return [];
  // Find the assignment '=' first, then the next '[' which is the array literal.
  const eqIdx = s.indexOf("=", startIdx);
  if (eqIdx === -1) return [];
  const arrOpen = s.indexOf("[", eqIdx);
  if (arrOpen === -1) return [];
  const out = [];
  let i = arrOpen + 1;
  while (i < s.length) {
    while (i < s.length && /[\s,]/.test(s[i])) i++;
    if (s[i] === "]") break;
    if (s[i] !== "{") { i++; continue; }
    let depth = 1, j = i + 1, inStr = null;
    while (j < s.length && depth > 0) {
      const c = s[j];
      if (inStr) {
        if (c === "\\") { j += 2; continue; }
        if (c === inStr) inStr = null;
      } else {
        if (c === '"' || c === "'" || c === "`") inStr = c;
        else if (c === "{") depth++;
        else if (c === "}") depth--;
      }
      j++;
    }
    out.push(s.slice(i, j));
    i = j;
  }
  return out;
}

const blocks = sliceTopLevelObjects(src, "export const firms");
console.log(`Found ${blocks.length} firm blocks`);

function pick(block, key) {
  const re = new RegExp(`(?:^|[,{\\s])${key}:\\s*("(?:[^"\\\\]|\\\\.)*"|'(?:[^'\\\\]|\\\\.)*'|[\\-\\d.]+|true|false|null)`, "m");
  const m = re.exec(block);
  if (!m) return null;
  let v = m[1];
  if (v === "null") return null;
  if (v === "true") return true;
  if (v === "false") return false;
  if (/^[\-\d.]+$/.test(v)) return Number(v);
  // strip quotes & unescape
  return v.slice(1, -1).replace(/\\"/g, '"').replace(/\\n/g, "\n").replace(/\\'/g, "'");
}

const firms = blocks.map((b) => ({
  slug: pick(b, "slug"),
  name: pick(b, "name"),
  logo: pick(b, "logo"),
  country: pick(b, "country"),
  countryCode: pick(b, "countryCode"),
  affiliateUrl: pick(b, "affiliateUrl"),
  promoCode: pick(b, "promoCode"),
  promoPercent: pick(b, "promoPercent"),
  promoLabel: pick(b, "promoLabel"),
})).filter((f) => f.slug && f.name);

console.log(`Parsed ${firms.length} firms`);
console.log("Sample:", firms[0]);

const client = await pool.connect();
let inserted = 0, updated = 0, offersInserted = 0;
try {
  await client.query("BEGIN");
  for (const f of firms) {
    const scrapeUrl =
      f.slug === "apex" ? "https://apextraderfunding.com/" : null;
    const res = await client.query(
      `INSERT INTO firms (slug, name, logo, country, country_code, affiliate_base_url, scrape_url, scrape_enabled, status, updated_at)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,'active',NOW())
       ON CONFLICT (slug) DO UPDATE SET
         name = EXCLUDED.name,
         logo = EXCLUDED.logo,
         country = EXCLUDED.country,
         country_code = EXCLUDED.country_code,
         affiliate_base_url = EXCLUDED.affiliate_base_url,
         updated_at = NOW()
       RETURNING (xmax = 0) AS inserted`,
      [f.slug, f.name, f.logo, f.country, f.countryCode, f.affiliateUrl ?? null, scrapeUrl, scrapeUrl ? 1 : 0],
    );
    if (res.rows[0]?.inserted) inserted++; else updated++;

    // Initial published offer if none exists
    const existing = await client.query(
      `SELECT id FROM offers WHERE firm_slug = $1 AND status = 'published' LIMIT 1`,
      [f.slug],
    );
    if (existing.rowCount === 0 && (f.promoCode || f.promoPercent)) {
      await client.query(
        `INSERT INTO offers (firm_slug, discount_percent, code, label, affiliate_url, source_type, status, confidence_score, created_by, published_at, updated_at)
         VALUES ($1,$2,$3,$4,$5,'manual','published',1.0,'import',NOW(),NOW())`,
        [
          f.slug,
          f.promoPercent ?? null,
          f.promoCode ?? null,
          f.promoLabel ?? null,
          f.affiliateUrl ?? null,
        ],
      );
      offersInserted++;
    }
  }
  await client.query("COMMIT");
} catch (e) {
  await client.query("ROLLBACK");
  throw e;
} finally {
  client.release();
}

console.log(`Done. Firms inserted=${inserted} updated=${updated}. Initial published offers=${offersInserted}`);
await pool.end();
