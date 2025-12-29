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
  /** @type {number} */ speed = 28;
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

  /** @type {Offset} */
  offset = { top: 130, left: 25, right: 25, bottom: 60 };

  constructor() {
    super();
    this.normalSpeed = this.speed;
    /** @type {CharacterSprites} */
    this.sprites = new CharacterSprites(this);
    this.sprites.init();
    /** @type {CharacterIdle} */
    this.idle = new CharacterIdle(this);
    /** @type {CharacterCombat} */
    this.combat = new CharacterCombat(this);
    /** @type {CharacterMeleeRange} */
    this.melee = new CharacterMeleeRange(this);
    /** @type {CharacterDamage} */
    this.damage = new CharacterDamage(this);
    /** @type {CharacterController} */
    this.controller = new CharacterController(this);
    this.disableGravity();
    this.groundY = 155;
    this.y = this.groundY;
    this.animation();
  }

  /**
   * Compatibility wrapper (older code might call this).
   * @returns {void}
   */
  linkAssets() {
    this.sprites.linkAssets();
  }

  /**
   * Compatibility wrapper (older code might call this).
   * @returns {void}
   */
  loadAssets() {
    this.sprites.preloadAllFrames();
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
    this.controller.startMovementLoops();
  }

  /**
   * Interval-based left movement and camera follow.
   * @returns {void}
   */
  walkLeft() {
    this.controller.walkLeft();
  }

  /**
   * Interval-based right movement and camera follow.
   * @returns {void}
   */
  walkRight() {
    this.controller.walkRight();
  }

  /**
   * Interval-based jumping (sets vertical speed).
   * @returns {void}
   */
  startJumpAnimation() {
    this.controller.startMovementLoops();
  }

  /**
   * Checks if any relevant player input is active.
   * @returns {boolean}
   */
  isPlayerActive() {
    return this.idle.isPlayerActive();
  }

  /**
   * Plays only the tail part of the long idle animation.
   * @returns {void}
   */
  playLongIdleTail() {
    this.idle.playLongIdleTail();
  }

  /**
   * Plays the long idle animation once (frame-by-frame).
   * @returns {void}
   */
  playLongIdleOnce() {
    this.idle.playLongIdleOnce();
  }

  /**
   * Shoots the normal (attack 1) bubble projectile.
   * @returns {void}
   */
  shootAttack1Bubble() {
    this.combat.shootAttack1Bubble();
  }

  /**
   * Shoots the ultimate bubble (consumes ammo/items).
   * @returns {void}
   */
  shootUltimateBubble() {
    this.combat.shootUltimateBubble();
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
    return this.melee.hitmakerRange(enemy);
  }

  /**
   * Calls the MovableObject implementation of hit().
   * Use this to allow helper classes to trigger base logic safely.
   * @returns {void}
   */
  baseHit() {
    super.hit();
  }

  /**
   * Applies damage and temporary slowdown when hit.
   * @returns {void}
   */
  hit() {
    this.damage.hit();
  }
}
