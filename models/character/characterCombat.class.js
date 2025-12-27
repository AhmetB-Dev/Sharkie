/**
 * Shooting / projectile logic for the character.
 * Keeps Character.class.js smaller and avoids mixing combat with movement/idle.
 */
class CharacterCombat {
  /**
   * @param {Character} character
   */
  constructor(character) {
    /** @type {Character} */
    this.c = character;
  }

  /**
   * Shoots the normal (attack 1) bubble projectile.
   * @returns {void}
   */
  shootAttack1Bubble() {
    const c = this.c;
    if (!c.world) return;

    const shootToLeft = c.otherDirection;
    const offsetX = shootToLeft ? -20 : c.width;
    const startX = c.x + offsetX;
    const startY = c.y + c.height * 0.5;

    const bubble = new BubbleProjectile(startX, startY, c.IMAGES_ATTACK_BUBBLE_ANI1, shootToLeft);
    c.world.throwableObjects.push(bubble);

    if (window.audioManager) window.audioManager.play("bubbleShot");
  }

  /**
   * Shoots the ultimate bubble (consumes ammo/items).
   * @returns {void}
   */
  shootUltimateBubble() {
    const c = this.c;
    if (!this.canShootUltimate()) return;

    this.consumeUltimateAmmo();
    const startPos = this.getUltimateShotStart();
    const projectile = this.createUltimateBubble(startPos);

    this.spawnProjectile(projectile);
    this.playBubbleShotSound();
  }

  /**
   * @returns {boolean}
   */
  canShootUltimate() {
    const c = this.c;
    if (!c.world) return false;
    return c.items > 0;
  }

  /**
   * Consumes one ultimate ammo stack and updates HUD.
   * @returns {void}
   */
  consumeUltimateAmmo() {
    const c = this.c;
    c.items--;
    this.updateAmmoBar();
  }

  /**
   * Updates ammo bar percent based on items.
   * @returns {void}
   */
  updateAmmoBar() {
    const c = this.c;
    if (!c.world || !c.world.ammoBar) return;
    c.world.ammoBar.setStack(c.items * 20);
  }

  /**
   * Computes the starting position/direction for ultimate shot.
   * @returns {{x:number, y:number, shootToLeft:boolean}}
   */
  getUltimateShotStart() {
    const c = this.c;
    const shootToLeft = c.otherDirection;
    const offsetX = shootToLeft ? -20 : c.width;

    return {
      x: c.x + offsetX,
      y: c.y + c.height * 0.5,
      shootToLeft,
    };
  }

  /**
   * Creates the ultimate bubble projectile instance.
   * @param {{x:number, y:number, shootToLeft:boolean}} pos
   * @returns {BubbleProjectile}
   */
  createUltimateBubble(pos) {
    const c = this.c;
    return new BubbleProjectile(pos.x, pos.y, c.IMAGES_UTLIMATE_ATTACK_BUBBLE, pos.shootToLeft, true);
  }

  /**
   * Spawns a projectile into the world.
   * @param {any} projectile
   * @returns {void}
   */
  spawnProjectile(projectile) {
    const c = this.c;
    if (!c.world) return;
    c.world.throwableObjects.push(projectile);
  }

  /**
   * Plays bubble shot sound effect.
   * @returns {void}
   */
  playBubbleShotSound() {
    if (window.audioManager) window.audioManager.play("bubbleShot");
  }
}
