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

/**
 * Which subject an intent maps to. The browser derives this too, but the
 * server owns it: a submission that arrives without JavaScript carries the
 * intent and nothing else, and the intent is the better answer.
 */
const INTENT_SUBJECT: Record<string, string> = {
  quote: "product",
  sample: "samples",
  visit: "other",
  partnership: "partnership",
  other: "other",
};

function clean(value: unknown, max = MAX_FIELD): string {
  return String(value ?? "").trim().slice(0, max);
}

function subjectForIntent(intent: string, fallback: string): string {
  if (!intent) return fallback || "general";
  return INTENT_SUBJECT[intent] || fallback || "general";
}

/** The path part of a URL, used to attribute a submission made without JavaScript. */
function pathFrom(url: string): string {
  if (!url) return "";
  try {
    return new URL(url).pathname;
  } catch {
    return url.startsWith("/") ? url : "";
  }
}

/**
 * The page shown when the form was submitted without JavaScript. The inquiry
 * is already stored; this only tells the visitor that it arrived.
 */
function thankYouPage(sourcePage: string): string {
  const back = sourcePage.startsWith("/") ? sourcePage : "/en";
  return `<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <meta name="robots" content="noindex" />
    <title>Inquiry received — EarthHue</title>
    <style>
      body { margin: 0; min-height: 100vh; display: flex; align-items: center;
             justify-content: center; background: #f7f6f2; color: #1f2937;
             font-family: ui-sans-serif, system-ui, -apple-system, "Segoe UI", sans-serif; }
      main { max-width: 34rem; margin: 2rem auto; padding: 2.5rem; background: #fff;
             border: 1px solid #e5e7eb; border-radius: 12px; text-align: center; }
      h1 { font-size: 1.5rem; margin: 0 0 .75rem; }
      p { line-height: 1.6; color: #4b5563; }
      a { display: inline-block; margin-top: 1.25rem; padding: .7rem 1.4rem;
          background: #4f7a5b; color: #fff; border-radius: 8px; text-decoration: none; }
    </style>
  </head>
  <body>
    <main>
      <h1>Thank you for your message.</h1>
      <p>We have received your inquiry and will respond within 24–48 hours.</p>
      <a href="${back.replace(/"/g, "&quot;")}">Back to the site</a>
    </main>
  </body>
</html>`;
}

export async function POST(request: NextRequest) {
  try {
    // The form posts to this route directly as well as through fetch, so a
    // visitor without JavaScript still reaches the database instead of
    // reloading the page and losing everything that was typed.
    const contentType = request.headers.get("content-type") || "";
    const isFormPost = contentType.includes("application/x-www-form-urlencoded");

    let raw: unknown;
    if (isFormPost) {
      const form = await request.formData();
      raw = Object.fromEntries(form.entries());
    } else {
      try {
        raw = await request.json();
      } catch {
        return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
      }
    }
    const body = (raw && typeof raw === "object" ? raw : {}) as Record<string, unknown>;
    const name = clean(body.name, 200);
    const email = clean(body.email, 200);
    const company = clean(body.company, 200);
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
    const subject = subjectForIntent(intent, clean(body.subject, 200));

    const refererHeader = request.headers.get("referer") || "";
    const sourcePage = clean(body.source_page, 300) || pathFrom(refererHeader);
    const referrer = clean(body.referrer, 500) || refererHeader.slice(0, 500);

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

    if (isFormPost) {
      return new NextResponse(thankYouPage(sourcePage), {
        status: 200,
        headers: { "Content-Type": "text/html; charset=utf-8" },
      });
    }

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
