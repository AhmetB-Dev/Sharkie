/**
 * Boss enemy with intro, combat (walk/attack), hurt and death animations.
 * @extends MovableObject
 */
class Boss extends MovableObject {
  /** @type {number} */ height = 350;
  /** @type {number} */ width = 400;
  /** @type {number} */ y = 70;
  /** @type {number} */ energy = 100;
  /** @type {number} */ speed = 40;
  /** @type {number} */ attackRange = 200;
  /** @type {boolean} */ isDead = false;
  /** @type {number} */ deathFrame = 0;
  /** @type {boolean} */ deathAnimationDone = false;
  /** @type {boolean} */ isActive = false;
  /** @type {boolean} */ playerInRange = false;
  /** @type {boolean} */ introPlayed = false;
  /** @type {number} */ introFrame = 0;
  /** @type {boolean} */ isAttacking = false;
  /** @type {boolean} */ inDamageWindow = false;
  /** @type {number} */ triggerIntro = 4000;

  constructor() {
    super();
    this.linkAssets();
    this.loadImage(this.ENEMIES_INTRODUCE[0]);
    this.loadAssets();
    this.initAnim();
    this.x = 4500;
  }

  /**
   * Connects asset arrays from EnemyAssets to boss instance fields.
   * @returns {void}
   */
  linkAssets() {
    this.ENEMIES_INTRODUCE = EnemyAssets.BOSS_INTRO;
    this.ENEMIES_WALK = EnemyAssets.BOSS_WALK;
    this.ENEMIES_ATTACK = EnemyAssets.BOSS_ATTACK;
    this.ENEMIES_HURT = EnemyAssets.BOSS_HURT;
    this.ENEMIES_DEAD = EnemyAssets.BOSS_DEAD;
  }

  /**
   * Preloads all boss animation frames into image cache.
   * @returns {void}
   */
  loadAssets() {
    this.animationImage(this.ENEMIES_INTRODUCE);
    this.animationImage(this.ENEMIES_WALK);
    this.animationImage(this.ENEMIES_ATTACK);
    this.animationImage(this.ENEMIES_HURT);
    this.animationImage(this.ENEMIES_DEAD);
  }

  /**
   * Initializes animation timing accumulators.
   * @returns {void}
   */
  initAnim() {
    this.animStepSec = 0.125;
    this._animAcc = 0;
    this._deathAcc = 0;
  }

  /**
   * Main boss update step.
   * @param {number} dtSec
   * @returns {void}
   */
  update(dtSec) {
    if (!this.isActive) return;
    if (this.isDead || this.dead()) return this.stepDeath(dtSec);
    if (this.playerInRange && !this.introPlayed) return this.stepIntro(dtSec);

    if (this.hitHurt()) return this.stepAnim(dtSec, this.ENEMIES_HURT);
    if (!this.playerInRange || !this.introPlayed) return;

    this.stepCombat(dtSec);
  }

  /**
   * Applies damage to the boss (only after the intro has finished).
   * @param {number} [damage=5] - Damage amount to subtract from energy.
   * @returns {void}
   */
  hit(damage = 5) {
    if (!this.introPlayed) return;
    super.hit(damage);
  }

  /**
   * Plays intro animation frames once.
   * @param {number} dtSec
   * @returns {void}
   */
  stepIntro(dtSec) {
    const introFrames = this.ENEMIES_INTRODUCE;
    this._animAcc += dtSec;
    if (this._animAcc < this.animStepSec) return;
    this._animAcc = 0;

    const frameIndex = this.introFrame;
    this.img = this.imageCache[introFrames[frameIndex]];
    if (frameIndex >= introFrames.length - 1) return this.finishIntro();
    this.introFrame++;
  }

  /**
   * Marks intro as finished and triggers SFX.
   * @returns {void}
   */
  finishIntro() {
    this.introPlayed = true;
    if (window.audioManager) window.audioManager.play("bossIntro");
  }

