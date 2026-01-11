#!/usr/bin/env bash

# Web Vitals Benchmark - Quick Run Script
# Usage: ./run.sh [mobile|desktop]

set -e

PRESET="${1:-desktop}"

echo "🎯 Running Lighthouse CI with $PRESET preset..."

# Temporary override for quick testing
TEMP_CONFIG=$(cat <<EOF
{
  "ci": {
    "collect": {
      "url": ["https://google.com"],
      "numberOfRuns": 1,
      "settings": {
        "preset": "$PRESET",
        "chromeFlags": "--no-sandbox --disable-dev-shm-usage"
      }
    },
    "assert": {
      "preset": "lighthouse:recommended"
    },
    "upload": {
      "target": "temporary-public-storage"
    }
  }
}
EOF
)

# Backup original config
if [ -f lighthouserc.json ]; then
  cp lighthouserc.json lighthouserc.json.bak
fi

# Use temp config for quick run
echo "$TEMP_CONFIG" > lighthouserc.temp.json

# Run with temp config
npx @lhci/cli@0.13.x autorun --config=lighthouserc.temp.json

# Cleanup
rm lighthouserc.temp.json
if [ -f lighthouserc.json.bak ]; then
  mv lighthouserc.json.bak lighthouserc.json
fi

echo "✅ Done!"
