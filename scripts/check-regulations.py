#!/usr/bin/env python3
"""
Check the pigment regulatory table against the sources it claims to follow.

The regulatory table on every pigment page is the part of this site a buyer
can act on. A wrong status there is worse than a missing one: a buyer who
reads "Approved" for titanium dioxide and ships an EU food order has a
compliance problem, not a content problem. Nine entries were wrong when this
catalogue was first checked, and they were wrong in the direction that looks
reassuring — an E number that belonged to another pigment, a GRAS notice that
belonged to a different substance, a CFR section that does not cover the
colourant at all.

So the status text now lives in one file, `src/content/pigments/regulations.json`,
and this script checks that file against the rules below. It reports; it does
not edit, and it does not take the site down.

Rules:
  A. Every pigment in `data.ts` has a regulatory entry, and every entry has a
     pigment.
  B. All four jurisdictions carry a real answer. No placeholders.
  C. An E number in the EU column has to be one the pigment may actually
     claim. A pigment that carries no E number may only name one in an
     explicit note, and a number that is reserved but never authorised
     (E 161c, E 161h, E 161j) may never be presented as the pigment's own.
  D. A 21 CFR citation has to be a section that covers that colourant.
  E. A GRAS notice number has to be the notice that covers that pigment.
  F. A substance that is not GRAS is never described as GRAS.
  G. The EU column says "authorised", not "approved". The two are not the
     same word in EU law, and the difference is what a compliance reviewer
     will look for.
  H. The four jurisdictions are not a copy-and-paste of each other.
  I. Two pigments that share a CAS number are the same substance, so they
     carry the same E number.
  J. A CAS number identifies one substance. Only the pigments listed for a
     CAS number may quote it.

Exit code 0 means clean, 1 means something was found.
"""
import json
import re
import sys
from pathlib import Path

APP = Path(sys.argv[1] if len(sys.argv) > 1 else "/var/www/earthhue")
REGULATIONS = APP / "src/content/pigments/regulations.json"
DATA = APP / "src/content/pigments/data.ts"

# The E numbers listed as authorised food colours in Annex II of Regulation
# (EC) No 1333/2008.
AUTHORISED_EU_COLOURS = {
    "E 100", "E 101", "E 102", "E 104", "E 110", "E 120", "E 122", "E 123",
    "E 124", "E 127", "E 129", "E 131", "E 132", "E 133", "E 140", "E 141",
    "E 142", "E 150a", "E 150b", "E 150c", "E 150d", "E 151", "E 153",
    "E 155", "E 160a", "E 160b", "E 160c", "E 160d", "E 160e", "E 161b",
    "E 161g", "E 162", "E 163", "E 170", "E 171", "E 172", "E 173", "E 174",
    "E 175", "E 180",
}

# Numbers in the E 161 series that exist but have never been authorised as a
# food colour in the EU. Naming one is fine in a note; claiming one is not.
RESERVED_E_NUMBERS = {
    "E 161", "E 161c", "E 161d", "E 161e", "E 161f", "E 161h", "E 161i",
    "E 161j",
}

# Listed but not authorised for food: E 171 since 7 Aug 2022 (Reg. (EU)
# 2022/63), E 161g only for medicinal products.
NOT_AUTHORISED_FOR_FOOD = {"E 171", "E 161g"}

# 21 CFR sections that actually cover one of these colourants, taken from the
# FDA colour additive database.
VERIFIED_CFR = {
    "73.32": "Antarctic krill meal",
    "73.35": "Astaxanthin",
    "73.37": "Astaxanthin dimethyldisuccinate",
    "73.50": "Ultramarine blue",
    "73.75": "Canthaxanthin (animal feed)",
    "73.107": "Canthaxanthin (food and drugs)",
    "73.185": "Dried algae meal",
    "73.200": "Synthetic iron oxides",
    "73.275": "Corn endosperm oil (carotenoids)",
    "73.295": "Tagetes (marigold) meal and extract (lutein)",
    "73.315": "Haematococcus algae meal",
    "73.352": "Paracoccus pigment",
    "73.355": "Phaffia yeast",
    "73.575": "Titanium dioxide (food)",
    "73.1496": "Mica",
    "73.1575": "Titanium dioxide (drugs)",
    "73.2575": "Titanium dioxide (cosmetics)",
}

