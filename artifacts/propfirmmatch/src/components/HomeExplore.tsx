import { useState } from "react";
import NewbieRoadmap from "./NewbieRoadmap";
import MyPlatform from "./MyPlatform";

/**
 * 沉浸式首页的两个入口：新手走「鱼骨路线图」，已上路的人走「查我的平台」。
 */
export default function HomeExplore({ prefix }: { prefix: string }) {
  const [view, setView] = useState<"roadmap" | "platform">("roadmap");
  return (
    <>
      <div className="home-switch" role="tablist" aria-label="选择入口">
        <button type="button" role="tab" aria-selected={view === "roadmap"}
          className={view === "roadmap" ? "is-active" : ""} onClick={() => setView("roadmap")}>
          🌱 我是新手 · 路线图
        </button>
        <button type="button" role="tab" aria-selected={view === "platform"}
          className={view === "platform" ? "is-active" : ""} onClick={() => setView("platform")}>
          🔎 我已经在做 · 查我的平台
        </button>
      </div>
      {view === "roadmap" ? <NewbieRoadmap prefix={prefix} /> : <MyPlatform prefix={prefix} />}
    </>
  );
}
