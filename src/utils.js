/**
 * Creates a debounced version of a function that runs only after
 * `delay` milliseconds have elapsed since the most recent invocation.
 *
 * @param {Function} fn - The function to debounce.
 * @param {number} delay - Delay in milliseconds.
 * @returns {Function} A debounced function.
 */
export function debounce(fn, delay) {
  let timerId;

  return function debounced(...args) {
    clearTimeout(timerId);

    timerId = setTimeout(() => {
      fn.apply(this, args);
    }, delay);
  };
}
