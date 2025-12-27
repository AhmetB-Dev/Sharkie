/**
 * Pickup / collectible subsystem for the World.
 * - ammo pickups
 * - coin pickups
 * - updates HUD bars accordingly
 */
class WorldPickups {
  /**
   * @param {World} world
   */
  constructor(world) {
    /** @type {World} */
    this.world = world;
  }

  /**
   * Runs collision-related updates for collectibles.
   * @returns {void}
   */
  checkCollisions() {
    const w = this.world;
    if (w.isStopped()) return;
    this.updateAmmoBar();
    this.updateCoinBar();
  }

  /**
   * Checks ammo pickups and updates the HUD.
   * @returns {void}
   */
  updateAmmoBar() {
    const w = this.world;
    for (let index = w.level.ammo.length - 1; index >= 0; index--) {
      this.tryPickupAmmo(index);
    }
  }

  /**
   * Attempts to pick up ammo at a given index.
   * @param {number} index
   * @returns {void}
   */
  tryPickupAmmo(index) {
    const w = this.world;
    const ammoPickup = w.level.ammo[index];
    if (!w.character.isColliding(ammoPickup)) return;

    w.level.ammo.splice(index, 1);
    w.character.getItems();
    window.audioManager?.play?.("ammoPickup");
    w.ammoBar.setStack(w.character.items * 20);
  }

  /**
   * Checks coin pickups and updates the HUD.
   * @returns {void}
   */
  updateCoinBar() {
    const w = this.world;
    for (let index = w.level.coin.length - 1; index >= 0; index--) {
      this.tryPickupCoin(index);
    }
  }

  /**
   * Attempts to pick up a coin at a given index.
   * @param {number} index
   * @returns {void}
   */
  tryPickupCoin(index) {
    const w = this.world;
    const coin = w.level.coin[index];
    if (!w.character.isColliding(coin)) return;

    w.level.coin.splice(index, 1);
    this.addCoinToCharacter();
    window.audioManager?.play?.("coin");
    w.coinBar.setStack(this.getCoinPercent());
  }

  /**
   * Adds one coin to the character (supports multiple legacy APIs).
   * @returns {void}
   */
  addCoinToCharacter() {
    const c = this.world.character;
    if (c.addCoin) return c.addCoin();
    if (c.getCoins) return c.getCoins();
    c.coins = Math.min((c.coins || 0) + 1, 5);
  }

  /**
   * Converts current coin count into a percent value (0..100).
   * @returns {number}
   */
  getCoinPercent() {
    const c = this.world.character;
    const coins = Number.isFinite(c.coins) ? c.coins : 0;
    return coins * 20;
  }
}
