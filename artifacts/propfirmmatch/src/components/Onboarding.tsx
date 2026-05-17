import { useCallback, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { onboardingTree, type Leaf } from "../data/onboardingCopy";
import { ChevronDownIcon, CloseIcon, ExpandIcon, PlayIcon } from "./icons";

const STORAGE_KEY = "pfm.onboarding.collapsed.v3";

interface TreeProps {
  fullscreen: boolean;
  expanded: Set<number>;
  onToggleBranch: (i: number) => void;
  activeTip: string | null;
  onToggleTip: (id: string | null) => void;
}

function Tree({ fullscreen, expanded, onToggleBranch, activeTip, onToggleTip }: TreeProps) {
  return (
    <div className={`onb-mm ${fullscreen ? "onb-mm-fs" : ""}`}>
      <div className="onb-mm-root-wrap">
        <div className="onb-mm-root">{onboardingTree.root}</div>
        <span className="onb-mm-trunk" aria-hidden="true" />
        <span className="onb-mm-bus" aria-hidden="true" />
      </div>
      <div className="onb-mm-branches">
        {onboardingTree.branches.map((b, i) => {
          const isOpen = expanded.has(i);
          return (
            <div key={i} className={`onb-mm-branch ${isOpen ? "is-open" : ""}`}>
              <span className="onb-mm-stem" aria-hidden="true" />
              <button
                type="button"
                className="onb-mm-branch-head"
                onClick={() => onToggleBranch(i)}
                aria-expanded={isOpen}
              >
                <span className="onb-mm-branch-label">{b.label}</span>
                <ChevronDownIcon size={14} className="onb-mm-chev" />
              </button>
              <div className="onb-mm-leaves" role="group" aria-hidden={!isOpen}>
                {isOpen &&
                  b.leaves.map((l: Leaf, j) => {
                    const tipId = `${i}-${j}`;
                    const tipOpen = activeTip === tipId;
                    return (
                      <div key={j} className="onb-mm-leaf-wrap" style={{ animationDelay: `${j * 40}ms` }}>
                        <button
                          type="button"
                          className={`onb-mm-leaf${l.tip ? " has-tip" : ""}${tipOpen ? " is-active" : ""}`}
                          onClick={() => {
                            if (l.tip) onToggleTip(tipOpen ? null : tipId);
                          }}
                        >
                          <span className="onb-mm-leaf-text">{l.text}</span>
                          {l.tip && <span className="onb-mm-leaf-dot" aria-hidden="true" />}
                        </button>
                        {tipOpen && l.tip && (
                          <div className="onb-mm-tip" role="tooltip">
                            <span className="onb-mm-tip-arrow" aria-hidden="true" />
                            {l.tip}
                          </div>
                        )}
                      </div>
                    );
                  })}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default function Onboarding() {
  const [collapsed, setCollapsed] = useState<boolean | null>(null);
  const [expandedInline, setExpandedInline] = useState<Set<number>>(new Set());
  const [expandedFs, setExpandedFs] = useState<Set<number>>(new Set());
  const [activeTip, setActiveTip] = useState<string | null>(null);
  const [fullscreen, setFullscreen] = useState(false);
  const [introPlaying, setIntroPlaying] = useState(false);
  const introTimersRef = useRef<number[]>([]);

  useEffect(() => {
    try {
      const v = typeof window !== "undefined" ? window.localStorage.getItem(STORAGE_KEY) : null;
      if (v === null) {
        setCollapsed(false);
        setIntroPlaying(true);
        try {
          window.localStorage.setItem(STORAGE_KEY, "0");
        } catch {
          /* ignore */
        }
      } else {
        setCollapsed(v === "1");
      }
    } catch {
      setCollapsed(false);
    }
  }, []);

  const cancelIntro = useCallback(() => {
    if (introTimersRef.current.length) {
      introTimersRef.current.forEach(t => clearTimeout(t));
      introTimersRef.current = [];
    }
    setIntroPlaying(false);
  }, []);

  const replayIntro = useCallback(() => {
    if (introTimersRef.current.length) {
      introTimersRef.current.forEach(t => clearTimeout(t));
      introTimersRef.current = [];
    }
    try {
      window.localStorage.setItem(STORAGE_KEY, "0");
    } catch {
      /* ignore */
    }
    setCollapsed(false);
    setFullscreen(false);
    setExpandedInline(new Set());
    setExpandedFs(new Set());
    setActiveTip(null);
    setIntroPlaying(false);
    if (typeof window !== "undefined") {
      const kickoff = window.setTimeout(() => {
        introTimersRef.current = introTimersRef.current.filter(t => t !== kickoff);
        setIntroPlaying(true);
      }, 30);
      introTimersRef.current.push(kickoff);
    } else {
      setIntroPlaying(true);
    }
  }, []);

  useEffect(() => {
    if (!introPlaying) return;
    if (typeof window === "undefined") return;
    const timers: number[] = [];
    const branches = onboardingTree.branches;
    const startDelay = 700;
    const perBranch = 4000;

    branches.forEach((b, i) => {
      const base = startDelay + i * perBranch;
      timers.push(
        window.setTimeout(() => {
          setExpandedInline(new Set([i]));
          setActiveTip(null);
        }, base)
      );
      const tipIdx = b.leaves.findIndex(l => l.tip);
      if (tipIdx >= 0) {
        timers.push(
          window.setTimeout(() => {
            setActiveTip(`${i}-${tipIdx}`);
          }, base + 1700)
        );
        timers.push(
          window.setTimeout(() => {
            setActiveTip(null);
          }, base + 3300)
        );
      }
    });

    timers.push(
      window.setTimeout(() => {
        setExpandedInline(new Set());
        setActiveTip(null);
        setIntroPlaying(false);
        introTimersRef.current = [];
      }, startDelay + branches.length * perBranch)
    );

    introTimersRef.current = timers;
    return () => {
      timers.forEach(t => clearTimeout(t));
    };
  }, [introPlaying]);

  useEffect(() => {
    if (collapsed !== false) return;
    if (typeof window === "undefined") return;
    let done = false;
    const onScroll = () => {
      if (done) return;
      const doc = document.documentElement;
      if (doc.scrollHeight - (window.scrollY + window.innerHeight) < 200) {
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

  const closeFs = useCallback(() => {
    setFullscreen(false);
    setExpandedFs(new Set());
    setExpandedInline(new Set());
    setActiveTip(null);
  }, []);

  useEffect(() => {
    if (!fullscreen) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeFs();
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener("keydown", onKey);
    };
  }, [fullscreen, closeFs]);

  function setAndStore(next: boolean) {
    cancelIntro();
    setCollapsed(next);
    try {
      window.localStorage.setItem(STORAGE_KEY, next ? "1" : "0");
    } catch {
      /* ignore */
    }
  }

  function toggleInline(i: number) {
    cancelIntro();
    setExpandedInline(prev => {
      const next = new Set<number>();
      if (!prev.has(i)) next.add(i);
      return next;
    });
    setActiveTip(null);
  }

  function toggleFs(i: number) {
    setExpandedFs(prev => {
      const next = new Set(prev);
      if (next.has(i)) next.delete(i);
      else next.add(i);
      return next;
    });
    setActiveTip(null);
  }

  function openFs() {
    cancelIntro();
    setFullscreen(true);
    setActiveTip(null);
  }

  if (collapsed === null) return null;

  if (collapsed) {
    return (
      <div className="onb-collapsed" role="region" aria-label="新手引导">
        <span className="onb-collapsed-left">再看看怎么运作？</span>
        <div className="onb-collapsed-actions">
          <button type="button" className="onb-collapsed-btn" onClick={replayIntro}>
            重播演示
          </button>
          <button type="button" className="onb-collapsed-btn" onClick={() => setAndStore(false)}>
            展开
            <ChevronDownIcon size={12} />
          </button>
        </div>
      </div>
    );
  }

  return (
    <>
      <section className={`onb${introPlaying ? " is-intro" : ""}`} aria-label="新手引导">
        <div className="onb-toolbar">
          {introPlaying && (
            <button
              type="button"
              className="onb-skip-btn"
              onClick={cancelIntro}
              aria-label="跳过演示"
            >
              <span className="onb-skip-dot" aria-hidden="true" />
              <span>演示中 · 点击跳过</span>
            </button>
          )}
          {!introPlaying && (
            <button
              type="button"
              className="onb-fs-btn"
              onClick={replayIntro}
              aria-label="重播演示"
            >
              <PlayIcon size={14} />
              <span>重播演示</span>
            </button>
          )}
          <button type="button" className="onb-fs-btn" onClick={openFs} aria-label="全屏查看">
            <ExpandIcon size={14} />
            <span>全屏查看</span>
          </button>
          <button
            type="button"
            className="onb-dismiss"
            aria-label="关闭新手引导"
            onClick={() => setAndStore(true)}
          >
            <CloseIcon size={14} />
          </button>
        </div>
        <Tree
          fullscreen={false}
          expanded={expandedInline}
          onToggleBranch={toggleInline}
          activeTip={activeTip}
          onToggleTip={setActiveTip}
        />
      </section>

      {fullscreen && typeof document !== "undefined" &&
        createPortal(
          <div
            className="onb-fs-overlay"
            onClick={closeFs}
            role="dialog"
            aria-modal="true"
            aria-label="新手引导全屏视图"
          >
            <div className="onb-fs-canvas" onClick={e => e.stopPropagation()}>
              <button
                type="button"
                className="onb-fs-close"
                aria-label="关闭全屏"
                onClick={closeFs}
              >
                <CloseIcon size={18} />
              </button>
              <Tree
                fullscreen={true}
                expanded={expandedFs}
                onToggleBranch={toggleFs}
                activeTip={activeTip}
                onToggleTip={setActiveTip}
              />
            </div>
          </div>,
          document.body
        )}
    </>
  );
}
