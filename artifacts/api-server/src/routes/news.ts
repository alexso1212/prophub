import { Router, type IRouter } from "express";
import { MockNewsSource } from "../news/mockSource";
import type { NewsCategory } from "../news/types";
import { rewriteAll } from "../news/translator";
import { logger } from "../lib/logger";

const router: IRouter = Router();
const source = new MockNewsSource();

const VALID_CATS = new Set<NewsCategory>(["forex", "futures", "indices", "crypto"]);

router.get("/news", async (req, res) => {
  const rawCat = typeof req.query.category === "string" ? req.query.category : undefined;
  const category = rawCat && VALID_CATS.has(rawCat as NewsCategory) ? (rawCat as NewsCategory) : undefined;
  const limit = Math.min(50, Math.max(1, Number(req.query.limit) || 30));

  try {
    const raw = await source.fetch({ category, limit });
    const translated = await rewriteAll(raw);
    const items = translated.map(n => ({
      id: n.id,
      publishedAt: n.publishedAt,
      sourceLabel: n.sourceLabel,
      category: n.category,
      tickers: n.tickers,
      titleZh: n.titleZh,
      summaryZh: n.summaryZh,
      takeawaysZh: n.takeawaysZh,
      originalUrl: n.originalUrl,
    }));
    res.json({ items });
  } catch (err) {
    logger.error({ err }, "news endpoint failed");
    res.status(500).json({ items: [], error: "news_unavailable" });
  }
});

export default router;
