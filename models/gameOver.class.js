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
    this.width = canvasWidth;
    this.height = canvasHeight;
    this.x = 0;
    this.y = 0;

    const titleList = hasWon ? EndScreen.WIN_TITLES : EndScreen.GAME_OVER_TITLES;
    const titlePath = this.pickRandom(titleList);
    this.titleImage = new Image();
    this.titleImage.src = titlePath;

    const btnPath = this.pickRandom(EndScreen.TRY_AGAIN_IMAGES);
    this.buttonImage = new Image();
    this.buttonImage.src = btnPath;

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
    ctx.save();
    ctx.fillStyle = "rgba(0, 0, 0, 0.6)";
    ctx.fillRect(0, 0, this.width, this.height);
    ctx.restore();

    const titleW = this.width * 0.7;
    const titleH = this.height * 0.25;
    const titleX = (this.width - titleW) / 2;
    const titleY = this.height * 0.2;

    if (this.titleImage.complete) {
      ctx.drawImage(this.titleImage, titleX, titleY, titleW, titleH);
    }

    if (this.buttonImage.complete) {
      ctx.drawImage(this.buttonImage, this.buttonX, this.buttonY, this.buttonWidth, this.buttonHeight);
    }
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
