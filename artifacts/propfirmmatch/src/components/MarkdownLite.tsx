import { ReactNode } from "react";

export interface MdSection {
  id: string;
  text: string;
  level: 2 | 3;
}

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\u4e00-\u9fa5]+/g, "-")
    .replace(/^-|-$/g, "");
}

function renderInline(text: string): ReactNode[] {
  const out: ReactNode[] = [];
  const re = /\*\*(.+?)\*\*|`([^`]+?)`/g;
  let last = 0;
  let m: RegExpExecArray | null;
  let key = 0;
  while ((m = re.exec(text)) !== null) {
    if (m.index > last) out.push(text.slice(last, m.index));
    if (m[1] !== undefined) out.push(<strong key={key++}>{m[1]}</strong>);
    else if (m[2] !== undefined) out.push(<code key={key++} className="md-code">{m[2]}</code>);
    last = m.index + m[0].length;
  }
  if (last < text.length) out.push(text.slice(last));
  return out;
}

export function extractSections(md: string): MdSection[] {
  const lines = md.split("\n");
  const out: MdSection[] = [];
  let inFence = false;
  for (const line of lines) {
    if (line.startsWith("```")) { inFence = !inFence; continue; }
    if (inFence) continue;
    const m2 = /^##\s+(.+)/.exec(line);
    const m3 = /^###\s+(.+)/.exec(line);
    if (m2) out.push({ id: slugify(m2[1]), text: m2[1].trim(), level: 2 });
    else if (m3) out.push({ id: slugify(m3[1]), text: m3[1].trim(), level: 3 });
  }
  return out;
}

export default function MarkdownLite({ source }: { source: string }) {
  const lines = source.split("\n");
  const nodes: ReactNode[] = [];
  let i = 0;
  let key = 0;

  while (i < lines.length) {
    const line = lines[i];

    if (line.startsWith("```")) {
      const buf: string[] = [];
      i++;
      while (i < lines.length && !lines[i].startsWith("```")) {
        buf.push(lines[i]);
        i++;
      }
      i++;
      nodes.push(<pre key={key++} className="md-pre"><code>{buf.join("\n")}</code></pre>);
      continue;
    }

    const h2 = /^##\s+(.+)/.exec(line);
    if (h2) {
      const text = h2[1].trim();
      nodes.push(<h2 key={key++} id={slugify(text)} className="md-h2">{text}</h2>);
      i++; continue;
    }
    const h3 = /^###\s+(.+)/.exec(line);
    if (h3) {
      const text = h3[1].trim();
      nodes.push(<h3 key={key++} id={slugify(text)} className="md-h3">{text}</h3>);
      i++; continue;
    }

    if (line.startsWith("> ")) {
      const buf: string[] = [line.slice(2)];
      i++;
      while (i < lines.length && lines[i].startsWith("> ")) {
        buf.push(lines[i].slice(2));
        i++;
      }
      nodes.push(<blockquote key={key++} className="md-quote">{renderInline(buf.join(" "))}</blockquote>);
      continue;
    }

    if (line.startsWith("|") && i + 1 < lines.length && /^\|[\s\-:|]+\|$/.test(lines[i + 1])) {
      const header = line.split("|").slice(1, -1).map(s => s.trim());
      i += 2;
      const rows: string[][] = [];
      while (i < lines.length && lines[i].startsWith("|")) {
        rows.push(lines[i].split("|").slice(1, -1).map(s => s.trim()));
        i++;
      }
      nodes.push(
        <div key={key++} className="md-table-wrap">
          <table className="md-table">
            <thead>
              <tr>{header.map((h, k) => <th key={k}>{renderInline(h)}</th>)}</tr>
            </thead>
            <tbody>
              {rows.map((r, ri) => (
                <tr key={ri}>{r.map((c, k) => <td key={k}>{renderInline(c)}</td>)}</tr>
              ))}
            </tbody>
          </table>
        </div>
      );
      continue;
    }

    if (/^(-|\*|\d+\.)\s+/.test(line)) {
      const isOrdered = /^\d+\.\s+/.test(line);
      const buf: { text: string; checked?: boolean }[] = [];
      while (i < lines.length && /^(-|\*|\d+\.)\s+/.test(lines[i])) {
        const item = lines[i].replace(/^(-|\*|\d+\.)\s+/, "");
        const cb = /^\[( |x|X)\]\s+(.*)$/.exec(item);
        if (cb) buf.push({ text: cb[2], checked: cb[1].toLowerCase() === "x" });
        else buf.push({ text: item });
        i++;
      }
      const Tag = isOrdered ? "ol" : "ul";
      nodes.push(
        <Tag key={key++} className="md-list">
          {buf.map((b, k) => (
            <li key={k}>
              {b.checked !== undefined && (
                <input type="checkbox" checked={b.checked} readOnly style={{ marginRight: 6 }} />
              )}
              {renderInline(b.text)}
            </li>
          ))}
        </Tag>
      );
      continue;
    }

    if (line.trim() === "") { i++; continue; }

    const buf: string[] = [line];
    i++;
    while (i < lines.length && lines[i].trim() !== "" && !/^(#|>|-|\*|\d+\.|```|\|)/.test(lines[i])) {
      buf.push(lines[i]);
      i++;
    }
    nodes.push(<p key={key++} className="md-p">{renderInline(buf.join(" "))}</p>);
  }

  return <div className="md-body">{nodes}</div>;
}
