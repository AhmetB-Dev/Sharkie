/**
 * Single touch UI button that maps pointer presses to Input flags.
 * Supports hold buttons (press = true until release) and pulse buttons (auto-release after ms).
 */
class TouchButton {
  /**
   * @param {{action:string, hold?:boolean, imgSrc?:string|null, pulseMs?:number, shape?:"circle"|"rect"}} options
   */
  constructor(options) {
    this.initConfig(options);
    this.initState();
    this.initRect();
    this.initImage(this.imageSrc);
  }

  /**
   * Reads config options and sets defaults.
   * @param {{action:string, hold?:boolean, imgSrc?:string|null, pulseMs?:number, shape?:"circle"|"rect"}} param0
   * @returns {void}
   */
  initConfig({ action, hold = true, imgSrc = null, pulseMs = 550, shape = "circle" }) {
    this.actionKey = action;
    this.isHoldButton = hold;
    this.shape = shape;
    this.pulseDurationMs = pulseMs;
    this.imageSrc = imgSrc;
  }

  /**
   * Initializes runtime state flags.
   * @returns {void}
   */
  initState() {
    this.isPressed = false;
    this.pulseTimeoutId = null;
  }

  /**
   * Initializes the button rectangle (layout is set later via setRect()).
   * @returns {void}
   */
  initRect() {
    this.x = 0;
    this.y = 0;
    this.size = 64;
  }

  /**
   * Creates image element from source if provided.
   * @param {string|null} imgSrc
   * @returns {void}
   */
  initImage(imgSrc) {
    this.image = imgSrc ? new Image() : null;
    if (this.image) this.image.src = imgSrc;
  }

  /**
   * Sets layout rectangle.
   * @param {number} x
   * @param {number} y
   * @param {number} size
   * @returns {void}
   */
  setRect(x, y, size) {
    this.x = x;
    this.y = y;
    this.size = size;
  }

  /**
   * Hit test for current shape.
   * @param {number} pointerX
   * @param {number} pointerY
   * @returns {boolean}
   */
  contains(pointerX, pointerY) {
    if (this.shape !== "circle") return this.isPointInRect(pointerX, pointerY);
    return this.isPointInCircle(pointerX, pointerY);
  }

  /**
   * Rect hit test.
   * @param {number} pointerX
   * @param {number} pointerY
   * @returns {boolean}
   */
  isPointInRect(pointerX, pointerY) {
    return (
      pointerX >= this.x &&
      pointerX <= this.x + this.size &&
      pointerY >= this.y &&
      pointerY <= this.y + this.size
    );
  }

  /**
   * Circle hit test.
   * @param {number} pointerX
   * @param {number} pointerY
   * @returns {boolean}
   */
  isPointInCircle(pointerX, pointerY) {
    const { centerX, centerY, radius } = this.getCircle();
    const distanceFromCenterX = pointerX - centerX;
    const distanceFromCenterY = pointerY - centerY;
    return (
      distanceFromCenterX * distanceFromCenterX + distanceFromCenterY * distanceFromCenterY <= radius * radius
    );
  }

  /**
   * Returns circle geometry based on current rect.
   * @returns {{centerX:number, centerY:number, radius:number}}
   */
  getCircle() {
    const radius = this.size / 2;
    return { centerX: this.x + radius, centerY: this.y + radius, radius };
  }

  /**
   * Handles initial press.
   * @param {any} input - Input state object (e.g. world.input).
   * @returns {void}
   */
  press(input) {
    if (this.isPressed) return;
    this.isPressed = true;

    if (this.isHoldButton) {
      this.setInput(input, true);
      return;
    }

    this.pulsePress(input);
  }

  /**
   * Pulse press: sets input true and auto-releases after duration.
   * @param {any} input
   * @returns {void}
   */
  pulsePress(input) {
    this.setInput(input, true);
    clearTimeout(this.pulseTimeoutId);
    this.pulseTimeoutId = setTimeout(() => {
      this.finishPulse(input);
    }, this.pulseDurationMs);
  }

  /**
   * Finishes pulse and resets pressed state.
   * @param {any} input
   * @returns {void}
   */
  finishPulse(input) {
    this.setInput(input, false);
    this.isPressed = false;
  }

  /**
   * Writes the mapped action flag to the input object.
   * @param {any} input
   * @param {boolean} value
   * @returns {void}
   */
  setInput(input, value) {
    input[this.actionKey] = value;
  }

  /**
   * Handles release.
   * @param {any} input
   * @returns {void}
   */
  release(input) {
    if (!this.isPressed) return;

    if (this.isHoldButton) {
      this.releaseHold(input);
      return;
    }

    this.isPressed = false;
  }

  /**
   * Releases a hold button and sets input flag to false.
   * @param {any} input
   * @returns {void}
   */
  releaseHold(input) {
    this.isPressed = false;
    this.setInput(input, false);
  }

  /**
   * Draws button image with different alpha based on press state.
   * @param {CanvasRenderingContext2D} ctx
   * @returns {void}
   */
  draw(ctx) {
    if (!this.image) return;

    ctx.save();
    ctx.globalAlpha = this.isPressed ? 0.95 : 0.75;

    if (this.image.complete) {
      ctx.drawImage(this.image, this.x, this.y, this.size, this.size);
    }

    ctx.restore();
  }
}
