import { useState } from "react";
import { MIND_MAP_ROOT, type MindMapNode } from "../../data/knowledgeGraph";

function Branch({ node, depth = 0 }: { node: MindMapNode; depth?: number }) {
  const [open, setOpen] = useState(depth < 1);
  const has = !!node.children?.length;
  return (
    <div className={`kg-branch kg-branch-d${depth}`}>
      <button
        type="button"
        className="kg-node"
        onClick={() => has && setOpen((o) => !o)}
        aria-expanded={open}
      >
        {has && <span className="kg-caret">{open ? "▾" : "▸"}</span>}
        <span className="kg-node-label">{node.label}</span>
      </button>
      {node.summary && <div className="kg-node-summary">{node.summary}</div>}
      {has && open && (
        <div className="kg-children">
          {node.children!.map((c) => (
            <Branch key={c.id} node={c} depth={depth + 1} />
          ))}
        </div>
      )}
    </div>
  );
}

export default function MindMap() {
  return (
    <div className="kg-mindmap">
      <Branch node={MIND_MAP_ROOT} />
    </div>
  );
}
