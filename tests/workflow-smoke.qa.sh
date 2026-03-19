#!/usr/bin/env bash
set -euo pipefail

pass=0
fail=0

check_contains() {
  local file="$1"
  local pattern="$2"
  local name="$3"
  if grep -Fq "$pattern" "$file"; then
    echo "PASS: $name"
    pass=$((pass+1))
  else
    echo "FAIL: $name"
    fail=$((fail+1))
  fi
}

check_nonempty() {
  local file="$1"
  local name="$2"
  if [ -s "$file" ]; then
    echo "PASS: $name"
    pass=$((pass+1))
  else
    echo "FAIL: $name"
    fail=$((fail+1))
  fi
}

check_contains "kind-workflow-smoke.txt" "spr-8 agentsandbox unattended workflow smoke 2026-03-19" "Kind smoke marker includes SPR-8 signature"
check_contains "kind-workflow-smoke.txt" "signature-retry 2026-03-19T16:01Z" "Kind smoke marker includes required QA webhook retry timestamp"
check_nonempty "linear-live-workflow-smoke.txt" "Linear live workflow smoke marker file is non-empty"

printf '{"total":%d,"passed":%d,"failed":%d}\n' "$((pass+fail))" "$pass" "$fail" > artifacts/qa-shell-results.json

if [ "$fail" -gt 0 ]; then
  exit 1
fi
