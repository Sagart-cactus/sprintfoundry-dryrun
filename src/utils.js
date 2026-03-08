/**
 * Creates a debounced function that delays invoking `fn` until after `delay`
 * milliseconds have elapsed since the last time the debounced function was called.
 *
 * @param {Function} fn - The function to debounce.
 * @param {number} delay - The debounce delay in milliseconds.
 * @returns {Function} A debounced wrapper function.
 */
export function debounce(fn, delay) {
  let timeoutId;

  return function debounced(...args) {
    const context = this;

    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => {
      fn.apply(context, args);
    }, delay);
  };
}
