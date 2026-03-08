import test from 'node:test';
import assert from 'node:assert/strict';
import { setTimeout as sleep } from 'node:timers/promises';

import { debounce } from '../src/utils.js';

test('debounce export regression: should export a callable function', () => {
  assert.equal(typeof debounce, 'function');
});

test('debounce waits for quiet period and invokes once with latest args', async () => {
  const calls = [];
  const debounced = debounce((value) => {
    calls.push({ value, at: Date.now() });
  }, 40);

  const start = Date.now();
  debounced('first');
  await sleep(15);
  debounced('second');
  await sleep(15);
  debounced('final');

  await sleep(30);
  assert.equal(calls.length, 0, 'should not run before delay after last call');

  await sleep(20);
  assert.equal(calls.length, 1, 'should run once after quiet period');
  assert.equal(calls[0].value, 'final');
  assert.ok(calls[0].at - start >= 40, 'should run only after at least delay');
});

test('debounce preserves this context for method-style usage', async () => {
  const obj = {
    factor: 7,
    output: 0,
    update(value) {
      this.output = value * this.factor;
    },
  };

  obj.debouncedUpdate = debounce(obj.update, 30);
  obj.debouncedUpdate(3);
  await sleep(40);

  assert.equal(obj.output, 21);
});

test('debounce reset semantics: later call cancels earlier pending invocation', async () => {
  let count = 0;
  const debounced = debounce(() => {
    count += 1;
  }, 35);

  debounced();
  await sleep(20);
  debounced();
  await sleep(20);

  assert.equal(count, 0, 'second call should reset timer and prevent early invocation');

  await sleep(20);
  assert.equal(count, 1, 'should invoke only once after reset quiet period');
});
