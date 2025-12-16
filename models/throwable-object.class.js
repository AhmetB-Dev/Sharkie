class ThrowableObject extends MovableObject {
  IMAGE_SHOOT = CharacterAssets.IMAGE_SHOOT;
  IMAGES_SHOOTBALL = CharacterAssets.IMAGES_SHOOTBALL;

  constructor(x, y) {
    super();

    this.animationImage(this.IMAGE_SHOOT);

    this.loadImage(this.IMAGE_SHOOT[0]);

    this.x = x;
    this.y = y;
    this.height = 40;
    this.width = 40;

    this.animationShoot();
    this.throw();
  }

  animationShoot() {
    setInterval(() => {
      this.playAnimation(this.IMAGE_SHOOT);
    }, 100);
  }

  throw() {
    this.speedY = 30;
    this.applyGravity();

    setInterval(() => {
      this.x += 10;
    }, 25);
  }
}
