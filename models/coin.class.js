/**
 * Animated coin collectible.
 * @extends MovableObject
 */
class Coin extends MovableObject {
  /** @type {number} */ width = 40;
  /** @type {number} */ height = 60;

  /** @type {string[]} */
  IMAGES_COIN = [
    "assets/assets_sharkie/4. Marcadores/1. Coins/1.png",
    "assets/assets_sharkie/4. Marcadores/1. Coins/2.png",
    "assets/assets_sharkie/4. Marcadores/1. Coins/3.png",
    "assets/assets_sharkie/4. Marcadores/1. Coins/4.png",
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
    setInterval(() => {
      this.playAnimation(this.IMAGES_COIN);
    }, 325);
  }
}
