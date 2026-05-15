import { useRoute, Link } from "wouter";
import { findFirmAnyCategory } from "../contexts/CategoryContext";
import { getBrandZh } from "../data/brandZh";

export default function GoPage() {
  const [, params] = useRoute("/go/:slug");
  const slug = params?.slug ?? "";
  const found = findFirmAnyCategory(slug);
  const firm = found?.firm;
  const category = found?.category ?? "futures";
  const brandZh = firm ? getBrandZh(firm.slug) : "";

  return (
    <main className="container" style={{ maxWidth: 640 }}>
      <div
        style={{
          marginTop: 40,
          padding: "32px 28px",
          border: "1px solid var(--border)",
          borderRadius: 16,
          background: "var(--card)",
          textAlign: "center",
        }}
      >
        {firm && (
          <div className="firm-logo-sm" style={{ width: 72, height: 72, margin: "0 auto 18px" }}>
            <img src={firm.logo} alt={firm.name} />
          </div>
        )}
        <div style={{ fontSize: 20, fontWeight: 700, color: "var(--text)", marginBottom: 8 }}>
          {firm ? `前往 ${brandZh || firm.name}` : "合作页面"}
        </div>
        <p style={{ color: "var(--text-dim)", fontSize: 14, lineHeight: 1.7, marginBottom: 22 }}>
          我们正在与该公司洽谈官方合作通道，开通后此处会跳转到我们的专属返现链接。
          在此之前，建议你先回到详情页查看完整规则、用户评价和出金记录。
        </p>
        <div style={{ display: "flex", justifyContent: "center", gap: 10, flexWrap: "wrap" }}>
          {firm && (
            <Link href={`/${category}/prop-firms/${firm.slug}`} className="btn-buy">
              查看公司详情
            </Link>
          )}
          <Link href={`/${category}/all-prop-firms`} className="btn-pill">
            浏览同类公司
          </Link>
        </div>
        {firm?.promoCode && firm.promoCode !== "" && (
          <div
            style={{
              marginTop: 22,
              padding: "10px 14px",
              border: "1px dashed var(--border)",
              borderRadius: 8,
              fontSize: 13,
              color: "var(--text-muted)",
            }}
          >
            未来下单时记得使用我们的优惠码 <strong style={{ color: "var(--orange)" }}>{firm.promoCode}</strong>
          </div>
        )}
      </div>
      <p style={{ color: "var(--text-muted)", fontSize: 12, textAlign: "center", marginTop: 16 }}>
        ※ 演示数据：合作链接尚未启用。
      </p>
    </main>
  );
}
