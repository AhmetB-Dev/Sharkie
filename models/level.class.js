/**
 * Level container holding all spawn lists and background layers.
 */
class Level {
  /** @type {Array<any>} */
  enemies;
  /** @type {Array<any>} */
  coin;
  /** @type {Array<any>} */
  ammo;
  /** @type {Array<any>} */
  backgroundObjects;
  /** @type {Array<any>} */
  ambient;

  /** @type {number} */
  level_end = 4700;

  /**
   * @param {Array<any>} enemies
   * @param {Array<any>} coin
   * @param {Array<any>} ammo
   * @param {Array<any>} backgroundObjects
   * @param {Array<any>} ambient
   */
  constructor(enemies, coin, ammo, backgroundObjects, ambient) {
    this.enemies = enemies;
    this.coin = coin;
    this.ammo = ammo;
    this.backgroundObjects = backgroundObjects;
    this.ambient = ambient;
  }
}
