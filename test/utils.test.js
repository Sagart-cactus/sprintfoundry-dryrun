const test = require('node:test');
const assert = require('node:assert/strict');

const { isEven } = require('../src/utils');

test('returns true for positive even numbers', () => {
  assert.equal(isEven(2), true);
  assert.equal(isEven(42), true);
});

test('returns false for positive odd numbers', () => {
  assert.equal(isEven(1), false);
  assert.equal(isEven(99), false);
});

test('returns true for negative even numbers', () => {
  assert.equal(isEven(-2), true);
  assert.equal(isEven(-100), true);
});

test('returns false for negative odd numbers', () => {
  assert.equal(isEven(-1), false);
  assert.equal(isEven(-77), false);
});

test('returns true for zero', () => {
  assert.equal(isEven(0), true);
});
