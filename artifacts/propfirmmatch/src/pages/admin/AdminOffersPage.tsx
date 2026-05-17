import { useEffect, useState, useCallback } from "react";
import AdminNav from "./AdminNav";

const API_BASE = import.meta.env.VITE_API_URL ?? "";

interface Offer {
  id: number;
  firmSlug: string;
  discountPercent: number | null;
  code: string | null;
  label: string | null;
  validUntil: string | null;
  affiliateUrl: string | null;
  sourceUrl: string | null;
  sourceType: string;
  status: string;
  confidenceScore: number | null;
  notes: string | null;
  createdBy: string | null;
  reviewedBy: string | null;
  publishedAt: string | null;
  createdAt: string;
  updatedAt: string;
}

interface QueueCard {
  draft: Offer;
  current: Offer | null;
}

const STATUS_TABS: { key: string; label: string }[] = [
  { key: "queue", label: "待审核 (Diff)" },
  { key: "draft", label: "草稿" },
  { key: "published", label: "已发布" },
  { key: "rejected", label: "已驳回" },
  { key: "expired", label: "已归档" },
];

export default function AdminOffersPage() {
  const [tab, setTab] = useState("queue");
  const [items, setItems] = useState<Offer[] | QueueCard[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const url =
        tab === "queue"
          ? `${API_BASE}/api/admin/offers/queue`
          : `${API_BASE}/api/admin/offers?status=${tab}`;
      const res = await fetch(url, { credentials: "include" });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      setItems(await res.json());
    } catch (e: any) {
      setError(e?.message || "加载失败");
    }
    setLoading(false);
  }, [tab]);

  useEffect(() => {
    load();
  }, [load]);

  const approve = async (id: number) => {
    await fetch(`${API_BASE}/api/admin/offers/${id}/approve`, {
      method: "POST",
      credentials: "include",
    });
    load();
  };
  const reject = async (id: number) => {
    const reason = prompt("驳回原因（会作为反馈喂给 AI）") || "";
    await fetch(`${API_BASE}/api/admin/offers/${id}/reject`, {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ reason }),
    });
    load();
  };
  const rollback = async (firmSlug: string) => {
    if (!confirm(`确认回滚 ${firmSlug} 到上一个已发布的版本？当前正式版会被归档。`)) return;
    const res = await fetch(`${API_BASE}/api/admin/offers/rollback/${firmSlug}`, {
      method: "POST",
      credentials: "include",
    });
    if (!res.ok) {
      const j = await res.json().catch(() => ({}));
      alert(`回滚失败：${j.error ?? res.status}`);
    }
    load();
  };
  const editAndApprove = async (offer: Offer) => {
    const code = prompt("优惠码", offer.code ?? "") ?? offer.code;
    const pct = prompt("折扣 %", String(offer.discountPercent ?? "")) ?? "";
    await fetch(`${API_BASE}/api/admin/offers/${offer.id}`, {
      method: "PATCH",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ code, discountPercent: pct ? Number(pct) : null }),
    });
    await approve(offer.id);
  };

  return (
    <main className="container" style={{ paddingTop: 24 }}>
      <AdminNav />
      <h1 style={{ fontSize: 22, fontWeight: 700, marginBottom: 16 }}>优惠管理</h1>
      <div style={{ display: "flex", gap: 8, marginBottom: 20, flexWrap: "wrap" }}>
        {STATUS_TABS.map((t) => (
          <button
            key={t.key}
            onClick={() => setTab(t.key)}
            style={{
              padding: "6px 14px",
              borderRadius: 999,
              fontSize: 13,
              border: "1px solid var(--border)",
              background: tab === t.key ? "#a855f7" : "var(--card-bg)",
              color: tab === t.key ? "#fff" : "var(--text)",
              cursor: "pointer",
              fontWeight: tab === t.key ? 600 : 400,
            }}
          >
            {t.label}
          </button>
        ))}
      </div>

      {error && <ErrorBox text={error} />}
      {loading ? (
        <div style={{ textAlign: "center", padding: 40, color: "var(--text-dim)" }}>加载中…</div>
      ) : tab === "queue" ? (
        <QueueView cards={items as QueueCard[]} onApprove={approve} onReject={reject} onEdit={editAndApprove} />
      ) : (
        <OffersTable
          rows={items as Offer[]}
          onRollback={tab === "published" ? rollback : undefined}
        />
      )}
    </main>
  );
}

function ErrorBox({ text }: { text: string }) {
  return (
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
      {text}
    </div>
  );
}

