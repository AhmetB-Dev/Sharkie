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
    this.character = character;
  }

  /**
   * Shoots the normal (attack 1) bubble projectile.
   * @returns {void}
   */
  shootAttack1Bubble() {
    const character = this.character;
    if (!character.world) return;

    const shootToLeft = character.otherDirection;
    const offsetX = shootToLeft ? -20 : character.width;
    const startX = character.x + offsetX;
    const startY = character.y + character.height * 0.5;

    const bubble = new BubbleProjectile(startX, startY, character.IMAGES_ATTACK_BUBBLE_ANI1, shootToLeft);
    character.world.throwableObjects.push(bubble);

    if (window.audioManager) window.audioManager.play("bubbleShot");
  }

  /**
   * Shoots the ultimate bubble (consumes ammo/items).
   * @returns {void}
   */
  shootUltimateBubble() {
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
    const character = this.character;
    if (!character.world) return false;
    return character.items > 0;
  }

  /**
   * Consumes one ultimate ammo stack and updates HUD.
   * @returns {void}
   */
  consumeUltimateAmmo() {
    const character = this.character;
    character.items--;
    this.updateAmmoBar();
  }

  /**
   * Updates ammo bar percent based on items.
   * @returns {void}
   */
  updateAmmoBar() {
    const character = this.character;
    if (!character.world || !character.world.ammoBar) return;
    character.world.ammoBar.setStack(character.items * 20);
  }

  /**
   * Computes the starting position/direction for ultimate shot.
   * @returns {{x:number, y:number, shootToLeft:boolean}}
   */
  getUltimateShotStart() {
    const character = this.character;
    const shootToLeft = character.otherDirection;
    const offsetX = shootToLeft ? -20 : character.width;

    return {
      x: character.x + offsetX,
      y: character.y + character.height * 0.5,
      shootToLeft,
    };
  }

  /**
   * Creates the ultimate bubble projectile instance.
   * @param {{x:number, y:number, shootToLeft:boolean}} pos
   * @returns {BubbleProjectile}
   */
  createUltimateBubble(pos) {
    const character = this.character;
    return new BubbleProjectile(pos.x, pos.y, character.IMAGES_UTLIMATE_ATTACK_BUBBLE, pos.shootToLeft, true);
  }

  /**
   * Spawns a projectile into the world.
   * @param {any} projectile
   * @returns {void}
   */
  spawnProjectile(projectile) {
    const character = this.character;
    if (!character.world) return;
    character.world.throwableObjects.push(projectile);
  }

  /**
   * Plays bubble shot sound effect.
   * @returns {void}
   */
  playBubbleShotSound() {
    if (window.audioManager) window.audioManager.play("bubbleShot");
  }
}
