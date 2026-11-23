import type { MetadataRoute } from "next";
import { BASE_URL } from "@/lib/seo";

export const dynamic = "force-dynamic";

/**
 * Answer engines and AI retrieval systems. They are explicitly welcomed —
 * the content is meant to be cited, and /llms.txt carries the clean index.
 */
const AI_CRAWLERS = [
  "GPTBot",
  "OAI-SearchBot",
  "ChatGPT-User",
  "ClaudeBot",
  "Claude-User",
  "anthropic-ai",
  "PerplexityBot",
  "Perplexity-User",
  "Google-Extended",
  "Applebot-Extended",
  "Bingbot",
  "CCBot",
  "Bytespider",
  "Meta-ExternalAgent",
  "cohere-ai",
  "Diffbot",
  "YouBot",
];

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/admin", "/api/", "/md/"],
      },
      // /md/ holds the machine-readable markdown mirror of every page. The
      // generic rule keeps it away from ordinary crawlers so the HTML pages
      // stay canonical, but the AI groups below open it explicitly instead of
      // relying on the more-specific-agent-wins reading of RFC 9309.
      ...AI_CRAWLERS.map((userAgent) => ({
        userAgent,
        allow: ["/", "/md/"],
      })),
    ],
    sitemap: `${BASE_URL}/sitemap.xml`,
    host: BASE_URL,
  };
}
