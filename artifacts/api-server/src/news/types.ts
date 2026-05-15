export type NewsCategory = "forex" | "futures" | "indices" | "crypto";

export interface RawNewsItem {
  id: string;
  publishedAt: string;
  sourceLabel: string;
  category: NewsCategory;
  tickers: string[];
  titleEn: string;
  bodyEn: string;
  originalUrl: string;
}

export interface NewsItem {
  id: string;
  publishedAt: string;
  sourceLabel: string;
  category: NewsCategory;
  tickers: string[];
  titleZh: string;
  summaryZh: string;
  takeawaysZh: string[];
  originalUrl: string;
}

export interface NewsSource {
  fetch(opts?: { category?: NewsCategory; limit?: number }): Promise<RawNewsItem[]>;
}