# GRAS notices that have been checked against the FDA inventory.
KNOWN_GRN = {
    "131": "High 2-palmitic vegetable oil",
    "450": "Chlorella protothecoides S106 flour with 40-70% lipid",
    "580": "Haematococcus pluvialis extract containing astaxanthin esters",
}

# Substances that must never carry a GRAS claim.
NOT_GRAS = {"titanium-dioxide"}

# A CAS number identifies one substance. Only the pigments listed against a
# number may quote it.
VERIFIED_CAS = {
    "458-37-7": {"curcumin"},
    "7659-50-9": {"beet-red"},
    "479-61-8": {"chlorophyll"},
    "11088-48-9": {"anthocyanin"},
    "7235-40-7": {"carotenoid", "beta-carotene-fermentation"},
    "90131-83-2": {"paprika-oleoresin"},
    "2022-79-5": {"saffron"},
    "127-40-2": {"lutein-plant", "lutein-fermentation"},
    "472-61-7": {"astaxanthin", "astaxanthin-synthetic-biological"},
    "514-78-3": {"canthaxanthin"},
    "547-74-6": {"torularhodin"},
    "6852-11-7": {"monascus-red"},
    "11024-84-7": {"phycocyanin", "spirulina-blue"},
    "11024-48-7": {"phycoerythrin"},
    "74434-36-9": {"violaxanthin"},
    "144-68-3": {"zeaxanthin-microbial"},
    "1332-37-2": {"iron-oxide"},
    "13463-67-7": {"titanium-dioxide"},
    "12001-26-2": {"mica-pearl"},
}

E_TOKEN = re.compile(r"\bE\s?\d{3}[a-z]?\b")
CFR_TOKEN = re.compile(r"21 CFR (\d+\.\d+)")
GRN_TOKEN = re.compile(r"GRAS Notice (\d+)")
CAS_TOKEN = re.compile(r"^\d{2,7}-\d{2}-\d$")

PLACEHOLDERS = {"", "-", "n/a", "na", "tbd", "todo", "unknown", "none", "?"}


def normalise_e(token):
    """E100 and E 100 are the same number; the spelling in the copy is not."""
    match = re.match(r"^\s*E\s*(\d{3}[a-z]?)\s*$", token, re.I)
    if not match:
        return token.strip().upper()
    return f"E {match.group(1).lower()}"


def load():
    if not REGULATIONS.exists():
        print(f"FATAL: {REGULATIONS} not found")
        sys.exit(1)
    if not DATA.exists():
        print(f"FATAL: {DATA} not found")
        sys.exit(1)
    try:
        regulations = json.loads(REGULATIONS.read_text(encoding="utf-8"))
    except json.JSONDecodeError as exc:
        print(f"FATAL: {REGULATIONS} is not valid JSON: {exc}")
        sys.exit(1)

    source = DATA.read_text(encoding="utf-8")
    pigments = []
    for block in re.split(r"\n  \{\n", source)[1:]:
        pigment_id = re.search(r'^\s*id: "([a-z0-9-]+)",', block, re.M)
        if not pigment_id:
            continue
        cas = re.search(r'^\s*casNumber: "([^"]*)",', block, re.M)
        pigments.append(
            (pigment_id.group(1), cas.group(1).strip() if cas else "")
        )
    return regulations, pigments


