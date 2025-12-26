/**
 * @typedef {Object} Level
 * @property {Array<any>} enemies
 * @property {Array<any>} ammo
 * @property {Array<any>} coin
 */

/**
 * Main game world orchestrator (loop, systems, collisions, rendering).
 */
class World {
  /** @type {HTMLCanvasElement} */
  canvas;

  /** @type {CanvasRenderingContext2D} */
  ctx;

  /** @type {any} */
  input;

  /** @type {EndScreen|null} */
  endScreen = null;

  /** @type {Level|null} */
  level = null;

  /** @type {Character} */
  character = new Character();

  /** @type {number} */
  camera_x = 0;

  /** @type {Statusbars} */
  healthBar = new Statusbars();

  /** @type {Statusbars} */
  coinBar = new Statusbars();

  /** @type {Statusbars} */
  ammoBar = new Statusbars();

  /** @type {Array<any>} */
  throwableObjects = [];

  /** @type {boolean} */
  isPaused = false;

  /** @type {boolean} */
  debugHitboxes = false;

  /**
   * @param {HTMLCanvasElement} canvas - Target canvas element.
   * @param {any} input - Input state handler (keyboard/touch).
   */
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

  /**
   * Initializes canvas context and stores references.
   * @param {HTMLCanvasElement} canvas
   * @param {any} input
   * @returns {void}
   */
  initCanvas(canvas, input) {
    this.canvas = canvas;
    this.ctx = canvas.getContext("2d");
    this.input = input;
  }

  /**
   * Loads all HUD status bars.
   * @returns {void}
   */
  initStatusBars() {
    this.loadAmmoBar();
    this.loadHealthBar();
    this.loadCoinBar();
  }

  /**
   * Initializes mobile touch controls.
   * @returns {void}
   */
  initTouchControls() {
    /** @type {TouchControls} */
    this.touchControls = new TouchControls(this);
  }

  /**
   * Loads the level definition (expects global level1).
   * @throws {Error} If level1 is missing/invalid.
   * @returns {void}
   */
  initLevel() {
    this.level = this.level || (typeof level1 !== "undefined" ? level1 : null);
    if (!this.level) throw new Error("level1 ist nicht geladen oder hat einen Fehler (level/level1.js)");
  }

  /**
   * Initializes core gameplay systems/managers.
   * @returns {void}
   */
  initSystems() {
    /** @type {BackgroundCache} */
    this.bgCache = new BackgroundCache();
    /** @type {EnemyManager} */
    this.enemyManager = new EnemyManager(
      this.level,
      this.character,
      this.throwableObjects,
      this.healthBar,
      false
    );
  }

  /**
   * Initializes the renderer.
   * @returns {void}
   */
  initRenderer() {
    /** @type {WorldRenderer} */
    this.renderer = new WorldRenderer(this);
  }

  /**
   * Initializes the main loop timing and starts RAF.
   * @returns {void}
   */
  initLoop() {
    /** @type {number} */
    this._lastTs = performance.now();
    /** @type {number} */
    this._accMs = 0;
    /** @type {number} */
    this._fixedStepMs = 100;
    requestAnimationFrame((timestamp) => this.frame(timestamp));
  }

  /**
   * Main RAF frame callback (per-frame + fixed-step update).
   * @param {number} timestamp - High-res time from requestAnimationFrame.
   * @returns {void}
   */
  frame(timestamp) {
    const deltaMs = timestamp - this._lastTs;
    this._lastTs = timestamp;

    this.updatePerFrame(deltaMs / 1000);
    this.updateFixed(deltaMs);
    this.render();

    requestAnimationFrame((t) => this.frame(t));
  }

  /**
   * Returns true if world updates should stop.
   * @returns {boolean}
   */
  isStopped() {
    return this.isPaused || !!this.endScreen;
  }

  /**
   * Fixed-step update (AI/collisions).
   * @param {number} deltaMs
   * @returns {void}
   */
  updateFixed(deltaMs) {
    if (this.isStopped()) return;
    this._accMs += deltaMs;

    while (this._accMs >= this._fixedStepMs) {
      this.enemyManager?.tick?.();
      this.checkCollisions();
      this._accMs -= this._fixedStepMs;
    }
  }

  /**
   * Per-frame update (movement/projectiles).
   * @param {number} deltaSec
   * @returns {void}
   */
  updatePerFrame(deltaSec) {
    if (this.isPaused) return;
    if (this.endScreen) return this.updateDeathOnly(deltaSec);

    if (this.character?.dead?.()) this.character.updateDeath?.(deltaSec);
    else this.character?.updateGravity?.(deltaSec);

    this.updateProjectiles(deltaSec);
    this.updateEnemies(deltaSec);
  }

  /**
   * Keeps death animations running behind the end screen overlay.
   * @param {number} deltaSec
   * @returns {void}
   */
  updateDeathOnly(deltaSec) {
    if (this.character?.dead?.()) this.character.updateDeath?.(deltaSec);
    this.updateBossDeath(deltaSec);
  }

  /**
   * Updates the boss death animation while the end screen is visible.
   * @param {number} deltaSec
   * @returns {void}
   */
  updateBossDeath(deltaSec) {
    if (!this.level?.enemies) return;
    for (const enemy of this.level.enemies) {
      if (!(enemy instanceof Boss)) continue;
      if (!(enemy.isDead || enemy.dead?.())) continue;
      enemy.update?.(deltaSec);
    }
  }

