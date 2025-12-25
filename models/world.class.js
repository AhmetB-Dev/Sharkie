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
    this.initCanvas(canvas, input);
    this.initStatusBars();
    this.setWorld();
    this.initTouchControls();
    this.initLevel();
    this.initSystems();
    this.initRenderer();
    this.initLoop();
  }

  initCanvas(canvas, input) {
    this.canvas = canvas;
    this.ctx = canvas.getContext("2d");
    this.input = input;
  }

  initStatusBars() {
    this.loadAmmoBar();
    this.loadHealthBar();
    this.loadCoinBar();
  }

  initTouchControls() {
    this.touchControls = new TouchControls(this);
  }

  initLevel() {
    this.level = this.level || (typeof level1 !== "undefined" ? level1 : null);
    if (!this.level) throw new Error("level1 ist nicht geladen oder hat einen Fehler (level/level1.js)");
  }

  initSystems() {
    this.bgCache = new BackgroundCache();
    this.enemyManager = new EnemyManager(
      this.level,
      this.character,
      this.throwableObjects,
      this.healthBar,
      false
    );
  }

  initRenderer() {
    this.renderer = new WorldRenderer(this);
  }

  initLoop() {
    this._lastTs = performance.now();
    this._accMs = 0;
    this._fixedStepMs = 100;
    requestAnimationFrame((timestamp) => this.frame(timestamp));
  }

  frame(timestamp) {
    const deltaMs = timestamp - this._lastTs;
    this._lastTs = timestamp;

    this.updatePerFrame(deltaMs / 1000);
    this.updateFixed(deltaMs);
    this.render();

    requestAnimationFrame((t) => this.frame(t));
  }

  isStopped() {
    return this.isPaused || !!this.endScreen;
  }

  updateFixed(deltaMs) {
    if (this.isStopped()) return;
    this._accMs += deltaMs;

    while (this._accMs >= this._fixedStepMs) {
      this.enemyManager?.tick?.();
      this.checkCollisions();
      this._accMs -= this._fixedStepMs;
    }
  }

  updatePerFrame(deltaSec) {
    if (this.isStopped()) return;
    this.character?.updateGravity?.(deltaSec);
    this.updateProjectiles(deltaSec);
    this.updateEnemies(deltaSec);
  }

  updateEnemies(deltaSec) {
    for (const enemy of this.level.enemies) {
      this.updateSingleEnemy(enemy, deltaSec);
    }
  }

  updateSingleEnemy(enemy, deltaSec) {
    if (!enemy) return;
    if (enemy.update) return enemy.update(deltaSec);
    enemy.updatePatrol?.(deltaSec);
  }

  updateProjectiles(deltaSec) {
    for (let index = this.throwableObjects.length - 1; index >= 0; index--) {
      const projectile = this.throwableObjects[index];
      projectile?.update?.(deltaSec);
      if (this.isOutOfView(projectile)) this.throwableObjects.splice(index, 1);
    }
  }

  isOutOfView(projectile) {
    if (!projectile) return true;
    const viewLeft = -this.camera_x;
    const viewRight = viewLeft + this.canvas.width;
    const padding = 300;
    return projectile.x + projectile.width < viewLeft - padding || projectile.x > viewRight + padding;
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
    if (this.isStopped()) return;
    this.updateAmmoBar();
    this.updateCoinBar();
  }

  updateAmmoBar() {
    for (let index = this.level.ammo.length - 1; index >= 0; index--) {
      this.tryPickupAmmo(index);
    }
  }

  tryPickupAmmo(index) {
    const ammoPickup = this.level.ammo[index];
    if (!this.character.isColliding(ammoPickup)) return;

    this.level.ammo.splice(index, 1);
    this.character.getItems();
    window.audioManager?.play?.("ammoPickup");
    this.ammoBar.setStack(this.character.items * 20);
  }

  updateCoinBar() {
    for (let index = this.level.coin.length - 1; index >= 0; index--) {
      this.tryPickupCoin(index);
    }
  }

  tryPickupCoin(index) {
    const coin = this.level.coin[index];
    if (!this.character.isColliding(coin)) return;

    this.level.coin.splice(index, 1);
    this.addCoinToCharacter();
    window.audioManager?.play?.("coin");
    this.coinBar.setStack(this.getCoinPercent());
  }

  addCoinToCharacter() {
    if (this.character.addCoin) return this.character.addCoin();
    if (this.character.getCoins) return this.character.getCoins();
    this.character.coins = Math.min((this.character.coins || 0) + 1, 5);
  }

  getCoinPercent() {
    const coins = Number.isFinite(this.character.coins) ? this.character.coins : 0;
    return coins * 20;
  }

  render() {
    this.renderer.render();
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
    const soundKey = hasWon ? "winSfx" : "deathSfx";
    window.audioManager?.play?.(soundKey);
  }
}
