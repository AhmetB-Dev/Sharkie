class BackgroundObject extends MovableObject {
  constructor(imagePath, x, y, width, height) {
    super();
    this.loadImage(imagePath);
    this.setTransform(x, y, width, height);
  }

  setTransform(x, y, width, height) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
  }
}
