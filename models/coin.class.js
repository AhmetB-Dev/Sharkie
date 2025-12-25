class Coin extends MovableObject {
  width = 40;
  height = 60;

  IMAGES_COIN = [
    "assets/assets_sharkie/4. Marcadores/1. Coins/1.png",
    "assets/assets_sharkie/4. Marcadores/1. Coins/2.png",
    "assets/assets_sharkie/4. Marcadores/1. Coins/3.png",
    "assets/assets_sharkie/4. Marcadores/1. Coins/4.png",
  ];

  constructor(x, y) {
    super();
    this.animationCoin();
    this.x = x;
    this.y = y;
    this.heiht = this.height;
    this.width = this.width;
  }

  animationCoin() {
    this.animationImage(this.IMAGES_COIN);
    this.loadImage(this.IMAGES_COIN[0]);
    setInterval(() => {
      this.playAnimation(this.IMAGES_COIN);
    }, 325);
  }
}
