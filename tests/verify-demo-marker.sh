#!/bin/bash
# Test: Verify demo-marker.txt requirements
# Requirements:
# 1. File exists at repository root
# 2. Contains exactly 'ok'
# 3. Has no trailing newline
# 4. Byte count is exactly 2

set -e

REPO_ROOT="$(cd "$(dirname "$0")/.." && pwd)"
FILE="$REPO_ROOT/demo-marker.txt"
FAILED=0

echo "Running demo-marker.txt verification tests..."
echo "=============================================="

# Test 1: File exists
echo -n "Test 1: File exists at repository root... "
if [ -f "$FILE" ]; then
    echo "PASS"
else
    echo "FAIL"
    FAILED=1
fi

# Test 2: Byte count is exactly 2
echo -n "Test 2: File byte count is exactly 2... "
BYTE_COUNT=$(wc -c < "$FILE")
if [ "$BYTE_COUNT" -eq 2 ]; then
    echo "PASS (actual: $BYTE_COUNT bytes)"
else
    echo "FAIL (expected: 2 bytes, actual: $BYTE_COUNT bytes)"
    FAILED=1
fi

# Test 3: Content is exactly 'ok'
echo -n "Test 3: Content is exactly 'ok'... "
CONTENT=$(cat "$FILE")
if [ "$CONTENT" = "ok" ]; then
    echo "PASS"
else
    echo "FAIL (actual content: '$CONTENT')"
    FAILED=1
fi

# Test 4: No trailing newline
echo -n "Test 4: No trailing newline... "
LAST_BYTE=$(tail -c 1 "$FILE" | od -An -tx1 | tr -d ' ')
if [ "$LAST_BYTE" != "0a" ]; then
    echo "PASS (last byte: 0x$LAST_BYTE)"
else
    echo "FAIL (found trailing newline)"
    FAILED=1
fi

# Test 5: Hex verification (6f 6b = 'ok')
echo -n "Test 5: Hex bytes are 0x6f 0x6b ('ok')... "
HEX=$(od -An -tx1 "$FILE" | tr -d ' \n')
if [ "$HEX" = "6f6b" ]; then
    echo "PASS"
else
    echo "FAIL (actual hex: $HEX)"
    FAILED=1
fi

echo "=============================================="
if [ $FAILED -eq 0 ]; then
    echo "All tests PASSED"
    exit 0
else
    echo "Some tests FAILED"
    exit 1
fi
