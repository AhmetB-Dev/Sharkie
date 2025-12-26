/**
 * @typedef {Object} Offset
 * @property {number} top
 * @property {number} left
 * @property {number} right
 * @property {number} bottom
 */

/**
 * Main player character (movement, attacks, idle logic).
 * @extends MovableObject
 */
class Character extends MovableObject {
  /** @type {World} */
  world;
  /** @type {number} */ height = 270;
  /** @type {number} */ width = 140;
  /** @type {number} */ y = 155;
  /** @type {number} */ speed = 60;
  /** @type {number} */ normalSpeed = 60;
  /** @type {number} */ hurtSpeedFactor = 0.3;
  /** @type {boolean} */ isSlowed = false;
  /** @type {number} */ coins = 0;
  /** @type {number} */ lastActionTime = Date.now();
  /** @type {number} */ delay = 3000;
  /** @type {boolean} */ longIdlePlayed = false;
  /** @type {number} */ longIdleFrame = 0;
  /** @type {boolean} */ attack1Ready = true;
  /** @type {boolean} */ ultimateReady = true;
  /** @type {boolean} */ hitRange = false;
  /** @type {boolean} */ lastHitByEnemy1 = false;
  /** @type {number} */ deathFrame = 0;
  /** @type {boolean} */ deathAnimationDone = false;
  /** @type {number} */ deathStepSec = 0.125;
  /** @type {number} */ _deathAcc = 0;
  /** @type {boolean} */ _deathStarted = false;
  /** @type {Offset} */
  offset = {
    top: 130,
    left: 25,
    right: 25,
    bottom: 60,
  };

  constructor() {
    super();
    this.normalSpeed = this.speed;
    this.linkAssets();
    this.loadImage(this.IMAGES_IDLE[0]);
    this.loadAssets();

    /** @type {CharacterController} */
    this.controller = new CharacterController(this);

    this.applyGravity();
    this.groundY = 155;
    this.y = this.groundY;

    this.animation();
  }

  /**
   * Links animation frame arrays from CharacterAssets.
   * @returns {void}
   */
  linkAssets() {
    this.IMAGES_IDLE = CharacterAssets.IMAGES_IDLE;
    this.IMAGES_LONG_IDLE = CharacterAssets.IMAGES_LONG_IDLE;
    this.IMAGES_WALK = CharacterAssets.IMAGES_WALK;
    this.IMAGES_ATTACK_ANI1 = CharacterAssets.IMAGES_ATTACK_ANI1;
    this.IMAGES_ATTACK_BUBBLE_ANI1 = CharacterAssets.IMAGES_ATTACK_BUBBLE_ANI1;
    this.IMAGES_ATTACK_ANI2 = CharacterAssets.IMAGES_ATTACK_ANI2;
    this.IMAGES_UTLIMATE_ATTACK = CharacterAssets.IMAGES_UTLIMATE_ATTACK;
    this.IMAGES_UTLIMATE_ATTACK_BUBBLE = CharacterAssets.IMAGES_UTLIMATE_ATTACK_BUBBLE;
    this.IMAGES_HURT_ANI1 = CharacterAssets.IMAGES_HURT_ANI1;
    this.IMAGES_HURT_ANI2 = CharacterAssets.IMAGES_HURT_ANI2;
    this.IMAGES_DEAD_ANI1 = CharacterAssets.IMAGES_DEAD_ANI1;
    this.IMAGES_DEAD_ANI2 = CharacterAssets.IMAGES_DEAD_ANI2;
  }

  /**
   * Preloads all character animation frames into cache.
   * @returns {void}
   */
  loadAssets() {
    this.animationImage(this.IMAGES_IDLE);
    this.animationImage(this.IMAGES_LONG_IDLE);
    this.animationImage(this.IMAGES_WALK);
    this.animationImage(this.IMAGES_ATTACK_ANI1);
    this.animationImage(this.IMAGES_ATTACK_BUBBLE_ANI1);
    this.animationImage(this.IMAGES_ATTACK_ANI2);
    this.animationImage(this.IMAGES_UTLIMATE_ATTACK);
    this.animationImage(this.IMAGES_UTLIMATE_ATTACK_BUBBLE);
    this.animationImage(this.IMAGES_HURT_ANI1);
    this.animationImage(this.IMAGES_HURT_ANI2);
    this.animationImage(this.IMAGES_DEAD_ANI1);
    this.animationImage(this.IMAGES_DEAD_ANI2);
  }

