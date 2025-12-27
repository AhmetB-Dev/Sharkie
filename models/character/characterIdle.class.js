/**
 * Idle and long-idle logic for the character.
 * Uses the existing Character fields (lastActionTime, delay, longIdlePlayed, longIdleFrame).
 */
class CharacterIdle {
  /**
   * @param {Character} character
   */
  constructor(character) {
    /** @type {Character} */
    this.c = character;
  }

  /**
   * Checks if any relevant player input is active.
   * @returns {boolean}
   */
  isPlayerActive() {
    const c = this.c;
    if (!c.world) return false;
    const input = c.world.input;

    return (
      input.RIGHT ||
      input.LEFT ||
      input.UP ||
      input.DOWN ||
      input.SPACE ||
      input.THROW ||
      input.ATA1 ||
      input.ATA2 ||
      input.ULTIMATE
    );
  }

  /**
   * Plays only the tail part of the long idle animation.
   * @returns {void}
   */
  playLongIdleTail() {
    const c = this.c;
    const frames = c.IMAGES_LONG_IDLE;
    const startIndex = Math.max(frames.length - 4, 0);
    c.playAnimation(frames.slice(startIndex));
  }

  /**
   * Plays the long idle animation once (frame-by-frame).
   * @returns {void}
   */
  playLongIdleOnce() {
    const c = this.c;
    const frames = c.IMAGES_LONG_IDLE;

    if (c.longIdleFrame < 0 || c.longIdleFrame >= frames.length) c.longIdleFrame = 0;
    c.img = c.imageCache[frames[c.longIdleFrame]];

    if (c.longIdleFrame < frames.length - 1) c.longIdleFrame++;
    else c.longIdlePlayed = true;
  }
}
