class BackgroundObject extends MovableObject {
  constructor(imagePath, x, y, width, height) {
    super().loadImage(imagePath);
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
  }
}

class BackgroundCache {
  constructor() {
    this.enabled = true;
    this.built = false;
    this.originX = 0;

    this.canvas = document.createElement("canvas");
    this.ctx = this.canvas.getContext("2d");
  }

  draw(targetCtx, objects, cameraX, viewW, viewH) {
    if (!this.enabled) return this.drawDirect(targetCtx, objects);

    if (!this.built) this.tryBuild(objects, viewW, viewH);
    if (!this.built) return this.drawDirect(targetCtx, objects);

    this.drawSlice(targetCtx, cameraX, viewW, viewH);
  }

  tryBuild(objects, viewW, viewH) {
    if (!Array.isArray(objects) || objects.length === 0) return;
    if (!this.assetsReady(objects)) return;

    const bounds = this.getBounds(objects, viewW);
    this.originX = bounds.minX;

    const width = Math.max(viewW, Math.ceil(bounds.maxX - bounds.minX));
    this.canvas.width = width;
    this.canvas.height = viewH;

    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.ctx.save();
    this.ctx.translate(-this.originX, 0);
    objects.forEach((o) => o.draw(this.ctx));
    this.ctx.restore();

    this.built = true;
  }

  assetsReady(objects) {
    return objects.every((o) => o?.img && o.img.complete && o.img.naturalWidth > 0);
  }

  getBounds(objects, viewW) {
    let minX = 0;
    let maxX = viewW;

    objects.forEach((o) => {
      minX = Math.min(minX, o.x);
      maxX = Math.max(maxX, o.x + o.width);
    });

    return { minX, maxX };
  }

  drawSlice(ctx, cameraX, viewW, viewH) {
    const viewLeft = -cameraX;
    const sw = Math.min(viewW, this.canvas.width);

    const sxRaw = viewLeft - this.originX;
    const sxMax = Math.max(0, this.canvas.width - sw);
    const sx = this.clamp(sxRaw, 0, sxMax);

    ctx.drawImage(this.canvas, sx, 0, sw, viewH, viewLeft, 0, sw, viewH);
  }

  drawDirect(ctx, objects) {
    if (!Array.isArray(objects)) return;
    objects.forEach((o) => o.draw(ctx));
  }

  clamp(v, min, max) {
    return Math.max(min, Math.min(max, v));
  }
}
