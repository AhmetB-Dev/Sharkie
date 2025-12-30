/**
 * Enemy type 2 (jellyfish): patrol + interval-driven walk/attack/death animations.
 * @extends MovableObject
 */
class Enemy_jellyfish extends MovableObject {
  /** @type {number} Vertical position in world coordinates. */
  y = 300;
  /** @type {number} Sprite height in pixels. */
  height = 60;
  /** @type {number} Sprite width in pixels. */
  width = 90;
  /** @type {boolean} True once enemy has been killed (dead animation active). */
  isDead = false;
  /** @type {boolean} True while enemy plays attack animation (AI-driven). */
  isAttacking = false;
  /** @type {boolean} Short-lived flag used when player gets hit by this enemy. */
  isHittingPlayer = false;

  /**
   * Creates a new type-2 enemy instance.
   * Initializes assets, random spawn, speed, patrol and animation intervals.
   * @constructor
   */
  constructor() {
    super();
    this.linkAssets();
    this.loadImage(this.ENEMIES_WALK[0]);
    this.loadAssets();
    this.animationTyp2();
    this.spawnTyp2Random();
    this.enemySpeedTyp2();
    this.startPatrol(250);
  }

  /** @returns {void} */
  linkAssets() {
    this.ENEMIES_WALK = EnemyAssets.TYPE2_WALK;
    this.ENEMIES_ATTACK = EnemyAssets.TYPE2_ATTACK;
    this.ENEMIES_DEAD = EnemyAssets.TYPE2_DEAD;
  }

  /** @returns {void} */
  loadAssets() {
    this.animationImage(this.ENEMIES_WALK);
    this.animationImage(this.ENEMIES_ATTACK);
    this.animationImage(this.ENEMIES_DEAD);
  }

  /**
   * Starts animation intervals.
   * @returns {void}
   */
  animationTyp2() {
    this.animationWalktyp2();
    this.animationDeadtyp2();
  }

  /**
   * Spawns enemy at random x/y within predefined ranges.
   * @returns {void}
   */
  spawnTyp2Random() {
    const minX = 1950;
    const maxX = 2800;
    this.x = minX + Math.random() * (maxX - minX);

    const minY = 150;
    const maxY = 300;
    this.y = minY + Math.random() * (maxY - minY);
  }

  /**
   * Randomizes movement speed.
   * @returns {void}
   */
  enemySpeedTyp2() {
    this.speed = 0.8 + Math.random() * 1.5;
  }

  /**
   * Switches enemy into dead state and changes sprite size.
   * @override
   * @returns {void}
   */
  die() {
    if (this.isDead) return;
    this.isDead = true;
    this.speed = 0;
    this.currentImage = 0;
    this.width = 50;
    this.height = 80;
  }

  /**
   * Temporary "hit" flag (short window).
   * Used for damage window / VFX sync.
   * @returns {void}
   */
  startHitAnimation() {
    this.isHittingPlayer = true;
    setTimeout(() => {
      this.isHittingPlayer = false;
    }, 150);
  }

  /**
   * Sets attack state based on distance to character.
   * @param {{x:number, y:number}} character Character-like object (needs x/y).
   * @returns {void}
   */
  updateAI(character) {
    const dx = character.x - this.x;
    const dy = character.y - this.y;
    const distance = Math.sqrt(dx * dx + dy * dy);
    this.isAttacking = distance < 250;
  }

  /**
   * Interval loop for walk/attack animation while alive.
   * @returns {void}
   */
  animationWalktyp2() {
    this.timers.every(() => {
      if (this.isDead) return;

      if (this.isAttacking) {
        this.playAnimation(this.ENEMIES_ATTACK);
      } else {
        this.playAnimation(this.ENEMIES_WALK);
      }
    }, 175);
  }

  /**
   * Interval loop for death animation while dead.
   * @returns {void}
   */
  animationDeadtyp2() {
    this.timers.every(() => {
      if (this.isDead) {
        this.playAnimation(this.ENEMIES_DEAD);
      }
    }, 175);
  }
}
