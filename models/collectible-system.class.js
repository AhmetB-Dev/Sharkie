/**
 * Handles collecting ammo and coins and updates HUD bars.
 */
class CollectibleSystem {
  /**
   * @param {any} level
   * @param {Character} character
   * @param {Statusbars} coinBar
   * @param {Statusbars} ammoBar
   */
  constructor(level, character, coinBar, ammoBar) {
    /** @type {any} */
    this.level = level;
    /** @type {Character} */
    this.character = character;
    /** @type {Statusbars} */
    this.coinBar = coinBar;
    /** @type {Statusbars} */
    this.ammoBar = ammoBar;
  }

  /**
   * Runs collectible checks.
   * @returns {void}
   */
  update() {
    this.collectAmmo();
    this.collectCoins();
  }

  /**
   * Collects ammo pickups (removes from level, updates ammo bar).
   * @returns {void}
   */
  collectAmmo() {
    for (let i = this.level.ammo.length - 1; i >= 0; i--) {
      const pickup = this.level.ammo[i];
      if (!this.character.isColliding(pickup)) continue;

      this.level.ammo.splice(i, 1);
      this.character.getItems();
      this.ammoBar.setStack(this.character.items * 20);
      window.audioManager?.play("ammoPickup");
    }
  }

  /**
   * Collects coins (removes from level, updates coin bar).
   * @returns {void}
   */
  collectCoins() {
    for (let i = this.level.coin.length - 1; i >= 0; i--) {
      const coin = this.level.coin[i];
      if (!this.character.isColliding(coin)) continue;

      coin.clearTimers?.();
      this.level.coin.splice(i, 1);
      this.character.addCoin();
      this.coinBar.setStack(this.character.coins * 20);
      window.audioManager?.play("coin");
    }
  }
}
