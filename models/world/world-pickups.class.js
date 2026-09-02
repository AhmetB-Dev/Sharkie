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
    if (this.world.isStopped()) return;
    this.updateAmmoBar();
    this.updateCoinBar();
  }

  /**
   * Checks ammo pickups and updates the HUD.
   * @returns {void}
   */
  updateAmmoBar() {
    for (let index = this.world.level.ammo.length - 1; index >= 0; index--) {
      this.tryPickupAmmo(index);
    }
  }

  /**
   * Attempts to pick up ammo at a given index.
   * @param {number} index
   * @returns {void}
   */
  tryPickupAmmo(index) {
    const ammoPickup = this.world.level.ammo[index];
    if (!this.world.character.isColliding(ammoPickup)) return;
    ammoPickup?.timers?.clearAll?.();
    this.world.level.ammo.splice(index, 1);
    this.world.character.getItems();
    window.audioManager?.play?.("ammoPickup");
    this.world.ammoBar.setStack(this.world.character.items * 20);
  }

  /**
   * Checks coin pickups and updates the HUD.
   * @returns {void}
   */
  updateCoinBar() {
    const world = this.world;
    for (let index = world.level.coin.length - 1; index >= 0; index--) {
      this.tryPickupCoin(index);
    }
  }

  /**
   * Attempts to pick up a coin at a given index.
   * @param {number} index
   * @returns {void}
   */
  tryPickupCoin(index) {
    const coin = this.world.level.coin[index];
    if (!this.world.character.isColliding(coin)) return;
    coin?.timers?.clearAll?.();
    this.world.level.coin.splice(index, 1);
    this.addCoinToCharacter();
    window.audioManager?.play?.("coin");
    this.world.coinBar.setStack(this.getCoinPercent());
  }

  /**
   * Adds one coin to the character (supports multiple legacy APIs).
   * @returns {void}
   */
  addCoinToCharacter() {
    const character = this.world.character;
    if (character.addCoin) return character.addCoin();
    if (character.getCoins) return character.getCoins();
    character.coins = Math.min((character.coins || 0) + 1, 5);
  }

  /**
   * Converts current coin count into a percent value (0..100).
   * @returns {number}
   */
  getCoinPercent() {
    const character = this.world.character;
    const coins = Number.isFinite(character.coins) ? character.coins : 0;
    return coins * 20;
  }
}
