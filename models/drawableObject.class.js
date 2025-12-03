class DrawableObject {
  x = 0;
  y = 300;
  height = 130;
  width = 100;
  img;
  imageCache = {};
  currentImage = 0;

  loadImage(path) {
    this.img = new Image();
    this.img.src = path;
  }

  draw(ctx) {
    ctx.drawImage(this.img, this.x, this.y, this.width, this.height);
  }

  animationImage(array) {
    array.forEach((path) => {
      let img = new Image();
      img.src = path;
      this.imageCache[path] = img;
    });
  }

  showHitbox(ctx) {
    if (
      this instanceof Character ||
      this instanceof Coin ||
      this instanceof AmmoPickup ||
      this instanceof Enemy_Typ01 ||
      this instanceof Enemy_Typ02 ||
      this instanceof Boss
    ) {
      ctx.beginPath();
      ctx.lineWidth = "3";
      ctx.strokeStyle = "red";
      const x = this.x + this.offset.left;
      const y = this.y + this.offset.top;
      const w = this.width - this.offset.left - this.offset.right;
      const h = this.height - this.offset.top - this.offset.bottom;

      ctx.rect(x, y, w, h);
      ctx.stroke();
    }
  }
}
