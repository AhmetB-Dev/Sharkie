/**
 * Simple timer registry to track and clear intervals/timeouts.
 */
class TimerBag {
  constructor() {
    /** @type {number[]} */
    this.intervals = [];
    /** @type {number[]} */
    this.timeouts = [];
  }

  /**
   * Registers a repeating timer.
   * @param {Function} fn
   * @param {number} ms
   * @returns {number}
   */
  every(fn, ms) {
    const id = setInterval(fn, ms);
    this.intervals.push(id);
    return id;
  }

  /**
   * Registers a one-shot timer.
   * @param {Function} fn
   * @param {number} ms
   * @returns {number}
   */
  after(fn, ms) {
    const id = setTimeout(fn, ms);
    this.timeouts.push(id);
    return id;
  }

  /**
   * Clears all registered timers and resets arrays.
   * @returns {void}
   */
  clearAll() {
    for (const id of this.intervals) clearInterval(id);
    for (const id of this.timeouts) clearTimeout(id);
    this.intervals = [];
    this.timeouts = [];
  }
}
