import test from 'node:test';
import assert from 'node:assert/strict';
import { setTimeout as sleep } from 'node:timers/promises';

import { debounce } from '../src/utils.js';

test('exports a callable debounce function', () => {
  assert.equal(typeof debounce, 'function');
});

test('invokes only once after delay for a single call', async () => {
  const calls = [];
  const delay = 40;
  const start = Date.now();
  const fn = () => calls.push(Date.now());
  const debounced = debounce(fn, delay);

  debounced();

  await sleep(20);
  assert.equal(calls.length, 0, 'should not run before delay elapses');

  await sleep(40);
  assert.equal(calls.length, 1, 'should run once after delay');
  assert.ok(
    calls[0] - start >= delay,
    `expected invocation at >= ${delay}ms, got ${calls[0] - start}ms`
  );
});

test('resets timer across rapid successive calls and uses last arguments', async () => {
  const seen = [];
  const delay = 50;
  const fn = (value) => seen.push({ value, at: Date.now() });
  const debounced = debounce(fn, delay);

  const first = Date.now();
  debounced('first');
  await sleep(15);
  debounced('second');
  await sleep(15);
  debounced('third');

  await sleep(30);
  assert.equal(seen.length, 0, 'should still be waiting after latest reset');

  await sleep(35);
  assert.equal(seen.length, 1, 'should run once after final call');
  assert.equal(seen[0].value, 'third', 'should use latest call arguments');
  assert.ok(
    seen[0].at - first >= delay,
    `expected invocation >= ${delay}ms after first call`
  );
});

test('allows a new invocation cycle after previous execution', async () => {
  let count = 0;
  const delay = 35;
  const debounced = debounce(() => {
    count += 1;
  }, delay);

  debounced();
  await sleep(50);
  assert.equal(count, 1);

  debounced();
  await sleep(50);
  assert.equal(count, 2, 'should run once per settled burst');
});
