class Bottle extends MovableObject {
  height = 90;
  width = 85;
  constructor(imagePath, x, y) {
    super().loadImage(imagePath);
    this.x = x;
    this.y = y;
  }
}
