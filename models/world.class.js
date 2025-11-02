class World {
  character = new Character();
  enemies = [new Chicken(), new Chicken(), new Chicken()];
  ctx;

  constructor(canvas) {
    this.ctx = canvas.getContext("2d");
    this.draw();
    this.chicken();
  }

  draw() {
    this.ctx.drawImage(
      this.character.img,
      this.character.x,
      this.character.y,
      this.character.width,
      this.character.height
    );

    let self = this;
    requestAnimationFrame(() => self.draw());
  }

  chicken() {
    this.enemies.forEach((chicken) => {
      this.ctx.drawImage(chicken.img, chicken.x, chicken.y, chicken.width, chicken.height);
    });
  }
}
