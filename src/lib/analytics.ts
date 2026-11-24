/**
 * First-party analytics.
 *
 * The site had no measurement of any kind, which meant every decision about
 * content and every decision about the inquiry funnel had to be made blind.
 * Rather than hand the traffic to a third party, the numbers are collected
 * here and stored in the same SQLite file as everything else.
 *
 * The browser reports raw facts — where it is, what it came from, what it
 * clicked. Everything else (referrer class, target class, IP hashing) happens
 * on the server, so there is exactly one implementation of each rule and a
 * client cannot forge a classification.
 *
 * Privacy posture: no cookies, no cross-site sharing, no fingerprinting. The
 * IP is truncated and salted before it is stored. A visitor who sends
 * Do-Not-Track is not counted at all.
 */

/** Event names the endpoint accepts. */
export const ANALYTICS_EVENTS = ["page_view", "link_click", "form_start", "form_submit"] as const;
export type AnalyticsEvent = (typeof ANALYTICS_EVENTS)[number];

/**
 * Hosts that mean "an answer engine sent this visitor".
 *
 * A referral from one of these is the whole point of the exercise: it is the
 * first hard number that a model cited this site.
 */
const AI_HOSTS = [
  "chatgpt.com",
  "chat.openai.com",
  "openai.com",
  "perplexity.ai",
  "perplexity.ai/api",
  "gemini.google.com",
  "copilot.microsoft.com",
  "claude.ai",
  "you.com",
  "phind.com",
  "andisearch.com",
  "kagi.ai",
  "poe.com",
];

const SEARCH_HOSTS = [
  "google.",
  "bing.",
  "duckduckgo.",
  "yandex.",
  "baidu.",
  "yahoo.",
  "ecosia.",
  "naver.",
  "daum.",
  "seznam.",
  "startpage.",
  "brave.com/search",
  "qwant.",
  "sogou.",
  "so.com",
];

const SOCIAL_HOSTS = [
  "linkedin.",
  "facebook.",
  "instagram.",
  "twitter.",
  "x.com/",
  "tiktok.",
  "youtube.",
  "weibo.",
  "wechat",
  "reddit.",
  "pinterest.",
  "zhihu.",
  "bilibili.",
  "douyin.",
];

function hostOf(referrer: string): string {
  try {
    if (!referrer) return "";
    const url = new URL(referrer);
    return (url.hostname + url.pathname).toLowerCase();
  } catch {
    return referrer.toLowerCase();
  }
}

/**
 * Sort a referrer into the bucket that decides what it means.
 *
 * The order matters: an AI search host also contains a search host pattern
 * in some cases, and a social link often carries a search-engine referrer on
 * the other end of the redirect.
 */
export function classifyReferrer(referrer: string, siteOrigin?: string): string {
  const value = (referrer || "").trim();
  if (!value) return "direct";

  if (siteOrigin && value.startsWith(siteOrigin)) return "internal";

  const host = hostOf(value);
  if (!host) return "direct";

  if (AI_HOSTS.some((h) => host.includes(h))) return "ai";
  if (SEARCH_HOSTS.some((h) => host.includes(h))) return "search";
  if (SOCIAL_HOSTS.some((h) => host.includes(h))) return "social";

  return "referral";
}

/** What kind of thing a click landed on. */
export function classifyTarget(target: string, siteOrigin?: string): string {
  const value = (target || "").trim();
  if (!value) return "none";
  if (value.startsWith("mailto:")) return "email";
  if (value.startsWith("tel:")) return "phone";
  if (value.startsWith("#")) return "anchor";

  let path = value;
  if (siteOrigin && value.startsWith(siteOrigin)) {
    path = value.slice(siteOrigin.length);
  } else if (/^https?:\/\//i.test(value)) {
    return "external";
  }

  if (/\/products\//.test(path)) return "product";
  if (/\/articles\//.test(path)) return "article";
  if (/\/pigments/.test(path)) return "pigment";
  if (/\/b2b\/(samples|contact)/.test(path)) return "inquiry";
  if (/\/contact/.test(path)) return "inquiry";
  if (/\/c2c\//.test(path)) return "c2c";
  return "page";
}

/**
 * The browser script.
 *
 * Deliberately small: report a page view, report the links that get clicked,
 * report when a form is started and when it is submitted. No cookies, no
 * session replay, no fingerprint.
 */
export const TRACKER_SCRIPT = `(function(){
  if (typeof window === "undefined") return;
  try {
    if (navigator.doNotTrack === "1" || window.doNotTrack === "1") return;
    if (localStorage.getItem("eh_analytics_off") === "1") return;
  } catch (e) { return; }

  var sid = "";
  try {
    sid = localStorage.getItem("eh_sid") || "";
    if (!sid) {
      sid = Math.random().toString(36).slice(2, 10) + Date.now().toString(36);
      localStorage.setItem("eh_sid", sid);
    }
  } catch (e) { sid = "anon"; }

  function send(payload) {
    payload.sid = sid;
    payload.path = location.pathname + location.search;
    payload.referrer = document.referrer || "";
    payload.locale = (location.pathname.split("/")[1] || "en");
    var body = JSON.stringify(payload);
    try {
      if (navigator.sendBeacon) {
        navigator.sendBeacon("/api/track", new Blob([body], { type: "application/json" }));
      } else {
        fetch("/api/track", { method: "POST", headers: { "Content-Type": "application/json" }, body: body, keepalive: true });
      }
    } catch (e) {}
  }

  send({ type: "page_view" });

  document.addEventListener("click", function (e) {
    var a = e.target && e.target.closest ? e.target.closest("a[href]") : null;
    if (!a) return;
    var href = a.getAttribute("href") || "";
    if (!href || href.charAt(0) === "#") return;
    if (href.indexOf("mailto:") === 0 || href.indexOf("tel:") === 0) return;
    send({ type: "link_click", target: href });
  }, { passive: true });

  var started = false;
  document.addEventListener("focusin", function (e) {
    if (started) return;
    if (e.target && e.target.form) { started = true; send({ type: "form_start" }); }
  }, { passive: true });

  document.addEventListener("submit", function () { send({ type: "form_submit" }); }, true);
})();`;
