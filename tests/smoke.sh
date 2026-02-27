#!/usr/bin/env bash
set -euo pipefail

PASS_COUNT=0
FAIL_COUNT=0

run_check() {
  local name="$1"
  local cmd="$2"
  if eval "$cmd"; then
    echo "PASS: ${name}"
    PASS_COUNT=$((PASS_COUNT + 1))
  else
    echo "FAIL: ${name}"
    FAIL_COUNT=$((FAIL_COUNT + 1))
  fi
}

run_check "README exists and is non-empty" "[ -s README.md ]"
run_check "AGENTS contains QA Agent heading" "rg -q '^# QA Agent' AGENTS.md"

echo "SUMMARY total=$((PASS_COUNT + FAIL_COUNT)) passed=${PASS_COUNT} failed=${FAIL_COUNT} skipped=0"

if [ "$FAIL_COUNT" -gt 0 ]; then
  exit 1
fi
