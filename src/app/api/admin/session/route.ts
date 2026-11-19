import { NextRequest, NextResponse } from "next/server";
import { adminPassword, adminSecret, issueAdminToken, safeEqual } from "@/lib/adminAuth";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * Admin session.
 *
 * The password is checked here, on the server, and the browser only ever
 * receives a signed, expiring token. The password itself is no longer part
 * of the client bundle.
 */

export async function POST(req: NextRequest) {
  const expected = adminPassword();
  if (!expected) {
    return NextResponse.json(
      { error: "Admin access is not configured on this server" },
      { status: 503 }
    );
  }
  if (!adminSecret()) {
    return NextResponse.json(
      { error: "Admin session secret is not configured on this server" },
      { status: 503 }
    );
  }

  let body: any = {};
  try {
    body = await req.json();
  } catch {
    /* empty body is treated as a missing password */
  }

  const supplied = String(body?.password ?? "");
  if (!supplied || !safeEqual(supplied, expected)) {
    // Small delay makes online password guessing less useful.
    await new Promise((r) => setTimeout(r, 400));
    return NextResponse.json({ error: "Incorrect password" }, { status: 401 });
  }

  return NextResponse.json({ ok: true, token: issueAdminToken() });
}