  /**
   * Updates all enemies for the current frame.
   * @param {number} deltaSec
   * @returns {void}
   */
  updateEnemies(deltaSec) {
    for (const enemy of this.level.enemies) {
      this.updateSingleEnemy(enemy, deltaSec);
    }
  }

  /**
   * Updates a single enemy using its available update method.
   * @param {any} enemy
   * @param {number} deltaSec
   * @returns {void}
   */
  updateSingleEnemy(enemy, deltaSec) {
    if (!enemy) return;
    if (enemy.update) return enemy.update(deltaSec);
    enemy.updatePatrol?.(deltaSec);
  }

  /**
   * Updates all projectiles and removes those outside the viewport.
   * @param {number} deltaSec
   * @returns {void}
   */
  updateProjectiles(deltaSec) {
    for (let index = this.throwableObjects.length - 1; index >= 0; index--) {
      const projectile = this.throwableObjects[index];
      projectile?.update?.(deltaSec);
      if (this.isOutOfView(projectile)) this.throwableObjects.splice(index, 1);
    }
  }

  /**
   * Checks if a projectile is outside the camera view (+padding).
   * @param {any} projectile
   * @returns {boolean}
   */
  isOutOfView(projectile) {
    if (!projectile) return true;
    const viewLeft = -this.camera_x;
    const viewRight = viewLeft + this.canvas.width;
    const padding = 300;
    return projectile.x + projectile.width < viewLeft - padding || projectile.x > viewRight + padding;
  }

  /**
   * Creates and initializes the ammo bar.
   * @returns {void}
   */
  loadAmmoBar() {
    this.ammoBar = new Statusbars();
    this.ammoBar.initAmmoBar(0, 0);
  }

  /**
   * Creates and initializes the health bar.
   * @returns {void}
   */
  loadHealthBar() {
    this.healthBar = new Statusbars();
    this.healthBar.initHealthBar(0, 50);
  }

  /**
   * Creates and initializes the coin bar.
   * @returns {void}
   */
  loadCoinBar() {
    this.coinBar = new Statusbars();
    this.coinBar.initCoinBar(0, 105);
  }

  /**
   * Injects the world reference into the character.
   * @returns {void}
   */
  setWorld() {
    this.character.world = this;
  }

  /**
   * Runs collision-related updates for collectibles.
   * @returns {void}
   */
  checkCollisions() {
    if (this.isStopped()) return;
    this.updateAmmoBar();
    this.updateCoinBar();
  }

  /**
   * Checks ammo pickups and updates the HUD.
   * @returns {void}
   */
  updateAmmoBar() {
    for (let index = this.level.ammo.length - 1; index >= 0; index--) {
      this.tryPickupAmmo(index);
    }
  }

  /**
   * Attempts to pick up ammo at a given index.
   * @param {number} index
   * @returns {void}
   */
  tryPickupAmmo(index) {
    const ammoPickup = this.level.ammo[index];
    if (!this.character.isColliding(ammoPickup)) return;

    this.level.ammo.splice(index, 1);
    this.character.getItems();
    window.audioManager?.play?.("ammoPickup");
    this.ammoBar.setStack(this.character.items * 20);
  }

  /**
   * Checks coin pickups and updates the HUD.
   * @returns {void}
   */
  updateCoinBar() {
    for (let index = this.level.coin.length - 1; index >= 0; index--) {
      this.tryPickupCoin(index);
    }
  }

  /**
   * Attempts to pick up a coin at a given index.
   * @param {number} index
   * @returns {void}
   */
  tryPickupCoin(index) {
    const coin = this.level.coin[index];
    if (!this.character.isColliding(coin)) return;

    this.level.coin.splice(index, 1);
    this.addCoinToCharacter();
    window.audioManager?.play?.("coin");
    this.coinBar.setStack(this.getCoinPercent());
  }

  /**
   * Adds one coin to the character (supports multiple legacy APIs).
   * @returns {void}
   */
  addCoinToCharacter() {
    if (this.character.addCoin) return this.character.addCoin();
    if (this.character.getCoins) return this.character.getCoins();
    this.character.coins = Math.min((this.character.coins || 0) + 1, 5);
  }

  /**
   * Converts current coin count into a percent value (0..100).
   * @returns {number}
   */
  getCoinPercent() {
    const coins = Number.isFinite(this.character.coins) ? this.character.coins : 0;
    return coins * 20;
  }

  /**
   * Renders the world via the renderer.
   * @returns {void}
   */
  render() {
    this.renderer.render();
  }

  /**
   * Shows the end screen once and plays end sounds.
   * @param {boolean} hasWon
   * @returns {void}
   */
  showEndScreen(hasWon) {
    if (this.endScreen) return;

    this.stopBackgroundMusic();
    this.playEndSfx(hasWon);

    this.endScreen = new EndScreen(hasWon, this.canvas.width, this.canvas.height);
  }

  /**
   * Stops background music (requires window.audioManager).
   * @returns {void}
   */
  stopBackgroundMusic() {
    window.audioManager?.stopMusic?.();
  }

  /**
   * Plays win/lose SFX (requires window.audioManager).
   * @param {boolean} hasWon
   * @returns {void}
   */
  playEndSfx(hasWon) {
    const soundKey = hasWon ? "winSfx" : "deathSfx";
    window.audioManager?.play?.(soundKey);
  }
}
