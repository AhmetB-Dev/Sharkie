/**
 * @typedef {Object} Offset
 * @property {number} top
 * @property {number} left
 * @property {number} right
 * @property {number} bottom
 */

/**
 * Collectible ammo pickup object.
 * @extends MovableObject
 */
class AmmoPickup extends MovableObject {
  /** @type {Offset} */
  offset = {
    top: 20,
    left: 20,
    right: 20,
    bottom: 5,
  };

  /** @type {number} */
  height = 100;

  /** @type {number} */
  width = 40;

  /**
   * @param {string} imagePath - Sprite/image path.
   * @param {number} x - X position on canvas.
   * @param {number} y - Y position on canvas.
   */
  constructor(imagePath, x, y) {
    super().loadImage(imagePath);
    this.x = x;
    this.y = y;
  }
}
