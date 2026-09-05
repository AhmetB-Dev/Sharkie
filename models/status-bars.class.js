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
    "assets/ui/green/life/0-copia-3.webp",
    "assets/ui/green/life/20-copia-4.webp",
    "assets/ui/green/life/40-copia-3.webp",
    "assets/ui/green/life/60-copia-3.webp",
    "assets/ui/green/life/80-copia-3.webp",
    "assets/ui/green/life/100-copia-2.webp",
  ];

  /** @type {string[]} */
  STATUS_COIN = [
    "assets/ui/orange/0-copia-2.webp",
    "assets/ui/orange/20-copia.webp",
    "assets/ui/orange/40-copia-2.webp",
    "assets/ui/orange/60-copia-2.webp",
    "assets/ui/orange/80-copia-2.webp",
    "assets/ui/orange/100-copia-2.webp",
  ];

  /** @type {string[]} */
  STATUS_AMMO = [
    "assets/ui/purple/0.webp",
    "assets/ui/purple/20.webp",
    "assets/ui/purple/40.webp",
    "assets/ui/purple/60.webp",
    "assets/ui/purple/80.webp",
    "assets/ui/purple/100.webp",
  ];

  /** @type {string[]} */
  STATUS_BOSS = [
    "assets/ui/boss-bar/0.webp",
    "assets/ui/boss-bar/20.webp",
    "assets/ui/boss-bar/40.webp",
    "assets/ui/boss-bar/60.webp",
    "assets/ui/boss-bar/80.webp",
    "assets/ui/boss-bar/100.webp",
  ];

  constructor() {
    super();
    this.height = 70;
    this.width = 200;
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
    this.stackObjects = Math.max(0, Math.min(100, stackObjects));
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
   * @param {number} [y=25]
   * @param {number} [stackObjects=0]
   * @returns {void}
   */
  initCoinBar(x, y = 25, stackObjects = 0) {
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
    this.width = 290;
    this.height = 370;
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
      this.x = 460;
      this.y = -150;
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
    if (this.stackObjects >= 100) return 5;
    if (this.stackObjects >= 80) return 4;
    if (this.stackObjects >= 60) return 3;
    if (this.stackObjects >= 40) return 2;
    if (this.stackObjects >= 20) return 1;
    return 0;
  }
}
