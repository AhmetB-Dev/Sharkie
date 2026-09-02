/**
 * Ambient background object that moves slowly to create atmosphere/parallax.
 * @extends MovableObject
 */
class AmbientObject extends MovableObject {
  /**
   * @param {string} imagePath - Sprite/image path.
   * @param {number} y - Y position on canvas.
   * @param {number} x - X position on canvas.
   * @param {number} width - Render width.
   * @param {number} height - Render height.
   */
  constructor(imagePath, y, x, width, height) {
    super().loadImage(imagePath);
    this.y = y;
    this.x = x;
    this.width = width;
    this.height = height;
    this.speed = 0.08;
    this.animationAmbient();
  }

  /**
   * Starts the ambient movement loop (60 FPS timer).
   * @returns {void}
   */
  animationAmbient() {
    this.timers.every(() => (this.x -= this.speed), 1000 / 60);
  }
}
