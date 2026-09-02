/**
 * Plays an uninterruptible animation sequence frame-by-frame.
 * Used by CharacterAnimator to keep attacks atomic (tap-to-play).
 */
class CharacterActionLock {
  /**
   * @param {Character} character
   */
  constructor(character) {
    /** @type {Character} */
    this.character = character;
    /** @type {null|{frames:string[], i:number, fired:boolean, onStart?:Function, onEnd?:Function, onLastFrame?:Function}} */
    this.lock = null;
  }

  /** @returns {boolean} */
  has() {
    return !!this.lock;
  }

  /**
   * @param {string[]} frames
   * @param {{onStart?:Function, onEnd?:Function, onLastFrame?:Function}} [hooks]
   * @returns {void}
   */
  start(frames, hooks = {}) {
    if (!Array.isArray(frames) || frames.length === 0) return;
    this.cancel();
    this.lock = { frames, i: 0, fired: false, ...hooks };
    this.lock.onStart?.();
    this.tick();
  }

  /**
   * @returns {boolean} True when a lock is active.
   */
  tick() {
    if (!this.lock) return false;
    const lock = this.lock;
    const frames = lock.frames;
    const idx = Math.min(lock.i, frames.length - 1);

    this.character.img = this.character.imageCache[frames[idx]];
    this.fireLastFrameOnce(lock, idx);
    this.advanceOrFinish(lock, frames.length);
    return true;
  }

  /**
   * @param {any} lock
   * @param {number} idx
   * @returns {void}
   */
  fireLastFrameOnce(lock, idx) {
    const isLast = idx === lock.frames.length - 1;
    if (!isLast || lock.fired) return;
    lock.fired = true;
    lock.onLastFrame?.();
  }

  /**
   * @param {any} lock
   * @param {number} frameCount
   * @returns {void}
   */
  advanceOrFinish(lock, frameCount) {
    lock.i += 1;
    if (lock.i < frameCount) return;
    this.cancel();
  }

  /**
   * @returns {void}
   */
  cancel() {
    if (!this.lock) return;
    this.lock.onEnd?.();
    this.lock = null;
  }
}
