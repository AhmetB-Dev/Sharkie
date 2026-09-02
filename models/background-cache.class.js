/**
 * @typedef {Object} Bounds
 * @property {number} minX
 * @property {number} maxX
 */

/**
 * Background caching helper: pre-renders static background objects onto an offscreen canvas
 * and draws only the visible slice for performance.
 */
class BackgroundCache {
  constructor() {
    /** @type {boolean} */
    this.enabled = true;
    /** @type {boolean} */
    this.isBuilt = false;
    /** @type {number} */
    this.originX = 0;

    this.maxCacheWidth = 7500;
    /** @type {HTMLCanvasElement} */
    this.cacheCanvas = document.createElement("canvas");
    /** @type {CanvasRenderingContext2D} */
    this.cacheCtx = this.cacheCanvas.getContext("2d");

    /** @type {string} */
    this.lastSignature = "";
  }

  /**
   * Draws background using cache when possible, otherwise draws directly.
   * @param {CanvasRenderingContext2D} targetCtx
   * @param {Array<any>} objects
   * @param {number} cameraX
   * @param {number} viewWidth
   * @param {number} viewHeight
   * @returns {void}
   */
  draw(targetCtx, objects, cameraX, viewWidth, viewHeight) {
    if (!this.enabled) return this.drawDirect(targetCtx, objects);
    if (!this.ensureBuilt(objects, viewWidth, viewHeight)) return this.drawDirect(targetCtx, objects);
    this.drawCachedSlice(targetCtx, cameraX, viewWidth, viewHeight);
  }

  /**
   * Ensures the cache is built and up-to-date for the current objects/signature.
   * @param {Array<any>} objects
   * @param {number} viewWidth
   * @param {number} viewHeight
   * @returns {boolean}
   */
  ensureBuilt(objects, viewWidth, viewHeight) {
    if (!this.canBuild(objects)) return this.isBuilt;
    if (!this.assetsReady(objects)) return false;

    const signature = this.getSignature(objects, viewWidth, viewHeight);
    if (this.isBuilt && signature === this.lastSignature) return true;

    return this.buildCache(objects, viewWidth, viewHeight, signature);
  }

  /**
   * @param {Array<any>} objects
   * @returns {boolean}
   */
  canBuild(objects) {
    return Array.isArray(objects) && objects.length > 0;
  }

  /**
   * Creates a simple signature to detect when the cache must be rebuilt.
   * @param {Array<any>} objects
   * @param {number} viewWidth
   * @param {number} viewHeight
   * @returns {string}
   */
  getSignature(objects, viewWidth, viewHeight) {
    const last = objects[objects.length - 1];
    return `${objects.length}-${viewWidth}-${viewHeight}-${last?.x}-${last?.width}`;
  }

  /**
   * Builds the offscreen cache canvas for all background objects.
   * @param {Array<any>} objects
   * @param {number} viewWidth
   * @param {number} viewHeight
   * @param {string} signature
   * @returns {boolean}
   */
  buildCache(objects, viewWidth, viewHeight, signature) {
    const bounds = this.getBounds(objects, viewWidth);
    const cacheWidth = Math.max(viewWidth, Math.ceil(bounds.maxX - bounds.minX));
    if (cacheWidth > this.maxCacheWidth) return false;

    this.originX = bounds.minX;
    this.resizeCache(cacheWidth, viewHeight);
    this.paintObjectsToCache(objects);

    this.isBuilt = true;
    this.lastSignature = signature;
    return true;
  }

  /**
   * Resizes and clears the cache canvas.
   * @param {number} width
   * @param {number} height
   * @returns {void}
   */
  resizeCache(width, height) {
    this.cacheCanvas.width = width;
    this.cacheCanvas.height = height;
    this.cacheCtx.clearRect(0, 0, width, height);
  }

  /**
   * Paints all objects onto the cache canvas at a fixed origin.
   * @param {Array<any>} objects
   * @returns {void}
   */
  paintObjectsToCache(objects) {
    this.cacheCtx.save();
    this.cacheCtx.translate(-this.originX, 0);
    objects.forEach((obj) => obj.draw(this.cacheCtx));
    this.cacheCtx.restore();
  }

  /**
   * Checks if all images are loaded and ready to be drawn into the cache.
   * @param {Array<any>} objects
   * @returns {boolean}
   */
  assetsReady(objects) {
    return objects.every((obj) => obj?.img && obj.img.complete && obj.img.naturalWidth > 0);
  }

  /**
   * Computes min/max x bounds for all objects (plus viewport width).
   * @param {Array<any>} objects
   * @param {number} viewWidth
   * @returns {Bounds}
   */
  getBounds(objects, viewWidth) {
    let minX = 0;
    let maxX = viewWidth;

    objects.forEach((obj) => {
      minX = Math.min(minX, obj.x);
      maxX = Math.max(maxX, obj.x + obj.width);
    });

    return { minX, maxX };
  }

  /**
   * Draws the visible slice of the cached canvas into the target context.
   * @param {CanvasRenderingContext2D} targetCtx
   * @param {number} cameraX
   * @param {number} viewWidth
   * @param {number} viewHeight
   * @returns {void}
   */
  drawCachedSlice(targetCtx, cameraX, viewWidth, viewHeight) {
    const viewLeft = -cameraX;
    const sliceWidth = Math.min(viewWidth, this.cacheCanvas.width);

    const sourceX = this.getSourceX(viewLeft, sliceWidth);
    this.drawSliceImage(targetCtx, sourceX, viewLeft, sliceWidth, viewHeight);
  }

  /**
   * Converts world viewLeft to cache sourceX and clamps to valid range.
   * @param {number} viewLeft
   * @param {number} sliceWidth
   * @returns {number}
   */
  getSourceX(viewLeft, sliceWidth) {
    const raw = viewLeft - this.originX;
    const max = Math.max(0, this.cacheCanvas.width - sliceWidth);
    return this.clamp(raw, 0, max);
  }

  /**
   * Draws one slice from cache canvas to the screen.
   * @param {CanvasRenderingContext2D} targetCtx
   * @param {number} sourceX
   * @param {number} destX
   * @param {number} width
   * @param {number} height
   * @returns {void}
   */
  drawSliceImage(targetCtx, sourceX, destX, width, height) {
    targetCtx.drawImage(this.cacheCanvas, sourceX, 0, width, height, destX, 0, width, height);
  }

  /**
   * Fallback: draws all objects directly.
   * @param {CanvasRenderingContext2D} targetCtx
   * @param {Array<any>} objects
   * @returns {void}
   */
  drawDirect(targetCtx, objects) {
    if (!Array.isArray(objects)) return;
    objects.forEach((obj) => obj.draw(targetCtx));
  }

  /**
   * @param {number} value
   * @param {number} min
   * @param {number} max
   * @returns {number}
   */
  clamp(value, min, max) {
    return Math.max(min, Math.min(max, value));
  }
}
