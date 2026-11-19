import React from "react";

/**
 * Minimal, dependency-free Markdown renderer.
 *
 * The content it renders is Markdown produced by our own content pipeline
 * (geo-publisher) or written in the admin editor, so it covers the subset we
 * actually publish: headings, paragraphs, lists, tables, blockquotes, code
 * fences, horizontal rules, bold/italic/code, links and images.
 *
 * It renders to React elements rather than dangerouslySetInnerHTML, so no
 * untrusted HTML can reach the DOM.
 */

type Block =
  | { type: "heading"; level: number; text: string }
  | { type: "paragraph"; text: string }
  | { type: "list"; ordered: boolean; items: string[] }
  | { type: "table"; header: string[]; rows: string[][] }
  | { type: "quote"; text: string }
  | { type: "code"; lang: string; text: string }
  | { type: "hr" };

function splitRow(line: string): string[] {
  return line
    .replace(/^\s*\|/, "")
    .replace(/\|\s*$/, "")
    .split("|")
    .map((c) => c.trim());
}

function isTableDivider(line: string): boolean {
  return /^\s*\|?[\s:|-]*-[\s:|-]*\|?\s*$/.test(line) && line.includes("-");
}

function parseBlocks(markdown: string): Block[] {
  const lines = markdown.replace(/\r\n/g, "\n").split("\n");
  const blocks: Block[] = [];
  let i = 0;

  while (i < lines.length) {
    const line = lines[i];

    if (!line.trim()) {
      i++;
      continue;
    }

    // fenced code
    const fence = line.match(/^\s*```(\w*)\s*$/);
    if (fence) {
      const buf: string[] = [];
      i++;
      while (i < lines.length && !/^\s*```\s*$/.test(lines[i])) {
        buf.push(lines[i]);
        i++;
      }
      i++; // closing fence
      blocks.push({ type: "code", lang: fence[1] || "", text: buf.join("\n") });
      continue;
    }

    // horizontal rule
    if (/^\s*([-*_])\s*\1\s*\1[\s\-*_]*$/.test(line)) {
      blocks.push({ type: "hr" });
      i++;
      continue;
    }

    // heading
    const heading = line.match(/^(#{1,6})\s+(.*)$/);
    if (heading) {
      blocks.push({ type: "heading", level: heading[1].length, text: heading[2].trim() });
      i++;
      continue;
    }

    // table
    if (line.includes("|") && i + 1 < lines.length && isTableDivider(lines[i + 1])) {
      const header = splitRow(line);
      i += 2;
      const rows: string[][] = [];
      while (i < lines.length && lines[i].includes("|") && lines[i].trim()) {
        rows.push(splitRow(lines[i]));
        i++;
      }
      blocks.push({ type: "table", header, rows });
      continue;
    }

    // blockquote
    if (/^\s*>\s?/.test(line)) {
      const buf: string[] = [];
      while (i < lines.length && /^\s*>\s?/.test(lines[i])) {
        buf.push(lines[i].replace(/^\s*>\s?/, ""));
        i++;
      }
      blocks.push({ type: "quote", text: buf.join(" ") });
      continue;
    }

    // list
    const bullet = line.match(/^\s*[-*+]\s+(.*)$/);
    const ordered = line.match(/^\s*\d+[.)]\s+(.*)$/);
    if (bullet || ordered) {
      const isOrdered = !!ordered;
      const items: string[] = [];
      while (i < lines.length) {
        const m = isOrdered
          ? lines[i].match(/^\s*\d+[.)]\s+(.*)$/)
          : lines[i].match(/^\s*[-*+]\s+(.*)$/);
        if (!m) break;
        items.push(m[1].trim());
        i++;
      }
      blocks.push({ type: "list", ordered: isOrdered, items });
      continue;
    }

    // paragraph (consume until blank line or a block starter)
    const buf: string[] = [];
    while (i < lines.length && lines[i].trim()) {
      const l = lines[i];
      if (
        /^(#{1,6})\s+/.test(l) ||
        /^\s*[-*+]\s+/.test(l) ||
        /^\s*\d+[.)]\s+/.test(l) ||
        /^\s*>\s?/.test(l) ||
        /^\s*```/.test(l)
      ) {
        break;
      }
      buf.push(l);
      i++;
    }
    if (buf.length) blocks.push({ type: "paragraph", text: buf.join(" ") });
  }

  return blocks;
}

/** Inline formatting: bold, italic, inline code, links, images. */
function renderInline(text: string, keyPrefix: string): React.ReactNode[] {
  const nodes: React.ReactNode[] = [];
  const pattern =
    /(!\[[^\]]*\]\([^)]+\))|(\[[^\]]+\]\([^)]+\))|(\*\*[^*]+\*\*)|(__[^_]+__)|(\*[^*\n]+\*)|(_[^_\n]+_)|(`[^`]+`)/g;
  let last = 0;
  let match: RegExpExecArray | null;
  let n = 0;

  while ((match = pattern.exec(text)) !== null) {
    if (match.index > last) nodes.push(text.slice(last, match.index));
    const token = match[0];
    const key = `${keyPrefix}-i${n++}`;

    if (token.startsWith("![")) {
      const m = token.match(/^!\[([^\]]*)\]\(([^)]+)\)$/);
      if (m) {
        nodes.push(
          // eslint-disable-next-line @next/next/no-img-element
          <img key={key} src={m[2]} alt={m[1]} className="rounded-xl my-4 max-w-full" loading="lazy" decoding="async" />
        );
      }
    } else if (token.startsWith("[")) {
      const m = token.match(/^\[([^\]]+)\]\(([^)]+)\)$/);
      if (m) {
        const external = /^https?:\/\//i.test(m[2]);
        nodes.push(
          <a
            key={key}
            href={m[2]}
            className="text-sage-700 underline underline-offset-2 hover:text-sage-900"
            {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
          >
            {m[1]}
          </a>
        );
      }
    } else if (token.startsWith("**") || token.startsWith("__")) {
      nodes.push(<strong key={key}>{token.slice(2, -2)}</strong>);
    } else if (token.startsWith("`")) {
      nodes.push(
        <code key={key} className="bg-earth-100 text-earth-800 px-1.5 py-0.5 rounded text-[0.9em]">
          {token.slice(1, -1)}
        </code>
      );
    } else {
      nodes.push(<em key={key}>{token.slice(1, -1)}</em>);
    }
    last = match.index + token.length;
  }
  if (last < text.length) nodes.push(text.slice(last));
  return nodes;
}

