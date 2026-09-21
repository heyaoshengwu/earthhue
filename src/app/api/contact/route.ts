import { NextRequest, NextResponse } from "next/server";

// Configure your contact email here
const CONTACT_EMAIL = "contact@earthhue.net";
const ADMIN_EMAIL = "admin@earthhue.net";

interface ContactSubmission {
  name: string;
  email: string;
  company?: string;
  subject: string;
  message: string;
  timestamp: string;
}

// Store submissions in memory (for demo - use a database in production)
const submissions: ContactSubmission[] = [];

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, email, company, subject, message } = body;

    // Validate required fields
    if (!name || !email || !message) {
      return NextResponse.json(
        { error: "Name, email, and message are required" },
        { status: 400 }
      );
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: "Invalid email format" },
        { status: 400 }
      );
    }

    const submission: ContactSubmission = {
      name,
      email,
      company: company || "",
      subject: subject || "General Inquiry",
      message,
      timestamp: new Date().toISOString(),
    };

    // Store submission
    submissions.push(submission);

    // Log submission (in production, you would send email or save to database)
    console.log("=== New Contact Submission ===");
    console.log(`Name: ${name}`);
    console.log(`Email: ${email}`);
    console.log(`Company: ${company || "N/A"}`);
    console.log(`Subject: ${subject}`);
    console.log(`Message: ${message}`);
    console.log(`Time: ${submission.timestamp}`);
    console.log("===========================");

    // In production, you could:
    // 1. Send email using Resend, SendGrid, etc.
    // 2. Save to database (Neon, Prisma, etc.)
    // 3. Send to Slack/Discord webhook
    // 4. Integrate with CRM

    return NextResponse.json({
      success: true,
      message: "Thank you for your message. We will respond within 24-48 hours.",
      submissionId: submissions.length,
    });
  } catch (error) {
    console.error("Contact form error:", error);
    return NextResponse.json(
      { error: "Failed to submit form. Please try again." },
      { status: 500 }
    );
  }
}

// Get all submissions (for admin - in production, add authentication)
export async function GET() {
  return NextResponse.json({
    submissions,
    total: submissions.length,
    // Don't expose in production without auth
    message: "Contact submissions (admin only)",
  });
}
