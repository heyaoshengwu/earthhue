import { NextRequest, NextResponse } from "next/server";
import crypto from "node:crypto";
import { getDb } from "@/lib/db";
import {
  ANALYTICS_EVENTS,
  classifyReferrer,
  classifyTarget,
  type AnalyticsEvent,
} from "@/lib/analytics";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * The analytics beacon.
 *
 * The browser sends raw facts only. The referrer class, the target class and
 * the hashed address are all decided here, so there is one implementation of
 * each rule and the numbers cannot be forged from the client.
 */

const MAX_FIELD = 1000;

function clean(value: unknown, max = MAX_FIELD): string {
  return String(value ?? "").trim().slice(0, max);
}

/**
 * Truncate the address to a /24 and salt it. Enough to tell one visitor
 * from another without keeping anything that identifies a person.
 */
function hashIp(ip: string): string {
  if (!ip) return "";
  const first = ip.split(",")[0].trim();
  const trimmed = first.includes(":") ? first.split(":").slice(0, 4).join(":") : first.split(".").slice(0, 3).join(".");
  const salt = process.env.ANALYTICS_SALT || process.env.ADMIN_SECRET || "earthhue";
  return crypto.createHash("sha256").update(salt + "|" + trimmed).digest("hex").slice(0, 16);
}

export async function POST(request: NextRequest) {
  try {
    const raw = await request.text();
    if (!raw) return NextResponse.json({ error: "Empty body" }, { status: 400 });

    let body: Record<string, unknown>;
    try {
      body = JSON.parse(raw) as Record<string, unknown>;
    } catch {
      return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
    }

    const type = clean(body.type, 40) as AnalyticsEvent;
    if (!ANALYTICS_EVENTS.includes(type)) {
      return NextResponse.json({ error: "Unknown event type" }, { status: 400 });
    }

    const origin = request.nextUrl.origin;
    const path = clean(body.path, 500);
    const referrer = clean(body.referrer, 500);
    const target = clean(body.target, 500);
    const session = clean(body.sid, 64);
    const locale = clean(body.locale, 10);

    const db = getDb();
    db.prepare(
      `INSERT INTO analytics_events
         (type, locale, path, referrer, referrer_class, target, target_kind, session, ua, ip_hash)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
    ).run(
      type,
      locale,
      path,
      referrer,
      classifyReferrer(referrer, origin),
      target,
      classifyTarget(target, origin),
      session,
      clean(request.headers.get("user-agent"), 300),
      hashIp(request.headers.get("x-forwarded-for") || "")
    );

    return new NextResponse(null, { status: 204 });
  } catch (error) {
    console.error("Analytics beacon error:", error);
    return NextResponse.json({ error: "Failed to record" }, { status: 500 });
  }
}
