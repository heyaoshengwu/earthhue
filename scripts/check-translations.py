#!/usr/bin/env python3
"""
Lint the product and article translations for machine-translation artifacts.

The catalogues are translated, and a machine translation occasionally leaves
an English fragment behind: a glued word ("su Supply"), a term that should
have been translated ("안료 carry-over"). Two such strings reached the
public site before this check existed, so this is a巡检 item — it reports the
gap instead of taking the page down.

Rules:
  A. a lowercase letter immediately followed by a capital, in a non-English
     locale ("su Supply" -> suS). Brand names and codes are excluded.
  B. a short list of generic English words that do not belong in the Korean
     or Japanese copy, such as "carry-over" or "supply".

Exit code 0 means clean, 1 means something was found.
"""
import json
import re
import sqlite3
import sys
from pathlib import Path

DB = Path(sys.argv[1] if len(sys.argv) > 1 else "/var/www/earthhue/data/site.db")

# Rule A: a word that contains an internal lowercase-to-uppercase transition
# ("suSupply" -> suS). The whole word is inspected so that legitimate brand
# names such as "EarthHue" can be excluded by name.
WORD = re.compile(r"[A-Za-zÀ-ÿ]{3,}")
INNER_GLUE = re.compile(r"[a-zà-ÿß][A-Z]")

# Tokens that legitimately look glued but are not artifacts.
ALLOW_A = {
    "earthhue", "cosing", "haematococcus", "phaffia", "xanthophyllomyces",
    "blakeslea", "yarrowia", "tagetes", "curcuma", "spirulina",
}

# Rule B: generic English words that must not survive in the CJK copy.
# Technical terms (astaxanthin, phycocyanin, GRAS) are deliberately absent.
BLOCK_CJK = {
    "carry-over", "carry", "supply", "supplies", "supplied", "colourant",
    "colorant", "formulation", "formulations", "grade", "suitable",
    "provides", "maintains", "keeps", "dissolves", "obtained", "derived",
    "available", "produced", "use", "used", "uses", "with", "without",
    "and", "the", "for", "from", "that", "this", "which", "while",
}


def walk(translations):
    for locale, payload in translations.items():
        if locale == "en" or not isinstance(payload, dict):
            continue
        for field, value in payload.items():
            if isinstance(value, str):
                yield locale, field, value


def check_value(locale, field, value):
    findings = []
    for m in WORD.finditer(value):
        word = m.group(0)
        if not INNER_GLUE.search(word):
            continue
        if word.lower() in ALLOW_A:
            continue
        if any(ch.isdigit() for ch in word):
            continue
        findings.append(("glued-word", word, value[max(0, m.start() - 40): m.end() + 40]))
    if locale in ("ko", "ja"):
        for m in re.finditer(r"[A-Za-z][A-Za-z\-]{3,}", value):
            word = m.group(0).lower()
            if word in BLOCK_CJK:
                findings.append(("untranslated", m.group(0), value[max(0, m.start() - 40): m.end() + 40]))
    return findings


if not DB.exists():
    sys.exit(f"database not found: {DB}")

con = sqlite3.connect(f"file:{DB}?mode=ro", uri=True)
cur = con.cursor()
total = 0
for table in ("products", "articles"):
    for slug, blob in cur.execute(f"select slug, translations from {table}"):
        if not blob:
            continue
        try:
            translations = json.loads(blob)
        except json.JSONDecodeError as exc:
            print(f"FAIL {table}/{slug}: translations is not valid JSON ({exc})")
            total += 1
            continue
        if not isinstance(translations, dict):
            continue
        for locale, field, value in walk(translations):
            for kind, token, context in check_value(locale, field, value):
                total += 1
                print(f"FAIL {table}/{slug} [{locale}.{field}] {kind}: {token}")
                print(f"     ...{context}...")

con.close()
print()
print(f"translation residue findings: {total}")
sys.exit(0 if total == 0 else 1)
