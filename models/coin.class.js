/**
 * Animated coin collectible.
 * @extends MovableObject
 */
class Coin extends MovableObject {
  /** @type {number} */ width = 40;
  /** @type {number} */ height = 60;

  /** @type {string[]} */
  IMAGES_COIN = [
    "assets/assets_sharkie/4. Marcadores/1. Coins/1.webp",
    "assets/assets_sharkie/4. Marcadores/1. Coins/2.webp",
    "assets/assets_sharkie/4. Marcadores/1. Coins/3.webp",
    "assets/assets_sharkie/4. Marcadores/1. Coins/4.webp",
  ];

  /**
   * @param {number} x
   * @param {number} y
   */
  constructor(x, y) {
    super();
    this.animationCoin();
    this.x = x;
    this.y = y;
    this.heiht = this.height;
    this.width = this.width;
  }

  /**
   * Starts coin animation loop.
   * @returns {void}
   */
  animationCoin() {
    this.animationImage(this.IMAGES_COIN);
    this.loadImage(this.IMAGES_COIN[0]);
    this.timers.every(() => {
      this.playAnimation(this.IMAGES_COIN);
    }, 325);
  }
}
