import { buildLlmsTxt } from "@/lib/llms";
import { LOCALES } from "@/lib/seo";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * /{locale}/llms.txt — the same machine-readable map in each language tree.
 *
 * Previously the only entry point was the root /llms.txt, which is English by
 * construction: a Chinese crawler had no localized map to read, and the
 * "Other languages" section pointed at bare home pages with no llms.txt of
 * their own.
 */
export async function GET(
  _request: Request,
  { params }: { params: Promise<{ locale: string }> }
) {
  const { locale } = await params;

  if (!(LOCALES as readonly string[]).includes(locale)) {
    return new Response("Not found", {
      status: 404,
      headers: { "Content-Type": "text/plain; charset=utf-8" },
    });
  }

  return new Response(buildLlmsTxt(locale), {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "public, max-age=3600, s-maxage=86400",
    },
  });
}
