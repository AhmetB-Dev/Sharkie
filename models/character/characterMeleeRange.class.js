/**
 * Melee hit-range calculations for the character.
 * Controller toggles c.hitRange; this class only evaluates geometry.
 */
class CharacterMeleeRange {
  /**
   * @param {Character} character
   */
  constructor(character) {
    /** @type {Character} */
    this.c = character;
  }

  /**
   * Checks if an enemy is within melee hit range (front-only).
   * @param {any} enemy
   * @returns {boolean}
   */
  hitmakerRange(enemy) {
    const c = this.c;
    if (!this.canUseHitRange(enemy)) return false;

    const delta = this.getCenterDelta(enemy);
    if (!this.isTargetInFront(delta.dx)) return false;

    return this.isDeltaWithinHitRange(delta);
  }

  /**
   * @param {any} enemy
   * @returns {boolean}
   */
  canUseHitRange(enemy) {
    const c = this.c;
    if (!c.hitRange) return false;
    return !!enemy;
  }

  /**
   * Computes center deltas between character and enemy.
   * @param {any} enemy
   * @returns {{dx:number, dy:number}}
   */
  getCenterDelta(enemy) {
    const c = this.c;
    const center = this.getCenter(c);
    const enemyCenter = this.getCenter(enemy);
    return { dx: enemyCenter.x - center.x, dy: enemyCenter.y - center.y };
  }

  /**
   * @param {any} obj
   * @returns {{x:number, y:number}}
   */
  getCenter(obj) {
    return { x: obj.x + obj.width / 2, y: obj.y + obj.height / 2 };
  }

  /**
   * Checks if target is in front of character based on facing direction.
   * @param {number} dx
   * @returns {boolean}
   */
  isTargetInFront(dx) {
    const c = this.c;
    const facingRight = !c.otherDirection;
    if (facingRight) return dx > 0;
    return dx < 0;
  }

  /**
   * @param {{dx:number, dy:number}} delta
   * @returns {boolean}
   */
  isDeltaWithinHitRange(delta) {
    const limits = this.getHitRangeLimits();
    return Math.abs(delta.dx) < limits.maxX && Math.abs(delta.dy) < limits.maxY;
  }

  /**
   * Returns hit range thresholds.
   * @returns {{maxX:number, maxY:number}}
   */
  getHitRangeLimits() {
    const c = this.c;
    return { maxX: c.width * 0.9, maxY: c.height * 0.7 };
  }
}
