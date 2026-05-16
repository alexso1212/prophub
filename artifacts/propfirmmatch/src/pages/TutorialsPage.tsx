import { Link } from "wouter";
import { useCategory } from "../contexts/CategoryContext";
import { BookIcon } from "../components/icons";

type Tutorial = {
  id: string;
  title: string;
  desc: string;
  level: "新手" | "进阶" | "专家";
  minutes: number;
  category: "futures" | "forex" | "crypto" | "通用";
};

const TUTORIALS: Tutorial[] = [
  { id: "t01", title: "新手指南：什么是自营交易公司？", desc: "三分钟看懂 Prop Firm 的盈利模式、挑战赛流程与常见骗局识别。", level: "新手", minutes: 3, category: "通用" },
  { id: "t02", title: "如何选择第一个挑战赛？", desc: "对比 Topstep、Apex、TopOne 等主流期货挑战赛的费用、利润分成与一致性规则。", level: "新手", minutes: 8, category: "futures" },
  { id: "t03", title: "外汇 Prop Firm 通关策略", desc: "FTMO、The5ers、MFF 等公司风控规则解析，附 5 步通关计划。", level: "进阶", minutes: 12, category: "forex" },
  { id: "t04", title: "加密永续合约风险管理", desc: "高杠杆环境下如何控制单笔亏损、避免爆仓、稳定通过加密挑战赛。", level: "进阶", minutes: 10, category: "crypto" },
  { id: "t05", title: "出金到账时间表对比", desc: "实测 20 家主流公司的出金通道、手续费和到账速度，附真实截图。", level: "新手", minutes: 6, category: "通用" },
  { id: "t06", title: "一致性规则陷阱大全", desc: "盈利上限、最大单日盈利、持仓时间……资深玩家整理的 12 类高频违规。", level: "专家", minutes: 15, category: "通用" },
];

export default function TutorialsPage() {
  const category = useCategory();
  const prefix = `/${category}`;

  const levelColor = (lv: Tutorial["level"]) =>
    lv === "新手" ? "var(--success, #22c55e)" : lv === "进阶" ? "var(--orange)" : "#a855f7";

  return (
    <main className="container">
      <div className="section-title"><BookIcon size={18} className="icon" /> 教程中心</div>
      <p style={{ color: "var(--text-dim)", marginBottom: 24, maxWidth: 720 }}>
        从零基础到专家级，一站学习自营交易的全流程：挑战赛选择、通关策略、风险管理与出金技巧。
      </p>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))", gap: 16 }}>
        {TUTORIALS.map(t => (
          <div key={t.id} className="offer-card" style={{ display: "flex", flexDirection: "column", gap: 10, padding: 18 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 11, color: "var(--text-muted)" }}>
              <span style={{ color: levelColor(t.level), fontWeight: 600 }}>● {t.level}</span>
              <span>· {t.minutes} 分钟阅读</span>
              {t.category !== "通用" && (
                <Link href={`/${t.category}`} className="firm-name-link" style={{ marginLeft: "auto", fontSize: 11 }}>
                  {t.category === "futures" ? "期货" : t.category === "forex" ? "外汇" : "加密"} →
                </Link>
              )}
            </div>
            <div style={{ fontSize: 15, fontWeight: 600, color: "var(--text)" }}>{t.title}</div>
            <div style={{ fontSize: 13, color: "var(--text-dim)", lineHeight: 1.55 }}>{t.desc}</div>
            <div style={{ marginTop: "auto", paddingTop: 8 }}>
              <button className="btn-firm" style={{ width: "100%" }}>开始阅读</button>
            </div>
          </div>
        ))}
      </div>

      <div style={{ marginTop: 28, padding: 18, border: "1px solid var(--border)", borderRadius: 12, background: "var(--card)" }}>
        <div style={{ fontSize: 14, fontWeight: 600, marginBottom: 6 }}>想要更深入的内容？</div>
        <div style={{ color: "var(--text-dim)", fontSize: 13 }}>
          浏览 <Link href={`${prefix}/prop-firm-rules`} className="firm-name-link">规则手册</Link> 或 <Link href={`${prefix}/payouts`} className="firm-name-link">出金记录</Link> 查看实战数据。
        </div>
      </div>

      <p style={{ color: "var(--text-muted)", fontSize: 12, marginTop: 24 }}>※ 教程内容为演示数据，正式版即将上线。</p>
    </main>
  );
}
