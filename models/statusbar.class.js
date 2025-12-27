/**
 * HUD status bar (health / coins / ammo / boss) using sprite steps.
 * @extends DrawableObject
 */
class Statusbars extends DrawableObject {
  /** @type {string[]} */ IMAGES;
  /** @type {number} */ percentage = 100;
  /** @type {number} */ stackObjects = 0;
  /** @type {boolean} */ isHidden = false;

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

  /** @type {string[]} */
  STATUS_BOSS = [
    "assets/assets_sharkie/4. Marcadores/boss_bar/0.png",
    "assets/assets_sharkie/4. Marcadores/boss_bar/20.png",
    "assets/assets_sharkie/4. Marcadores/boss_bar/40.png",
    "assets/assets_sharkie/4. Marcadores/boss_bar/60.png",
    "assets/assets_sharkie/4. Marcadores/boss_bar/80.png",
    "assets/assets_sharkie/4. Marcadores/boss_bar/100.png",
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
    this.y = 65;
  }

  /**
   * Initializes coin bar (stack-based).
   * @param {number} x
   * @param {number} [stackObjects=0]
   * @returns {void}
   */
  initCoinBar(x, stackObjects = 0) {
    this.IMAGES = this.STATUS_COIN;
    this.animationImage(this.IMAGES);
    this.x = x;
    this.y = 25;
    this.setStack(stackObjects);
  }

  /**
   * Initializes ammo bar (stack-based).
   * @param {number} x
   * @param {number} y
   * @param {number} [stackObjects=0]
   * @returns {void}
   */
  initAmmoBar(x, stackObjects = 0) {
    this.IMAGES = this.STATUS_AMMO;
    this.animationImage(this.IMAGES);
    this.x = x;
    this.y = -20;
    this.setStack(stackObjects);
  }

  /**
   * Initializes boss health bar (percentage-based).
   * @param {number} [percentage=100]
   * @returns {void}
   */
  initBossBar(percentage = 100) {
    this.width = 260;
    this.height = 280;
    this.IMAGES = this.STATUS_BOSS;
    this.animationImage(this.IMAGES);
    this.setPercentrage(percentage);
    this.setHudPosition();
    this.show();
  }

  /**
   * Stores HUD position (used by show/hide).
   * @param {number} x
   * @param {number} y
   * @returns {void}
   */
  setHudPosition() {
    if (!this.isHidden) {
      this.x = 490;
      this.y = -115;
    }
  }

  /**
   * Hides the bar by moving it off-canvas (renderer-safe).
   * @returns {void}
   */
  hide() {
    this.isHidden = true;
    this.x = -10000;
    this.y = -10000;
  }

  /**
   * Shows the bar at its HUD position.
   * @returns {void}
   */
  show() {
    this.isHidden = false;
  }

  /**
   * Resolves image step index for percentage bars.
   * @returns {number}
   */
  resolveImageIndex() {
    if (this.percentage >= 100) return 5;
    if (this.percentage >= 80) return 4;
    if (this.percentage >= 60) return 3;
    if (this.percentage >= 40) return 2;
    if (this.percentage >= 20) return 1;
    return 0;
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
