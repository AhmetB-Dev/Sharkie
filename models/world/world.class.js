/**
 * @typedef {Object} Level
 * @property {Array<any>} enemies
 * @property {Array<any>} ammo
 * @property {Array<any>} coin
 */

/**
 * Main game world orchestrator (loop, systems, collisions, rendering).
 *
 * Split into subsystems:
 * - WorldHud (status bars)
 * - WorldPickups (collectibles)
 * - WorldEntitiesUpdater (enemies/projectiles)
 * - WorldEndFlow (end screen + end audio)
 */
class World {
  /** @type {HTMLCanvasElement} */ canvas;
  /** @type {CanvasRenderingContext2D} */ ctx;
  /** @type {any} */ input;

  /** @type {EndScreen|null} */ endScreen = null;
  /** @type {Level|null} */ level = null;

  /** @type {Character} */ character = new Character();
  /** @type {number} */ camera_x = 100;

  /** @type {Statusbars} */ healthBar = new Statusbars();
  /** @type {Statusbars} */ coinBar = new Statusbars();
  /** @type {Statusbars} */ ammoBar = new Statusbars();
  /** @type {Statusbars} */ bossBar = new Statusbars();

  /** @type {Array<any>} */ throwableObjects = [];

  /** @type {boolean} */ isPaused = false;
  /** @type {boolean} */ debugHitboxes = false;

  /** @type {WorldHud} */ hud;
  /** @type {WorldPickups} */ pickups;
  /** @type {WorldEntitiesUpdater} */ entities;
  /** @type {WorldEndFlow} */ endFlow;

  /**
   * @param {HTMLCanvasElement} canvas - Target canvas element.
   * @param {any} input - Input state handler (keyboard/touch).
   */
  constructor(canvas, input) {
    this.initCanvas(canvas, input);

    this.hud = new WorldHud(this);
    this.pickups = new WorldPickups(this);
    this.entities = new WorldEntitiesUpdater(this);
    this.endFlow = new WorldEndFlow(this);

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

  initStatusBars() {
    this.hud.initStatusBars();
  }

  loadAmmoBar() {
    this.hud.loadAmmoBar();
  }

  loadHealthBar() {
    this.hud.loadHealthBar();
  }

  loadCoinBar() {
    this.hud.loadCoinBar();
  }

  loadBossBar() {
    this.hud.loadBossBar();
  }

  updateHudPositions() {
    this.hud.updateHudPositions();
  }

  updateBossBarPosition(margin = 20) {
    this.hud.updateBossBarPosition(margin);
  }

  checkCollisions() {
    this.pickups.checkCollisions();
  }

  updateAmmoBar() {
    this.pickups.updateAmmoBar();
  }

  tryPickupAmmo(index) {
    this.pickups.tryPickupAmmo(index);
  }

  updateCoinBar() {
    this.pickups.updateCoinBar();
  }

  tryPickupCoin(index) {
    this.pickups.tryPickupCoin(index);
  }

  addCoinToCharacter() {
    this.pickups.addCoinToCharacter();
  }

  getCoinPercent() {
    return this.pickups.getCoinPercent();
  }

  updateEnemies(deltaSec) {
    this.entities.updateEnemies(deltaSec);
  }

  updateSingleEnemy(enemy, deltaSec) {
    this.entities.updateSingleEnemy(enemy, deltaSec);
  }

  updateProjectiles(deltaSec) {
    this.entities.updateProjectiles(deltaSec);
  }

  isOutOfView(projectile) {
    return this.entities.isOutOfView(projectile);
  }

  updateBossDeath(deltaSec) {
    this.entities.updateBossDeath(deltaSec);
  }

  showEndScreen(hasWon) {
    this.endFlow.showEndScreen(hasWon);
  }

  stopBackgroundMusic() {
    this.endFlow.stopBackgroundMusic();
  }

  playEndSfx(hasWon) {
    this.endFlow.playEndSfx(hasWon);
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
    if (typeof createLevel1 === "function") {
      this.level = createLevel1();
      return;
    }

    this.level = this.level || (typeof level1 !== "undefined" ? level1 : null);
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
      this.bossBar,
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
    this._isDestroyed = false;
    this._rafId = requestAnimationFrame((timestamp) => this.frame(timestamp));
  }

  /**
   * Main RAF frame callback (per-frame + fixed-step update).
   * @param {number} timestamp - High-res time from requestAnimationFrame.
   * @returns {void}
   */
  frame(timestamp) {
    if (this._isDestroyed) return;
    const deltaMs = timestamp - this._lastTs;
    this._lastTs = timestamp;

    this.updatePerFrame(deltaMs / 1000);
    this.updateFixed(deltaMs);
    this.render();

    this._rafId = requestAnimationFrame((t) => this.frame(t));
  }

  /**
   * Returns true if world updates should stop.
   * @returns {boolean}
   */
  isStopped() {
    return this.isPaused || !!this.endScreen;
  }

  /**
   * Destroys the world instance: stops RAF loop and clears running timers.
   * Allows returning to the main menu without reloading the whole page.
   * @returns {void}
   */
  destroy() {
    this._isDestroyed = true;
    if (this._rafId) cancelAnimationFrame(this._rafId);
    this.isPaused = true;

    this.cleanupTimers();
    this.endScreen = null;
  }

  /**
   * Clears intervals/timeouts from entities (TimerBag) and controller loops.
   * @returns {void}
   */
  cleanupTimers() {
    this.character?.controller?.stop?.();
    this.character?.controller?.stopMovementLoops?.();

    const clearTimers = (obj) => obj?.timers?.clearAll?.();
    clearTimers(this.character);
    this.throwableObjects?.forEach(clearTimers);
    this.level?.enemies?.forEach(clearTimers);
    this.level?.coin?.forEach(clearTimers);
    this.level?.ammo?.forEach(clearTimers);
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
   * Renders the world via the renderer.
   * @returns {void}
   */
  render() {
    this.updateHudPositions();
    this.renderer.render();
  }

  /**
   * Injects the world reference into the character.
   * @returns {void}
   */
  setWorld() {
    this.character.world = this;
  }
}
