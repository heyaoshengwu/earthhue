#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""Message catalogue check.

Hard failures:
  - a duplicate JSON key (the parser silently keeps the last one, which is how
    the colour stories once lost half their entries)
  - a replacement character
  - non-latin text in the English catalogue
  - a locale carrying a key English does not have — almost always a typo

Reported but not fatal:
  - a locale missing a key. The request config merges English underneath every
    locale, so a missing key falls back to English rather than breaking the
    page. It is still untranslated copy and worth seeing.

Exit code 1 on a hard failure.
"""
import io
import json
import os
import re
import sys

BASE = os.environ.get("MESSAGE_DIR") or os.path.join(
    os.path.dirname(os.path.dirname(os.path.abspath(__file__))), "src", "messages"
)
LOCALES = ["en", "zh", "ja", "ko", "es", "fr", "de"]

CJK = re.compile(u"[\u3000-\u303f\u3400-\u4dbf\u4e00-\u9fff\uff00-\uffef\uff66-\uff9f]")
REPL = re.compile(u"[\ufffd]")


def make_hook(dups):
    def hook(pairs):
        seen = {}
        for k, v in pairs:
            if k in seen:
                dups.append(k)
            seen[k] = v
        return seen
    return hook


def flat(obj, prefix=""):
    out = {}
    if isinstance(obj, dict):
        for k, v in obj.items():
            out.update(flat(v, prefix + "." + k if prefix else k))
    elif isinstance(obj, list):
        for i, v in enumerate(obj):
            out.update(flat(v, "%s[%d]" % (prefix, i)))
    else:
        out[prefix] = obj
    return out


def main() -> int:
    data = {}
    problems = []
    gaps = []

    for locale in LOCALES:
        path = os.path.join(BASE, locale + ".json")
        if not os.path.exists(path):
            problems.append("%s: file missing" % locale)
            continue

        with io.open(path, "r", encoding="utf-8", newline="") as fh:
            raw = fh.read()

        if raw.startswith("\ufeff"):
            problems.append("%s: unexpected BOM" % locale)

        dups = []
        try:
            obj = json.loads(raw, object_pairs_hook=make_hook(dups))
        except Exception as exc:
            problems.append("%s: invalid JSON -> %s" % (locale, exc))
            continue

        data[locale] = obj
        if dups:
            problems.append("%s: DUPLICATE KEYS -> %s" % (locale, sorted(set(dups))))

    if "en" not in data:
        for p in problems:
            print("  - " + p)
        return 1

    ref = set(flat(data["en"]).keys())
    for locale in LOCALES:
        if locale not in data:
            continue
        keys = set(flat(data[locale]).keys())
        extra = sorted(keys - ref)
        missing = sorted(ref - keys)
        if extra:
            problems.append("%s: %d keys not in en -> %s" % (locale, len(extra), extra[:8]))
        if missing:
            gaps.append("%s: %d keys fall back to English" % (locale, len(missing)))

    for k, v in flat(data["en"]).items():
        if isinstance(v, str) and CJK.search(v):
            problems.append("en: %s contains CJK -> %s" % (k, v[:70]))

    for locale in LOCALES:
        if locale not in data:
            continue
        for k, v in flat(data[locale]).items():
            if isinstance(v, str) and REPL.search(v):
                problems.append("%s: %s has U+FFFD" % (locale, k))

    for locale in LOCALES:
        if locale in data:
            print("  %s: %d leaf keys" % (locale, len(flat(data[locale]))))

    if gaps:
        print("English fallback (untranslated copy):")
        for g in gaps:
            print("  - " + g)

    if problems:
        print("PROBLEMS:")
        for p in problems:
            print("  - " + p)
        return 1

    print("Message catalogues OK")
    return 0


if __name__ == "__main__":
    sys.exit(main())
