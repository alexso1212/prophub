import { Link } from "wouter";

type Category = "forex" | "crypto";

const META: Record<Category, { label: string; icon: string; desc: string }> = {
  forex: {
    label: "外汇",
    icon: "💱",
    desc: "外汇自营公司榜单即将上线，我们正在整理全球主流外汇 Prop Firm 的挑战赛、点差与出金数据。",
  },
  crypto: {
    label: "加密",
    icon: "₿",
    desc: "加密自营公司榜单即将上线，敬请期待对加密 Prop Firm 的全方位对比与真实评价。",
  },
};

export default function CategoryComingSoonPage({ category }: { category: Category }) {
  const m = META[category];
  return (
    <main className="container" style={{ minHeight: "60vh", display: "grid", placeItems: "center", padding: "60px 24px" }}>
      <div
        style={{
          background: "var(--card-2)",
          border: "1px solid var(--card-border)",
          borderRadius: 16,
          padding: "48px 36px",
          maxWidth: 520,
          width: "100%",
          textAlign: "center",
        }}
      >
        <div
          style={{
            width: 72,
            height: 72,
            margin: "0 auto 18px",
            borderRadius: 16,
            background: "var(--gradient-pp-2)",
            display: "grid",
            placeItems: "center",
            fontSize: 36,
          }}
          aria-hidden
        >
          {m.icon}
        </div>
        <h1 style={{ margin: "0 0 8px", fontSize: 26 }}>{m.label} · 敬请期待</h1>
        <p style={{ color: "var(--text-dim)", fontSize: 14, lineHeight: 1.7, margin: "0 0 24px" }}>
          {m.desc}
        </p>
        <Link
          href="/futures/all-prop-firms"
          className="btn-pill primary"
          style={{ display: "inline-flex", padding: "10px 22px" }}
        >
          先去看看期货板块 →
        </Link>
      </div>
    </main>
  );
}
