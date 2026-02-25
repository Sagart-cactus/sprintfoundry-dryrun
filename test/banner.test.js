import test from 'node:test';
import assert from 'node:assert/strict';

import { ALLOWED_CHARS, pickChar, renderSprintFoundry } from '../src/banner.js';

test('pickChar supports deterministic injection at lower and upper bounds', () => {
  assert.equal(pickChar(() => 0), ALLOWED_CHARS[0]);
  assert.equal(pickChar(() => 0.999999), ALLOWED_CHARS[ALLOWED_CHARS.length - 1]);
  assert.equal(pickChar(() => 1), ALLOWED_CHARS[ALLOWED_CHARS.length - 1]);
});

test('pickChar always returns a member of ALLOWED_CHARS', () => {
  const sampleValues = [0, 0.05, 0.2, 0.45, 0.62, 0.8, 0.999999, 1];

  for (const value of sampleValues) {
    const result = pickChar(() => value);
    assert.equal(ALLOWED_CHARS.includes(result), true);
  }
});

test('renderSprintFoundry returns a multiline banner', () => {
  const banner = renderSprintFoundry('#');
  const lines = banner.split('\n');

  assert.equal(banner.includes('\n'), true);
  assert.ok(lines.length > 1);
});

test('rendered pixels use the selected character consistently', () => {
  const char = '@';
  const banner = renderSprintFoundry(char);

  for (const glyph of banner) {
    if (glyph === ' ' || glyph === '\n') {
      continue;
    }

    assert.equal(glyph, char);
  }
});

test('pixel set is constrained to selected char, space, and newline', () => {
  const char = '&';
  const banner = renderSprintFoundry(char);
  const unique = new Set(banner.split(''));

  for (const glyph of unique) {
    assert.equal(glyph === char || glyph === ' ' || glyph === '\n', true);
  }
});

test('renderSprintFoundry throws TypeError for invalid char input', () => {
  assert.throws(() => renderSprintFoundry(), TypeError);
  assert.throws(() => renderSprintFoundry(''), TypeError);
  assert.throws(() => renderSprintFoundry('ab'), TypeError);
  assert.throws(() => renderSprintFoundry(1), TypeError);
});
