#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Multi-locale regression for the earthhue GEO work.

Covers every locale for the pages that changed:
  - HTTP 200 and a body on every route
  - every JSON-LD block parses, and the schema types this round added are present
  - the regulatory chips (JSFA / MFDS / EINECS) reach the pigment page in every locale
  - the sample CTA reaches the article page and the contact page in every locale
  - no raw translation key leaks into the rendered HTML
  - the message files still parse and every new key is filled and actually translated
  - the pigment source data carries an institution suffix for every japan/korea value
  - the pigment ItemList keeps full per-item coverage in every locale

Run against the live site:
    python3 scripts/verify_geo_locales.py
"""
import json
import os
import re
import sys
import urllib.error
import urllib.request

BASE = os.environ.get("EARTHHUE_BASE", "https://earthhue.net")
PROJECT = os.environ.get("EARTHHUE_PROJECT", "/var/www/earthhue")
LOCALES = ["en", "zh", "ja", "ko", "es", "fr", "de"]
ARTICLE = "natural-carotenoids-in-cosmetics-and-personal-care"
ROUTES = [
    "", "/contact", "/pigments", "/regulations", "/articles", "/b2b/samples",
    "/articles/" + ARTICLE, "/products", "/about", "/c2c", "/c2c/gallery",
]
LD = re.compile(r'<script[^>]+type=["\']application/ld\+json["\'][^>]*>(.*?)</script>', re.S | re.I)

PASS, FAIL = 0, 0
FAILS = []


def check(label, expected, actual, note=""):
    global PASS, FAIL
    if expected == actual:
        print("  PASS  %-64s %s" % (label, note or actual))
        PASS += 1
    else:
        print("  FAIL  %-64s expected=%r actual=%r" % (label, expected, actual))
        FAILS.append(label)
        FAIL += 1


def check_true(label, cond, note=""):
    check(label, True, bool(cond), note)


def fetch(path):
    req = urllib.request.Request(BASE + path, headers={"User-Agent": "Mozilla/5.0 (GEO locale verify)"})
    try:
        with urllib.request.urlopen(req, timeout=30) as r:
            return r.status, r.read().decode("utf-8", "replace")
    except urllib.error.HTTPError as e:
        return e.code, ""


def ld_types(html):
    types, broken = [], 0
    for b in LD.findall(html):
        try:
            data = json.loads(b)
        except Exception:
            broken += 1
            continue
        for it in (data if isinstance(data, list) else [data]):
            if not isinstance(it, dict):
                broken += 1
                continue
            t = it.get("@type")
            types.append(t if isinstance(t, str) else (t[0] if isinstance(t, list) else "?"))
    return types, broken


print("=" * 96)
print(" 1. Every locale serves every changed route with HTTP 200")
print("=" * 96)
pages = {}
for loc in LOCALES:
    for r in ROUTES:
        path = "/%s%s" % (loc, r)
        status, html = fetch(path)
        pages[path] = html
        if status != 200 or not html:
            check("%s -> 200" % path, 200, status, "body=%d chars" % len(html))
        else:
            PASS += 1
    print("  %s: %d routes fetched" % (loc, len(ROUTES)))

print()
print("=" * 96)
print(" 2. JSON-LD parses in every locale, and the new schema types landed")
print("=" * 96)
for loc in LOCALES:
    row = []
    broken_total = 0
    for r in ["/contact", "/pigments", "/regulations", "/articles", "/b2b/samples", ""]:
        path = "/%s%s" % (loc, r)
        types, broken = ld_types(pages.get(path, ""))
        broken_total += broken
        row.append("%s=%s" % (r or "/", ",".join(sorted(set(types))) or "-"))
    check("%s: no malformed JSON-LD block" % loc, 0, broken_total)
    print("     %-8s %s" % (loc, " | ".join(row)))

print()
print("=" * 96)
print(" 3. Schema types required by this round, per locale")
print("=" * 96)
for loc in LOCALES:
    con = ld_types(pages.get("/%s/contact" % loc, ""))[0]
    pig = ld_types(pages.get("/%s/pigments" % loc, ""))[0]
    reg = ld_types(pages.get("/%s/regulations" % loc, ""))[0]
    art = ld_types(pages.get("/%s/articles" % loc, ""))[0]
    smp = ld_types(pages.get("/%s/b2b/samples" % loc, ""))[0]
    det = ld_types(pages.get("/%s/articles/%s" % (loc, ARTICLE), ""))[0]
    check_true("%s contact -> ContactPage" % loc, "ContactPage" in con)
    check_true("%s pigments -> ItemList" % loc, "ItemList" in pig)
    check_true("%s regulations -> ItemList" % loc, "ItemList" in reg)
    check_true("%s articles -> ItemList" % loc, "ItemList" in art)
    check_true("%s samples -> HowTo" % loc, "HowTo" in smp)
    check_true("%s article -> Article" % loc, "Article" in det)

print()
print("=" * 96)
print(" 4. Regulatory authorities and EINECS reach the pigment page in every locale")
print("=" * 96)
for loc in LOCALES:
    html = pages.get("/%s/pigments" % loc, "")
    jsfa, mfds, einecs = html.count("JSFA"), html.count("MFDS"), html.count("EINECS")
    check_true("%s pigments JSFA >= 24" % loc, jsfa >= 24, "JSFA=%d" % jsfa)
    check_true("%s pigments MFDS >= 24" % loc, mfds >= 24, "MFDS=%d" % mfds)
    check_true("%s pigments EINECS >= 24" % loc, einecs >= 24, "EINECS=%d" % einecs)

print()
print("=" * 96)
print(" 5. Sample CTA reaches article page and contact page in every locale")
print("=" * 96)
for loc in LOCALES:
    art = pages.get("/%s/articles/%s" % (loc, ARTICLE), "")
    con = pages.get("/%s/contact" % loc, "")
    check_true("%s article links /%s/b2b/samples" % (loc, loc), ('/%s/b2b/samples' % loc) in art)
    check_true("%s contact links /%s/b2b/samples" % (loc, loc), ('/%s/b2b/samples' % loc) in con)

print()
print("=" * 96)
print(" 6. No raw translation key leaks into the rendered HTML")
print("=" * 96)
LEAKS = ["articles.cta.title", "articles.cta.desc", "articles.cta.sample",
         "articles.cta.contact", "pigments.regions.eu", "pigments.regions.us",
         "pigments.regions.japan", "pigments.regions.korea", "pigments.formulations"]
SCRIPT = re.compile(r"<script[^>]*>.*?</script>", re.S | re.I)
for loc in LOCALES:
    for r in ["/contact", "/articles", "/articles/" + ARTICLE, "/pigments"]:
        # strip script bodies: the RSC flight payload legitimately embeds message keys
        html = SCRIPT.sub(" ", pages.get("/%s%s" % (loc, r), ""))
        found = [k for k in LEAKS if k in html]
        check_true("%s%s: no leaked key" % (loc, r), not found, ",".join(found))

print()
print("=" * 96)
print(" 7. html lang attribute follows the locale")
print("=" * 96)
for loc in LOCALES:
    html = pages.get("/%s" % loc, "")
    m = re.search(r'<html[^>]*\blang=["\']([^"\']+)', html)
    got = m.group(1) if m else None
    check("%s html lang" % loc, loc, got.split("-")[0] if got else None)

print()
print("=" * 96)
print(" 8. Message files parse, new keys are filled, and are really translated")
print("=" * 96)
NEW_KEYS = [
    ("pigments", "regions", "eu"),
    ("pigments", "regions", "us"),
    ("pigments", "regions", "japan"),
    ("pigments", "regions", "korea"),
    ("pigments", "formulations", None),
    ("articles", "cta", "title"),
    ("articles", "cta", "desc"),
    ("articles", "cta", "sample"),
    ("articles", "cta", "contact"),
]


def dig(obj, path):
    for p in path:
        if not isinstance(obj, dict) or p not in obj:
            return None
        obj = obj[p]
    return obj


msgs = {}
for loc in LOCALES:
    path = os.path.join(PROJECT, "src", "messages", "%s.json" % loc)
    try:
        with open(path, "rb") as f:
            raw = f.read()
        data = json.loads(raw.decode("utf-8-sig"))
        msgs[loc] = data
        check_true("%s.json parses" % loc, True, "%d bytes" % len(raw))
    except Exception as e:
        check_true("%s.json parses" % loc, False, str(e))
        msgs[loc] = {}

for ns, sub, leaf in NEW_KEYS:
    path = [ns] + ([sub] if sub else []) + ([leaf] if leaf else [])
    for loc in LOCALES:
        val = dig(msgs.get(loc, {}), path)
        ok = isinstance(val, str) and len(val.strip()) > 0
        check_true("%s %s filled" % (loc, ".".join(path)), ok, repr(val)[:48])

print()
for ns, sub, leaf in NEW_KEYS:
    path = [ns] + ([sub] if sub else []) + ([leaf] if leaf else [])
    en = dig(msgs.get("en", {}), path)
    same = []
    for loc in LOCALES:
        if loc == "en":
            continue
        v = dig(msgs.get(loc, {}), path)
        # a single-word label may legitimately be identical in another language
        # (EU, Japan, Korea, Formulations); only flag copied multi-word phrases
        if isinstance(v, str) and v == en and " " in en.strip():
            same.append("%s=%s" % (loc, v))
    check_true("%s not an English fallback" % ".".join(path), not same, "; ".join(same) or "-")

print()
print("=" * 96)
print(" 9. Pigment source data: every japan/korea value names its authority")
print("=" * 96)
try:
    with open(os.path.join(PROJECT, "src", "content", "pigments", "data.ts"), "r", encoding="utf-8") as f:
        ts = f.read()
    jp = re.findall(r'japan:\s*"([^"]+)"', ts)
    kr = re.findall(r'korea:\s*"([^"]+)"', ts)
    check("pigment count", 24, len(jp))
    bad_j = [v for v in jp if not re.search(r"JSFA|CI|MFDS|FDA|EFSA", v)]
    bad_k = [v for v in kr if not re.search(r"MFDS|CI|JSFA|FDA|EFSA", v)]
    check_true("every japan value names an authority", not bad_j, str(bad_j))
    check_true("every korea value names an authority", not bad_k, str(bad_k))
    print("     sample japan=%s" % jp[:3])
    print("     sample korea=%s" % kr[:3])
except Exception as e:
    check_true("pigment data.ts readable", False, str(e))

print()
print("=" * 96)
print(" 10. Pigment ItemList in every locale keeps full per-item coverage")
print("=" * 96)
REQUIRED_PROP = ["CAS Number", "EINECS Number", "Source"]
REGION_PROP = ["EU Regulation", "US Regulation", "Japan Regulation", "Korea Regulation"]
for loc in LOCALES:
    html = pages.get("/%s/pigments" % loc, "")
    blocks = LD.findall(html)
    target = None
    for b in blocks:
        try:
            data = json.loads(b)
        except Exception:
            continue
        for it in (data if isinstance(data, list) else [data]):
            if isinstance(it, dict) and it.get("@type") == "ItemList" and "numberOfItems" in it:
                if it.get("numberOfItems") == 24:
                    target = it
    if target is None:
        check("%s pigment ItemList found" % loc, "found", "missing")
        continue
    elements = target.get("itemListElement", [])
    check("%s pigment ItemList items" % loc, 24, len(elements))
    missing_prop, missing_region, no_anchor = [], [], []
    for el in elements:
        item = el.get("item", {})
        props = {}
        for p in item.get("additionalProperty", []):
            props[p.get("name")] = p.get("value")
        label = item.get("name") or el.get("name")
        for rp in REQUIRED_PROP:
            if not props.get(rp):
                missing_prop.append("%s/%s" % (label, rp))
        for rp in REGION_PROP:
            if not props.get(rp):
                missing_region.append("%s/%s" % (label, rp))
        if "#" not in (el.get("url") or ""):
            no_anchor.append(label)
    check_true("%s every item carries CAS/EINECS/Source" % loc, not missing_prop, ",".join(missing_prop[:5]))
    check_true("%s every item carries EU/US/Japan/Korea" % loc, not missing_region, ",".join(missing_region[:5]))
    check_true("%s every item url has a pigment anchor" % loc, not no_anchor, ",".join(no_anchor[:5]))

print()
print("=" * 96)
print(" RESULT: %d passed, %d failed" % (PASS, FAIL))
if FAILS:
    print(" failed checks:")
    for f in FAILS:
        print("   - %s" % f)
print("=" * 96)
sys.exit(1 if FAIL else 0)
