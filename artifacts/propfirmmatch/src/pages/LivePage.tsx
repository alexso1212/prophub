import { useCategoryMeta } from "../contexts/CategoryContext";
import { TvIcon, PlayIcon } from "../components/icons";

export default function LivePage() {
  const meta = useCategoryMeta();
  return (
    <main className="container">
      <div className="section-title"><TvIcon size={18} className="icon" /> 直播间 · {meta.label}</div>
      <p style={{ color: "var(--text-dim)", marginBottom: 18, maxWidth: 720 }}>
        每天与合作公司联合直播实盘交易、挑战赛策略和复盘讲解。开播时间将通过站内通知和邮件提醒。
      </p>

      <div
        className="rule-card"
        style={{
          display: "grid",
          gridTemplateColumns: "minmax(260px, 1fr)",
          gap: 18,
          padding: 0,
          overflow: "hidden",
        }}
      >
        <div
          style={{
            background: "linear-gradient(135deg, #1a1730, #2a1745)",
            aspectRatio: "16 / 9",
            display: "grid",
            placeItems: "center",
            position: "relative",
          }}
        >
          <div
            style={{
              position: "absolute", top: 14, left: 14,
              display: "inline-flex", alignItems: "center", gap: 6,
              background: "#ef4444", color: "#fff",
              padding: "4px 10px", borderRadius: 999,
              fontSize: 11, fontWeight: 700, letterSpacing: ".08em",
            }}
          >
            <span style={{ width: 8, height: 8, borderRadius: "50%", background: "#fff" }} />
            LIVE
          </div>
          <div style={{ textAlign: "center", color: "var(--text-dim)" }}>
            <div style={{ marginBottom: 12, color: "var(--text-muted)" }}><PlayIcon size={56} /></div>
            <div style={{ fontSize: 14 }}>直播流接入中，敬请期待</div>
          </div>
        </div>

        <div style={{ padding: "16px 20px 22px" }}>
          <div style={{ fontSize: 18, fontWeight: 700, marginBottom: 6 }}>
            正在直播：{meta.label}实盘 + 挑战赛复盘
          </div>
          <div style={{ color: "var(--text-dim)", fontSize: 13, marginBottom: 12 }}>
            主持：合作公司官方分析师 · 互动方式：弹幕 + 站内问答
          </div>
          <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
            <button className="btn-buy">订阅开播提醒</button>
            <button className="btn-outline">查看排期</button>
          </div>
        </div>
      </div>

      <p style={{ color: "var(--text-muted)", fontSize: 12, marginTop: 28 }}>
        ※ 直播功能为演示页，真实直播以站内通知为准。
      </p>
    </main>
  );
}
