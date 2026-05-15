type Category = "forex" | "crypto";

const META: Record<Category, { label: string; icon: string; desc: string; sourcePath: string }> = {
  forex: {
    label: "外汇",
    icon: "💱",
    desc: "外汇自营公司榜单即将上线，我们正在整理全球主流外汇 Prop Firm 的挑战赛、点差与出金数据。",
    sourcePath: "forex/all-prop-firms",
  },
  crypto: {
    label: "加密",
    icon: "₿",
    desc: "加密自营公司榜单即将上线，敬请期待对加密 Prop Firm 的全方位对比与真实评价。",
    sourcePath: "crypto/all-prop-firms",
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
        <a
          className="btn-pill primary"
          href={`https://propfirmmatch.com/${m.sourcePath}`}
          target="_blank"
          rel="noreferrer"
          style={{ display: "inline-flex", padding: "10px 22px" }}
        >
          前往源站查看 {m.label} 公司 →
        </a>
      </div>
    </main>
  );
}
