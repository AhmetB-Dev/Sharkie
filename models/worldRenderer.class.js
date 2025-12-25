class WorldRenderer {
  constructor(world) {
    this.world = world;
  }

  render() {
    this.clearCanvas();
    this.renderWorldScene();
    this.renderOverlays();
  }

  clearCanvas() {
    const { ctx, canvas } = this.world;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
  }

  renderWorldScene() {
    const { ctx, camera_x } = this.world;
    ctx.save();
    ctx.translate(camera_x, 0);

    this.drawBackground();
    this.renderStatusBars();
    this.drawWorldActors();
    this.drawLevelObjects();

    ctx.restore();
  }

  renderOverlays() {
    const { ctx, touchControls, endScreen } = this.world;
    touchControls?.draw?.(ctx);
    endScreen?.draw?.(ctx);
  }

  drawBackground() {
    const { level, bgCache, ctx, camera_x, canvas } = this.world;
    const backgroundObjects = level?.backgroundObjects;
    if (!Array.isArray(backgroundObjects) || backgroundObjects.length === 0) return;

    if (bgCache?.draw) {
      bgCache.draw(ctx, backgroundObjects, camera_x, canvas.width, canvas.height);
      return;
    }

    this.addObjectsToMap(backgroundObjects);
  }

  renderStatusBars() {
    const { ctx, camera_x, ammoBar, healthBar, coinBar } = this.world;

    ctx.save();
    ctx.translate(-camera_x, 0);

    this.addToMap(ammoBar);
    this.addToMap(healthBar);
    this.addToMap(coinBar);

    ctx.restore();
  }

  drawWorldActors() {
    const { character, level } = this.world;
    this.addToMap(character);
    this.addObjectsToMap(level.enemies);
  }

  drawLevelObjects() {
    const { level, throwableObjects } = this.world;
    this.addObjectsToMap(level.coin);
    this.addObjectsToMap(level.ammo);
    this.addObjectsToMap(level.ambient);
    this.addObjectsToMap(throwableObjects);
  }

  addObjectsToMap(list) {
    if (!Array.isArray(list)) return;
    list.forEach((obj) => this.addToMap(obj));
  }

  addToMap(movableObject) {
    if (!movableObject) return;

    if (movableObject.otherDirection) this.flipImage(movableObject);
    movableObject.draw(this.world.ctx);
    this.drawHitboxIfEnabled(movableObject);
    if (movableObject.otherDirection) this.flipImageBack(movableObject);
  }

  drawHitboxIfEnabled(movableObject) {
    if (!this.world.debugHitboxes) return;
    movableObject.showHitbox?.(this.world.ctx);
  }

  flipImage(movableObject) {
    const { ctx } = this.world;
    ctx.save();
    ctx.translate(movableObject.width, 0);
    ctx.scale(-1, 1);
    movableObject.x = movableObject.x * -1;
  }

  flipImageBack(movableObject) {
    movableObject.x = movableObject.x * -1;
    this.world.ctx.restore();
  }
}
