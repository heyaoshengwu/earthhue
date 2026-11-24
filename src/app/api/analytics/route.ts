import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/lib/db";
import { isAdminAuthorized } from "@/lib/adminAuth";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * Analytics read-out. Admin session token required.
 *
 * Four numbers matter: how many inquiries arrived, where they came from, how
 * many people arrived from an answer engine, and which pages earned the
 * traffic. Everything else here supports those four.
 */

function daysAgo(days: number): string {
  const d = new Date(Date.now() - days * 24 * 60 * 60 * 1000);
  return d.toISOString().slice(0, 19).replace("T", " ");
}

export async function GET(req: NextRequest) {
  if (!isAdminAuthorized(req)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const days = Math.min(Math.max(Number(req.nextUrl.searchParams.get("days") || 30), 1), 365);
  const since = daysAgo(days);
  const prevSince = daysAgo(days * 2);
  const db = getDb();

  const events = db
    .prepare(
      `SELECT type, COUNT(*) AS c FROM analytics_events WHERE created_at >= ? GROUP BY type`
    )
    .all(since) as { type: string; c: number }[];

  const eventsPrev = db
    .prepare(
      `SELECT type, COUNT(*) AS c FROM analytics_events WHERE created_at >= ? AND created_at < ? GROUP BY type`
    )
    .all(prevSince, since) as { type: string; c: number }[];

  const daily = db
    .prepare(
      `SELECT date(created_at) AS day,
              SUM(CASE WHEN type = 'page_view' THEN 1 ELSE 0 END) AS views,
              SUM(CASE WHEN type = 'form_submit' THEN 1 ELSE 0 END) AS submits
         FROM analytics_events
        WHERE created_at >= ?
        GROUP BY day
        ORDER BY day`
    )
    .all(since);

  const topPages = db
    .prepare(
      `SELECT path, locale, COUNT(*) AS views
         FROM analytics_events
        WHERE type = 'page_view' AND created_at >= ?
        GROUP BY path
        ORDER BY views DESC
        LIMIT 25`
    )
    .all(since);

  const referrers = db
    .prepare(
      `SELECT referrer_class AS bucket, COUNT(*) AS c, COUNT(DISTINCT session) AS visitors
         FROM analytics_events
        WHERE type = 'page_view' AND created_at >= ? AND referrer_class != 'internal'
        GROUP BY referrer_class
        ORDER BY c DESC`
    )
    .all(since);

  const aiReferrers = db
    .prepare(
      `SELECT referrer, COUNT(*) AS c
         FROM analytics_events
        WHERE type = 'page_view' AND referrer_class = 'ai' AND created_at >= ?
        GROUP BY referrer
        ORDER BY c DESC
        LIMIT 15`
    )
    .all(since);

  const clicked = db
    .prepare(
      `SELECT target, target_kind, COUNT(*) AS c
         FROM analytics_events
        WHERE type = 'link_click' AND created_at >= ?
        GROUP BY target, target_kind
        ORDER BY c DESC
        LIMIT 25`
    )
    .all(since);

  const inquiryTotal = db
    .prepare("SELECT COUNT(*) AS c FROM contact_submissions WHERE created_at >= ?")
    .get(since) as { c: number };

  const inquiryPrev = db
    .prepare("SELECT COUNT(*) AS c FROM contact_submissions WHERE created_at >= ? AND created_at < ?")
    .get(prevSince, since) as { c: number };

  const inquiries = db
    .prepare(
      `SELECT id, name, company, email, subject, product, application, market, volume,
              grade, quantity, intent, source_page, referrer, status, created_at
         FROM contact_submissions
        WHERE created_at >= ?
        ORDER BY id DESC
        LIMIT 100`
    )
    .all(since);

  const bySource = db
    .prepare(
      `SELECT COALESCE(NULLIF(source_page,''),'(not recorded)') AS source, COUNT(*) AS c
         FROM contact_submissions
        WHERE created_at >= ?
        GROUP BY source
        ORDER BY c DESC`
    )
    .all(since);

  const byProduct = db
    .prepare(
      `SELECT COALESCE(NULLIF(product,''),'(not stated)') AS product, COUNT(*) AS c
         FROM contact_submissions
        WHERE created_at >= ?
        GROUP BY product
        ORDER BY c DESC`
    )
    .all(since);

  const byApplication = db
    .prepare(
      `SELECT COALESCE(NULLIF(application,''),'(not stated)') AS application, COUNT(*) AS c
         FROM contact_submissions
        WHERE created_at >= ?
        GROUP BY application
        ORDER BY c DESC`
    )
    .all(since);

  const byMarket = db
    .prepare(
      `SELECT COALESCE(NULLIF(market,''),'(not stated)') AS market, COUNT(*) AS c
         FROM contact_submissions
        WHERE created_at >= ?
        GROUP BY market
        ORDER BY c DESC`
    )
    .all(since);

  const byLocale = db
    .prepare(
      `SELECT locale, COUNT(*) AS c
         FROM analytics_events
        WHERE type = 'page_view' AND created_at >= ?
        GROUP BY locale
        ORDER BY c DESC`
    )
    .all(since);

  const toMap = (rows: { type: string; c: number }[]) => {
    const map: Record<string, number> = {};
    for (const r of rows) map[r.type] = r.c;
    return map;
  };

  const current = toMap(events);
  const previous = toMap(eventsPrev);

  return NextResponse.json({
    days,
    since,
    totals: {
      pageViews: current.page_view || 0,
      linkClicks: current.link_click || 0,
      formStarts: current.form_start || 0,
      formSubmits: current.form_submit || 0,
      inquiries: inquiryTotal.c,
    },
    previous: {
      pageViews: previous.page_view || 0,
      inquiries: inquiryPrev.c,
    },
    daily,
    topPages,
    referrers,
    aiReferrers,
    clicked,
    byLocale,
    inquiries,
    inquiryBreakdown: {
      bySource,
      byProduct,
      byApplication,
      byMarket,
    },
  });
}
