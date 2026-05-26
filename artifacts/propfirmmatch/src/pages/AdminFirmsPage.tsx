import { useEffect, useState, useCallback } from "react";
import { useClerk, useUser } from "@clerk/react";
import { Link } from "wouter";
import { firms as localFirms } from "../data/firms";

interface FirmOverride {
  slug: string;
  affiliateUrl: string | null;
  promoCode: string | null;
  promoPercent: number | null;
  promoLabel: string | null;
  discountPercent: number | null;
  updatedAt: string | null;
}

function formatRelativeTime(iso: string | null): string {
  if (!iso) return "—";
  const then = new Date(iso).getTime();
  if (Number.isNaN(then)) return "—";
  const diffSec = Math.round((Date.now() - then) / 1000);
  if (diffSec < 60) return "just now";
  const mins = Math.round(diffSec / 60);
  if (mins < 60) return `${mins} minute${mins === 1 ? "" : "s"} ago`;
  const hours = Math.round(mins / 60);
  if (hours < 24) return `${hours} hour${hours === 1 ? "" : "s"} ago`;
  const days = Math.round(hours / 24);
  if (days < 30) return `${days} day${days === 1 ? "" : "s"} ago`;
  const months = Math.round(days / 30);
  if (months < 12) return `${months} month${months === 1 ? "" : "s"} ago`;
  const years = Math.round(days / 365);
  return `${years} year${years === 1 ? "" : "s"} ago`;
}

interface EditState {
  affiliateUrl: string;
  promoCode: string;
  promoPercent: string;
  promoLabel: string;
  discountPercent: string;
}

interface Props {
  clerkEnabled?: boolean;
}

const API_BASE = import.meta.env.VITE_API_URL ?? "";
const basePath = import.meta.env.BASE_URL.replace(/\/$/, "");

const inputStyle: React.CSSProperties = {
  width: "100%",
  padding: "5px 8px",
  borderRadius: 6,
  border: "1px solid var(--border)",
  background: "var(--card-bg)",
  color: "var(--text)",
  fontSize: 12,
  boxSizing: "border-box",
};

