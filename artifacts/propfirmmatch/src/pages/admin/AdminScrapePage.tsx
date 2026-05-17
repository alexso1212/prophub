import { useEffect, useState, useCallback } from "react";
import AdminNav from "./AdminNav";

const API_BASE = import.meta.env.VITE_API_URL ?? "";

interface ScrapeJob {
  id: number;
  firmSlug: string;
  status: string;
  triggeredBy: string | null;
  startedAt: string | null;
  finishedAt: string | null;
  durationMs: number | null;
  sourceUrl: string | null;
  rawSnippet: string | null;
  extractedJson: any;
  confidenceScore: number | null;
  offerId: number | null;
  errorMessage: string | null;
  createdAt: string;
}

interface FirmV2 {
  slug: string;
  name: string;
  scrapeUrl: string | null;
  scrapeEnabled: number;
}

export default function AdminScrapePage() {
  const [firms, setFirms] = useState<FirmV2[]>([]);
  const [jobs, setJobs] = useState<ScrapeJob[]>([]);
  const [running, setRunning] = useState<Record<string, boolean>>({});
  const [error, setError] = useState<string | null>(null);
  const [expanded, setExpanded] = useState<number | null>(null);

  const loadAll = useCallback(async () => {
    try {
      const [fRes, jRes] = await Promise.all([
        fetch(`${API_BASE}/api/admin/firms-v2`, { credentials: "include" }),
        fetch(`${API_BASE}/api/admin/scrape/jobs`, { credentials: "include" }),
      ]);
      if (!fRes.ok) throw new Error(`firms HTTP ${fRes.status}`);
      if (!jRes.ok) throw new Error(`jobs HTTP ${jRes.status}`);
      setFirms(await fRes.json());
      setJobs(await jRes.json());
    } catch (e: any) {
      setError(e?.message ?? "加载失败");
    }
  }, []);

  useEffect(() => {
    loadAll();
    const id = setInterval(loadAll, 5000);
    return () => clearInterval(id);
  }, [loadAll]);

  const triggerScrape = async (slug: string) => {
    setRunning((p) => ({ ...p, [slug]: true }));
    try {
      const res = await fetch(`${API_BASE}/api/admin/scrape/run`, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ slug }),
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        alert(`触发失败: ${err.error || res.status}`);
      }
    } catch (e: any) {
      alert(`网络错误: ${e?.message}`);
    }
    setRunning((p) => ({ ...p, [slug]: false }));
    loadAll();
  };

  const scrapeReady = firms.filter((f) => f.scrapeUrl);

  return (
    <main className="container" style={{ paddingTop: 24 }}>
      <AdminNav />
      <h1 style={{ fontSize: 22, fontWeight: 700, marginBottom: 16 }}>抓取任务监控</h1>
      {error && (
        <div
          style={{
            background: "rgba(239,68,68,0.1)",
            border: "1px solid rgba(239,68,68,0.3)",
            borderRadius: 8,
            padding: "10px 16px",
            color: "#ef4444",
            marginBottom: 16,
          }}
        >
          {error}
        </div>
      )}

      <section style={{ marginBottom: 32 }}>
        <h2 style={{ fontSize: 16, fontWeight: 600, marginBottom: 12 }}>
          已开启抓取的公司 ({scrapeReady.length})
        </h2>
        {scrapeReady.length === 0 ? (
          <div style={{ color: "var(--text-dim)", fontSize: 13 }}>
            还没有公司开启抓取。在"公司管理"里给某家公司设置 scrapeUrl 后即可触发。
          </div>
        ) : (
          <div style={{ display: "grid", gap: 8 }}>
            {scrapeReady.map((f) => (
              <div
                key={f.slug}
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  padding: "10px 14px",
                  background: "var(--card-bg)",
                  border: "1px solid var(--border)",
                  borderRadius: 8,
                }}
              >
                <div>
                  <div style={{ fontWeight: 600 }}>{f.name}</div>
                  <div style={{ fontSize: 11, color: "var(--text-dim)" }}>{f.scrapeUrl}</div>
                </div>
                <button
                  onClick={() => triggerScrape(f.slug)}
                  disabled={running[f.slug]}
                  style={{
                    background: "#a855f7",
                    color: "#fff",
                    border: "none",
                    borderRadius: 6,
                    padding: "6px 14px",
                    cursor: running[f.slug] ? "wait" : "pointer",
                    fontSize: 13,
                    fontWeight: 600,
                  }}
                >
                  {running[f.slug] ? "运行中…" : "▶ 立即抓取"}
                </button>
              </div>
            ))}
          </div>
        )}
      </section>

      <section>
        <h2 style={{ fontSize: 16, fontWeight: 600, marginBottom: 12 }}>
          最近抓取记录 (每 5 秒刷新)
        </h2>
        {jobs.length === 0 ? (
          <div style={{ color: "var(--text-dim)", fontSize: 13 }}>暂无记录。</div>
        ) : (
          <div className="table-wrap">
            <table className="firms-table" style={{ fontSize: 13 }}>
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Firm</th>
                  <th>状态</th>
                  <th>耗时</th>
                  <th>置信度</th>
                  <th>触发者</th>
                  <th>开始时间</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {jobs.map((j) => (
                  <>
                    <tr key={j.id}>
                      <td>#{j.id}</td>
                      <td>{j.firmSlug}</td>
                      <td>
                        <StatusBadge s={j.status} />
                      </td>
                      <td>{j.durationMs != null ? `${j.durationMs}ms` : "—"}</td>
                      <td>{j.confidenceScore != null ? `${j.confidenceScore}%` : "—"}</td>
                      <td>{j.triggeredBy ?? "system"}</td>
                      <td style={{ color: "var(--text-dim)", fontSize: 12 }}>
                        {j.startedAt ? new Date(j.startedAt).toLocaleString() : "—"}
                      </td>
                      <td>
                        <button
                          onClick={() => setExpanded(expanded === j.id ? null : j.id)}
                          style={{
                            background: "transparent",
                            border: "1px solid var(--border)",
                            borderRadius: 4,
                            padding: "3px 8px",
                            fontSize: 11,
                            cursor: "pointer",
                            color: "var(--text)",
                          }}
                        >
                          {expanded === j.id ? "收起" : "详情"}
                        </button>
                      </td>
                    </tr>
                    {expanded === j.id && (
                      <tr>
                        <td colSpan={8} style={{ background: "rgba(0,0,0,0.2)" }}>
                          <div style={{ padding: 12, fontSize: 12, fontFamily: "monospace" }}>
                            {j.errorMessage && (
                              <div style={{ color: "#ef4444", marginBottom: 8 }}>
                                ❌ {j.errorMessage}
                              </div>
                            )}
                            {j.extractedJson && (
                              <details open>
                                <summary style={{ cursor: "pointer", marginBottom: 4 }}>
                                  AI 提取结果
                                </summary>
                                <pre style={{ whiteSpace: "pre-wrap", color: "#a855f7" }}>
                                  {JSON.stringify(j.extractedJson, null, 2)}
                                </pre>
                              </details>
                            )}
                            {j.rawSnippet && (
                              <details>
                                <summary style={{ cursor: "pointer", marginTop: 8 }}>
                                  原始页面片段 (前 2000 字)
                                </summary>
                                <pre style={{ whiteSpace: "pre-wrap", color: "var(--text-dim)" }}>
                                  {j.rawSnippet}
                                </pre>
                              </details>
                            )}
                          </div>
                        </td>
                      </tr>
                    )}
                  </>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </main>
  );
}

function StatusBadge({ s }: { s: string }) {
  const colors: Record<string, string> = {
    queued: "var(--text-dim)",
    running: "#3b82f6",
    extracted: "#a855f7",
    no_change: "#22c55e",
    failed: "#ef4444",
  };
  return (
    <span
      style={{
        padding: "2px 8px",
        borderRadius: 999,
        fontSize: 11,
        background: `${colors[s] ?? "#888"}22`,
        color: colors[s] ?? "var(--text)",
        fontWeight: 600,
      }}
    >
      {s}
    </span>
  );
}
