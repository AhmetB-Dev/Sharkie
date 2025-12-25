/**
 * Bubble projectile shot by the character (normal / ultimate).
 * @extends MovableObject
 */
class BubbleProjectile extends MovableObject {
  /**
   * @param {number} x
   * @param {number} y
   * @param {string[]} images - Animation frame paths.
   * @param {boolean} [shootToLeft=false]
   * @param {boolean} [isUltimate=false]
   */
  constructor(x, y, images, shootToLeft = false, isUltimate = false) {
    super();
    this.isUltimate = isUltimate;
    this.animationFrames = images;
    this.animationImage(this.animationFrames);
    this.loadImage(this.animationFrames[0]);
    this.x = x;
    this.y = y;
    this.width = 40;
    this.height = 40;
    this.otherDirection = shootToLeft;
    this.speedX = 12;
    this.startAnimation();
    this.startMovement();
  }

  /**
   * Starts sprite animation loop.
   * @returns {void}
   */
  startAnimation() {
    setInterval(() => {
      this.playAnimation(this.animationFrames);
    }, 1000 / 15);
  }

  /**
   * Starts movement loop (left/right depending on otherDirection).
   * @returns {void}
   */
  startMovement() {
    setInterval(() => {
      if (this.otherDirection) {
        this.x -= this.speedX;
      } else {
        this.x += this.speedX;
      }
    }, 1000 / 60);
  }
}
