#!/usr/bin/env bash
# Submit the sitemap to IndexNow.
#
# IndexNow is a push protocol: instead of waiting for a scheduled crawl, the
# host tells the participating engines that a URL is new or changed, and they
# pick it up within minutes. It matters here because the next phase adds ~170
# pigment URLs — a sitemap alone leaves them waiting for discovery, and the
# whole point of adding them is to be quotable.
#
# The protocol has no registration step. The host mints its own key, publishes
# it at https://<host>/<key>.txt and the engines fetch that file to verify
# ownership, so this works before the Bing Webmaster Tools verification does.
#
# Exit code 0 means the submission was accepted.
set -uo pipefail

APP="${APP:-/var/www/earthhue}"
SITE="${SITE:-https://earthhue.net}"
HOST="${HOST:-earthhue.net}"
ENDPOINT="${INDEXNOW_ENDPOINT:-https://api.indexnow.org/indexnow}"

KEYFILE=$(ls "$APP"/public/indexnow-*.txt 2>/dev/null | head -1)
if [ -z "$KEYFILE" ]; then
  echo "indexnow: no key file in $APP/public — run the key install step first"
  exit 1
fi
KEY=$(basename "$KEYFILE" .txt)

# The key file has to be reachable and has to contain exactly the key,
# otherwise the engines reject every submission with 403.
KEYURL="$SITE/$KEY.txt"
KCODE=$(curl -s -o /tmp/idx_key.txt -w '%{http_code}' --max-time 20 "$KEYURL")
if [ "$KCODE" != "200" ] || [ "$(cat /tmp/idx_key.txt)" != "$KEY" ]; then
  echo "indexnow: key file is not verifiable at $KEYURL (code=$KCODE)"
  exit 1
fi

SITEMAP=$(curl -s --max-time 60 "$SITE/sitemap.xml")
URLS=$(printf '%s' "$SITEMAP" | grep -o '<loc>[^<]*</loc>' | sed -E 's|</?loc>||g')
COUNT=$(printf '%s\n' "$URLS" | grep -c .)
if [ "$COUNT" -eq 0 ]; then
  echo "indexnow: the sitemap returned no urls"
  exit 1
fi

PAYLOAD=$(printf '%s\n' "$URLS" | python3 -c '
import sys, json
urls = [line.strip() for line in sys.stdin if line.strip()]
print(json.dumps({
    "host": sys.argv[3],
    "key": sys.argv[1],
    "keyLocation": sys.argv[2],
    "urlList": urls,
}))
' "$KEY" "$KEYURL" "$HOST")

CODE=$(curl -s -o /tmp/idx_resp.txt -w '%{http_code}' -X POST "$ENDPOINT" \
  -H 'Content-Type: application/json' -d "$PAYLOAD")

echo "indexnow: submitted $COUNT urls from $SITE/sitemap.xml -> HTTP $CODE"
case "$CODE" in
  200) echo "  accepted" ;;
  202) echo "  accepted for processing" ;;
  400) echo "  bad request — the payload was rejected"; head -c 300 /tmp/idx_resp.txt; exit 1 ;;
  403) echo "  forbidden — the key file could not be verified"; exit 1 ;;
  422) echo "  unprocessable — a url does not match the host"; exit 1 ;;
  429) echo "  too many requests — back off and retry later"; exit 1 ;;
  *)   echo "  unexpected response"; head -c 300 /tmp/idx_resp.txt; exit 1 ;;
esac
exit 0
