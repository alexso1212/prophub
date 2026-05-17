import { Link, useLocation } from "wouter";

const basePath = import.meta.env.BASE_URL.replace(/\/$/, "");

const tabs = [
  { href: "/admin/firms", label: "公司管理" },
  { href: "/admin/offers", label: "优惠审核" },
  { href: "/admin/scrape", label: "抓取监控" },
];

export default function AdminNav() {
  const [path] = useLocation();
  return (
    <div
      style={{
        display: "flex",
        gap: 4,
        borderBottom: "1px solid var(--border)",
        marginBottom: 20,
        flexWrap: "wrap",
      }}
    >
      <Link
        href="/"
        style={{
          color: "var(--text-muted)",
          textDecoration: "none",
          fontSize: 13,
          padding: "10px 14px",
        }}
      >
        ← 返回站点
      </Link>
      {tabs.map((t) => {
        const active = path.startsWith(t.href);
        return (
          <Link
            key={t.href}
            href={t.href}
            style={{
              padding: "10px 16px",
              fontSize: 14,
              fontWeight: active ? 700 : 500,
              color: active ? "#a855f7" : "var(--text)",
              textDecoration: "none",
              borderBottom: active ? "2px solid #a855f7" : "2px solid transparent",
              marginBottom: -1,
            }}
          >
            {t.label}
          </Link>
        );
      })}
      <div style={{ flex: 1 }} />
      <a
        href={`${basePath}/admin/firms`}
        style={{ fontSize: 12, color: "var(--text-dim)", alignSelf: "center", paddingRight: 8 }}
      >
        Prophub Admin
      </a>
    </div>
  );
}
