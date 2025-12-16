class AmmoPickup extends MovableObject {
  offset = {
    top: 20,
    left: 20,
    right: 20,
    bottom: 5,
  };

  height = 100;
  width = 40;

  constructor(imagePath, x, y) {
    super().loadImage(imagePath);
    this.x = x;
    this.y = y;
  }
}
