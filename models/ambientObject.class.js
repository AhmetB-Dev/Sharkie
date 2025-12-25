class AmbientObject extends MovableObject {
  constructor(imagePath, y, x, width, height) {
    super().loadImage(imagePath);
    this.y = y;
    this.x = x;
    this.width = width;
    this.height = height;
    this.speed = 0.08;
    this.animationAmbient();
  }

  animationAmbient() {
    this.timers.every(() => (this.x -= this.speed), 1000 / 60);
  }
}
