class EndScreen extends DrawableObject {
  static WIN_TITLES = [
    "assets/assets_sharkie/6.Botones/Tittles/You win/Recurso 22.png",
    "assets/assets_sharkie/6.Botones/Tittles/You win/Mesa de trabajo 1.png",
    "assets/assets_sharkie/6.Botones/Tittles/You win/Recurso 19.png",
    "assets/assets_sharkie/6.Botones/Tittles/You win/Recurso 20.png",
    "assets/assets_sharkie/6.Botones/Tittles/You win/Recurso 21.png",
  ];

  static GAME_OVER_TITLES = [
    "assets/assets_sharkie/6.Botones/Tittles/Game Over/Recurso 9.png",
    "assets/assets_sharkie/6.Botones/Tittles/Game Over/Recurso 10.png",
    "assets/assets_sharkie/6.Botones/Tittles/Game Over/Recurso 11.png",
    "assets/assets_sharkie/6.Botones/Tittles/Game Over/Recurso 12.png",
    "assets/assets_sharkie/6.Botones/Tittles/Game Over/Recurso 13.png",
  ];

  static TRY_AGAIN_IMAGES = [
    "assets/assets_sharkie/6.Botones/Try again/Recurso 16.png",
    "assets/assets_sharkie/6.Botones/Try again/Recurso 15.png",
    "assets/assets_sharkie/6.Botones/Try again/Recurso 17.png",
    "assets/assets_sharkie/6.Botones/Try again/Recurso 18.png",
  ];

  constructor(hasWon, canvasWidth, canvasHeight) {
    super();
    this.initCanvas(canvasWidth, canvasHeight);
    this.initImages(hasWon);
    this.initButton(canvasWidth, canvasHeight);
  }

  initCanvas(canvasWidth, canvasHeight) {
    this.width = canvasWidth;
    this.height = canvasHeight;
    this.x = 0;
    this.y = 0;
  }

  initImages(hasWon) {
    const titlePath = this.getTitlePath(hasWon);
    const buttonPath = this.getTryAgainPath();
    this.titleImage = this.createImage(titlePath);
    this.buttonImage = this.createImage(buttonPath);
  }

  getTitlePath(hasWon) {
    const list = hasWon ? EndScreen.WIN_TITLES : EndScreen.GAME_OVER_TITLES;
    return this.pickRandom(list);
  }

  getTryAgainPath() {
    return this.pickRandom(EndScreen.TRY_AGAIN_IMAGES);
  }

  createImage(src) {
    const img = new Image();
    img.src = src;
    return img;
  }

  initButton(canvasWidth, canvasHeight) {
    this.buttonWidth = 220;
    this.buttonHeight = 80;
    this.buttonX = (canvasWidth - this.buttonWidth) / 2;
    this.buttonY = canvasHeight * 0.65;
  }
  pickRandom(list) {
    const index = Math.floor(Math.random() * list.length);
    return list[index];
  }

  draw(ctx) {
    this.drawOverlay(ctx);
    this.drawTitle(ctx);
    this.drawButton(ctx);
  }

  drawOverlay(ctx) {
    ctx.save();
    ctx.fillStyle = "rgba(0, 0, 0, 0.6)";
    ctx.fillRect(0, 0, this.width, this.height);
    ctx.restore();
  }

  drawTitle(ctx) {
    const title = this.getTitleRect();
    if (!this.titleImage.complete) return;
    ctx.drawImage(this.titleImage, title.x, title.y, title.w, title.h);
  }

  drawButton(ctx) {
    if (!this.buttonImage.complete) return;
    ctx.drawImage(this.buttonImage, this.buttonX, this.buttonY, this.buttonWidth, this.buttonHeight);
  }

  getTitleRect() {
    const w = this.width * 0.7;
    const h = this.height * 0.25;
    return { w, h, x: (this.width - w) / 2, y: this.height * 0.2 };
  }

  handleClick(x, y) {
    const inside =
      x >= this.buttonX &&
      x <= this.buttonX + this.buttonWidth &&
      y >= this.buttonY &&
      y <= this.buttonY + this.buttonHeight;

    if (!inside) return false;

    if (typeof restartGame === "function") {
      restartGame();
    }
    return true;
  }
}
