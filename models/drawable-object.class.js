/**
 * @typedef {Object} Offset
 * @property {number} top
 * @property {number} left
 * @property {number} right
 * @property {number} bottom
 */

/**
 * @typedef {Object} Rect
 * @property {number} x
 * @property {number} y
 * @property {number} w
 * @property {number} h
 */

/**
 * Base drawable object for canvas rendering (sprite + cache).
 * Note: `offset` and `debugHitbox` are expected to exist (often defined in subclasses).
 */
class DrawableObject {
  /** @type {number} */
  x = 0;

  /** @type {number} */
  y = 300;

  /** @type {number} */
  height = 130;

  /** @type {number} */
  width = 100;

  /** @type {HTMLImageElement|undefined} */
  img;

  /** @type {Record<string, HTMLImageElement>} */
  imageCache = {};

  /** @type {number} */
  currentImage = 0;

  /**
   * Loads a single image into `this.img`.
   * @param {string} path - Image source path/URL.
   * @returns {void}
   */
  loadImage(path) {
    this.img = new Image();
    this.img.src = path;
  }

  /**
   * Draws the current image to the canvas.
   * @param {CanvasRenderingContext2D} ctx
   * @returns {void}
   */
  draw(ctx) {
    if (!this.img) return;
    ctx.drawImage(this.img, this.x, this.y, this.width, this.height);
  }

  /**
   * Preloads images and stores them in `imageCache`.
   * @param {string[]} array - List of image paths.
   * @returns {void}
   */
  animationImage(array) {
    array.forEach((path) => {
      let img = new Image();
      img.src = path;
      this.imageCache[path] = img;
    });
  }

  /**
   * Draws the current hitbox rect if debugging is enabled.
   * @param {CanvasRenderingContext2D} ctx
   * @returns {void}
   */
  showHitbox(ctx) {
    if (!this.debugHitbox) return;
    const strokeRect = this.getHitboxRect();
    this.drawRect(ctx, strokeRect);
  }

  /**
   * Calculates the hitbox rectangle using `offset`.
   * @returns {Rect}
   */
  getHitboxRect() {
    const x = this.x + this.offset.left;
    const y = this.y + this.offset.top;
    const w = this.width - this.offset.left - this.offset.right;
    const h = this.height - this.offset.top - this.offset.bottom;
    return { x, y, w, h };
  }

  /**
   * Draws a stroked rectangle (hitbox debug).
   * @param {CanvasRenderingContext2D} ctx
   * @param {Rect} strokeRect
   * @returns {void}
   */
  drawRect(ctx, strokeRect) {
    ctx.beginPath();
    ctx.lineWidth = 3;
    ctx.strokeStyle = "red";
    ctx.strokeRect(strokeRect.x, strokeRect.y, strokeRect.w, strokeRect.h);
    ctx.stroke();
  }
}
