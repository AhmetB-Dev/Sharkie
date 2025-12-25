/**
 * Static background sprite object.
 * @extends MovableObject
 */
class BackgroundObject extends MovableObject {
  /**
   * @param {string} imagePath
   * @param {number} x
   * @param {number} y
   * @param {number} width
   * @param {number} height
   */
  constructor(imagePath, x, y, width, height) {
    super();
    this.loadImage(imagePath);
    this.setTransform(x, y, width, height);
  }

  /**
   * Sets object transform (position + size).
   * @param {number} x
   * @param {number} y
   * @param {number} width
   * @param {number} height
   * @returns {void}
   */
  setTransform(x, y, width, height) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
  }
}