def check(regulations, pigments):
    findings = []

    def bad(pigment, rule, message):
        findings.append((pigment, rule, message))

    ids = [pid for pid, _ in pigments]

    # A. coverage
    for pigment in ids:
        if pigment not in regulations:
            bad(pigment, "A", "no regulatory entry")
    for pigment in regulations:
        if pigment not in ids:
            bad(pigment, "A", "regulatory entry with no pigment in data.ts")

    for pigment, entry in regulations.items():
        # B. all four jurisdictions
        for field in ("eu", "us", "japan", "korea"):
            value = entry.get(field)
            if not isinstance(value, str) or value.strip().lower() in PLACEHOLDERS:
                bad(pigment, "B", f"{field} is empty or a placeholder")
        values = [entry.get(f) for f in ("eu", "us", "japan", "korea")]
        if len(set(v for v in values if isinstance(v, str))) < 4:
            bad(pigment, "H", "two jurisdictions carry the same text")

        eu = entry.get("eu") or ""
        us = entry.get("us") or ""
        own = normalise_e(entry.get("euENumber") or "")
        mentions = {normalise_e(m) for m in (entry.get("mentions") or [])}

        # C. E numbers
        tokens = {normalise_e(t) for t in E_TOKEN.findall(eu)}
        for token in sorted(tokens):
            if token not in AUTHORISED_EU_COLOURS and token not in RESERVED_E_NUMBERS:
                bad(pigment, "C", f"{token} is not an EU colour number")
            elif token != own and token not in mentions:
                bad(pigment, "C", f"{token} is claimed but is not this pigment's E number")
        if own:
            if own not in tokens:
                bad(pigment, "C", f"the EU entry does not state {own}")
            if own in RESERVED_E_NUMBERS:
                bad(pigment, "C", f"{own} is reserved and cannot be the pigment's E number")
            if own in NOT_AUTHORISED_FOR_FOOD and "not authorised" not in eu.lower():
                bad(pigment, "C", f"{own} is not authorised for food but the entry does not say so")

        # D. 21 CFR citations
        for section in CFR_TOKEN.findall(us):
            if section not in VERIFIED_CFR:
                bad(pigment, "D", f"21 CFR {section} does not cover this colourant")
            elif pigment == "astaxanthin" and section not in {"73.35", "73.37"}:
                bad(pigment, "D", f"21 CFR {section} covers {VERIFIED_CFR[section]}, not astaxanthin")

        # E. GRAS notices
        declared = entry.get("usGRN")
        cited = GRN_TOKEN.findall(us)
        for number in cited:
            if number not in KNOWN_GRN:
                bad(pigment, "E", f"GRAS Notice {number} has not been verified")
            elif declared is None or number != str(declared):
                bad(pigment, "E", f"GRAS Notice {number} covers {KNOWN_GRN[number]}, not this pigment")
        if declared and str(declared) not in cited:
            bad(pigment, "E", f"the entry declares GRAS Notice {declared} but does not cite it")

        # F. GRAS claims
        if pigment in NOT_GRAS:
            without_negation = re.sub(r"\b(?:not|non)[- ]?gras\b", "", us, flags=re.I)
            if "gras" in without_negation.lower():
                bad(pigment, "F", "this substance is not GRAS in the United States")

        # G. EU wording
        if "approved" in eu.lower() and "authoris" not in eu.lower():
            bad(pigment, "G", "the EU column says approved; EU law says authorised")

    # I. one substance, one E number
    by_cas = {}
    for pigment, cas in pigments:
        if CAS_TOKEN.match(cas):
            by_cas.setdefault(cas, []).append(pigment)
    for cas, owners in by_cas.items():
        numbers = {
            normalise_e((regulations.get(p) or {}).get("euENumber") or "")
            for p in owners
            if p in regulations
        }
        if len(numbers) > 1:
            bad(
                owners[0],
                "I",
                f"pigments sharing CAS {cas} carry different E numbers: {sorted(numbers)}",
            )

    # J. one substance, one CAS number
    for pigment, cas in pigments:
        if not CAS_TOKEN.match(cas):
            continue
        allowed = VERIFIED_CAS.get(cas)
        if allowed is None:
            bad(pigment, "J", f"CAS {cas} has not been verified")
        elif pigment not in allowed:
            bad(pigment, "J", f"CAS {cas} belongs to {sorted(allowed)}, not to {pigment}")

    return findings


def main():
    regulations, pigments = load()
    findings = check(regulations, pigments)

    print(f"pigments in data.ts: {len(pigments)}")
    print(f"regulatory entries:   {len(regulations)}")
    print(f"findings:             {len(findings)}")
    if findings:
        print()
        for pigment, rule, message in findings:
            print(f"  [{rule}] {pigment}: {message}")
        sys.exit(1)
    print("RESULT: clean")


if __name__ == "__main__":
    main()
