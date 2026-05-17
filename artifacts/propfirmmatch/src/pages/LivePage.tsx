import { useCategoryMeta } from "../contexts/CategoryContext";
import { TvIcon } from "../components/icons";

const BILIBILI_ROOM_ID = "1874453448";
const BILIBILI_ROOM_URL = `https://live.bilibili.com/${BILIBILI_ROOM_ID}`;
const BILIBILI_PLAYER_URL = `https://live.bilibili.com/blanc/${BILIBILI_ROOM_ID}?liteVersion=true`;

export default function LivePage() {
  const meta = useCategoryMeta();
  return (
    <main className="container">
      <div className="section-title"><TvIcon size={18} className="icon" /> 直播间 · {meta.label}</div>
      <p style={{ color: "var(--text-dim)", marginBottom: 18, maxWidth: 720 }}>
        直播在哔哩哔哩进行，下方播放器实时同步 B 站直播间画面。如需弹幕、送礼或登录互动，点击下方按钮直接前往 B 站。
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
            background: "#000",
            aspectRatio: "16 / 9",
            position: "relative",
          }}
        >
          <div
            style={{
              position: "absolute", top: 14, left: 14, zIndex: 2,
              display: "inline-flex", alignItems: "center", gap: 6,
              background: "#ef4444", color: "#fff",
              padding: "4px 10px", borderRadius: 999,
              fontSize: 11, fontWeight: 700, letterSpacing: ".08em",
              pointerEvents: "none",
            }}
          >
            <span style={{ width: 8, height: 8, borderRadius: "50%", background: "#fff" }} />
            LIVE
          </div>
          <iframe
            src={BILIBILI_PLAYER_URL}
            title="哔哩哔哩直播间"
            style={{ width: "100%", height: "100%", border: 0, display: "block" }}
            allow="autoplay; fullscreen; encrypted-media"
            allowFullScreen
            referrerPolicy="no-referrer"
          />
        </div>

        <div style={{ padding: "16px 20px 22px" }}>
          <div style={{ fontSize: 18, fontWeight: 700, marginBottom: 6 }}>
            正在直播：{meta.label}实盘 + 挑战赛复盘
          </div>
          <div style={{ color: "var(--text-dim)", fontSize: 13, marginBottom: 12 }}>
            主持：合作公司官方分析师 · 互动方式：哔哩哔哩弹幕
          </div>
          <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
            <a
              className="btn-buy"
              href={BILIBILI_ROOM_URL}
              target="_blank"
              rel="noopener noreferrer"
            >
              前往哔哩哔哩直播间
            </a>
          </div>
        </div>
      </div>

      <p style={{ color: "var(--text-muted)", fontSize: 12, marginTop: 28 }}>
        ※ 若播放器未显示画面，可能是主播未开播或浏览器限制了第三方嵌入，请点击「前往哔哩哔哩直播间」在 B 站观看。
      </p>
    </main>
  );
}
