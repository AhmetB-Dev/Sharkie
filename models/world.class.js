class World {
  canvas;
  ctx;
  input;

  endScreen = null;
  level = null;
  character = new Character();
  camera_x = 0;

  healthBar = new Statusbars();
  coinBar = new Statusbars();
  ammoBar = new Statusbars();
  throwableObjects = [];

  isPaused = false;
  debugHitboxes = false;

  constructor(canvas, input) {
    this.ctx = canvas.getContext("2d");
    this.canvas = canvas;
    this.input = input;

    this.loadStatusBar();
    this.setWorld();

    this.touchControls = new TouchControls(this);
    this.level = this.level || (typeof level1 !== "undefined" ? level1 : null);
    if (!this.level) throw new Error("level1 ist nicht geladen oder hat einen Fehler (level/level1.js)");

    this.bgCache = new BackgroundCache();
    this.enemyManager = new EnemyManager(
      this.level,
      this.character,
      this.throwableObjects,
      this.healthBar,
      false
    );

    this.initLoop();
  }

  initLoop() {
    this._lastTs = performance.now();
    this._accMs = 0;
    this._fixedStepMs = 100;
    requestAnimationFrame((t) => this.frame(t));
  }

  frame(timestamp) {
    const dtMs = timestamp - this._lastTs;
    this._lastTs = timestamp;

    this.updatePerFrame(dtMs / 1000);
    this.updateFixed(dtMs);
    this.render();

    requestAnimationFrame((t) => this.frame(t));
  }

  updateFixed(dtMs) {
    if (this.isPaused || this.endScreen) return;
    this._accMs += dtMs;

    while (this._accMs >= this._fixedStepMs) {
      this.enemyManager?.tick?.();
      this.checkCollisions();
      this._accMs -= this._fixedStepMs;
    }
  }

  updatePerFrame(dtSec) {
    if (this.isPaused || this.endScreen) return;
    this.character?.updateGravity?.(dtSec);
    this.updateProjectiles(dtSec);
    this.updateEnemies(dtSec);
  }

  updateEnemies(dtSec) {
    for (const enemy of this.level.enemies) {
      if (!enemy) continue;
      if (enemy.update) enemy.update(dtSec);
      else enemy.updatePatrol?.(dtSec);
    }
  }

  updateProjectiles(dtSec) {
    for (let i = this.throwableObjects.length - 1; i >= 0; i--) {
      const p = this.throwableObjects[i];
      p?.update?.(dtSec);
      if (this.isOutOfView(p)) this.throwableObjects.splice(i, 1);
    }
  }

  isOutOfView(p) {
    if (!p) return true;
    const left = -this.camera_x;
    const right = left + this.canvas.width;
    const pad = 300;
    return p.x + p.width < left - pad || p.x > right + pad;
  }

  loadStatusBar() {
    this.loadAmmoBar();
    this.loadHealthBar();
    this.loadCoinBar();
  }

  loadAmmoBar() {
    this.ammoBar = new Statusbars();
    this.ammoBar.initAmmoBar(0, 0);
  }

  loadHealthBar() {
    this.healthBar = new Statusbars();
    this.healthBar.initHealthBar(0, 50);
  }

  loadCoinBar() {
    this.coinBar = new Statusbars();
    this.coinBar.initCoinBar(0, 105);
  }

  setWorld() {
    this.character.world = this;
  }

  checkCollisions() {
    if (this.isPaused || this.endScreen) return;
    this.updateAmmoBar();
    this.updateCoinBar();
  }

  updateAmmoBar() {
    for (let i = this.level.ammo.length - 1; i >= 0; i--) {
      const ammoPickup = this.level.ammo[i];
      if (!this.character.isColliding(ammoPickup)) continue;

      this.level.ammo.splice(i, 1);
      this.character.getItems();
      if (window.audioManager) window.audioManager.play("ammoPickup");
      this.ammoBar.setStack(this.character.items * 20);
    }
  }

  updateCoinBar() {
    for (let i = this.level.coin.length - 1; i >= 0; i--) {
      const coin = this.level.coin[i];
      if (!this.character.isColliding(coin)) continue;

      this.level.coin.splice(i, 1);
      this.addCoinToCharacter();
      if (window.audioManager) window.audioManager.play("coin");
      this.coinBar.setStack(this.getCoinPercent());
    }
  }

  addCoinToCharacter() {
    if (this.character.addCoin) return this.character.addCoin();
    if (this.character.getCoins) return this.character.getCoins();
    this.character.coins = Math.min((this.character.coins || 0) + 1, 5);
  }

  getCoinPercent() {
    const c = Number.isFinite(this.character.coins) ? this.character.coins : 0;
    return c * 20;
  }

  render() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.renderWorldScene();
    if (this.touchControls) this.touchControls.draw(this.ctx);
    if (this.endScreen) this.endScreen.draw(this.ctx);
  }

  renderWorldScene() {
    this.ctx.translate(this.camera_x, 0);
    this.drawBackground();
    this.renderStatusBars();
    this.drawWorldActors();
    this.addLevelObjectsToMap();
    this.ctx.translate(-this.camera_x, 0);
  }

  drawBackground() {
    const bg = this.level?.backgroundObjects;
    if (!Array.isArray(bg) || bg.length === 0) return;

    if (this.bgCache?.draw) {
      this.bgCache.draw(this.ctx, bg, this.camera_x, this.canvas.width, this.canvas.height);
      return;
    }

    this.addObjectsToMap(bg);
  }

  drawWorldActors() {
    this.addToMap(this.character);
    this.addObjectsToMap(this.level.enemies);
  }

  addLevelObjectsToMap() {
    this.addObjectsToMap(this.level.coin);
    this.addObjectsToMap(this.level.ammo);
    this.addObjectsToMap(this.level.ambient);
    this.addObjectsToMap(this.throwableObjects);
  }

  renderStatusBars() {
    this.ctx.translate(-this.camera_x, 0);
    this.addToMap(this.ammoBar);
    this.addToMap(this.healthBar);
    this.addToMap(this.coinBar);
    this.ctx.translate(this.camera_x, 0);
  }

  addObjectsToMap(list) {
    if (!Array.isArray(list)) return;
    list.forEach((o) => this.addToMap(o));
  }

  addToMap(movableObject) {
    if (movableObject.otherDirection) this.flipImage(movableObject);
    movableObject.draw(this.ctx);
    if (this.debugHitboxes && movableObject.showHitbox) movableObject.showHitbox(this.ctx);
    if (movableObject.otherDirection) this.flipImageBack(movableObject);
  }

  flipImage(movableObject) {
    this.ctx.save();
    this.ctx.translate(movableObject.width, 0);
    this.ctx.scale(-1, 1);
    movableObject.x = movableObject.x * -1;
  }

  flipImageBack(movableObject) {
    movableObject.x = movableObject.x * -1;
    this.ctx.restore();
  }

  showEndScreen(hasWon) {
    if (this.endScreen) return;

    this.stopBackgroundMusic();
    this.playEndSfx(hasWon);

    this.endScreen = new EndScreen(hasWon, this.canvas.width, this.canvas.height);
  }

  stopBackgroundMusic() {
    window.audioManager?.stopMusic?.();
  }

  playEndSfx(hasWon) {
    const key = hasWon ? "winSfx" : "deathSfx";
    window.audioManager?.play?.(key);
  }

}
