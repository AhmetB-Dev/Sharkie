/**
 * Damage and slowdown handling for the character.
 * Uses Character.baseHit() for calling the MovableObject implementation.
 */
class CharacterDamage {
  /**
   * @param {Character} character
   */
  constructor(character) {
    /** @type {Character} */
    this.c = character;
  }

  /**
   * Applies damage and temporary slowdown when hit.
   * @returns {void}
   */
  hit() {
    const c = this.c;
    c.baseHit();

    if (c.dead()) {
      c.speed = 0;
      return;
    }

    this.applyHitSlowdown();
  }

  /**
   * Temporarily slows the character after being hit.
   * @returns {void}
   */
  applyHitSlowdown() {
    const c = this.c;
    if (c.isSlowed) return;

    c.isSlowed = true;
    c.speed = c.normalSpeed * c.hurtSpeedFactor;

    setTimeout(() => {
      if (!c.dead() && c.world && !c.world.endScreen) c.speed = c.normalSpeed;
      c.isSlowed = false;
    }, 400);
  }
}
