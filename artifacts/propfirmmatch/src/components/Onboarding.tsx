import { useEffect, useState } from "react";
import { onboardingCopy } from "../data/onboardingCopy";
import {
  WalletIcon,
  TrophyIcon,
  HandshakeIcon,
  ChevronRightIcon,
  ChevronDownIcon,
  LightbulbIcon,
  SparkleIcon,
  CloseIcon,
} from "./icons";

const STORAGE_KEY = "pfm.onboarding.collapsed.v1";

const STEP_ICONS = [WalletIcon, TrophyIcon, HandshakeIcon];

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

  function setAndStore(next: boolean) {
    setCollapsed(next);
    try {
      window.localStorage.setItem(STORAGE_KEY, next ? "1" : "0");
    } catch {
      /* ignore */
    }
  }

  if (collapsed === null) return null;

  if (collapsed) {
    return (
      <div className="onb-collapsed" role="region" aria-label="新手指引">
        <span className="onb-collapsed-left">
          <LightbulbIcon size={14} />
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

      <div className="onb-hero">
        <div className="onb-hero-text">
          <div className="onb-eyebrow">
            <SparkleIcon size={12} /> {c.hero.eyebrow}
          </div>
          <h1 id="onb-title" className="onb-title">
            {c.hero.title}
          </h1>
          <p className="onb-sub">{c.hero.subtitle}</p>
          <div className="onb-cta-row">
            <button
              type="button"
              className="onb-cta-primary"
              onClick={() => {
                setAndStore(true);
                if (typeof window !== "undefined") {
                  const el = document.getElementById("homepage-offers");
                  if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
                }
              }}
            >
              {c.hero.primaryCta} <ChevronRightIcon size={14} />
            </button>
            <a className="onb-cta-secondary" href="#onb-steps">
              {c.hero.secondaryCta}
            </a>
          </div>
        </div>

        <div className="onb-hero-visual" aria-hidden="true">
          <div className="onb-vis-card onb-vis-small">
            <div className="onb-vis-label">{c.hero.compareSmall}</div>
            <div className="onb-vis-amount">$100</div>
          </div>
          <ChevronRightIcon size={20} className="onb-vis-arrow" />
          <div className="onb-vis-card onb-vis-big">
            <div className="onb-vis-label">{c.hero.compareBig}</div>
            <div className="onb-vis-amount onb-vis-amount-big">$100,000</div>
          </div>
          <ChevronRightIcon size={20} className="onb-vis-arrow" />
          <div className="onb-vis-card onb-vis-share">
            <div className="onb-vis-label">{c.hero.compareShare}</div>
            <div className="onb-vis-amount onb-vis-amount-share">80%</div>
          </div>
        </div>
      </div>

      <div id="onb-steps" className="onb-steps">
        {c.steps.map((step, i) => {
          const Icon = STEP_ICONS[i];
          const last = i === c.steps.length - 1;
          return (
            <div className="onb-step-wrap" key={step.n}>
              <div className="onb-step">
                <div className="onb-step-icon">
                  <Icon size={22} />
                </div>
                <div className="onb-step-num">第 {step.n} 步</div>
                <div className="onb-step-title">{step.title}</div>
                <div className="onb-step-analogy">{step.analogy}</div>
                <div className="onb-step-detail">{step.detail}</div>
              </div>
              {!last && (
                <span className="onb-step-arrow" aria-hidden="true">
                  <ChevronRightIcon size={20} />
                </span>
              )}
            </div>
          );
        })}
      </div>

      <div className="onb-value">
        <div className="onb-value-title">
          <LightbulbIcon size={16} /> {c.bigValue.title}
        </div>
        <div className="onb-value-grid">
          <div className="onb-value-cell onb-value-small">
            <div className="onb-value-label">{c.bigValue.small.label}</div>
            <div className="onb-value-amount">{c.bigValue.small.amount}</div>
            <div className="onb-value-note">{c.bigValue.small.note}</div>
          </div>
          <ChevronRightIcon size={18} className="onb-value-arrow" />
          <div className="onb-value-cell onb-value-big">
            <div className="onb-value-label">{c.bigValue.big.label}</div>
            <div className="onb-value-amount">{c.bigValue.big.amount}</div>
            <div className="onb-value-note">{c.bigValue.big.note}</div>
          </div>
          <ChevronRightIcon size={18} className="onb-value-arrow" />
          <div className="onb-value-cell onb-value-share">
            <div className="onb-value-label">{c.bigValue.share.label}</div>
            <div className="onb-value-amount">{c.bigValue.share.amount}</div>
            <div className="onb-value-note">{c.bigValue.share.note}</div>
          </div>
        </div>
        <p className="onb-value-explain">{c.bigValue.explain}</p>
      </div>

      <div className="onb-faq">
        <div className="onb-faq-title">小白最常问的几个问题</div>
        {c.faq.map((item, i) => (
          <details className="onb-faq-item" key={i}>
            <summary>
              <span>{item.q}</span>
              <ChevronDownIcon size={14} className="onb-faq-chev" />
            </summary>
            <div className="onb-faq-a">{item.a}</div>
          </details>
        ))}
      </div>

      <div className="onb-footer-row">
        <button
          type="button"
          className="onb-cta-primary"
          onClick={() => {
            setAndStore(true);
            if (typeof window !== "undefined") {
              const el = document.getElementById("homepage-offers");
              if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
            }
          }}
        >
          看懂了，开始挑公司 <ChevronRightIcon size={14} />
        </button>
      </div>
    </section>
  );
}
