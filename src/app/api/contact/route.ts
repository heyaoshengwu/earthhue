import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/lib/db";
import { sendInquiryEmail, mailConfigured } from "@/lib/mailer";
import { isAdminAuthorized } from "@/lib/adminAuth";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * Contact form.
 *
 * Every submission is written to the database first, so an inquiry can never
 * be lost — not if SMTP is down, not if the mail provider rate-limits us, not
 * if the server restarts. Delivery by email is a second step on top of that,
 * and its outcome is recorded on the row.
 *
 * Reading submissions back requires an admin session token.
 */

const MAX_FIELD = 5000;

function clean(value: unknown, max = MAX_FIELD): string {
  return String(value ?? "").trim().slice(0, max);
}

export async function POST(request: NextRequest) {
  try {
    let raw: unknown;
    try {
      raw = await request.json();
    } catch {
      return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
    }
    const body = (raw && typeof raw === "object" ? raw : {}) as Record<string, unknown>;
    const name = clean(body.name, 200);
    const email = clean(body.email, 200);
    const company = clean(body.company, 200);
    const subject = clean(body.subject, 200) || "general";
    const message = clean(body.message);
    const locale = clean(body.locale, 10);

    // Qualification and attribution. These are the fields that turn an
    // inquiry into something that can be routed, counted and mined back into
    // the page that should have answered the question.
    const product = clean(body.product, 200);
    const application = clean(body.application, 200);
    const market = clean(body.market, 100);
    const volume = clean(body.volume, 100);
    const grade = clean(body.grade, 100);
    const quantity = clean(body.quantity, 100);
    const intent = clean(body.intent, 100);
    const sourcePage = clean(body.source_page, 300);
    const referrer = clean(body.referrer, 500);

    if (!name || !email || !message) {
      return NextResponse.json(
        { error: "Name, email, and message are required" },
        { status: 400 }
      );
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json({ error: "Invalid email format" }, { status: 400 });
    }

    const db = getDb();
    const info = db
      .prepare(
        `INSERT INTO contact_submissions
           (name, email, company, subject, message, locale,
            product, application, market, volume, grade, quantity, intent,
            source_page, referrer, delivery_status, ip, user_agent)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'stored', ?, ?)`
      )
      .run(
        name,
        email,
        company,
        subject,
        message,
        locale,
        product,
        application,
        market,
        volume,
        grade,
        quantity,
        intent,
        sourcePage,
        referrer,
        request.headers.get("x-forwarded-for") || "",
        clean(request.headers.get("user-agent"), 300)
      );

    const id = Number(info.lastInsertRowid);

    // Persisted first, delivered second. A mail failure never loses the lead.
    const mail = await sendInquiryEmail({ name, email, company, subject, message, locale });
    db.prepare("UPDATE contact_submissions SET delivery_status = ?, delivery_error = ? WHERE id = ?").run(
      mail.delivered ? "sent" : "stored",
      mail.error ?? null,
      id
    );

    return NextResponse.json({
      success: true,
      message: "Thank you for your message. We will respond within 24-48 hours.",
      id,
      emailDelivered: mail.delivered,
    });
  } catch (error) {
    console.error("Contact form error:", error);
    return NextResponse.json(
      { error: "Failed to submit form. Please try again." },
      { status: 500 }
    );
  }
}

/** List stored inquiries. Admin session token required. */
export async function GET(req: NextRequest) {
  if (!isAdminAuthorized(req)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const db = getDb();
  const limit = Math.min(Number(req.nextUrl.searchParams.get("limit") || 200), 1000);
  const rows = db
    .prepare("SELECT * FROM contact_submissions ORDER BY id DESC LIMIT ?")
    .all(limit);
  const total = db.prepare("SELECT COUNT(*) AS c FROM contact_submissions").get() as { c: number };
  return NextResponse.json({
    submissions: rows,
    total: total.c,
    mailConfigured: mailConfigured(),
  });
}
