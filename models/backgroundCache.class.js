class BackgroundCache {
  constructor() {
    this.enabled = true;
    this.isBuilt = false;
    this.originX = 0;

    this.maxCacheWidth = 12000; // Schutz gegen riesige Level
    this.cacheCanvas = document.createElement("canvas");
    this.cacheCtx = this.cacheCanvas.getContext("2d");

    this.lastSignature = "";
  }

  draw(targetCtx, objects, cameraX, viewWidth, viewHeight) {
    if (!this.enabled) return this.drawDirect(targetCtx, objects);
    if (!this.ensureBuilt(objects, viewWidth, viewHeight)) return this.drawDirect(targetCtx, objects);
    this.drawCachedSlice(targetCtx, cameraX, viewWidth, viewHeight);
  }

  ensureBuilt(objects, viewWidth, viewHeight) {
    if (!this.canBuild(objects)) return this.isBuilt;
    if (!this.assetsReady(objects)) return false;

    const signature = this.getSignature(objects, viewWidth, viewHeight);
    if (this.isBuilt && signature === this.lastSignature) return true;

    return this.buildCache(objects, viewWidth, viewHeight, signature);
  }

  canBuild(objects) {
    return Array.isArray(objects) && objects.length > 0;
  }

  getSignature(objects, viewWidth, viewHeight) {
    const last = objects[objects.length - 1];
    return `${objects.length}-${viewWidth}-${viewHeight}-${last?.x}-${last?.width}`;
  }

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

  resizeCache(width, height) {
    this.cacheCanvas.width = width;
    this.cacheCanvas.height = height;
    this.cacheCtx.clearRect(0, 0, width, height);
  }

  paintObjectsToCache(objects) {
    this.cacheCtx.save();
    this.cacheCtx.translate(-this.originX, 0);
    objects.forEach((obj) => obj.draw(this.cacheCtx));
    this.cacheCtx.restore();
  }

  assetsReady(objects) {
    return objects.every((obj) => obj?.img && obj.img.complete && obj.img.naturalWidth > 0);
  }

  getBounds(objects, viewWidth) {
    let minX = 0;
    let maxX = viewWidth;

    objects.forEach((obj) => {
      minX = Math.min(minX, obj.x);
      maxX = Math.max(maxX, obj.x + obj.width);
    });

    return { minX, maxX };
  }

  drawCachedSlice(targetCtx, cameraX, viewWidth, viewHeight) {
    const viewLeft = -cameraX;
    const sliceWidth = Math.min(viewWidth, this.cacheCanvas.width);

    const sourceX = this.getSourceX(viewLeft, sliceWidth);
    this.drawSliceImage(targetCtx, sourceX, viewLeft, sliceWidth, viewHeight);
  }

  getSourceX(viewLeft, sliceWidth) {
    const raw = viewLeft - this.originX;
    const max = Math.max(0, this.cacheCanvas.width - sliceWidth);
    return this.clamp(raw, 0, max);
  }

  drawSliceImage(targetCtx, sourceX, destX, width, height) {
    targetCtx.drawImage(this.cacheCanvas, sourceX, 0, width, height, destX, 0, width, height);
  }

  drawDirect(targetCtx, objects) {
    if (!Array.isArray(objects)) return;
    objects.forEach((obj) => obj.draw(targetCtx));
  }

  clamp(value, min, max) {
    return Math.max(min, Math.min(max, value));
  }
}
