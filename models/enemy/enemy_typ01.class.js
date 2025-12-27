/**
 * Enemy type 1 (puffer fish): patrol movement + distance-based attack animation.
 * Has a falling death behavior via gravity and a one-time death animation.
 * @extends MovableObject
 */
class Enemy_Typ01 extends MovableObject {
  y = 300;
  height = 70;
  width = 90;
  isDead = false;
  isAttacking = false;
  deathAnimationDone = false;
  deathFrame = 0;

  constructor() {
    super();
    this.linkAssets();
    this.loadImage(this.ENEMIES_WALK[0]);
    this.loadAssets();
    this.spawnRandomTyp1();
    this.enemySpeedTyp1();
    this.startPatrol(300);
    this.initAnim();
    this.otherDirection = true;
    this.groundY = 325;
  }

  /** @returns {void} */
  linkAssets() {
    this.ENEMIES_WALK = EnemyAssets.TYPE1_WALK;
    this.ENEMIES_ATTACK = EnemyAssets.TYPE1_ATTACK;
    this.ENEMIES_DEAD = EnemyAssets.TYPE1_DEAD;
  }

  /** @returns {void} */
  loadAssets() {
    this.animationImage(this.ENEMIES_WALK);
    this.animationImage(this.ENEMIES_ATTACK);
    this.animationImage(this.ENEMIES_DEAD);
  }

  /** @returns {void} */
  initAnim() {
    this.animStepSec = 0.175;
    this._animAcc = 0;
    this._deathAcc = 0;
  }

  /**
   * Per-frame update.
   * @param {number} dtSec
   * @returns {void}
   */
  update(dtSec) {
    if (this.isDead) return this.updateDead(dtSec);
    this.updatePatrol(dtSec);
    this.updateAlive(dtSec);
  }

  /**
   * Updates alive animation (walk vs attack).
   * @param {number} dtSec
   * @returns {void}
   */
  updateAlive(dtSec) {
    const frames = this.isAttacking ? this.ENEMIES_ATTACK : this.ENEMIES_WALK;
    this.stepAnim(dtSec, frames);
  }

  /**
   * Updates dead behavior (gravity + death frames).
   * @param {number} dtSec
   * @returns {void}
   */
  updateDead(dtSec) {
    this.updateGravity(dtSec);
    this._deathAcc += dtSec;
    if (this._deathAcc < this.animStepSec) return;
    this._deathAcc = 0;
    this.stepDeathFrame();
  }

  /**
   * Advances animation using accumulator timing.
   * @param {number} dtSec
   * @param {string[]} frames
   * @returns {void}
   */
  stepAnim(dtSec, frames) {
    this._animAcc += dtSec;
    if (this._animAcc < this.animStepSec) return;
    this._animAcc = 0;
    this.playAnimation(frames);
  }

  /**
   * Advances death frame and keeps last frame when done.
   * @returns {void}
   */
  stepDeathFrame() {
    const frames = this.ENEMIES_DEAD;
    if (!frames || frames.length === 0) return;

    const i = this.getDeathIndex(frames.length);
    this.img = this.imageCache[frames[i]];
    if (i >= frames.length - 1) this.deathAnimationDone = true;
    else this.deathFrame++;
  }

  /**
   * Returns the correct death frame index (clamped, last frame sticks).
   * @param {number} len
   * @returns {number}
   */
  getDeathIndex(len) {
    if (this.deathAnimationDone) return len - 1;
    if (this.deathFrame < 0) return 0;
    if (this.deathFrame >= len) return len - 1;
    return this.deathFrame;
  }

  /**
   * Switches enemy into dead state and enables gravity drop.
   * @returns {void}
   */
  die() {
    if (this.isDead) return;
    this.isDead = true;
    this.speed = 0;
    this.currentImage = 0;
    this.deathFrame = 0;
    this.deathAnimationDone = false;
    this.enableGravity();
  }

  /**
   * Spawns enemy at random x in a predefined range.
   * @returns {void}
   */
  spawnRandomTyp1() {
    const minX = 400;
    const maxX = 1600;
    this.x = Math.random() * (maxX - minX) + minX;
    this.y = 300;
  }

  /**
   * Randomizes movement speed.
   * @returns {void}
   */
  enemySpeedTyp1() {
    this.speed = 3 + Math.random() * 2;
  }

  /**
   * Sets attack state based on distance to character.
   * @param {Character} character
   * @returns {void}
   */
  updateAI(character) {
    const dx = character.x - this.x;
    const dy = character.y - this.y;
    const distance = Math.sqrt(dx * dx + dy * dy);
    this.isAttacking = distance < 250;
  }
}
