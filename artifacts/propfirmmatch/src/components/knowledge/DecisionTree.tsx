import { useState } from "react";
import { DECISION_TREE } from "../../data/knowledgeGraph";
import { findFirm } from "../../data/firms";
import { useCategory } from "../../contexts/CategoryContext";
import { TrackedLink } from "./Cta";

export default function DecisionTree() {
  const [path, setPath] = useState<string[]>(["start"]);
  const cat = useCategory();
  const currentId = path[path.length - 1];
  const node = DECISION_TREE[currentId];

  if (!node) {
    return <div className="kg-empty">数据缺失：{currentId}</div>;
  }

  const reset = () => setPath(["start"]);
  const back = () => setPath((p) => (p.length > 1 ? p.slice(0, -1) : p));

  return (
    <div className="kg-decision">
      <div className="kg-decision-crumb">
        步骤 {path.length}
        {path.length > 1 && (
          <button className="kg-link-btn" onClick={back}>← 返回上一步</button>
        )}
        {path.length > 1 && (
          <button className="kg-link-btn" onClick={reset}>重置</button>
        )}
      </div>

      {node.question && (
        <>
          <h3 className="kg-question">{node.question}</h3>
          <div className="kg-options">
            {node.options?.map((o) => (
              <button
                key={o.next}
                className="kg-option-btn"
                onClick={() => setPath((p) => [...p, o.next])}
              >
                {o.label}
              </button>
            ))}
          </div>
        </>
      )}

      {node.result && (
        <div className="kg-result-card">
          <div className="kg-result-title">✅ {node.result.title}</div>
          <p className="kg-result-body">{node.result.body}</p>
          {node.result.suggestSlug && (() => {
            const firm = findFirm(node.result.suggestSlug);
            if (!firm) return null;
            return (
              <TrackedLink
                href={`/${cat}/prop-firms/${firm.slug}`}
                track="decision-cta"
                className="kg-cta-btn"
              >
                去 {firm.name} 看这个方案 →
              </TrackedLink>
            );
          })()}
          <button className="kg-link-btn" onClick={reset}>重新测一次</button>
        </div>
      )}
    </div>
  );
}
