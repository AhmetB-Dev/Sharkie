class TimerBag {
  constructor() {
    this.intervals = [];
    this.timeouts = [];
  }

  every(fn, ms) {
    const id = setInterval(fn, ms);
    this.intervals.push(id);
    return id;
  }

  after(fn, ms) {
    const id = setTimeout(fn, ms);
    this.timeouts.push(id);
    return id;
  }

  clearAll() {
    for (const id of this.intervals) clearInterval(id);
    for (const id of this.timeouts) clearTimeout(id);
    this.intervals = [];
    this.timeouts = [];
  }
}
