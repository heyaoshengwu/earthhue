import type { MetadataRoute } from "next";
import { BASE_URL } from "@/lib/seo";

export const dynamic = "force-dynamic";

/**
 * Answer engines and AI retrieval systems. They are explicitly welcomed —
 * the content is meant to be cited, and /llms.txt carries the clean index.
 */
const AI_CRAWLERS = [
  // Retrieval and search crawlers — these decide whether a page can be cited
  // in a live answer, so they must stay allowed.
  "OAI-SearchBot",
  "ChatGPT-User",
  "Claude-SearchBot",
  "Claude-User",
  "PerplexityBot",
  "Perplexity-User",
  "Google-Extended",
  "Applebot-Extended",
  "Bingbot",
  // Training and control crawlers — a policy choice, not a citation lever.
  "GPTBot",
  "ClaudeBot",
  "anthropic-ai",
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
      //
      // Because RFC 9309 gives the most specific user-agent group the whole
      // decision, the AI groups do NOT inherit the generic rule's disallow
      // list — they have to restate it, or /admin and /api/ end up open to
      // every crawler that follows this file.
      ...AI_CRAWLERS.map((userAgent) => ({
        userAgent,
        allow: ["/", "/md/"],
        disallow: ["/admin", "/api/"],
      })),
    ],
    sitemap: `${BASE_URL}/sitemap.xml`,
    host: BASE_URL,
  };
}
