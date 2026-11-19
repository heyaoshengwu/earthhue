import { buildMarkdownFor } from "@/lib/llms";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * Machine-readable markdown mirror: /md/{locale}/{path}.md
 * Example: /md/en/products/eh-lutein-ferment-120.md
 */
export async function GET(
  _req: Request,
  ctx: { params: Promise<{ locale: string; path: string[] }> }
) {
  const { locale, path } = await ctx.params;
  const segments = (path || []).map((seg) => seg.replace(/\.md$/i, ""));
  const md = buildMarkdownFor(locale, segments);

  if (!md) {
    return new Response("Not found", {
      status: 404,
      headers: { "Content-Type": "text/plain; charset=utf-8" },
    });
  }

  return new Response(md, {
    headers: {
      "Content-Type": "text/markdown; charset=utf-8",
      "Cache-Control": "public, max-age=3600, s-maxage=86400",
    },
  });
}
