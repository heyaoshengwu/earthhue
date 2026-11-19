#!/usr/bin/env node
/**
 * Operational CLI for contact-form inquiries.
 *
 * Usage:
 *   node scripts/inquiries.mjs list [--limit 20]
 *   node scripts/inquiries.mjs export [--out inquiries.csv]
 *   node scripts/inquiries.mjs resend [--id 12 | --all]
 *
 * It reads the same SQLite database and the same .env.local the site reads,
 * so what it shows is always what the site actually stored.
 */
import fs from "node:fs";
import path from "node:path";
import Database from "better-sqlite3";
import nodemailer from "nodemailer";

const ROOT = process.cwd();

/** Minimal .env.local loader — avoids adding a dotenv dependency. */
function loadEnv(file) {
  if (!fs.existsSync(file)) return {};
  const out = {};
  for (const rawLine of fs.readFileSync(file, "utf8").split(/\r?\n/)) {
    const line = rawLine.trim();
    if (!line || line.startsWith("#")) continue;
    const eq = line.indexOf("=");
    if (eq < 0) continue;
    const key = line.slice(0, eq).trim();
    let value = line.slice(eq + 1).trim();
    if (
      (value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'"))
    ) {
      value = value.slice(1, -1);
    }
    out[key] = value;
  }
  return out;
}

const env = { ...loadEnv(path.join(ROOT, ".env.local")), ...process.env };
const DB_FILE = path.join(ROOT, "data", "site.db");

function openDb() {
  const db = new Database(DB_FILE);
  db.pragma("journal_mode = WAL");
  return db;
}

function parseArgs(argv) {
  const opts = { _: [] };
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    if (a.startsWith("--")) {
      const key = a.slice(2);
      const next = argv[i + 1];
      if (next && !next.startsWith("--")) {
        opts[key] = next;
        i++;
      } else {
        opts[key] = true;
      }
    } else {
      opts._.push(a);
    }
  }
  return opts;
}

function maskEmail(email) {
  const [user, domain] = String(email || "").split("@");
  if (!domain) return email;
  const head = user.slice(0, 2);
  return `${head}${"*".repeat(Math.max(user.length - 2, 1))}@${domain}`;
}

function list(db, limit) {
  const rows = db
    .prepare("SELECT * FROM contact_submissions ORDER BY id DESC LIMIT ?")
    .all(limit);
  const total = db.prepare("SELECT COUNT(*) AS c FROM contact_submissions").get().c;

  console.log(`Total inquiries: ${total}   (showing ${rows.length})`);
  console.log("");
  if (!rows.length) {
    console.log("No inquiries stored yet.");
    return;
  }
  for (const r of rows) {
    console.log(
      `#${r.id}  ${r.created_at}  [${r.delivery_status}]  ${r.name} <${maskEmail(r.email)}>` +
        (r.company ? `  (${r.company})` : "") +
        `  subject=${r.subject}`
    );
    console.log(`      ${String(r.message).replace(/\s+/g, " ").slice(0, 140)}`);
    if (r.delivery_error) console.log(`      delivery note: ${r.delivery_error}`);
  }
}

function csvEscape(v) {
  const s = v === null || v === undefined ? "" : String(v);
  return /[",\n\r]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
}

function exportCsv(db, out) {
  const rows = db.prepare("SELECT * FROM contact_submissions ORDER BY id DESC").all();
  const cols = [
    "id",
    "created_at",
    "name",
    "email",
    "company",
    "subject",
    "message",
    "locale",
    "delivery_status",
    "delivery_error",
  ];
  const lines = [cols.join(",")];
  for (const r of rows) lines.push(cols.map((c) => csvEscape(r[c])).join(","));
  fs.writeFileSync(out, lines.join("\n") + "\n", "utf8");
  console.log(`Exported ${rows.length} inquiries to ${out}`);
}

function mailConfigured() {
  return Boolean(env.SMTP_HOST && env.SMTP_USER && env.SMTP_PASS);
}

async function resend(db, opts) {
  if (!mailConfigured()) {
    console.error("SMTP is not configured (.env.local is missing SMTP_HOST/SMTP_USER/SMTP_PASS).");
    process.exit(1);
  }
  let rows;
  if (opts.id) {
    const row = db.prepare("SELECT * FROM contact_submissions WHERE id = ?").get(Number(opts.id));
    if (!row) {
      console.error(`No inquiry with id ${opts.id}.`);
      process.exit(1);
    }
    rows = [row];
  } else {
    rows = db
      .prepare("SELECT * FROM contact_submissions WHERE delivery_status != 'sent' ORDER BY id ASC")
      .all();
  }
  if (!rows.length) {
    console.log("Nothing to resend.");
    return;
  }

  const to = env.CONTACT_TO || env.SMTP_USER;
  const from = env.SMTP_FROM || env.SMTP_USER;
  const transporter = nodemailer.createTransport({
    host: env.SMTP_HOST,
    port: Number(env.SMTP_PORT || 465),
    secure: (env.SMTP_SECURE || "true").toLowerCase() === "true",
    auth: { user: env.SMTP_USER, pass: env.SMTP_PASS },
    connectionTimeout: 15000,
    greetingTimeout: 15000,
    socketTimeout: 20000,
  });

  let ok = 0;
  let failed = 0;
  for (const r of rows) {
    const subject = `[EarthHue inquiry] ${r.subject} - ${r.name}${
      r.company ? ` (${r.company})` : ""
    }`;
    const text = [
      `Name: ${r.name}`,
      `Email: ${r.email}`,
      `Company: ${r.company || "-"}`,
      `Subject: ${r.subject}`,
      `Page locale: ${r.locale || "-"}`,
      "",
      r.message,
    ].join("\n");
    try {
      await transporter.sendMail({
        from,
        to,
        replyTo: r.email,
        subject,
        text,
      });
      db.prepare(
        "UPDATE contact_submissions SET delivery_status = 'sent', delivery_error = NULL WHERE id = ?"
      ).run(r.id);
      console.log(`#${r.id} sent`);
      ok++;
    } catch (err) {
      const msg = String(err?.message || err).slice(0, 300);
      db.prepare(
        "UPDATE contact_submissions SET delivery_status = 'stored', delivery_error = ? WHERE id = ?"
      ).run(msg, r.id);
      console.error(`#${r.id} FAILED: ${msg}`);
      failed++;
    }
  }
  console.log(`Done. sent=${ok} failed=${failed} total=${rows.length}`);
  if (failed) process.exit(1);
}

async function main() {
  const opts = parseArgs(process.argv.slice(2));
  const cmd = opts._[0] || "list";
  const db = openDb();
  try {
    if (cmd === "list") {
      list(db, Math.min(Number(opts.limit || 20), 1000));
    } else if (cmd === "export") {
      exportCsv(db, String(opts.out || "inquiries.csv"));
    } else if (cmd === "resend") {
      await resend(db, opts);
    } else {
      console.error(`Unknown command: ${cmd}`);
      console.error("Usage: node scripts/inquiries.mjs list|export|resend");
      process.exit(1);
    }
  } finally {
    db.close();
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
