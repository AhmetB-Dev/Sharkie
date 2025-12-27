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
    const w = this.world;
    w.ammoBar = new Statusbars();
    w.ammoBar.initAmmoBar(0, 0);
  }

  /**
   * Creates and initializes the health bar.
   * @returns {void}
   */
  loadHealthBar() {
    const w = this.world;
    w.healthBar = new Statusbars();
    w.healthBar.initHealthBar(0, 50);
  }

  /**
   * Creates and initializes the coin bar.
   * @returns {void}
   */
  loadCoinBar() {
    const w = this.world;
    w.coinBar = new Statusbars();
    w.coinBar.initCoinBar(0, 105);
  }

  /**
   * Loads the boss health bar (hidden by default).
   * @returns {void}
   */
  loadBossBar() {
    const w = this.world;
    w.bossBar = new Statusbars();
    w.bossBar.initBossBar();
    this.updateBossBarPosition();
    w.bossBar.hide();
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
    const w = this.world;
    if (!w.canvas || !w.bossBar?.setHudPosition) return;
    const x = Math.max(margin, w.canvas.width - w.bossBar.width - margin);
    w.bossBar.setHudPosition(x, 10);
  }
}
