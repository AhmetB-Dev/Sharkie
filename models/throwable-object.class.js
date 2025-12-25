/**
 * Throwable object with its own physics (manual gravity) and animation accumulator.
 * @extends MovableObject
 */
class ThrowableObject extends MovableObject {
  /** @type {string[]} */
  IMAGE_SHOOT = CharacterAssets.IMAGE_SHOOT;
  /** @type {string[]} */
  IMAGES_SHOOTBALL = CharacterAssets.IMAGES_SHOOTBALL;

  /**
   * @param {number} x
   * @param {number} y
   */
  constructor(x, y) {
    super();
    this.initFrames();
    this.initBody(x, y);
    this.initAnim();
    this.isThrown = false;
  }

  /**
   * Loads and caches projectile animation frames.
   * @returns {void}
   */
  initFrames() {
    this.animationImage(this.IMAGE_SHOOT);
    this.loadImage(this.IMAGE_SHOOT[0]);
  }

  /**
   * Initializes projectile position and size.
   * @param {number} x
   * @param {number} y
   * @returns {void}
   */
  initBody(x, y) {
    this.x = x;
    this.y = y;
    this.height = 40;
    this.width = 40;
  }

  /**
   * Initializes animation timing settings.
   * @returns {void}
   */
  initAnim() {
    this.animFps = 10;
    this._animAcc = 0;
  }

  /**
   * Starts the throw with initial velocities and direction.
   * @param {number} [directionX=1]
   * @returns {void}
   */
  throw(directionX = 1) {
    this.isThrown = true;
    this.speedX = 10 / 0.025;
    this.speedY = 30 / 0.05;
    this.gravity = this.acceleration / 0.05;
    this.directionX = directionX;
  }

  /**
   * Update tick (only active when thrown).
   * @param {number} dtSec
   * @returns {void}
   */
  update(dtSec) {
    if (!this.isThrown) return;
    this.move(dtSec);
    this.applyGravityStep(dtSec);
    this.animate(dtSec);
  }

  /**
   * Horizontal movement step.
   * @param {number} dtSec
   * @returns {void}
   */
  move(dtSec) {
    this.x += this.directionX * this.speedX * dtSec;
  }

  /**
   * Vertical movement step (manual gravity).
   * @param {number} dtSec
   * @returns {void}
   */
  applyGravityStep(dtSec) {
    this.y -= this.speedY * dtSec;
    this.speedY -= this.gravity * dtSec;
  }

  /**
   * Advances sprite animation using accumulator + fps.
   * @param {number} dtSec
   * @returns {void}
   */
  animate(dtSec) {
    this._animAcc += dtSec;
    if (this._animAcc < 1 / this.animFps) return;
    this._animAcc = 0;
    this.playAnimation(this.IMAGE_SHOOT);
  }
}
