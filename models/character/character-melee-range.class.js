/**
 * Melee hit-range calculations for the character.
 * - Only while the melee animation is active (character.hitRange === true)
 * - Enemy must be in front of the character
 * - Enemy must be VERY close (touching hitboxes + tiny reach in front)
 */
class CharacterMeleeRange {
  /**
   * @param {Character} character
   */
  constructor(character) {
    this.character = character;

    /** @type {number} Tiny extra reach in px (set 0 for "must touch"). */
    this.REACH_PX = 12;
  }

  /**
   * Backward compatible: Character.hitmakerRange(enemy) delegates here.
   * @param {any} enemy
   * @returns {boolean}
   */
  hitmakerRange(enemy) {
    if (!this.isActive(enemy)) return false;
    if (!this.isInFront(enemy)) return false;
    return this.overlaps(this.getStrikeBox(), this.getHitbox(enemy));
  }

  /** @param {any} enemy @returns {boolean} */
  isActive(enemy) {
    return !!enemy && !!this.character?.hitRange;
  }

  /** @param {any} enemy @returns {boolean} */
  isInFront(enemy) {
    const character = this.character;
    const characterHitbox = this.getHitbox(character);
    const enemyHitbox = this.getHitbox(enemy);

    const characterCenterX = (characterHitbox.left + characterHitbox.right) / 2;
    const enemyCenterX = (enemyHitbox.left + enemyHitbox.right) / 2;

    return character.otherDirection ? enemyCenterX < characterCenterX : enemyCenterX > characterCenterX;
  }

  /**
   * Player hitbox + tiny reach only in facing direction.
   * @returns {{left:number,right:number,top:number,bottom:number}}
   */
  getStrikeBox() {
    const character = this.character;
    const characterHitbox = this.getHitbox(character);
    if (character.otherDirection) {
      return {
        left: characterHitbox.left - this.REACH_PX,
        right: characterHitbox.right,
        top: characterHitbox.top,
        bottom: characterHitbox.bottom,
      };
    }
    return {
      left: characterHitbox.left,
      right: characterHitbox.right + this.REACH_PX,
      top: characterHitbox.top,
      bottom: characterHitbox.bottom,
    };
  }

  /**
   * Uses MovableObject.getHitbox(obj) (offset-based).
   * @param {any} obj
   * @returns {{left:number,right:number,top:number,bottom:number}}
   */
  getHitbox(obj) {
    const character = this.character;
    if (character && typeof character.getHitbox === "function") return character.getHitbox(obj);

    const offset = obj?.offset || { top: 0, left: 0, right: 0, bottom: 0 };
    return {
      left: obj.x + offset.left,
      right: obj.x + obj.width - offset.right,
      top: obj.y + offset.top,
      bottom: obj.y + obj.height - offset.bottom,
    };
  }

  /**
   * AABB overlap for {left,right,top,bottom}.
   * @param {{left:number,right:number,top:number,bottom:number}} strikeBox
   * @param {{left:number,right:number,top:number,bottom:number}} targetHitbox
   * @returns {boolean}
   */
  overlaps(strikeBox, targetHitbox) {
    const overlapX = strikeBox.left < targetHitbox.right && strikeBox.right > targetHitbox.left;
    const overlapY = strikeBox.top < targetHitbox.bottom && strikeBox.bottom > targetHitbox.top;
    return overlapX && overlapY;
  }
}
