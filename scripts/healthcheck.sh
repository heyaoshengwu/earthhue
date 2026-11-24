#!/bin/bash
# Daily health check for earthhue.net.
#
# Two layers are checked, because the site is served from two places:
#
#   LOCAL  127.0.0.1:3000 — the application on this host. Authoritative for
#          the markdown mirror, the message catalogues, the database and the
#          process state.
#   PUBLIC https://earthhue.net — what a crawler or a customer actually gets.
#          Reachability and discovery are checked here, and a difference
#          between the two is reported as a sync lag rather than a failure:
#          the public host is a separate machine that picks up the code on
#          its own schedule, so a window of difference is expected right
#          after a deploy.
#
# Exit code 0 means healthy. Anything non-zero is meant to be picked up by
# cron and mailed.

set -uo pipefail

PUBLIC="${PUBLIC:-https://earthhue.net}"
LOCAL="${LOCAL:-http://127.0.0.1:3000}"
APP="${APP:-/var/www/earthhue}"
FAILURES=0
WARNINGS=0
REPORT=""

fail() {
  FAILURES=$((FAILURES + 1))
  REPORT="${REPORT}FAIL  $1"$'\n'
}

warn() {
  WARNINGS=$((WARNINGS + 1))
  REPORT="${REPORT}WARN  $1"$'\n'
}

ok() {
  REPORT="${REPORT}ok    $1"$'\n'
}

check_code() {
  local label="$1" url="$2" expected="$3" code
  code=$(curl -s -o /dev/null -w '%{http_code}' --max-time 20 "$url")
  if [ "$code" = "$expected" ]; then
    ok "$label ($code)"
  else
    fail "$label -> $code (expected $expected)"
  fi
}

echo "== earthhue.net health check =="
echo "time: $(date -Is)"
echo

# ------------------------------------------------------------------ local
echo "--- application on this host ---"
for path in /en /zh /en/c2c/stories /en/c2c/science /en/pigments /en/products \
            /en/articles /en/b2b/samples /en/b2b/contact /en/contact /en/regulations \
            /en/llms.txt /llms.txt /sitemap.xml /robots.txt; do
  check_code "local $path" "$LOCAL$path" 200
done

# The bare root redirects to the default locale, which is correct behaviour.
root_code=$(curl -s -o /dev/null -w '%{http_code}' --max-time 20 "$LOCAL/")
if [ "$root_code" = "200" ] || [ "$root_code" = "307" ]; then
  ok "local / redirects or serves ($root_code)"
else
  fail "local / -> $root_code"
fi

echo
REPORT="${REPORT}-- markdown mirror (local) --"$'\n'
MD_OK=0
MD_TOTAL=0
for path in "" "pigments" "products" "products/eh-curcumin-10" "articles" \
            "articles/beet-red-in-plant-based-meat" "c2c" "c2c/stories" "c2c/science" \
            "c2c/gallery" "b2b" "b2b/capability" "b2b/certifications" "b2b/samples" \
            "b2b/contact" "b2b/factory-visit" "regulations" "about" "contact"; do
  MD_TOTAL=$((MD_TOTAL + 1))
  if [ -z "$path" ]; then
    url="$LOCAL/md/en"
  else
    url="$LOCAL/md/en/$path"
  fi
  code=$(curl -s -o /dev/null -w '%{http_code}' --max-time 20 "$url")
  if [ "$code" = "200" ]; then
    MD_OK=$((MD_OK + 1))
  else
    REPORT="${REPORT}FAIL  $url -> $code"$'\n'
    FAILURES=$((FAILURES + 1))
  fi
done
if [ "$MD_OK" = "$MD_TOTAL" ]; then
  ok "markdown mirror covers $MD_OK/$MD_TOTAL paths"
else
  fail "markdown mirror covers $MD_OK/$MD_TOTAL paths"
fi

echo
ROBOTS=$(curl -s --max-time 20 "$LOCAL/robots.txt")
for token in OAI-SearchBot Claude-SearchBot ChatGPT-User PerplexityBot; do
  if printf '%s' "$ROBOTS" | grep -q "$token"; then
    ok "robots.txt lists $token"
  else
    fail "robots.txt is missing $token"
  fi
done

echo
for ua in "Mozilla/5.0 (compatible; Googlebot/2.1)" \
          "Mozilla/5.0 AppleWebKit/537.36 (compatible; Claude-SearchBot/1.0)" \
          "Mozilla/5.0 (compatible; OAI-SearchBot/1.0)" \
          "Mozilla/5.0 (compatible; PerplexityBot/1.0)"; do
  code=$(curl -s -o /dev/null -w '%{http_code}' --max-time 20 -A "$ua" "$LOCAL/en/c2c/science")
  if [ "$code" = "200" ]; then
    ok "crawler access ${ua:30:30} ($code)"
  else
    fail "crawler access ${ua:30:30} -> $code"
  fi
done

