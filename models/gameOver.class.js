/**
 * End screen overlay for win/lose with a random title image and "try again" button.
 * Handles click hit testing for restart.
 * @extends DrawableObject
 */
class EndScreen extends DrawableObject {
  /** @type {string[]} */
  static WIN_TITLES = [
    "assets/assets_sharkie/6.Botones/Tittles/You win/Recurso 22.png",
    "assets/assets_sharkie/6.Botones/Tittles/You win/Mesa de trabajo 1.png",
    "assets/assets_sharkie/6.Botones/Tittles/You win/Recurso 19.png",
    "assets/assets_sharkie/6.Botones/Tittles/You win/Recurso 20.png",
    "assets/assets_sharkie/6.Botones/Tittles/You win/Recurso 21.png",
  ];

  /** @type {string[]} */
  static GAME_OVER_TITLES = [
    "assets/assets_sharkie/6.Botones/Tittles/Game Over/Recurso 9.png",
    "assets/assets_sharkie/6.Botones/Tittles/Game Over/Recurso 10.png",
    "assets/assets_sharkie/6.Botones/Tittles/Game Over/Recurso 11.png",
    "assets/assets_sharkie/6.Botones/Tittles/Game Over/Recurso 12.png",
    "assets/assets_sharkie/6.Botones/Tittles/Game Over/Recurso 13.png",
  ];

  /** @type {string[]} */
  static TRY_AGAIN_IMAGES = [
    "assets/assets_sharkie/6.Botones/Try again/Recurso 16.png",
    "assets/assets_sharkie/6.Botones/Try again/Recurso 15.png",
    "assets/assets_sharkie/6.Botones/Try again/Recurso 17.png",
    "assets/assets_sharkie/6.Botones/Try again/Recurso 18.png",
  ];

  /**
   * @param {boolean} hasWon
   * @param {number} canvasWidth
   * @param {number} canvasHeight
   */
  constructor(hasWon, canvasWidth, canvasHeight) {
    super();
    this.initCanvas(canvasWidth, canvasHeight);
    this.initImages(hasWon);
    this.initButton(canvasWidth, canvasHeight);
  }

  /**
   * Initializes overlay transform.
   * @param {number} canvasWidth
   * @param {number} canvasHeight
   * @returns {void}
   */
  initCanvas(canvasWidth, canvasHeight) {
    this.width = canvasWidth;
    this.height = canvasHeight;
    this.x = 0;
    this.y = 0;
  }

  /**
   * Loads title + button images based on win/lose.
   * @param {boolean} hasWon
   * @returns {void}
   */
  initImages(hasWon) {
    const titlePath = this.getTitlePath(hasWon);
    const buttonPath = this.getTryAgainPath();
    this.titleImage = this.createImage(titlePath);
    this.buttonImage = this.createImage(buttonPath);
  }

  /**
   * @param {boolean} hasWon
   * @returns {string}
   */
  getTitlePath(hasWon) {
    const list = hasWon ? EndScreen.WIN_TITLES : EndScreen.GAME_OVER_TITLES;
    return this.pickRandom(list);
  }

  /**
   * @returns {string}
   */
  getTryAgainPath() {
    return this.pickRandom(EndScreen.TRY_AGAIN_IMAGES);
  }

  /**
   * Creates an HTML image element.
   * @param {string} src
   * @returns {HTMLImageElement}
   */
  createImage(src) {
    const img = new Image();
    img.src = src;
    return img;
  }

  /**
   * Initializes try-again button rect.
   * @param {number} canvasWidth
   * @param {number} canvasHeight
   * @returns {void}
   */
  initButton(canvasWidth, canvasHeight) {
    this.buttonWidth = 220;
    this.buttonHeight = 80;
    this.buttonX = (canvasWidth - this.buttonWidth) / 2;
    this.buttonY = canvasHeight * 0.65;
  }

  /**
   * Picks random element from list.
   * @param {string[]} list
   * @returns {string}
   */
  pickRandom(list) {
    const index = Math.floor(Math.random() * list.length);
    return list[index];
  }

  /**
   * Draws overlay, title, and button.
   * @param {CanvasRenderingContext2D} ctx
   * @returns {void}
   */
  draw(ctx) {
    this.drawOverlay(ctx);
    this.drawTitle(ctx);
    this.drawButton(ctx);
  }

  /**
   * Draws dark background overlay.
   * @param {CanvasRenderingContext2D} ctx
   * @returns {void}
   */
  drawOverlay(ctx) {
    ctx.save();
    ctx.fillStyle = "rgba(0, 0, 0, 0.6)";
    ctx.fillRect(0, 0, this.width, this.height);
    ctx.restore();
  }

  /**
   * Draws title image.
   * @param {CanvasRenderingContext2D} ctx
   * @returns {void}
   */
  drawTitle(ctx) {
    const title = this.getTitleRect();
    if (!this.titleImage.complete) return;
    ctx.drawImage(this.titleImage, title.x, title.y, title.w, title.h);
  }

  /**
   * Draws try-again button image.
   * @param {CanvasRenderingContext2D} ctx
   * @returns {void}
   */
  drawButton(ctx) {
    if (!this.buttonImage.complete) return;
    ctx.drawImage(this.buttonImage, this.buttonX, this.buttonY, this.buttonWidth, this.buttonHeight);
  }

  /**
   * Computes title rect based on canvas size.
   * @returns {{w:number, h:number, x:number, y:number}}
   */
  getTitleRect() {
    const w = this.width * 0.7;
    const h = this.height * 0.25;
    return { w, h, x: (this.width - w) / 2, y: this.height * 0.2 };
  }

  /**
   * Hit test for button click. Calls global `restartGame()` if available.
   * @param {number} x
   * @param {number} y
   * @returns {boolean} True if button was clicked.
   */
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
