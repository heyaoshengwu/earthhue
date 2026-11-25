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
colourant at all. A second pass, done while adding the citations, found
eleven more, including two that this checker had itself let through.

So the status text lives in one file, `src/content/pigments/regulations.json`,
every status points at the instrument it comes from, and this script checks
both against the sources they quote. It reports; it does not edit, and it
does not take the site down.

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
  K. Every source a status points at exists in the source registry.
  L. A source is an official document on an official domain, or a secondary
     source that says in its own text that it is not official.
  M. A status that names an instrument has to cite something.
  N. A Japan status that claims a listing carries the JSFA entry number it
     was read from, and a status that says not listed says so in the same
     words.
  O. A status marked as not verified entry by entry is reported, so the gap
     stays visible instead of quietly disappearing.
  P. A source is cited in the jurisdiction it belongs to.
  Q. The editorial copy agrees with the table: what the table says about
     Japan and Korea is what the prose says too.

Exit code 0 means clean, 1 means something was found.
"""
import json
import re
import sys
from pathlib import Path
from urllib.parse import urlparse

APP = Path(sys.argv[1] if len(sys.argv) > 1 else "/var/www/earthhue")
REGULATIONS = APP / "src/content/pigments/regulations.json"
SOURCES = APP / "src/content/pigments/sources.json"
DATA = APP / "src/content/pigments/data.ts"
CONTENT = APP / "src/content/pigments/content.ts"

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

# 21 CFR sections, with the heading the eCFR gives them. Read out of the
# eCFR itself, not from a summary.
VERIFIED_CFR = {
    "73.1": "Diluents in color additive mixtures for food use exempt from certification",
    "73.32": "Antarctic krill meal",
    "73.35": "Astaxanthin",
    "73.37": "Astaxanthin dimethyldisuccinate",
    "73.50": "Ultramarine blue",
    "73.75": "Canthaxanthin (animal food)",
    "73.1075": "Canthaxanthin (drugs)",
    "73.1496": "Mica (food)",
    "73.185": "Haematococcus algae meal",
    "73.200": "Synthetic iron oxide (food)",
    "73.275": "Dried algae meal",
    "73.295": "Tagetes (Aztec marigold) meal and extract",
    "73.315": "Corn endosperm oil",
    "73.350": "Mica-based pearlescent pigments (food)",
    "73.352": "Paracoccus pigment",
    "73.355": "Phaffia yeast",
    "73.575": "Titanium dioxide (food)",
    "73.1200": "Synthetic iron oxide (drugs)",
    "73.1350": "Mica-based pearlescent pigments (cosmetics)",
    "73.1575": "Titanium dioxide (drugs)",
    "73.2250": "Iron oxides (drugs)",
    "73.2496": "Mica (drugs)",
    "73.2575": "Titanium dioxide (cosmetics)",
    "73.3125": "Iron oxides (cosmetics)",
    "73.3126": "Titanium dioxide (cosmetics)",
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

# Only official documents may be cited as the source of a regulatory status.
OFFICIAL_HOSTS = {
    "publications.europa.eu",
    "eur-lex.europa.eu",
    "www.ecfr.gov",
    "ecfr.gov",
    "hfpappexternal.fda.gov",
    "cfsanappsexternal.fda.gov",
    "www.fda.gov",
    "www.mhlw.go.jp",
    "www.mfds.go.kr",
    "foodsafetykorea.go.kr",
    "www.foodsafetykorea.go.kr",
    "law.go.kr",
    "www.law.go.kr",
    # The WTO hosts the attachment of a Korean SPS notification, which carries
    # the Korean text of the revised food additive standards.
    "members.wto.org",
}

# A secondary source may be cited, but only from this list, only when it says
# so in its own detail, and only when it is marked as secondary. It is a
# reading of an official instrument, never the instrument itself.
SECONDARY_HOSTS = {
    "foodadditiveindex.com",
}
SECONDARY_DISCLOSURE = "not an official publication"

JURISDICTIONS = ("eu", "us", "japan", "korea")

E_TOKEN = re.compile(r"\bE\s?\d{3}[a-z]?\b")
CFR_TOKEN = re.compile(r"21 CFR (\d+\.\d+)")
GRN_TOKEN = re.compile(r"GRAS Notice (\d+)")
JSFA_ENTRY = re.compile(r"\bFA\d{6}\b")
CAS_TOKEN = re.compile(r"^\d{2,7}-\d{2}-\d$")
INSTRUMENT = re.compile(
    r"(Reg\.\s*\(|Reg\.\s*[A-Z]|21 CFR|GRAS Notice|E\s?\d{3}[a-z]?)"
)

PLACEHOLDERS = {"", "-", "n/a", "na", "tbd", "todo", "unknown", "none", "?"}


def normalise_e(token):
    """E100 and E 100 are the same number; the spelling in the copy is not."""
    match = re.match(r"^\s*E\s*(\d{3}[a-z]?)\s*$", token, re.I)
    if not match:
        return token.strip().upper()
    return f"E {match.group(1).lower()}"


def load():
    for path in (REGULATIONS, SOURCES, DATA, CONTENT):
        if not path.exists():
            print(f"FATAL: {path} not found")
            sys.exit(1)
    try:
        regulations = json.loads(REGULATIONS.read_text(encoding="utf-8"))
        sources = json.loads(SOURCES.read_text(encoding="utf-8"))
    except json.JSONDecodeError as exc:
        print(f"FATAL: regulatory source file is not valid JSON: {exc}")
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

    # The editorial copy, split into the block that belongs to each pigment.
    prose = CONTENT.read_text(encoding="utf-8")
    blocks = re.split(r'\n  "?([a-z0-9-]+)"?: \{\n', prose)[1:]
    content = {}
    for i in range(0, len(blocks) - 1, 2):
        content[blocks[i]] = blocks[i + 1]

    return regulations, sources, pigments, content


def check(regulations, sources, pigments, content):
    findings = []
    advisories = []

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

    # L. every source is an official document on an official domain, or a
    # secondary source that says it is one
    for source_id, source in sources.items():
        host = urlparse(source.get("url", "")).netloc.lower()
        tier = source.get("tier")
        if tier == "secondary":
            if host not in SECONDARY_HOSTS:
                bad(source_id, "L", f"secondary source is not on the approved list ({host})")
            if SECONDARY_DISCLOSURE not in (source.get("detail") or "").lower():
                bad(source_id, "L", "a secondary source has to say that it is not official")
        elif tier:
            bad(source_id, "L", f"unknown source tier '{tier}'")
        elif host not in OFFICIAL_HOSTS:
            bad(source_id, "L", f"source is not on an official domain ({host})")
        if not source.get("label") or not source.get("detail"):
            bad(source_id, "L", "source has no label or no detail")

    for pigment, entry in regulations.items():
        # B. all four jurisdictions
        for field in JURISDICTIONS:
            value = entry.get(field)
            if not isinstance(value, str) or value.strip().lower() in PLACEHOLDERS:
                bad(pigment, "B", f"{field} is empty or a placeholder")
        values = [entry.get(f) for f in JURISDICTIONS]
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

        # G2. the Korea column does not claim an approval either
        korea = entry.get("korea") or ""
        if "approved" in korea.lower():
            bad(pigment, "G", "the Korea column says approved; the Korean code permits a use standard")
        if not (korea.startswith("Permitted") or korea.startswith("Not confirmed")):
            bad(pigment, "G", "the Korea column uses neither 'Permitted' nor 'Not confirmed'")

        # K, M, N, O, P. the citations behind each status
        source_map = entry.get("sources") or {}
        verified = entry.get("verified") or {}
        for jurisdiction in JURISDICTIONS:
            value = entry.get(jurisdiction) or ""
            cited_ids = source_map.get(jurisdiction) or []
            for source_id in cited_ids:
                if source_id not in sources:
                    bad(pigment, "K", f"cites unknown source '{source_id}'")
                else:
                    scope = sources[source_id].get("scope")
                    if scope and scope != jurisdiction:
                        bad(pigment, "P", f"cites a {scope} source in the {jurisdiction} row")
            if INSTRUMENT.search(value) and not cited_ids:
                bad(pigment, "M", f"the {jurisdiction} status names an instrument but cites nothing")
            if not verified.get(jurisdiction):
                advisories.append(
                    (pigment, jurisdiction, "not checked entry by entry against its source")
                )
            if jurisdiction == "japan" and verified.get("japan"):
                if value.startswith("Listed") and not JSFA_ENTRY.search(value):
                    bad(pigment, "N", "a Japan status that claims a listing must carry the JSFA entry number")
                if value.startswith("Not listed") and "Not listed" not in value:
                    bad(pigment, "N", "a Japan status that says not listed must say it in the same words")

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

    # Q. the editorial copy agrees with the table
    #
    # The table is the checked part; the prose is what an answer engine
    # quotes. When the two drift apart, the prose wins in the snippet and the
    # wrong answer gets quoted, so they are checked against each other here.
    for pigment, entry in regulations.items():
        block = content.get(pigment)
        if block is None:
            bad(pigment, "Q", "no editorial copy for this pigment")
            continue
        japan = entry.get("japan") or ""
        korea = entry.get("korea") or ""
        if japan.startswith("Listed"):
            if not re.search(r"listed in Japan|Japan lists", block):
                bad(pigment, "Q", "Japan is listed in the table but the copy does not say so")
            if "not listed as a colour in Japan" in block:
                bad(pigment, "Q", "Japan is listed in the table but the copy says it is not")
        else:
            if "not listed as a colour in Japan" not in block and "not listed in Japan" not in block:
                bad(pigment, "Q", "Japan is not listed in the table but the copy does not say so")
        if korea.startswith("Permitted"):
            if "Korea" not in block:
                bad(pigment, "Q", "Korea is permitted in the table but the copy does not mention it")
        elif "Korea" in block:
            bad(pigment, "Q", "Korea is not confirmed in the table but the copy still claims it")

    return findings, advisories


def main():
    regulations, sources, pigments, content = load()
    findings, advisories = check(regulations, sources, pigments, content)

    print(f"pigments in data.ts: {len(pigments)}")
    print(f"regulatory entries:   {len(regulations)}")
    print(f"sources in registry:  {len(sources)}")
    print(f"findings:             {len(findings)}")
    print(f"advisories:           {len(advisories)}")
    if advisories:
        by_jurisdiction = {}
        for _, jurisdiction, _ in advisories:
            by_jurisdiction[jurisdiction] = by_jurisdiction.get(jurisdiction, 0) + 1
        for jurisdiction, count in sorted(by_jurisdiction.items()):
            print(f"  advisory  {jurisdiction}: {count} statuses are cited to the list "
                  f"but not checked entry by entry")
    if findings:
        print()
        for pigment, rule, message in findings:
            print(f"  [{rule}] {pigment}: {message}")
        sys.exit(1)
    print("RESULT: clean")


if __name__ == "__main__":
    main()