echo
SITEMAP_COUNT=$(curl -s --max-time 30 "$LOCAL/sitemap.xml" | grep -c "<loc>")
if [ "${SITEMAP_COUNT:-0}" -ge 37 ]; then
  ok "sitemap lists $SITEMAP_COUNT urls"
else
  fail "sitemap lists only $SITEMAP_COUNT urls"
fi

LLMS_COUNT=$(curl -s --max-time 30 "$LOCAL/llms.txt" | grep -c "^##")
if [ "${LLMS_COUNT:-0}" -ge 8 ]; then
  ok "llms.txt has $LLMS_COUNT sections"
else
  fail "llms.txt has only $LLMS_COUNT sections"
fi

LLMS_ARTICLES=$(curl -s --max-time 30 "$LOCAL/llms.txt" | grep -c "/articles/")
if [ "${LLMS_ARTICLES:-0}" -ge 8 ]; then
  ok "llms.txt lists $LLMS_ARTICLES article links"
else
  fail "llms.txt lists only $LLMS_ARTICLES article links"
fi

# ------------------------------------------------------------ catalogues
echo
if command -v python3 >/dev/null 2>&1; then
  if python3 "$APP/scripts/check-messages.py" >/tmp/eh_msgs_check.txt 2>&1; then
    ok "message catalogues are consistent"
  else
    fail "message catalogue check failed"
    REPORT="${REPORT}$(cat /tmp/eh_msgs_check.txt)"$'\n'
  fi
else
  fail "python3 not available for the catalogue check"
fi

# -------------------------------------------------------------- database
echo
DB="$APP/data/site.db"
if [ -f "$DB" ]; then
  if command -v sqlite3 >/dev/null 2>&1; then
    INQ=$(sqlite3 "$DB" "select count(*) from contact_submissions;" 2>/dev/null)
    EV=$(sqlite3 "$DB" "select count(*) from analytics_events;" 2>/dev/null)
    ok "database: ${INQ:-?} inquiries, ${EV:-?} tracked events"
  else
    ok "database present"
  fi
else
  fail "database file missing at $DB"
fi

# ------------------------------------------------------------------- pm2
echo
if command -v pm2 >/dev/null 2>&1; then
  STATUS=$(pm2 jlist 2>/dev/null | python3 -c "import json,sys;print(next((p['pm2_env']['status'] for p in json.load(sys.stdin) if p['name']=='earthhue'),'missing'))" 2>/dev/null)
  if [ "$STATUS" = "online" ]; then
    ok "pm2 earthhue is online"
  else
    fail "pm2 earthhue status is $STATUS"
  fi
else
  fail "pm2 not available"
fi

# ----------------------------------------------------------------- public
echo
REPORT="${REPORT}-- public edge --"$'\n'
for path in /en /zh /en/c2c/stories /en/c2c/science /en/pigments /en/articles \
            /en/b2b/samples /en/b2b/contact /en/contact /en/llms.txt /llms.txt \
            /sitemap.xml /robots.txt; do
  check_code "public $path" "$PUBLIC$path" 200
done

pub_root=$(curl -s -o /dev/null -w '%{http_code}' --max-time 20 "$PUBLIC/")
if [ "$pub_root" = "200" ] || [ "$pub_root" = "307" ]; then
  ok "public / redirects or serves ($pub_root)"
else
  fail "public / -> $pub_root"
fi

PUB_ROBOTS=$(curl -s --max-time 20 "$PUBLIC/robots.txt")
for token in OAI-SearchBot Claude-SearchBot; do
  if printf '%s' "$PUB_ROBOTS" | grep -q "$token"; then
    ok "public robots.txt lists $token"
  else
    fail "public robots.txt is missing $token"
  fi
done

PUB_MD=$(curl -s -o /dev/null -w '%{http_code}' --max-time 20 "$PUBLIC/md/en/c2c/stories")
if [ "$PUB_MD" != "200" ]; then
  fail "public markdown mirror is missing a page (-> $PUB_MD)"
fi

# A deploy on this host is not visible on the public host until that host
# picks it up. Report the difference instead of pretending the site is broken.
LOCAL_SIG=$(curl -s --max-time 20 "$LOCAL/en/b2b/contact" | grep -o 'class="space-y-5[^"]*"' | head -1)
PUB_SIG=$(curl -s --max-time 20 "$PUBLIC/en/b2b/contact" | grep -o 'class="space-y-5[^"]*"' | head -1)
if [ "$LOCAL_SIG" != "$PUB_SIG" ]; then
  warn "public host still runs an older build (form markup differs from local)"
fi

# --------------------------------------------------------------- report
echo
echo -e "$REPORT"
echo "=============================================="
echo "failures: $FAILURES   warnings: $WARNINGS"
if [ "$FAILURES" -eq 0 ]; then
  echo "RESULT: healthy"
  exit 0
fi
echo "RESULT: $FAILURES failure(s)"
exit 1
