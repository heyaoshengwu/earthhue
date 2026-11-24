import { buildMarkdownFor } from "@/lib/llms";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * Markdown mirror of the locale home page: /md/{locale}.
 *
 * The catch-all sibling handles /md/{locale}/{path}. A catch-all route needs
 * at least one segment, so the bare locale fell through to the 404 page and
 * the mirror did not actually cover every page. This route closes that gap.
 */
export async function GET(
  _req: Request,
  ctx: { params: Promise<{ locale: string }> }
) {
  const { locale } = await ctx.params;
  const md = buildMarkdownFor(locale, []);

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
