import { useEffect, useRef, useState } from "react";

export type SectionTab = {
  id: string;
  label: string;
  count?: number | string;
  countTone?: "default" | "purple";
};

export default function FirmDetailSectionTabs({ tabs }: { tabs: SectionTab[] }) {
  const ids = tabs.map(t => t.id);
  const [active, setActive] = useState(ids[0]);
  const stripRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const elements = ids
      .map(id => document.getElementById(id))
      .filter((el): el is HTMLElement => !!el);
    if (elements.length === 0) return;

    const visibility = new Map<string, number>();
    const obs = new IntersectionObserver(
      entries => {
        for (const e of entries) {
          visibility.set(e.target.id, e.intersectionRatio);
        }
        let bestId: string | null = null;
        let bestRatio = 0;
        for (const id of ids) {
          const r = visibility.get(id) ?? 0;
          if (r > bestRatio) {
            bestRatio = r;
            bestId = id;
          }
        }
        if (bestId) {
          const next = bestId;
          setActive(prev => (prev === next ? prev : next));
        }
      },
      { rootMargin: "-120px 0px -55% 0px", threshold: [0, 0.1, 0.25, 0.5, 0.75, 1] }
    );
    elements.forEach(el => obs.observe(el));
    return () => obs.disconnect();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ids.join("|")]);

  const onClick = (id: string) => {
    const el = document.getElementById(id);
    if (!el) return;
    setActive(id);
    const top = el.getBoundingClientRect().top + window.scrollY - 96;
    window.scrollTo({ top, behavior: "smooth" });
  };

  return (
    <div className="detail-tabs detail-tabs--sticky" ref={stripRef}>
      {tabs.map(t => (
        <button
          key={t.id}
          type="button"
          className={active === t.id ? "active" : ""}
          onClick={() => onClick(t.id)}
        >
          {t.label}
          {t.count !== undefined && t.count !== null && t.count !== "" && (
            <span
              className="count-pill"
              style={
                t.countTone === "purple"
                  ? { background: "rgba(168,85,247,0.15)", color: "var(--purple)" }
                  : undefined
              }
            >
              {t.count}
            </span>
          )}
        </button>
      ))}
    </div>
  );
}
