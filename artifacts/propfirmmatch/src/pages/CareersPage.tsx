import { BriefcaseIcon } from "../components/icons";

type Job = {
  id: string;
  title: string;
  team: string;
  location: string;
  type: "全职" | "兼职" | "实习";
};

const JOBS: Job[] = [
  { id: "eng-fe-01", title: "高级前端工程师 (React / Next.js)", team: "工程团队", location: "远程 · 全球", type: "全职" },
  { id: "eng-be-02", title: "后端工程师 (Node.js / PostgreSQL)", team: "工程团队", location: "远程 · 亚太", type: "全职" },
  { id: "ops-bd-01", title: "商务拓展经理 - 自营公司", team: "商务团队", location: "远程 · 北美 / 欧洲", type: "全职" },
  { id: "ops-cm-02", title: "中文社区运营", team: "运营团队", location: "远程 · 大中华区", type: "全职" },
  { id: "des-ui-01", title: "产品设计师 (UI/UX)", team: "设计团队", location: "远程", type: "兼职" },
  { id: "data-an-01", title: "数据分析实习生", team: "数据团队", location: "远程", type: "实习" },
];

export default function CareersPage() {
  return (
    <main className="container">
      <div className="section-title"><BriefcaseIcon size={18} className="icon" /> 加入我们</div>
      <p style={{ color: "var(--text-dim)", marginBottom: 28, maxWidth: 720 }}>
        Prop Firm Match 是全球自营交易公司的导航与点评平台。我们 100% 远程，团队分布在 12 个国家，致力于让交易者更高效地找到适合自己的公司。
      </p>

      <div style={{ display: "grid", gap: 12 }}>
        {JOBS.map(j => (
          <div key={j.id} className="rule-card" style={{ display: "grid", gridTemplateColumns: "1fr auto", gap: 18, alignItems: "center" }}>
            <div>
              <div style={{ fontSize: 16, fontWeight: 600, color: "var(--text)" }}>{j.title}</div>
              <div style={{ color: "var(--text-muted)", fontSize: 13, marginTop: 6 }}>
                {j.team} · {j.location} · <span style={{ color: "var(--orange)" }}>{j.type}</span>
              </div>
            </div>
            <button className="btn-firm" style={{ whiteSpace: "nowrap" }}>查看职位</button>
          </div>
        ))}
      </div>

      <div style={{ marginTop: 32, padding: 18, border: "1px solid var(--border)", borderRadius: 12, background: "var(--card)" }}>
        <div style={{ fontSize: 14, fontWeight: 600, color: "var(--text)", marginBottom: 6 }}>找不到合适的职位？</div>
        <div style={{ color: "var(--text-dim)", fontSize: 13 }}>
          欢迎将简历发送至 <span style={{ color: "var(--orange)" }}>careers@propfirmmatch.example</span>，我们会在两周内回复你。
        </div>
      </div>

      <p style={{ color: "var(--text-muted)", fontSize: 12, marginTop: 24 }}>※ 招聘信息为演示数据。</p>
    </main>
  );
}