export function Markdown({ content }: { content: string }) {
  const blocks = parseBlocks(content || "");

  return (
    <div className="text-earth-700 leading-relaxed">
      {blocks.map((block, i) => {
        const key = `b${i}`;
        switch (block.type) {
          case "heading": {
            const Tag = (`h${Math.min(block.level + 1, 6)}`) as keyof React.JSX.IntrinsicElements;
            const sizes: Record<number, string> = {
              1: "text-3xl md:text-4xl font-bold text-earth-900 mt-10 mb-4",
              2: "text-2xl md:text-3xl font-bold text-earth-900 mt-10 mb-4",
              3: "text-xl md:text-2xl font-semibold text-earth-900 mt-8 mb-3",
              4: "text-lg font-semibold text-earth-900 mt-6 mb-3",
              5: "text-base font-semibold text-earth-900 mt-5 mb-2",
              6: "text-sm font-semibold uppercase tracking-wider text-earth-700 mt-4 mb-2",
            };
            return (
              <Tag key={key} className={sizes[block.level] || sizes[2]}>
                {renderInline(block.text, key)}
              </Tag>
            );
          }
          case "paragraph":
            return (
              <p key={key} className="mb-4">
                {renderInline(block.text, key)}
              </p>
            );
          case "list":
            return block.ordered ? (
              <ol key={key} className="list-decimal pl-6 mb-4 space-y-1">
                {block.items.map((item, j) => (
                  <li key={`${key}-${j}`}>{renderInline(item, `${key}-${j}`)}</li>
                ))}
              </ol>
            ) : (
              <ul key={key} className="list-disc pl-6 mb-4 space-y-1">
                {block.items.map((item, j) => (
                  <li key={`${key}-${j}`}>{renderInline(item, `${key}-${j}`)}</li>
                ))}
              </ul>
            );
          case "table":
            return (
              <div key={key} className="overflow-x-auto my-6">
                <table className="w-full text-sm border-collapse">
                  <thead>
                    <tr>
                      {block.header.map((h, j) => (
                        <th
                          key={`${key}-h${j}`}
                          scope="col"
                          className="px-3 py-2.5 text-left font-semibold text-earth-900 bg-earth-50 border border-earth-200"
                        >
                          {renderInline(h, `${key}-h${j}`)}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {block.rows.map((row, r) => (
                      <tr key={`${key}-r${r}`}>
                        {row.map((cell, c) => (
                          <td
                            key={`${key}-r${r}c${c}`}
                            className="px-3 py-2.5 border border-earth-200 align-top"
                          >
                            {renderInline(cell, `${key}-r${r}c${c}`)}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            );
          case "quote":
            return (
              <blockquote
                key={key}
                className="border-l-4 border-sage-500 bg-earth-50 px-4 py-3 my-5 rounded-r-lg text-earth-800"
              >
                {renderInline(block.text, key)}
              </blockquote>
            );
          case "code":
            return (
              <pre
                key={key}
                className="bg-earth-900 text-earth-100 rounded-xl p-4 overflow-x-auto my-5 text-sm"
              >
                <code>{block.text}</code>
              </pre>
            );
          case "hr":
            return <hr key={key} className="border-earth-200 my-8" />;
          default:
            return null;
        }
      })}
    </div>
  );
}
