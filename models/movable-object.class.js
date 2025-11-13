class MovableObject {
  x = 0;
  y = 295;
  img;
  height = 130;
  width = 100;
  imageCache = {};
  currentImage = 0;
  speed = 0.15;
  otherDiretion = false;

  loadImage(path) {
    this.img = new Image();
    this.img.src = path;
  }

  animationImage(array) {
    array.forEach((path) => {
      let img = new Image();
      img.src = path;
      this.imageCache[path] = img;
    });
  }

  playAnimation(images) {
    let i = this.currentImage % images.length;
    let path = images[i];
    this.img = this.imageCache[path];
    this.currentImage++;
  }

  moveRight() {
    setInterval(() => {
      this.x += this.speed;
    }, 1000 / 60);
  }

  moveLeft() {
    setInterval(() => {
      this.x -= this.speed;
    }, 1000 / 60);
  }
}
