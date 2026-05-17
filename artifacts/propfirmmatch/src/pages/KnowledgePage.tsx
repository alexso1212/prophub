import { useEffect, useState } from "react";
import { useRoute, useLocation } from "wouter";
import MindMap from "../components/knowledge/MindMap";
import DecisionTree from "../components/knowledge/DecisionTree";
import KnowledgeCards from "../components/knowledge/KnowledgeCards";
import CostCalc from "../components/knowledge/sims/CostCalc";
import PnLDays from "../components/knowledge/sims/PnLDays";
import DrawdownSim from "../components/knowledge/sims/DrawdownSim";
import PayoutCycle from "../components/knowledge/sims/PayoutCycle";
import FirmCompare from "../components/knowledge/sims/FirmCompare";

type TabId =
  | "mindmap"
  | "decision"
  | "cards"
  | "sim-cost"
  | "sim-pnl"
  | "sim-dd"
  | "sim-payout"
  | "sim-compare";

const TABS: { id: TabId; label: string; group: "图谱" | "模拟器" }[] = [
  { id: "mindmap", label: "🧠 知识思维导图", group: "图谱" },
  { id: "decision", label: "🌳 我该选哪种账号？", group: "图谱" },
  { id: "cards", label: "🃏 概念卡牌", group: "图谱" },
  { id: "sim-cost", label: "🧮 考核成本计算器", group: "模拟器" },
  { id: "sim-pnl", label: "📈 盈亏天数模拟", group: "模拟器" },
  { id: "sim-dd", label: "📉 回撤风险沙盘", group: "模拟器" },
  { id: "sim-payout", label: "💸 出金周期计算", group: "模拟器" },
  { id: "sim-compare", label: "⚖️ 多家公司对比器", group: "模拟器" },
];

function track(id: TabId) {
  if (typeof window === "undefined") return;
  try {
    const key = "kg_tab_visits";
    const cur = JSON.parse(localStorage.getItem(key) || "{}");
    cur[id] = (cur[id] ?? 0) + 1;
    localStorage.setItem(key, JSON.stringify(cur));
  } catch {
    /* ignore */
  }
}

const VALID_TABS = new Set<string>(TABS.map((t) => t.id));

export default function KnowledgePage() {
  const [, params] = useRoute<{ tab?: string }>("/knowledge/:tab");
  const [, navigate] = useLocation();
  const initial: TabId =
    params?.tab && VALID_TABS.has(params.tab) ? (params.tab as TabId) : "mindmap";
  const [tab, setTab] = useState<TabId>(initial);

  // Keep state in sync when user navigates via browser back/forward.
  useEffect(() => {
    const next: TabId =
      params?.tab && VALID_TABS.has(params.tab) ? (params.tab as TabId) : "mindmap";
    setTab(next);
  }, [params?.tab]);

  const select = (id: TabId) => {
    setTab(id);
    track(id);
    navigate(`/knowledge/${id}`);
  };

  return (
    <main className="container kg-page">
      <header className="kg-header">
        <h1 className="kg-hero-title">知识图谱 · 交互模拟器</h1>
        <p className="kg-hero-sub">
          把规则变成图、把数字变成滑块。先理解再下单，少走 80% 弯路。
        </p>
      </header>

      <div className="kg-layout">
        <aside className="kg-side">
          {(["图谱", "模拟器"] as const).map((g) => (
            <div key={g} className="kg-side-group">
              <div className="kg-side-title">{g}</div>
              {TABS.filter((t) => t.group === g).map((t) => (
                <button
                  key={t.id}
                  className={`kg-side-tab ${tab === t.id ? "active" : ""}`}
                  onClick={() => select(t.id)}
                >
                  {t.label}
                </button>
              ))}
            </div>
          ))}
        </aside>

        <section className="kg-main">
          {tab === "mindmap" && <MindMap />}
          {tab === "decision" && <DecisionTree />}
          {tab === "cards" && <KnowledgeCards />}
          {tab === "sim-cost" && <CostCalc />}
          {tab === "sim-pnl" && <PnLDays />}
          {tab === "sim-dd" && <DrawdownSim />}
          {tab === "sim-payout" && <PayoutCycle />}
          {tab === "sim-compare" && <FirmCompare />}
        </section>
      </div>
    </main>
  );
}