function FirmsTable() {
  const [overrides, setOverrides] = useState<FirmOverride[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [editStates, setEditStates] = useState<Record<string, EditState>>({});
  const [saving, setSaving] = useState<Record<string, boolean>>({});
  const [saved, setSaved] = useState<Record<string, boolean>>({});
  const [search, setSearch] = useState("");

  const fetchOverrides = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`${API_BASE}/api/admin/firms`, {
        credentials: "include",
      });
      if (res.status === 401) {
        setError("Not authenticated. Please sign in.");
        setLoading(false);
        return;
      }
      if (res.status === 403) {
        setError("Access denied. Your account is not in the admin whitelist.");
        setLoading(false);
        return;
      }
      if (res.status === 503) {
        setError(
          "Auth not configured yet. Please set up Clerk authentication via the Auth pane in the Replit workspace, then add ADMIN_EMAILS to your environment variables.",
        );
        setLoading(false);
        return;
      }
      if (!res.ok) {
        setError("Failed to load data.");
        setLoading(false);
        return;
      }
      const data: FirmOverride[] = await res.json();
      setOverrides(data);
      const initial: Record<string, EditState> = {};
      for (const o of data) {
        initial[o.slug] = {
          affiliateUrl: o.affiliateUrl ?? "",
          promoCode: o.promoCode ?? "",
          promoPercent: o.promoPercent?.toString() ?? "",
          promoLabel: o.promoLabel ?? "",
          discountPercent: o.discountPercent?.toString() ?? "",
        };
      }
      setEditStates(initial);
    } catch {
      setError("Network error. Is the API server running?");
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchOverrides();
  }, [fetchOverrides]);

  const handleChange = (slug: string, field: keyof EditState, value: string) => {
    setEditStates((prev) => ({
      ...prev,
      [slug]: { ...prev[slug], [field]: value },
    }));
  };

  const handleSave = async (slug: string) => {
    const state = editStates[slug];
    if (!state) return;
    setSaving((p) => ({ ...p, [slug]: true }));
    try {
      const res = await fetch(`${API_BASE}/api/admin/firms/${slug}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          affiliateUrl: state.affiliateUrl,
          promoCode: state.promoCode,
          promoPercent: state.promoPercent ? parseInt(state.promoPercent, 10) : 0,
          promoLabel: state.promoLabel,
          discountPercent: state.discountPercent === "" ? null : parseInt(state.discountPercent, 10),
        }),
      });
      if (res.ok) {
        const updated: FirmOverride = await res.json();
        setOverrides((prev) => prev.map((o) => (o.slug === slug ? updated : o)));
        setSaved((p) => ({ ...p, [slug]: true }));
        setTimeout(() => setSaved((p) => ({ ...p, [slug]: false })), 2000);
      } else {
        alert("Save failed.");
      }
    } catch {
      alert("Network error.");
    }
    setSaving((p) => ({ ...p, [slug]: false }));
  };

  const filteredFirms = localFirms.filter((f) =>
    f.name.toLowerCase().includes(search.toLowerCase()),
  );
  const overridesBySlug: Record<string, FirmOverride> = {};
  for (const o of overrides) overridesBySlug[o.slug] = o;

  if (error) {
    return (
      <div
        style={{
          background: "rgba(239,68,68,0.1)",
          border: "1px solid rgba(239,68,68,0.3)",
          borderRadius: 8,
          padding: "12px 16px",
          color: "#ef4444",
        }}
      >
        {error}
      </div>
    );
  }

  return (
    <>
      <input
        type="text"
        placeholder="Search firms..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        style={{
          width: "100%",
          maxWidth: 400,
          padding: "8px 14px",
          borderRadius: 8,
          border: "1px solid var(--border)",
          background: "var(--card-bg)",
          color: "var(--text)",
          fontSize: 14,
          marginBottom: 20,
          boxSizing: "border-box",
        }}
      />
      {loading ? (
        <div style={{ color: "var(--text-dim)", padding: 40, textAlign: "center" }}>
          Loading…
        </div>
      ) : (
        <div className="table-wrap">
          <div className="table-scroll-hint" aria-hidden="true">← 左右滑动查看更多 →</div>
          <table className="firms-table" style={{ fontSize: 13 }}>
            <thead>
              <tr>
                <th>Firm</th>
                <th>Affiliate URL</th>
                <th>Promo Code</th>
                <th style={{ width: 100 }}>Display Discount %</th>
                <th style={{ width: 90 }}>Promo %</th>
                <th style={{ width: 120 }}>Label</th>
                <th style={{ width: 110 }}>Last updated</th>
                <th style={{ width: 80 }}>Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredFirms.map((firm) => {
                const state = editStates[firm.slug] ?? {
                  affiliateUrl: "",
                  promoCode: "",
                  promoPercent: "",
                  promoLabel: "",
                  discountPercent: "",
                };
                return (
                  <tr key={firm.slug}>
                    <td className="firm-col">
                      <div className="cell-firm" style={{ gap: 8 }}>
                        <div className="firm-logo-sm" style={{ width: 32, height: 32 }}>
                          <img src={firm.logo} alt={firm.name} />
                        </div>
                        <div>
                          <div style={{ fontWeight: 600, fontSize: 13 }}>{firm.name}</div>
                          <div style={{ color: "var(--text-dim)", fontSize: 11 }}>{firm.slug}</div>
                        </div>
                      </div>
                    </td>
                    <td>
                      <input
                        type="url"
                        placeholder="https://..."
                        value={state.affiliateUrl}
                        onChange={(e) => handleChange(firm.slug, "affiliateUrl", e.target.value)}
                        style={inputStyle}
                      />
                    </td>
                    <td>
                      <input
                        type="text"
                        placeholder="e.g. MATCH"
                        value={state.promoCode}
                        onChange={(e) => handleChange(firm.slug, "promoCode", e.target.value)}
                        style={{ ...inputStyle, width: 100 }}
                      />
                    </td>
                    <td>
                      <input
                        type="number"
                        min={0}
                        max={100}
                        placeholder={String(firm.promoPercent ?? 0)}
                        value={state.discountPercent}
                        onChange={(e) => handleChange(firm.slug, "discountPercent", e.target.value)}
                        style={{ ...inputStyle, width: 80 }}
                      />
                    </td>
                    <td>
                      <input
                        type="number"
                        min={0}
                        max={100}
                        placeholder="0"
                        value={state.promoPercent}
                        onChange={(e) => handleChange(firm.slug, "promoPercent", e.target.value)}
                        style={{ ...inputStyle, width: 70 }}
                      />
                    </td>
                    <td>
                      <input
                        type="text"
                        placeholder="e.g. SPECIAL"
                        value={state.promoLabel}
                        onChange={(e) => handleChange(firm.slug, "promoLabel", e.target.value)}
                        style={{ ...inputStyle, width: 100 }}
                      />
                    </td>
                    <td style={{ color: "var(--text-dim)", fontSize: 12, whiteSpace: "nowrap" }}>
                      {formatRelativeTime(overridesBySlug[firm.slug]?.updatedAt ?? null)}
                    </td>
                    <td>
                      <button
                        onClick={() => handleSave(firm.slug)}
                        disabled={saving[firm.slug]}
                        style={{
                          background: saved[firm.slug]
                            ? "rgba(34,197,94,0.15)"
                            : "var(--orange)",
                          color: saved[firm.slug] ? "#22c55e" : "#000",
                          border: "none",
                          borderRadius: 6,
                          padding: "5px 12px",
                          cursor: "pointer",
                          fontWeight: 600,
                          fontSize: 12,
                          whiteSpace: "nowrap",
                        }}
                      >
                        {saving[firm.slug] ? "…" : saved[firm.slug] ? "✓ Saved" : "Save"}
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </>
  );
}

export default function AdminFirmsPage({ clerkEnabled = false }: Props) {
  return (
    <main className="container" style={{ paddingTop: 24 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 24 }}>
        <Link href="/" style={{ color: "var(--text-muted)", textDecoration: "none", fontSize: 14 }}>
          ← Back to site
        </Link>
        <h1 style={{ fontSize: 22, fontWeight: 700, flex: 1 }}>Admin — Firms Management</h1>
        {clerkEnabled && <ClerkUserBar />}
      </div>

      {!clerkEnabled && (
        <div
          style={{
            background: "rgba(168,85,247,0.08)",
            border: "1px solid rgba(168,85,247,0.25)",
            borderRadius: 8,
            padding: "10px 16px",
            color: "#a855f7",
            marginBottom: 16,
            fontSize: 13,
          }}
        >
          Clerk auth is not configured yet. Open the Auth pane in the Replit workspace to enable login
          protection, then set <strong>ADMIN_EMAILS</strong> in Secrets to your email address.
        </div>
      )}

      <FirmsTable />
    </main>
  );
}

function ClerkUserBar() {
  const { signOut } = useClerk();
  const { user } = useUser();
  if (!user) return null;
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
      <span style={{ fontSize: 13, color: "var(--text-dim)" }}>
        {user.primaryEmailAddress?.emailAddress}
      </span>
      <button
        onClick={() => signOut({ redirectUrl: basePath || "/" })}
        style={{
          background: "transparent",
          border: "1px solid var(--border)",
          borderRadius: 6,
          padding: "6px 14px",
          color: "var(--text-muted)",
          cursor: "pointer",
          fontSize: 13,
        }}
      >
        Sign out
      </button>
    </div>
  );
}
