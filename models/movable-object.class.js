/**
 * @typedef {Object} Offset
 * @property {number} top
 * @property {number} left
 * @property {number} right
 * @property {number} bottom
 */

/**
 * @typedef {Object} Hitbox
 * @property {number} left
 * @property {number} right
 * @property {number} top
 * @property {number} bottom
 */

/**
 * Base class for movable entities (gravity, collision, patrol, health).
 * @extends DrawableObject
 */
class MovableObject extends DrawableObject {
  /** @type {number} */
  speed = 0.15;

  /** @type {boolean} */
  otherDirection = false;

  /** @type {number} */
  speedY = 0;

  /** @type {number} */
  acceleration = 2.5;

  /** @type {number} */
  energy = 100;

  /** @type {number} */
  lastHit = 0;

  /** @type {number} */
  items = 0;

  /** @type {number} */
  groundY = 155;

  /** @type {boolean} */
  gravityAutoDisable = true;

  /** @type {boolean} */
  gravityActive = false;

  /** @type {number} */
  _gravAcc = 0;

  /** @type {boolean} */
  patrolActive = false;

  /** @type {number} */
  patrolRangeX = 0;

  /** @type {number} */
  patrolOriginX = 0;

  /** @type {number} */
  patrolDirectionX = 1;

  /** @type {TimerBag} */
  timers = new TimerBag();

  /** @type {Offset} */
  offset = { top: 0, left: 0, right: 0, bottom: 0 };

  /**
   * AABB collision check using per-object hitbox offsets.
   * @param {any} other - Another object with x/y/width/height and offset.
   * @returns {boolean} True if hitboxes overlap.
   */
  isColliding(other) {
    if (!other) return false;

    const a = this.getHitbox(this);
    const b = this.getHitbox(other);

    const overlapX = a.left < b.right && a.right > b.left;
    const overlapY = a.top < b.bottom && a.bottom > b.top;
    return overlapX && overlapY;
  }

  /**
   * Builds a hitbox rect from an object's position/size and its offset.
   * @param {any} obj
   * @returns {Hitbox}
   */
  getHitbox(obj) {
    const left = obj.x + obj.offset.left;
    const right = obj.x + obj.width - obj.offset.right;
    const top = obj.y + obj.offset.top;
    const bottom = obj.y + obj.height - obj.offset.bottom;
    return { left, right, top, bottom };
  }

  /**
   * Applies damage and stores the hit timestamp.
   * @returns {void}
   */
  hit() {
    this.energy -= 20;
    if (this.energy < 0) {
      this.energy = 0;
      return;
    }
    this.lastHit = Date.now();
  }

  /**
   * Checks if the object is currently in the "hurt" window after a hit.
   * @returns {boolean}
   */
  hitHurt() {
    const elapsedMs = Date.now() - this.lastHit;
    const elapsedSec = elapsedMs / 1000;
    return elapsedSec < 1;
  }

  /**
   * Alias for hurt state.
   * @returns {boolean}
   */
  isHurt() {
    return this.hitHurt();
  }

  /**
   * Increases item stack (clamped to max 5).
   * @returns {void}
   */
  getItems() {
    this.items += 1;
    if (this.items > 5) this.items = 5;
  }

  /**
   * Checks if energy has reached zero.
   * @returns {boolean}
   */
  dead() {
    return this.energy === 0;
  }

  /**
   * Enables gravity (legacy name).
   * @returns {void}
   */
  applyGravity() {
    this.enableGravity();
  }

  /**
   * Activates gravity simulation.
   * @returns {void}
   */
  enableGravity() {
    this.gravityActive = true;
  }

  /**
   * Deactivates gravity simulation and resets accumulator.
   * @returns {void}
   */
  disableGravity() {
    this.gravityActive = false;
    this._gravAcc = 0;
  }

  /**
   * Updates gravity in fixed steps using an accumulator.
   * @param {number} dtSec - Delta time in seconds.
   * @returns {void}
   */
  updateGravity(dtSec) {
    if (!Number.isFinite(dtSec) || dtSec <= 0) return;
    if (!this.gravityActive && this.speedY > 0) this.enableGravity();
    if (!this.gravityActive) return;

    const fixedStepSec = 1 / 20;
    this._gravAcc = (this._gravAcc || 0) + dtSec;

    while (this._gravAcc >= fixedStepSec) {
      this.gravityStep();
      this._gravAcc -= fixedStepSec;
    }
  }

  /**
   * Executes one gravity simulation step.
   * @returns {void}
   */
  gravityStep() {
    const fallingOrJumping = this.isAboveGround() || this.speedY > 0;
    if (fallingOrJumping) {
      this.y -= this.speedY;
      this.speedY -= this.acceleration;
      return;
    }

    this.speedY = 0;
    if (this.gravityAutoDisable) this.disableGravity();
  }

  /**
   * Checks if the object is above its ground baseline.
   * @returns {boolean}
   */
  isAboveGround() {
    if (this instanceof ThrowableObject) return true;
    return this.y < this.groundY;
  }

  /**
   * Plays a sprite animation by switching image frames.
   * @param {string[]} images - Frame image paths.
   * @returns {void}
   */
  playAnimation(images) {
    const frameIndex = this.currentImage % images.length;
    const framePath = images[frameIndex];
    this.img = this.imageCache[framePath];
    this.currentImage++;
  }

  /**
   * Sets the upward velocity for jumping.
   * @returns {void}
   */
  setJumpHeight() {
    this.speedY = 25;
  }

  /**
   * Starts horizontal patrol movement around current x.
   * @param {number} rangeX - Max distance from origin in pixels.
   * @returns {void}
   */
  startPatrol(rangeX) {
    this.patrolRangeX = rangeX;
    this.patrolOriginX = this.x;
    this.patrolDirectionX = 1;
    this.patrolActive = true;
  }

  /**
   * Stops patrol movement.
   * @returns {void}
   */
  stopPatrol() {
    this.patrolActive = false;
  }

  /**
   * Updates patrol movement (expects a boolean `isDead` flag on some subclasses).
   * @param {number} dtSec - Delta time in seconds.
   * @returns {void}
   */
  updatePatrol(dtSec) {
    if (!this.patrolActive || this.isDead) return;

    const pxPerSec = this.speed * 60;
    this.x += this.patrolDirectionX * pxPerSec * dtSec;
    this.otherDirection = this.patrolDirectionX > 0;

    if (this.x < this.patrolOriginX - this.patrolRangeX) this.patrolDirectionX = 1;
    if (this.x > this.patrolOriginX + this.patrolRangeX) this.patrolDirectionX = -1;
  }

  /**
   * Clears all timers managed by this object.
   * @returns {void}
   */
  clearTimers() {
    this.timers?.clearAll();
  }
}
