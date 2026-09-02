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
    this.character = character;
  }

  /**
   * Applies damage and temporary slowdown when hit.
   * @returns {void}
   */
  hit() {
    const character = this.character;
    character.baseHit();

    if (character.dead()) {
      character.speed = 0;
      return;
    }

    this.applyHitSlowdown();
  }

  /**
   * Temporarily slows the character after being hit.
   * @returns {void}
   */
  applyHitSlowdown() {
    const character = this.character;
    if (character.isSlowed) return;

    character.isSlowed = true;
    character.speed = character.normalSpeed * character.hurtSpeedFactor;

    setTimeout(() => {
      if (!character.dead() && character.world && !character.world.endScreen)
        character.speed = character.normalSpeed;
      character.isSlowed = false;
    }, 400);
  }
}
