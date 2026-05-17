import { useEffect, useState } from "react";
import { Link, useRoute } from "wouter";
import { BriefcaseIcon } from "../components/icons";
import { getJob } from "../data/jobs";
import MarkdownLite from "../components/MarkdownLite";
import JobApplyModal from "../components/JobApplyModal";
import SimplePage from "./SimplePage";

const APPLY_KEY = "pfm.careers.applied.v1";

function readApplied(): Record<string, string> {
  try {
    const raw = localStorage.getItem(APPLY_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch { return {}; }
}
function writeApplied(map: Record<string, string>) {
  try { localStorage.setItem(APPLY_KEY, JSON.stringify(map)); } catch { /* ignore */ }
}

export default function JobDetailPage() {
  const [, params] = useRoute<{ slug: string }>("/careers/:slug");
  const slug = params?.slug ?? "";
  const job = getJob(slug);
  const [applied, setApplied] = useState<Record<string, string>>(() => readApplied());
  const [modalOpen, setModalOpen] = useState(false);
  const [toast, setToast] = useState<string | null>(null);

  useEffect(() => { window.scrollTo(0, 0); }, [slug]);

  if (!job) {
    return <SimplePage title="职位不存在" body="可能链接已失效，请返回招聘列表。" />;
  }

  const isApplied = !!applied[job.slug];

  function handleSuccess(email: string) {
    const next = { ...applied, [job!.slug]: email };
    setApplied(next);
    writeApplied(next);
    setModalOpen(false);
    setToast(`投递成功！我们会在两周内邮件回复 ${email}`);
    window.setTimeout(() => setToast(null), 3800);
  }

  return (
    <main className="container job-detail">
      <Link href="/careers" className="job-back">← 返回招聘中心</Link>

      <div className="job-detail-head">
        <div className="section-title" style={{ marginBottom: 8 }}>
          <BriefcaseIcon size={18} className="icon" /> {job.team}
        </div>
        <h1 className="job-detail-title">{job.title}</h1>
        <div className="job-detail-meta">
          <span className={`job-type job-type-${job.type === "全职" ? "full" : job.type === "兼职" ? "part" : "intern"}`}>{job.type}</span>
          <span>📍 {job.location}</span>
          <span>🗓 发布于 {job.postedAt}</span>
        </div>
        <p className="job-detail-summary">{job.summary}</p>
        <div className="job-card-skills">
          {job.skills.map(s => <span key={s} className="job-skill">{s}</span>)}
        </div>
      </div>

      <article className="job-body md-body">
        <MarkdownLite source={job.body} />
      </article>

      <div className="job-apply-bar">
        <div className="job-apply-bar-text">
          准备好了吗？把简历发给我们，我们最迟两周内邮件回复。
        </div>
        {isApplied
          ? <button className="gw-btn-done" disabled>✓ 已投递</button>
          : <button className="gw-btn-primary" onClick={() => setModalOpen(true)}>投递简历</button>}
      </div>

      {modalOpen && <JobApplyModal job={job} onClose={() => setModalOpen(false)} onSuccess={handleSuccess} />}
      {toast && <div className="gw-toast" role="status">{toast}</div>}
    </main>
  );
}
