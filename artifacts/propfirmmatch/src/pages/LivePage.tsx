import { useCategoryMeta } from "../contexts/CategoryContext";
import { TvIcon } from "../components/icons";
import { useBilibiliLiveStatus } from "../hooks/useBilibiliLiveStatus";

const BILIBILI_ROOM_ID = "1874453448";
const BILIBILI_ROOM_URL = `https://live.bilibili.com/${BILIBILI_ROOM_ID}`;
const BILIBILI_PLAYER_URL = `https://live.bilibili.com/blanc/${BILIBILI_ROOM_ID}?liteVersion=true`;
const BILIBILI_SPACE_URL = `https://space.bilibili.com/${BILIBILI_ROOM_ID}`;

export default function LivePage() {
  const meta = useCategoryMeta();
  const liveInfo = useBilibiliLiveStatus(BILIBILI_ROOM_ID);
  const isLive = liveInfo.status === "live";
  const isRerun = liveInfo.status === "rerun";
  const isOffline = liveInfo.status === "offline";
  const isLoading = liveInfo.status === "loading";

  const badge = isLive
    ? { text: "LIVE", color: "#ef4444", showDot: true }
    : isRerun
      ? { text: "轮播", color: "#475569", showDot: false }
      : isLoading
        ? { text: "···", color: "#64748b", showDot: false }
        : { text: "未开播", color: "#64748b", showDot: false };

  const heading = isLive
    ? (liveInfo.title ?? `正在直播：${meta.label}实盘 + 挑战赛复盘`)
    : isRerun
      ? (liveInfo.title ?? `往期回放轮播中：${meta.label}实盘`)
      : isOffline
        ? "主播暂未开播"
        : "正在获取直播状态…";

  const subline = isLive
    ? "主持：合作公司官方分析师 · 互动方式：哔哩哔哩弹幕"
    : isRerun
      ? "当前为录像循环播放，可点击下方按钮前往 B 站观看完整回放或关注开播提醒。"
      : isOffline
        ? "下次开播时直播将自动出现在下方播放器；可前往 B 站关注主播，开播时收到通知。"
        : "稍候片刻，正在向哔哩哔哩查询直播间状态。";

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
              background: badge.color, color: "#fff",
              padding: "4px 10px", borderRadius: 999,
              fontSize: 11, fontWeight: 700, letterSpacing: ".08em",
              pointerEvents: "none",
            }}
          >
            {badge.showDot && (
              <span style={{ width: 8, height: 8, borderRadius: "50%", background: "#fff" }} />
            )}
            {badge.text}
          </div>
          {isOffline ? (
            <div
              style={{
                width: "100%",
                height: "100%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "#cbd5e1",
                fontSize: 14,
                textAlign: "center",
                padding: 24,
              }}
            >
              主播暂未开播，开播后此处会自动播放 B 站画面。
            </div>
          ) : (
            <iframe
              src={BILIBILI_PLAYER_URL}
              title="哔哩哔哩直播间"
              style={{ width: "100%", height: "100%", border: 0, display: "block" }}
              allow="autoplay; fullscreen; encrypted-media"
              allowFullScreen
              referrerPolicy="no-referrer"
            />
          )}
        </div>

        <div style={{ padding: "16px 20px 22px" }}>
          <div style={{ fontSize: 18, fontWeight: 700, marginBottom: 6 }}>
            {heading}
          </div>
          <div style={{ color: "var(--text-dim)", fontSize: 13, marginBottom: 12 }}>
            {subline}
          </div>
          <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
            <a
              className="btn-buy"
              href={BILIBILI_ROOM_URL}
              target="_blank"
              rel="noopener noreferrer"
            >
              {isLive ? "前往哔哩哔哩直播间" : isRerun ? "前往 B 站观看回放" : "前往 B 站关注开播"}
            </a>
            {!isLive && (
              <a
                className="btn-pill"
                href={BILIBILI_SPACE_URL}
                target="_blank"
                rel="noopener noreferrer"
              >
                关注主播主页
              </a>
            )}
          </div>
        </div>
      </div>

      <p style={{ color: "var(--text-muted)", fontSize: 12, marginTop: 28 }}>
        ※ 直播状态来自哔哩哔哩公开接口，约每 30 秒刷新一次。若播放器未显示画面，可能是浏览器限制了第三方嵌入，请点击上方按钮在 B 站观看。
      </p>
    </main>
  );
}
