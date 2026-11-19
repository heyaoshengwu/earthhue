import nodemailer from "nodemailer";
import type { Transporter } from "nodemailer";

/**
 * Outbound email for contact-form inquiries.
 *
 * The transport is configured entirely from the environment, so the site
 * runs with no mail service at all (inquiries are still stored in the
 * database) and starts delivering the moment credentials are added.
 *
 * earthhue.net's MX records point at Zoho Mail, so the natural
 * configuration is:
 *
 *   SMTP_HOST=smtp.zoho.com
 *   SMTP_PORT=465
 *   SMTP_SECURE=true
 *   SMTP_USER=tech@earthhue.net
 *   SMTP_PASS=<zoho app password>
 */

export type Inquiry = {
  name: string;
  email: string;
  company: string;
  subject: string;
  message: string;
  locale: string;
};

export type MailResult = { delivered: boolean; error?: string };

function env(name: string): string {
  return (process.env[name] || "").trim();
}

/** True when enough SMTP configuration is present to attempt a delivery. */
export function mailConfigured(): boolean {
  return Boolean(env("SMTP_HOST") && env("SMTP_USER") && env("SMTP_PASS"));
}

/** Where inquiries are delivered. */
export function contactRecipient(): string {
  return env("CONTACT_TO") || env("SMTP_USER") || "tech@earthhue.net";
}

let transporter: Transporter | null = null;

function getTransporter(): Transporter {
  if (!transporter) {
    transporter = nodemailer.createTransport({
      host: env("SMTP_HOST"),
      port: Number(env("SMTP_PORT") || 587),
      secure: (env("SMTP_SECURE") || "true").toLowerCase() === "true",
      auth: { user: env("SMTP_USER"), pass: env("SMTP_PASS") },
      connectionTimeout: 15000,
      greetingTimeout: 15000,
      socketTimeout: 20000,
    });
  }
  return transporter;
}

const escapeHtml = (s: string) =>
  s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");

/** Deliver one inquiry. Never throws — the caller always persists first. */
export async function sendInquiryEmail(inquiry: Inquiry): Promise<MailResult> {
  if (!mailConfigured()) {
    return { delivered: false, error: "SMTP is not configured on this server" };
  }
  const to = contactRecipient();
  const from = env("SMTP_FROM") || env("SMTP_USER");
  const subject = `[EarthHue inquiry] ${inquiry.subject} — ${inquiry.name}${
    inquiry.company ? ` (${inquiry.company})` : ""
  }`;

  const lines = [
    `Name: ${inquiry.name}`,
    `Email: ${inquiry.email}`,
    `Company: ${inquiry.company || "-"}`,
    `Subject: ${inquiry.subject}`,
    `Page locale: ${inquiry.locale || "-"}`,
    "",
    inquiry.message,
  ];

  try {
    await getTransporter().sendMail({
      from,
      to,
      replyTo: inquiry.email,
      subject,
      text: lines.join("\n"),
      html: `<div style="font-family:system-ui,-apple-system,Segoe UI,Roboto,sans-serif;font-size:15px;line-height:1.6;color:#1f2937">
  <p><strong>New website inquiry</strong></p>
  <table cellpadding="4" cellspacing="0" style="border-collapse:collapse;margin-bottom:16px">
    <tr><td style="color:#6b7280">Name</td><td><strong>${escapeHtml(inquiry.name)}</strong></td></tr>
    <tr><td style="color:#6b7280">Email</td><td><a href="mailto:${escapeHtml(inquiry.email)}">${escapeHtml(inquiry.email)}</a></td></tr>
    <tr><td style="color:#6b7280">Company</td><td>${escapeHtml(inquiry.company || "-")}</td></tr>
    <tr><td style="color:#6b7280">Subject</td><td>${escapeHtml(inquiry.subject)}</td></tr>
    <tr><td style="color:#6b7280">Locale</td><td>${escapeHtml(inquiry.locale || "-")}</td></tr>
  </table>
  <div style="white-space:pre-wrap;border-top:1px solid #e5e7eb;padding-top:12px">${escapeHtml(inquiry.message)}</div>
</div>`,
    });
    return { delivered: true };
  } catch (err: any) {
    return { delivered: false, error: String(err?.message || err).slice(0, 500) };
  }
}
