class TouchButton {
  constructor(options) {
    this.initConfig(options);
    this.initState();
    this.initRect();
    this.initImage(this.imageSrc);
  }

  initConfig({ action, hold = true, imgSrc = null, pulseMs = 550, shape = "circle" }) {
    this.actionKey = action;
    this.isHoldButton = hold;
    this.shape = shape;
    this.pulseDurationMs = pulseMs;
    this.imageSrc = imgSrc;
  }

  initState() {
    this.isPressed = false;
    this.pulseTimeoutId = null;
  }

  initRect() {
    this.x = 0;
    this.y = 0;
    this.size = 64;
  }

  initImage(imgSrc) {
    this.image = imgSrc ? new Image() : null;
    if (this.image) this.image.src = imgSrc;
  }

  setRect(x, y, size) {
    this.x = x;
    this.y = y;
    this.size = size;
  }

  contains(pointerX, pointerY) {
    if (this.shape !== "circle") return this.isPointInRect(pointerX, pointerY);
    return this.isPointInCircle(pointerX, pointerY);
  }

  isPointInRect(pointerX, pointerY) {
    return (
      pointerX >= this.x &&
      pointerX <= this.x + this.size &&
      pointerY >= this.y &&
      pointerY <= this.y + this.size
    );
  }

  isPointInCircle(pointerX, pointerY) {
    const { centerX, centerY, radius } = this.getCircle();
    const distanceFromCenterX = pointerX - centerX;
    const distanceFromCenterY = pointerY - centerY;
    return (
      distanceFromCenterX * distanceFromCenterX + distanceFromCenterY * distanceFromCenterY <= radius * radius
    );
  }

  getCircle() {
    const radius = this.size / 2;
    return { centerX: this.x + radius, centerY: this.y + radius, radius };
  }

  press(input) {
    if (this.isPressed) return;
    this.isPressed = true;

    if (this.isHoldButton) {
      this.setInput(input, true);
      return;
    }

    this.pulsePress(input);
  }

  pulsePress(input) {
    this.setInput(input, true);
    clearTimeout(this.pulseTimeoutId);
    this.pulseTimeoutId = setTimeout(() => {
      this.finishPulse(input);
    }, this.pulseDurationMs);
  }

  finishPulse(input) {
    this.setInput(input, false);
    this.isPressed = false;
  }

  setInput(input, value) {
    input[this.actionKey] = value;
  }

  release(input) {
    if (!this.isPressed) return;

    if (this.isHoldButton) {
      this.releaseHold(input);
      return;
    }

    this.isPressed = false;
  }

  releaseHold(input) {
    this.isPressed = false;
    this.setInput(input, false);
  }

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
