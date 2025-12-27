/**
 * Canvas renderer for the World:
 * - clears canvas
 * - draws background + actors + HUD
 * - draws overlays (touch controls, end screen)
 */
class WorldRenderer {
  /**
   * @param {World} world
   */
  constructor(world) {
    /** @type {World} */
    this.world = world;
  }

  /**
   * Render entry point.
   * @returns {void}
   */
  render() {
    this.clearCanvas();
    this.renderWorldScene();
    this.renderOverlays();
  }

  /**
   * Clears the full canvas.
   * @returns {void}
   */
  clearCanvas() {
    const { ctx, canvas } = this.world;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
  }

  /**
   * Renders the world scene with camera translation.
   * @returns {void}
   */
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

  /**
   * Renders overlays not affected by camera (touch + end screen).
   * @returns {void}
   */
  renderOverlays() {
    const { ctx, touchControls, endScreen } = this.world;
    touchControls?.draw?.(ctx);
    endScreen?.draw?.(ctx);
  }

  /**
   * Draws background objects (cached when BackgroundCache is available).
   * @returns {void}
   */
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

  /**
   * Draws HUD bars without camera translation.
   * @returns {void}
   */
  renderStatusBars() {
    const { ctx, camera_x, ammoBar, healthBar, coinBar } = this.world;

    ctx.save();
    ctx.translate(-camera_x, 0);

    this.addToMap(ammoBar);
    this.addToMap(healthBar);
    this.addToMap(coinBar);
    this.addToMap(this.world.bossBar);
    ctx.restore();
  }

  /**
   * Draws main actors (character + enemies).
   * @returns {void}
   */
  drawWorldActors() {
    const { character, level } = this.world;
    this.addToMap(character);
    this.addObjectsToMap(level.enemies);
  }

  /**
   * Draws level objects (collectibles, ambient, projectiles).
   * @returns {void}
   */
  drawLevelObjects() {
    const { level, throwableObjects } = this.world;
    this.addObjectsToMap(level.coin);
    this.addObjectsToMap(level.ammo);
    this.addObjectsToMap(level.ambient);
    this.addObjectsToMap(throwableObjects);
  }

  /**
   * Draws a list of drawable objects.
   * @param {Array<any>} list
   * @returns {void}
   */
  addObjectsToMap(list) {
    if (!Array.isArray(list)) return;
    list.forEach((obj) => this.addToMap(obj));
  }

  /**
   * Draws one object (handles flip, optional hitbox debug).
   * @param {any} movableObject
   * @returns {void}
   */
  addToMap(movableObject) {
    if (!movableObject) return;

    if (movableObject.otherDirection) this.flipImage(movableObject);
    movableObject.draw(this.world.ctx);
    this.drawHitboxIfEnabled(movableObject);
    if (movableObject.otherDirection) this.flipImageBack(movableObject);
  }

  /**
   * Draws hitboxes if world debug flag is enabled.
   * @param {any} movableObject
   * @returns {void}
   */
  drawHitboxIfEnabled(movableObject) {
    if (!this.world.debugHitboxes) return;
    movableObject.showHitbox?.(this.world.ctx);
  }

  /**
   * Flips the canvas for mirroring sprites.
   * @param {any} movableObject
   * @returns {void}
   */
  flipImage(movableObject) {
    const { ctx } = this.world;
    ctx.save();
    ctx.translate(movableObject.width, 0);
    ctx.scale(-1, 1);
    movableObject.x = movableObject.x * -1;
  }

  /**
   * Restores canvas after flipping.
   * @param {any} movableObject
   * @returns {void}
   */
  flipImageBack(movableObject) {
    movableObject.x = movableObject.x * -1;
    this.world.ctx.restore();
  }
}
