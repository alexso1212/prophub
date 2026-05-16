import { useEffect, useState } from "react";
import { onboardingCopy } from "../data/onboardingCopy";
import {
  ChevronRightIcon,
  ChevronDownIcon,
  CloseIcon,
  CheckIcon,
  ShieldIcon,
  BalanceIcon,
  BriefcaseIcon,
  WalletIcon,
  TrophyIcon,
  HandshakeIcon,
} from "./icons";

const STORAGE_KEY = "pfm.onboarding.collapsed.v2";

const STEP_ICONS = [WalletIcon, TrophyIcon, HandshakeIcon];
const BADGE_ICONS = [CheckIcon, BalanceIcon, ShieldIcon];
const MODEL_ICONS = [BriefcaseIcon, BalanceIcon, WalletIcon];

export default function Onboarding() {
  const [collapsed, setCollapsed] = useState<boolean | null>(null);

  useEffect(() => {
    try {
      const v = typeof window !== "undefined" && window.localStorage.getItem(STORAGE_KEY);
      setCollapsed(v === "1");
    } catch {
      setCollapsed(false);
    }
  }, []);

  useEffect(() => {
    if (collapsed !== false) return;
    if (typeof window === "undefined") return;
    let done = false;
    const onScroll = () => {
      if (done) return;
      const doc = document.documentElement;
      const scrolled = window.scrollY + window.innerHeight;
      const full = doc.scrollHeight;
      if (full - scrolled < 200) {
        done = true;
        try {
          window.localStorage.setItem(STORAGE_KEY, "1");
        } catch {
          /* ignore */
        }
      }
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [collapsed]);

  function setAndStore(next: boolean) {
    setCollapsed(next);
    try {
      window.localStorage.setItem(STORAGE_KEY, next ? "1" : "0");
    } catch {
      /* ignore */
    }
  }

  function gotoOffers() {
    setAndStore(true);
    if (typeof window !== "undefined") {
      const el = document.getElementById("homepage-offers");
      if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }

  function gotoFaq() {
    if (typeof window !== "undefined") {
      const el = document.getElementById("onb-scam");
      if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }

  if (collapsed === null) return null;

  if (collapsed) {
    return (
      <div className="onb-collapsed" role="region" aria-label="新手指引">
        <span className="onb-collapsed-left">
          <ShieldIcon size={14} />
          <span>{onboardingCopy.collapsedBar.text}</span>
        </span>
        <button type="button" className="onb-collapsed-btn" onClick={() => setAndStore(false)}>
          {onboardingCopy.collapsedBar.cta}
          <ChevronDownIcon size={12} />
        </button>
      </div>
    );
  }

  const c = onboardingCopy;

  return (
    <section className="onb" aria-labelledby="onb-title">
      <button
        type="button"
        className="onb-dismiss"
        aria-label="关闭新手指引"
        onClick={() => setAndStore(true)}
      >
        <CloseIcon size={14} />
      </button>

      {/* ① Who we are */}
      <div className="onb-who">
        <div className="onb-eyebrow">{c.whoWeAre.eyebrow}</div>
        <h2 id="onb-title" className="onb-title">
          {c.whoWeAre.title}
        </h2>
        <p className="onb-sub">{c.whoWeAre.subtitle}</p>

        <div className="onb-badges">
          {c.whoWeAre.badges.map((b, i) => {
            const Icon = BADGE_ICONS[i];
            return (
              <div className="onb-badge" key={b.label}>
                <span className="onb-badge-icon"><Icon size={14} /></span>
                <div>
                  <div className="onb-badge-label">{b.label}</div>
                  <div className="onb-badge-sub">{b.sub}</div>
                </div>
              </div>
            );
          })}
        </div>

        <div className="onb-cta-row">
          <button type="button" className="onb-cta-primary" onClick={gotoFaq}>
            {c.whoWeAre.primaryCta} <ChevronRightIcon size={14} />
          </button>
          <button type="button" className="onb-cta-secondary" onClick={gotoOffers}>
            {c.whoWeAre.secondaryCta}
          </button>
        </div>
      </div>

      {/* ② Is this a scam? */}
      <div id="onb-scam" className="onb-scam">
        <div className="onb-section-title">{c.isThisScam.title}</div>
        <p className="onb-section-sub">{c.isThisScam.sub}</p>
        <div className="onb-qa-grid">
          {c.isThisScam.items.map((item, i) => (
            <details className="onb-qa" key={i} open>
              <summary>
                <span className="onb-qa-q">{item.q}</span>
                <ChevronDownIcon size={14} className="onb-qa-chev" />
              </summary>
              <div className="onb-qa-a">{item.a}</div>
            </details>
          ))}
        </div>
      </div>

      {/* ③ Business model */}
      <div className="onb-model">
        <div className="onb-section-title">{c.businessModel.title}</div>
        <div className="onb-model-flow">
          {c.businessModel.nodes.map((node, i) => {
            const Icon = MODEL_ICONS[i];
            const last = i === c.businessModel.nodes.length - 1;
            return (
              <div className="onb-model-wrap" key={node.role}>
                <div className="onb-model-card">
                  <div className="onb-model-icon"><Icon size={18} /></div>
                  <div className="onb-model-role">{node.role}</div>
                  <div className="onb-model-body">{node.body}</div>
                </div>
                {!last && (
                  <span className="onb-model-arrow" aria-hidden="true">
                    <ChevronRightIcon size={18} />
                  </span>
                )}
              </div>
            );
          })}
        </div>
        <p className="onb-model-explain">{c.businessModel.explain}</p>
      </div>

      {/* ④ Three steps */}
      <div className="onb-steps-wrap">
        <div className="onb-section-title">{c.steps.title}</div>
        <div className="onb-steps">
          {c.steps.items.map((step, i) => {
            const Icon = STEP_ICONS[i];
            const last = i === c.steps.items.length - 1;
            return (
              <div className="onb-step-wrap" key={step.n}>
                <div className="onb-step">
                  <div className="onb-step-head">
                    <span className="onb-step-icon"><Icon size={18} /></span>
                    <span className="onb-step-num">第 {step.n} 关</span>
                  </div>
                  <div className="onb-step-title">{step.title}</div>
                  <div className="onb-step-analogy">{step.analogy}</div>
                  <div className="onb-step-detail">{step.detail}</div>
                </div>
                {!last && (
                  <span className="onb-step-arrow" aria-hidden="true">
                    <ChevronRightIcon size={18} />
                  </span>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* ⑤ Fit check */}
      <div className="onb-fit">
        <div className="onb-section-title">{c.fitCheck.title}</div>
        <div className="onb-fit-grid">
          <div className="onb-fit-col onb-fit-yes">
            <div className="onb-fit-col-label">{c.fitCheck.fit.label}</div>
            <ul>
              {c.fitCheck.fit.items.map((x, i) => (
                <li key={i}>{x}</li>
              ))}
            </ul>
          </div>
          <div className="onb-fit-col onb-fit-no">
            <div className="onb-fit-col-label">{c.fitCheck.notFit.label}</div>
            <ul>
              {c.fitCheck.notFit.items.map((x, i) => (
                <li key={i}>{x}</li>
              ))}
            </ul>
          </div>
        </div>
        <p className="onb-fit-bottom">{c.fitCheck.bottomLine}</p>
      </div>

      <div className="onb-footer-row">
        <button type="button" className="onb-cta-secondary" onClick={() => setAndStore(true)}>
          看完了，收起这段
        </button>
        <button type="button" className="onb-cta-primary" onClick={gotoOffers}>
          开始挑公司 <ChevronRightIcon size={14} />
        </button>
      </div>
    </section>
  );
}
