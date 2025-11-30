class BubbleProjectile extends MovableObject {
  constructor(x, y, images, shootToLeft = false) {
    super();

    this.animationFrames = images;
    this.animationImage(this.animationFrames);

    this.loadImage(this.animationFrames[0]);

    this.x = x;
    this.y = y;
    this.width = 40;
    this.height = 40;

    this.otherDirection = shootToLeft;
    this.speedX = 12;

    this.startAnimation();
    this.startMovement();
  }

  startAnimation() {
    setInterval(() => {
      this.playAnimation(this.animationFrames);
    }, 1000 / 15);
  }

  startMovement() {
    setInterval(() => {
      if (this.otherDirection) {
        this.x -= this.speedX;
      } else {
        this.x += this.speedX;
      }
    }, 1000 / 60);
  }
}
