import { Link } from "wouter";
import { useCategory, useCategoryFirms } from "../contexts/CategoryContext";
import { getBrandZh } from "../data/brandZh";
import FirmLogo from "../components/FirmLogo";
import { GiftIcon } from "../components/icons";

type Giveaway = {
  id: string;
  title: string;
  prize: string;
  endsAt: string;
  entries: number;
  sponsorSlug: string;
  status: "进行中" | "即将开奖" | "已结束";
};

const GIVEAWAYS: Giveaway[] = [
  { id: "g-2026-05-a", title: "5 月 $100K 挑战赛免费抽奖", prize: "$100K 评估账户 ×3", endsAt: "2026-05-31", entries: 18420, sponsorSlug: "topstep", status: "进行中" },
  { id: "g-2026-05-b", title: "FundedNext Stellar 通行证", prize: "Stellar Lite $25K ×5", endsAt: "2026-05-22", entries: 12044, sponsorSlug: "fundednext-futures", status: "即将开奖" },
  { id: "g-2026-05-c", title: "Apex 周末速通赛", prize: "Apex $50K 评估 ×2", endsAt: "2026-05-18", entries: 7311, sponsorSlug: "apex-trader-funding", status: "即将开奖" },
  { id: "g-2026-04-z", title: "4 月感恩抽奖", prize: "MFFU $150K 评估 ×1", endsAt: "2026-04-30", entries: 22100, sponsorSlug: "my-funded-futures", status: "已结束" },
];

export default function GiveawaysPage() {
  const category = useCategory();
  const firms = useCategoryFirms();
  const prefix = `/${category}`;

  return (
    <main className="container">
      <div className="section-title"><GiftIcon size={18} className="icon" /> 免费抽奖</div>
      <p style={{ color: "var(--text-dim)", marginBottom: 24, maxWidth: 720 }}>
        每周联合合作公司送出免费评估账户与挑战赛通行证。完成下方任务获取抽奖码，开奖后通过站内信通知。
      </p>

      <div style={{ display: "grid", gap: 16 }}>
        {GIVEAWAYS.map(g => {
          const sponsor = firms.find(f => f.slug === g.sponsorSlug) ?? firms[0];
          const sponsorZh = sponsor ? getBrandZh(sponsor.slug) : "";
          const statusColor = g.status === "进行中" ? "var(--success, #22c55e)" : g.status === "即将开奖" ? "var(--orange)" : "var(--text-muted)";
          return (
            <div key={g.id} className="rule-card" style={{ display: "grid", gridTemplateColumns: "auto 1fr auto", gap: 18, alignItems: "center" }}>
              {sponsor && (
                <Link href={`${prefix}/prop-firms/${sponsor.slug}`} className="firm-logo-sm" style={{ width: 56, height: 56 }}>
                  <FirmLogo src={sponsor.logo} alt={sponsor.name} />
                </Link>
              )}
              <div>
                <div style={{ fontSize: 16, fontWeight: 600, color: "var(--text)" }}>{g.title}</div>
                <div style={{ color: "var(--text-dim)", fontSize: 13, marginTop: 4 }}>
                  奖品：<strong style={{ color: "var(--orange)" }}>{g.prize}</strong>
                  {sponsor && <> · 由 <Link href={`${prefix}/prop-firms/${sponsor.slug}`} className="firm-name-link">{sponsorZh || sponsor.name}</Link> 赞助</>}
                </div>
                <div style={{ color: "var(--text-muted)", fontSize: 12, marginTop: 6 }}>
                  截止 {g.endsAt} · 已有 {g.entries.toLocaleString()} 人参与 · <span style={{ color: statusColor }}>● {g.status}</span>
                </div>
              </div>
              {g.status !== "已结束"
                ? <button className="btn-buy" style={{ whiteSpace: "nowrap" }}>免费参加</button>
                : <span style={{ color: "var(--text-muted)", fontSize: 13 }}>已结束</span>}
            </div>
          );
        })}
      </div>

      <p style={{ color: "var(--text-muted)", fontSize: 12, marginTop: 28 }}>
        ※ 抽奖活动为演示数据，真实活动以站内通知和合作公司公告为准。
      </p>
    </main>
  );
}
