/**
 * HUD status bar (health / coins / ammo) using sprite steps.
 * @extends DrawableObject
 */
class Statusbars extends DrawableObject {
  /** @type {string[]} */
  IMAGES;
  /** @type {number} */
  percentage = 100;
  /** @type {number} */
  stackObjects = 0;

  /** @type {string[]} */
  STATUS_HEALTH = [
    "assets/assets_sharkie/4. Marcadores/green/Life/0_  copia 3.png",
    "assets/assets_sharkie/4. Marcadores/green/Life/20_ copia 4.png",
    "assets/assets_sharkie/4. Marcadores/green/Life/40_  copia 3.png",
    "assets/assets_sharkie/4. Marcadores/green/Life/60_  copia 3.png",
    "assets/assets_sharkie/4. Marcadores/green/Life/80_  copia 3.png",
    "assets/assets_sharkie/4. Marcadores/green/Life/100_  copia 2.png",
  ];

  /** @type {string[]} */
  STATUS_COIN = [
    "assets/assets_sharkie/4. Marcadores/orange/0_  copia 2.png",
    "assets/assets_sharkie/4. Marcadores/orange/20_  copia.png",
    "assets/assets_sharkie/4. Marcadores/orange/40_  copia 2.png",
    "assets/assets_sharkie/4. Marcadores/orange/60_  copia 2.png",
    "assets/assets_sharkie/4. Marcadores/orange/80_  copia 2.png",
    "assets/assets_sharkie/4. Marcadores/orange/100_ copia 2.png",
  ];

  /** @type {string[]} */
  STATUS_AMMO = [
    "assets/assets_sharkie/4. Marcadores/Purple/0_.png",
    "assets/assets_sharkie/4. Marcadores/Purple/20_.png",
    "assets/assets_sharkie/4. Marcadores/Purple/40_.png",
    "assets/assets_sharkie/4. Marcadores/Purple/60_.png",
    "assets/assets_sharkie/4. Marcadores/Purple/80_.png",
    "assets/assets_sharkie/4. Marcadores/Purple/100_.png",
  ];

  constructor() {
    super();
    this.height = 80;
    this.width = 220;
    this.x = 0;
    this.y = 0;
  }

  /**
   * Sets a percentage value (0..100) and updates the displayed image.
   * @param {number} percentage
   * @returns {void}
   */
  setPercentrage(percentage) {
    this.percentage = percentage;

    const index = this.resolveImageIndex();
    const path = this.IMAGES[index];

    this.img = this.imageCache[path];
  }

  /**
   * Sets a stack value (0..100) and updates the displayed image.
   * @param {number} stackObjects
   * @returns {void}
   */
  setStack(stackObjects) {
    this.stackObjects = stackObjects;
    const index = this.stackImageIndex();
    const path = this.IMAGES[index];
    this.img = this.imageCache[path];
  }

  /**
   * Initializes ammo bar (stack-based).
   * @param {number} x
   * @param {number} y
   * @param {number} [stackObjects=0]
   * @returns {void}
   */
  initAmmoBar(x, y, stackObjects = 0) {
    this.IMAGES = this.STATUS_AMMO;
    this.animationImage(this.IMAGES);
    this.x = x;
    this.y = y;
    this.setStack(stackObjects);
  }

  /**
   * Initializes health bar (percentage-based).
   * @param {number} x
   * @param {number} y
   * @param {number} [percentage=100]
   * @returns {void}
   */
  initHealthBar(x, y, percentage = 100) {
    this.IMAGES = this.STATUS_HEALTH;
    this.animationImage(this.IMAGES);
    this.setPercentrage(percentage);
    this.x = x;
    this.y = y;
  }

  /**
   * Initializes coin bar (stack-based).
   * @param {number} x
   * @param {number} y
   * @param {number} [stackObjects=0]
   * @returns {void}
   */
  initCoinBar(x, y, stackObjects = 0) {
    this.IMAGES = this.STATUS_COIN;
    this.animationImage(this.IMAGES);
    this.x = x;
    this.y = y;
    this.setStack(stackObjects);
  }

  /**
   * Resolves image step index for percentage bars.
   * @returns {number}
   */
  resolveImageIndex() {
    if (this.percentage == 100) {
      return 5;
    } else if (this.percentage > 80) {
      return 4;
    } else if (this.percentage > 60) {
      return 3;
    } else if (this.percentage > 40) {
      return 2;
    } else if (this.percentage > 20) {
      return 1;
    } else {
      return 0;
    }
  }

  /**
   * Resolves image step index for stack bars.
   * @returns {number}
   */
  stackImageIndex() {
    if (this.stackObjects == 0) return 0;
    else if (this.stackObjects < 20) return 1;
    else if (this.stackObjects < 40) return 2;
    else if (this.stackObjects < 60) return 3;
    else if (this.stackObjects < 80) return 4;
    else return 5;
  }
}
