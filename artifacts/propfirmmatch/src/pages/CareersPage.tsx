import { Link } from "wouter";
import { BriefcaseIcon } from "../components/icons";
import { getJobsSorted, type Job } from "../data/jobs";

const BENEFITS = [
  { icon: "🌏", title: "100% 远程", desc: "12 个国家，按结果而非打卡。" },
  { icon: "📈", title: "期权激励", desc: "全员持股，与公司一起成长。" },
  { icon: "📚", title: "学习预算", desc: "季度 USD 1,500，自由支配。" },
  { icon: "⏰", title: "灵活时间", desc: "异步沟通为主，会议尽量留给重要决策。" },
];

function JobCard({ job }: { job: Job }) {
  return (
    <article className="job-card">
      <div className="job-card-main">
        <div className="job-card-titlerow">
          <h3 className="job-card-title">{job.title}</h3>
          <span className={`job-type job-type-${job.type === "全职" ? "full" : job.type === "兼职" ? "part" : "intern"}`}>{job.type}</span>
        </div>
        <div className="job-card-meta">
          <span>{job.team}</span><span>·</span><span>{job.location}</span><span>·</span><span>发布于 {job.postedAt}</span>
        </div>
        <p className="job-card-summary">{job.summary}</p>
        <div className="job-card-skills">
          {job.skills.map(s => <span key={s} className="job-skill">{s}</span>)}
        </div>
      </div>
      <div className="job-card-action">
        <Link href={`/careers/${job.slug}`} className="gw-btn-primary">查看详情</Link>
      </div>
    </article>
  );
}

export default function CareersPage() {
  const jobs = getJobsSorted();

  return (
    <main className="container careers-page">
      <div className="section-title"><BriefcaseIcon size={18} className="icon" /> 加入我们</div>

      <section className="careers-hero">
        <div className="careers-hero-left">
          <h1 className="careers-hero-title">在全球远程团队，做交易者真正会用的产品。</h1>
          <p className="careers-hero-desc">
            Prop Firm Match 是全球自营交易公司的导航与点评平台。我们 100% 远程，团队分布在 12 个国家，
            目标是让每一位交易者都能 5 分钟内找到适合自己的 prop firm。
          </p>
          <div className="careers-hero-tags">
            <span className="careers-tag">🌐 Remote-first since day 1</span>
            <span className="careers-tag">👥 团队 32 人 · 7 个时区</span>
            <span className="careers-tag">💸 期权 + 项目奖金</span>
          </div>
        </div>
      </section>

      <section className="careers-benefits">
        {BENEFITS.map(b => (
          <div key={b.title} className="benefit-card">
            <div className="benefit-icon" aria-hidden>{b.icon}</div>
            <div className="benefit-title">{b.title}</div>
            <div className="benefit-desc">{b.desc}</div>
          </div>
        ))}
      </section>

      <section className="careers-jobs">
        <div className="careers-jobs-head">
          <h2 className="careers-jobs-title">在招职位</h2>
          <span className="careers-jobs-count">{jobs.length} 个空缺</span>
        </div>
        <div className="job-list">
          {jobs.map(j => <JobCard key={j.slug} job={j} />)}
        </div>
      </section>

      <section className="careers-contact">
        <div className="careers-contact-title">找不到合适的职位？</div>
        <div className="careers-contact-desc">
          欢迎将简历发送至 <a href="mailto:careers@propfirmmatch.example" className="firm-name-link">careers@propfirmmatch.example</a>，
          我们会在两周内回复你。也可以附上你想为我们做什么的一段想法 —— 我们对自发性永远开放。
        </div>
      </section>
    </main>
  );
}
