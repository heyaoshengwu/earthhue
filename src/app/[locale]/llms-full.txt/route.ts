import { buildLlmsFullTxt } from "@/lib/llms";
import { LOCALES } from "@/lib/seo";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/** /{locale}/llms-full.txt — the localized verbatim corpus. */
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

  return new Response(buildLlmsFullTxt(locale), {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "public, max-age=3600, s-maxage=86400",
    },
  });
}