  /**
   * Starts animation loops and controller logic.
   * @returns {void}
   */
  animation() {
    this.startWalkAnimation();
    this.startJumpAnimation();
    this.controller.start();
  }

  /**
   * Starts left/right movement intervals.
   * @returns {void}
   */
  startWalkAnimation() {
    this.walkRight();
    this.walkLeft();
  }

  /**
   * Interval-based left movement and camera follow.
   * @returns {void}
   */
  walkLeft() {
    setInterval(() => {
      if (!this.world) return;
      if (this.dead() || this.world.endScreen) return;

      if (this.world.input.LEFT && this.x > 0) {
        this.x -= this.speed;
        this.otherDirection = true;
      }
      if (this.dead() || this.world.endScreen || this.world.isPaused) return;

      this.world.camera_x = -this.x + 100;
    }, 70);
  }

  /**
   * Interval-based right movement and camera follow.
   * @returns {void}
   */
  walkRight() {
    setInterval(() => {
      if (!this.world) return;
      if (this.dead() || this.world.endScreen) return;

      if (this.world.input.RIGHT && this.x < this.world.level.level_end) {
        this.x += this.speed;
        this.otherDirection = false;
      }
      if (this.dead() || this.world.endScreen || this.world.isPaused) return;

      this.world.camera_x = -this.x;
    }, 70);
  }

  /**
   * Interval-based jumping (sets vertical speed).
   * @returns {void}
   */
  startJumpAnimation() {
    setInterval(() => {
      if (!this.world) return;
      if (this.dead() || this.world.endScreen) return;

      if (this.world.input.UP && !this.isAboveGround()) {
        this.setJumpHeight();
      }
      if (this.dead() || this.world.endScreen || this.world.isPaused) return;
    }, 115);
  }

  /**
   * Checks if any relevant player input is active.
   * @returns {boolean}
   */
  isPlayerActive() {
    if (!this.world) return false;
    const input = this.world.input;

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
    const frames = this.IMAGES_LONG_IDLE;
    const startIndex = Math.max(frames.length - 4, 0);
    this.playAnimation(frames.slice(startIndex));
  }

  /**
   * Plays the long idle animation once (frame-by-frame).
   * @returns {void}
   */
  playLongIdleOnce() {
    const frames = this.IMAGES_LONG_IDLE;

    if (this.longIdleFrame < 0 || this.longIdleFrame >= frames.length) {
      this.longIdleFrame = 0;
    }
    this.img = this.imageCache[frames[this.longIdleFrame]];

    if (this.longIdleFrame < frames.length - 1) {
      this.longIdleFrame++;
    } else {
      this.longIdlePlayed = true;
    }
  }

  /**
   * Shoots the normal (attack 1) bubble projectile.
   * @returns {void}
   */
  shootAttack1Bubble() {
    if (!this.world) return;

    const shootToLeft = this.otherDirection;
    const offsetX = shootToLeft ? -20 : this.width;
    const startX = this.x + offsetX;
    const startY = this.y + this.height * 0.5;

    const bubble = new BubbleProjectile(startX, startY, this.IMAGES_ATTACK_BUBBLE_ANI1, shootToLeft);

    this.world.throwableObjects.push(bubble);
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
    if (!this.world) return false;
    return this.items > 0;
  }

  /**
   * Consumes one ultimate ammo stack and updates HUD.
   * @returns {void}
   */
  consumeUltimateAmmo() {
    this.items--;
    this.updateAmmoBar();
  }

  /**
   * Updates ammo bar percent based on items.
   * @returns {void}
   */
  updateAmmoBar() {
    const ammoPercent = this.items * 20;
    this.world.ammoBar.setStack(ammoPercent);
  }