  /**
   * Handles combat state (walk vs attack).
   * @param {number} dtSec
   * @returns {void}
   */
  stepCombat(dtSec) {
    if (this.isAttacking) return this.stepAttack(dtSec);
    this.stepAnim(dtSec, this.ENEMIES_WALK);
    this.inDamageWindow = false;
  }

  /**
   * Plays attack animation and updates the damage window.
   * @param {number} dtSec
   * @returns {void}
   */
  stepAttack(dtSec) {
    this.stepAnim(dtSec, this.ENEMIES_ATTACK);
    this.updateAttackDamageWindow();
  }

  /**
   * Advances an animation by one frame based on animStepSec timing.
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
   * Advances death animation timing and frame state.
   * @param {number} dtSec
   * @returns {void}
   */
  stepDeath(dtSec) {
    this._deathAcc += dtSec;
    if (this._deathAcc < this.animStepSec) return;
    this._deathAcc = 0;
    this.playDeathAnimation();
  }

  /**
   * Switches boss into dead state and resets related flags.
   * @returns {void}
   */
  die() {
    if (this.isDead) return;
    this.isDead = true;
    this.speed = 0;
    this.isAttacking = false;
    this.deathFrame = 0;
    this.deathAnimationDone = false;
  }

  /**
   * Moves boss towards the character and updates attack state by distance.
   * @param {any} character
   * @returns {void}
   */
  followCharacter(character) {
    const deltaX = character.x - this.x;
    const deltaY = character.y - this.y;
    const distanceToCharacter = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
    const moveStep = 15;

    const normX = deltaX / (distanceToCharacter || 1);
    const normY = deltaY / (distanceToCharacter || 1);

    this.x += normX * moveStep;
    this.y += Math.min(0, normY * moveStep);

    this.otherDirection = deltaX > 0;
    this.isAttacking = distanceToCharacter < this.attackRange;
  }

  /**
   * Updates `inDamageWindow` based on the current attack animation frame.
   * @returns {void}
   */
  updateAttackDamageWindow() {
    const attackFrames = this.ENEMIES_ATTACK;
    if (!attackFrames || attackFrames.length === 0) {
      this.inDamageWindow = false;
      return;
    }

    const currentFrameIndex = (this.currentImage - 1) % attackFrames.length;
    const lastFrameIndex = attackFrames.length - 1;
    this.inDamageWindow = currentFrameIndex === lastFrameIndex;
  }

  /**
   * Checks if the boss may damage the player right now.
   * @param {any} character
   * @returns {boolean}
   */
  canDamagePlayer(character) {
    return (
      this.isActive &&
      !this.isDead &&
      !this.dead() &&
      this.isAttacking &&
      this.inDamageWindow &&
      !character.isHurt()
    );
  }

  /**
   * Plays death frames and keeps the last frame once finished.
   * @returns {void}
   */
  playDeathAnimation() {
    const deathFrames = this.ENEMIES_DEAD;
    if (!deathFrames || deathFrames.length === 0) return;

    if (this.deathAnimationDone) {
      const lastFrame = deathFrames[deathFrames.length - 1];
      this.img = this.imageCache[lastFrame];
      return;
    }

    const frameIndex = Math.min(this.deathFrame, deathFrames.length - 1);
    this.img = this.imageCache[deathFrames[frameIndex]];

    if (frameIndex >= deathFrames.length - 1) this.deathAnimationDone = true;
    else this.deathFrame++;
  }

  /**
   * Draws boss only when active.
   * @param {CanvasRenderingContext2D} ctx
   * @returns {void}
   */
  draw(ctx) {
    if (!this.isActive) return;
    super.draw(ctx);
  }

  /**
   * Draws hitbox only when active.
   * @param {CanvasRenderingContext2D} ctx
   * @returns {void}
   */
  showHitbox(ctx) {
    if (!this.isActive) return;
    super.showHitbox(ctx);
  }
}
