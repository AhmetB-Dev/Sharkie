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
    this.character = character;
  }

  /**
   * Checks if any relevant player input is active.
   * @returns {boolean}
   */
  isPlayerActive() {
    const character = this.character;
    if (!character.world) return false;
    const input = character.world.input;

    return (
      input.RIGHT ||
      input.LEFT ||
      input.UP ||
      input.DOWN ||
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
    const character = this.character;
    const frames = character.IMAGES_LONG_IDLE;
    const startIndex = Math.max(frames.length - 4, 0);
    character.playAnimation(frames.slice(startIndex));
  }

  /**
   * Plays the long idle animation once (frame-by-frame).
   * @returns {void}
   */
  playLongIdleOnce() {
    const character = this.character;
    const frames = character.IMAGES_LONG_IDLE;

    if (character.longIdleFrame < 0 || character.longIdleFrame >= frames.length) character.longIdleFrame = 0;
    character.img = character.imageCache[frames[character.longIdleFrame]];

    if (character.longIdleFrame < frames.length - 1) character.longIdleFrame++;
    else character.longIdlePlayed = true;
  }
}
