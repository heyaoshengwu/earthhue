#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Acceptance suite for the earthhue GEO work.

  A. the new copy renders in every locale, not the English fallback
  B. every public route answers 200
  C. every JSON-LD block on every route parses
  D. the admin API surface still rejects unauthenticated calls
  E. unknown locales answer 404 instead of serving a 200 page
  F. the contact endpoint answers 400 (not 500) on a malformed body

Run against the live site:
    python3 scripts/verify_geo_acceptance.py
"""
import json
import re
import sys
import urllib.error
import urllib.request

BASE = "https://earthhue.net"
LOC = ["en", "zh", "ja", "ko", "es", "fr", "de"]
ARTICLE = "natural-carotenoids-in-cosmetics-and-personal-care"

# localized copy that must appear in the rendered page
EXPECT = {
    "en": ("Request a sample", "Japan", "Formulations", "Talk to our technical team"),
    "zh": ("申请样品", "日本", "剂型", "咨询技术团队"),
    "ja": ("サンプルを請求", "日本", "剤型", "技術担当者に相談"),
    "ko": ("샘플 요청", "일본", "제형", "기술팀 상담"),
    "es": ("Solicitar una muestra", "Japón", "Formulaciones", "Hable con nuestro equipo técnico"),
    "fr": ("Demander un échantillon", "Japon", "Formulations", "Parlez à notre équipe technique"),
    "de": ("Muster anfordern", "Japan", "Formulierungen", "Mit unserem Fachteam sprechen"),
}

PASS = 0
FAIL = 0
FAILED = []


def ok(label, cond, note=""):
    global PASS, FAIL
    if cond:
        print("  PASS  %-56s %s" % (label, note))
        PASS += 1
    else:
        print("  FAIL  %-56s %s" % (label, note))
        FAILED.append(label)
        FAIL += 1


def fetch(p):
    req = urllib.request.Request(BASE + p, headers={"User-Agent": "Mozilla/5.0 (acceptance)"})
    with urllib.request.urlopen(req, timeout=30) as r:
        return r.status, r.read().decode("utf-8", "replace")


def code(p, method="GET", body=None, ctype="application/json"):
    headers = {"User-Agent": "Mozilla/5.0"}
    data = None
    if body is not None:
        headers["Content-Type"] = ctype
        data = body.encode("utf-8")
    req = urllib.request.Request(BASE + p, method=method, headers=headers, data=data)
    try:
        with urllib.request.urlopen(req, timeout=20) as r:
            return r.status
    except urllib.error.HTTPError as e:
        return e.code
    except Exception:
        return 0


print("=" * 92)
print(" A. New copy renders in every locale (no English fallback)")
print("=" * 92)
for loc in LOC:
    cta, jp, form, tech = EXPECT[loc]
    _, pig = fetch("/%s/pigments" % loc)
    _, art = fetch("/%s/articles/%s" % (loc, ARTICLE))
    _, con = fetch("/%s/contact" % loc)
    ok("%s pigments labels" % loc, form in pig and jp in pig,
       "form=%s jp=%s" % (form in pig, jp in pig))
    ok("%s article CTA copy" % loc, cta in art, cta)
    ok("%s contact CTA copy" % loc, tech in con, tech)

print()
print("=" * 92)
print(" B. Every public route answers 200")
print("=" * 92)
routes = []
for loc in LOC:
    routes += ["/%s" % loc, "/%s/contact" % loc, "/%s/products" % loc, "/%s/pigments" % loc,
               "/%s/regulations" % loc, "/%s/articles" % loc, "/%s/about" % loc,
               "/%s/b2b" % loc, "/%s/b2b/capability" % loc, "/%s/b2b/certifications" % loc,
               "/%s/b2b/samples" % loc, "/%s/b2b/factory-visit" % loc, "/%s/b2b/contact" % loc,
               "/%s/c2c" % loc, "/%s/c2c/science" % loc, "/%s/c2c/gallery" % loc, "/%s/c2c/stories" % loc]
routes += ["/robots.txt", "/sitemap.xml", "/llms.txt", "/llms-full.txt",
           "/en/articles/" + ARTICLE, "/zh/articles/" + ARTICLE]
bad = []
for r in routes:
    c = code(r, "HEAD")
    if c != 200:
        bad.append((r, c))
ok("all public routes 200", not bad, "%d routes checked" % len(routes))
for r, c in bad:
    print("      %s -> %s" % (r, c))

print()
print("=" * 92)
print(" C. Every JSON-LD block on every route parses")
print("=" * 92)
LD = re.compile(r'<script[^>]+type="application/ld\+json"[^>]*>(.*?)</script>', re.S)
n_ld, bad_json = 0, 0
for r in routes:
    try:
        _, html = fetch(r)
    except Exception:
        continue
    for b in LD.findall(html):
        n_ld += 1
        try:
            json.loads(b)
        except Exception:
            bad_json += 1
            print("      invalid JSON-LD on %s" % r)
ok("all JSON-LD blocks valid", bad_json == 0, "%d blocks checked" % n_ld)

print()
print("=" * 92)
print(" D. Admin API surface rejects unauthenticated calls")
print("=" * 92)
ADMIN_READS = ["/api/contact", "/api/articles", "/api/products",
               "/api/about/content", "/api/about/images", "/api/home/images",
               "/api/products/eh-lutein-ferment-120/images",
               "/api/articles/" + ARTICLE]
for p in ADMIN_READS:
    c = code(p, "GET")
    ok("GET %s -> 401" % p, c == 401, "got %s" % c)

# (method, path, expected) -- 405 means the route does not implement that method
ADMIN_WRITES = [("POST", "/api/articles", 401), ("PUT", "/api/articles", 405),
                ("POST", "/api/products", 401), ("PUT", "/api/products", 405),
                ("PUT", "/api/about/content", 401), ("POST", "/api/about/images", 401),
                ("POST", "/api/home/images", 401), ("POST", "/api/upload", 401),
                ("POST", "/api/products/eh-lutein-ferment-120/images", 401),
                ("DELETE", "/api/articles/" + ARTICLE, 401)]
for m, p, want in ADMIN_WRITES:
    c = code(p, m, body="{}")
    ok("%s %s -> %d" % (m, p, want), c == want, "got %s" % c)

print()
print("=" * 92)
print(" E. Unknown locales 404 (no more soft 404 pages)")
print("=" * 92)
for p in ["/api/about", "/api/zzz-nonexistent", "/zzz-nonexistent",
          "/xx", "/pt", "/en-US", "/EN", "/en/nonexistent-page",
          "/de/nope", "/ru/products"]:
    c = code(p)
    ok("%s -> 404" % p, c == 404, "got %s" % c)
for p in ["/", "/en", "/zh", "/ja", "/ko", "/es", "/fr", "/de"]:
    c = code(p)
    ok("%s -> 200" % p, c == 200, "got %s" % c)

# the 404 body must be a complete HTML document, and must not ask to be indexed
try:
    c, html = fetch("/zzz-nonexistent")
except urllib.error.HTTPError as e:
    c, html = e.code, e.read().decode("utf-8", "replace")
ok("404 body is a full HTML document", "<html" in html.lower() and "</html>" in html.lower(),
   "%d bytes, status %s" % (len(html), c))
# only look at the rendered meta tags: the RSC flight payload legitimately
# carries the root layout's metadata for client hydration, which crawlers
# never read
META = re.compile(r'<meta name="(?:robots|googlebot)"[^>]*content="([^"]*)"', re.I)
metas = META.findall(html)
ok("404 page is not indexable", bool(metas) and all("noindex" in m for m in metas),
   "meta robots=%s" % metas)
_, live = fetch("/en/pigments")
live_metas = META.findall(live)
ok("live pages stay indexable", any("index" in m and "noindex" not in m for m in live_metas),
   "meta robots=%s" % live_metas)

print()
print("=" * 92)
print(" F. Contact endpoint answers 400 on a malformed body")
print("=" * 92)
ok("POST /api/contact with empty object -> 400", code("/api/contact", "POST", body="{}") == 400)
ok("POST /api/contact with invalid json -> 400", code("/api/contact", "POST", body="not-json") == 400)
ok("POST /api/contact with no body -> 400", code("/api/contact", "POST") == 400)
ok("POST /api/contact with wrong email -> 400",
   code("/api/contact", "POST", body=json.dumps({"name": "a", "email": "nope", "message": "m"})) == 400)

print()
print("=" * 92)
print(" RESULT: %d passed, %d failed" % (PASS, FAIL))
if FAILED:
    print(" failed:")
    for f in FAILED:
        print("   - %s" % f)
print("=" * 92)
sys.exit(1 if FAIL else 0)