  /**
   * Computes the starting position/direction for ultimate shot.
   * @returns {{x:number, y:number, shootToLeft:boolean}}
   */
  getUltimateShotStart() {
    const shootToLeft = this.otherDirection;
    const offsetX = shootToLeft ? -20 : this.width;
    return {
      x: this.x + offsetX,
      y: this.y + this.height * 0.5,
      shootToLeft,
    };
  }

  /**
   * Creates the ultimate bubble projectile instance.
   * @param {{x:number, y:number, shootToLeft:boolean}} pos
   * @returns {BubbleProjectile}
   */
  createUltimateBubble(pos) {
    return new BubbleProjectile(pos.x, pos.y, this.IMAGES_UTLIMATE_ATTACK_BUBBLE, pos.shootToLeft, true);
  }

  /**
   * Spawns a projectile into the world.
   * @param {any} projectile
   * @returns {void}
   */
  spawnProjectile(projectile) {
    this.world.throwableObjects.push(projectile);
  }

  /**
   * Plays bubble shot sound effect.
   * @returns {void}
   */
  playBubbleShotSound() {
    if (window.audioManager) window.audioManager.play("bubbleShot");
  }

  /**
   * Adds one coin (clamped to max 5).
   * @returns {void}
   */
  addCoin() {
    this.coins++;
    if (this.coins > 5) this.coins = 5;
  }

  /**
   * Checks if an enemy is within melee hit range (front-only).
   * @param {any} enemy
   * @returns {boolean}
   */
  hitmakerRange(enemy) {
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
    if (!this.hitRange) return false;
    return !!enemy;
  }

  /**
   * Computes center deltas between character and enemy.
   * @param {any} enemy
   * @returns {{dx:number, dy:number}}
   */
  getCenterDelta(enemy) {
    const center = this.getCenter(this);
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
    const facingRight = !this.otherDirection;
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
    return { maxX: this.width * 0.9, maxY: this.height * 0.7 };
  }

  /**
   * Applies damage and temporary slowdown when hit.
   * @returns {void}
   */
  hit() {
    super.hit();
    if (this.dead()) {
      this.speed = 0;
      this.startDeath();
      return;
    }
    this.applyHitSlowdown();
  }

  /**
   * Temporarily slows the character after being hit.
   * @returns {void}
   */
  applyHitSlowdown() {
    if (this.isSlowed) return;

    this.isSlowed = true;
    this.speed = this.normalSpeed * this.hurtSpeedFactor;

    setTimeout(() => {
      if (!this.dead() && this.world && !this.world.endScreen) {
        this.speed = this.normalSpeed;
      }
      this.isSlowed = false;
    }, 400);
  }

  /**
   * Starts the death animation (once).
   * @returns {void}
   */
  startDeath() {
    if (this._deathStarted) return;
    this._deathStarted = true;
    this.deathFrame = 0;
    this.deathAnimationDone = false;
    this._deathAcc = 0;
  }

  /**
   * Updates death animation even when the end screen is visible.
   * @param {number} dtSec
   * @returns {void}
   */
  updateDeath(dtSec) {
    if (!this.dead()) return;
    this.startDeath();
    if (this.deathAnimationDone) return this.holdLastDeathFrame();
    this.advanceDeathFrame(dtSec);
  }

  /**
   * Advances death frames based on a fixed step time.
   * @param {number} dtSec
   * @returns {void}
   */
  advanceDeathFrame(dtSec) {
    const frames = this.IMAGES_DEAD_ANI1;
    this._deathAcc += dtSec;
    if (this._deathAcc < this.deathStepSec) return;
    this._deathAcc = 0;

    const index = Math.min(this.deathFrame, frames.length - 1);
    this.img = this.imageCache[frames[index]];

    if (index >= frames.length - 1) this.deathAnimationDone = true;
    else this.deathFrame++;
  }

  /**
   * Keeps the last death frame on screen.
   * @returns {void}
   */
  holdLastDeathFrame() {
    const frames = this.IMAGES_DEAD_ANI1;
    const lastFrame = frames[frames.length - 1];
    this.img = this.imageCache[lastFrame];
  }
}
