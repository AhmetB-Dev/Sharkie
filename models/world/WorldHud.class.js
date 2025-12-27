/**
 * HUD / Statusbar subsystem for the World.
 * - Creates status bars
 * - Anchors boss bar to the top-right corner
 * - Can be called each frame to keep HUD responsive
 */
class WorldHud {
  /**
   * @param {World} world
   */
  constructor(world) {
    /** @type {World} */
    this.world = world;
  }

  /**
   * Loads all HUD status bars.
   * @returns {void}
   */
  initStatusBars() {
    this.loadAmmoBar();
    this.loadHealthBar();
    this.loadCoinBar();
    this.loadBossBar();
  }

  /**
   * Creates and initializes the ammo bar.
   * @returns {void}
   */
  loadAmmoBar() {
    const world = this.world;
    world.ammoBar = new Statusbars();
    world.ammoBar.initAmmoBar(0, 0);
  }

  /**
   * Creates and initializes the health bar.
   * @returns {void}
   */
  loadHealthBar() {
    const world = this.world;
    world.healthBar = new Statusbars();
    world.healthBar.initHealthBar(0, 50);
  }

  /**
   * Creates and initializes the coin bar.
   * @returns {void}
   */
  loadCoinBar() {
    const world = this.world;
    world.coinBar = new Statusbars();
    world.coinBar.initCoinBar(0, 105);
  }

  /**
   * Loads the boss health bar (hidden by default).
   * @returns {void}
   */
  loadBossBar() {
    const world = this.world;
    world.bossBar = new Statusbars();
    world.bossBar.initBossBar();
    this.updateBossBarPosition();
    world.bossBar.hide();
  }

  /**
   * Updates HUD element anchor positions (for responsive canvas sizes).
   * @returns {void}
   */
  updateHudPositions() {
    this.updateBossBarPosition();
  }

  /**
   * Anchors the boss bar to the top-right corner of the canvas.
   * @param {number} [margin=20]
   * @returns {void}
   */
  updateBossBarPosition(margin = 20) {
    const world = this.world;
    if (!world.canvas || !world.bossBar?.setHudPosition) return;
    const x = Math.max(margin, world.canvas.width - world.bossBar.width - margin);
    world.bossBar.setHudPosition(x, 10);
  }
}