function QueueView({
  cards,
  onApprove,
  onReject,
  onEdit,
}: {
  cards: QueueCard[];
  onApprove: (id: number) => void;
  onReject: (id: number) => void;
  onEdit: (o: Offer) => void;
}) {
  if (!cards || cards.length === 0) {
    return (
      <div style={{ textAlign: "center", padding: 40, color: "var(--text-dim)" }}>
        🎉 没有待审核的优惠草稿。
      </div>
    );
  }
  return (
    <div style={{ display: "grid", gap: 16 }}>
      {cards.map(({ draft, current }) => (
        <div
          key={draft.id}
          style={{
            border: "1px solid var(--border)",
            borderRadius: 12,
            padding: 16,
            background: "var(--card-bg)",
          }}
        >
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 12 }}>
            <div>
              <div style={{ fontSize: 16, fontWeight: 700 }}>{draft.firmSlug}</div>
              <div style={{ fontSize: 12, color: "var(--text-dim)" }}>
                来源: {draft.sourceType} · 置信度:{" "}
                <span
                  style={{
                    color:
                      (draft.confidenceScore ?? 0) >= 0.8
                        ? "#22c55e"
                        : (draft.confidenceScore ?? 0) >= 0.5
                          ? "#eab308"
                          : "#ef4444",
                  }}
                >
                  {draft.confidenceScore != null ? Math.round(draft.confidenceScore * 100) : "?"}%
                </span>
              </div>
            </div>
            <div style={{ display: "flex", gap: 8 }}>
              <button
                onClick={() => onApprove(draft.id)}
                style={btnStyle("#a855f7", "#fff")}
              >
                ✅ 一键发布
              </button>
              <button onClick={() => onEdit(draft)} style={btnStyle("transparent", "var(--text)")}>
                ✏️ 改后发布
              </button>
              <button onClick={() => onReject(draft.id)} style={btnStyle("transparent", "#ef4444")}>
                ❌ 驳回
              </button>
            </div>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
            <DiffCol title="当前线上" offer={current} />
            <DiffCol title="AI 抓取草稿" offer={draft} highlight />
          </div>
          {draft.notes && (
            <div
              style={{
                marginTop: 12,
                fontSize: 12,
                color: "var(--text-dim)",
                padding: 8,
                background: "rgba(168,85,247,0.05)",
                borderRadius: 6,
              }}
            >
              📝 {draft.notes}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

function DiffCol({ title, offer, highlight }: { title: string; offer: Offer | null; highlight?: boolean }) {
  return (
    <div
      style={{
        border: highlight ? "1px solid rgba(168,85,247,0.4)" : "1px solid var(--border)",
        borderRadius: 8,
        padding: 12,
        background: highlight ? "rgba(168,85,247,0.05)" : "transparent",
      }}
    >
      <div style={{ fontSize: 11, color: "var(--text-dim)", marginBottom: 8 }}>{title}</div>
      {!offer ? (
        <div style={{ color: "var(--text-dim)", fontSize: 13 }}>—</div>
      ) : (
        <div style={{ fontSize: 13, lineHeight: 1.8 }}>
          <div>
            <strong>折扣:</strong> {offer.discountPercent ?? "—"}%
          </div>
          <div>
            <strong>优惠码:</strong>{" "}
            <code style={{ background: "rgba(0,0,0,0.3)", padding: "2px 6px", borderRadius: 4 }}>
              {offer.code ?? "—"}
            </code>
          </div>
          <div>
            <strong>标签:</strong> {offer.label ?? "—"}
          </div>
          <div>
            <strong>有效期至:</strong>{" "}
            {offer.validUntil ? new Date(offer.validUntil).toLocaleDateString() : "—"}
          </div>
        </div>
      )}
    </div>
  );
}

function OffersTable({
  rows,
  onRollback,
}: {
  rows: Offer[];
  onRollback?: (firmSlug: string) => void;
}) {
  if (!rows || rows.length === 0) {
    return (
      <div style={{ textAlign: "center", padding: 40, color: "var(--text-dim)" }}>暂无记录。</div>
    );
  }
  return (
    <div className="table-wrap">
      <table className="firms-table" style={{ fontSize: 13 }}>
        <thead>
          <tr>
            <th>Firm</th>
            <th>折扣</th>
            <th>优惠码</th>
            <th>来源</th>
            <th>状态</th>
            <th>置信度</th>
            <th>更新于</th>
            {onRollback && <th>操作</th>}
          </tr>
        </thead>
        <tbody>
          {rows.map((o) => (
            <tr key={o.id}>
              <td>{o.firmSlug}</td>
              <td>{o.discountPercent ?? "—"}%</td>
              <td>
                <code style={{ fontSize: 12 }}>{o.code ?? "—"}</code>
              </td>
              <td>{o.sourceType}</td>
              <td>{o.status}</td>
              <td>{o.confidenceScore != null ? `${Math.round(o.confidenceScore * 100)}%` : "—"}</td>
              <td style={{ color: "var(--text-dim)", fontSize: 12 }}>
                {new Date(o.updatedAt).toLocaleString()}
              </td>
              {onRollback && (
                <td>
                  <button onClick={() => onRollback(o.firmSlug)} style={btnStyle("#f59e0b", "#000")}>
                    回滚上一版
                  </button>
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function btnStyle(bg: string, color: string): React.CSSProperties {
  return {
    background: bg,
    color,
    border: "1px solid var(--border)",
    borderRadius: 6,
    padding: "6px 12px",
    cursor: "pointer",
    fontSize: 12,
    fontWeight: 600,
  };
}
