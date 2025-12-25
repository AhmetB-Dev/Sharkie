class TouchControls {
  constructor(world) {
    this.initRefs(world);
    this.initState();
    this.initButtons();
  }

  initRefs(world) {
    this.world = world;
    this.canvas = world.canvas;
    this.input = world.input;
  }

  initState() {
    this.activePointers = new Map();
    this.enabled = true;
    this.touchMaxSize = 1024;
  }

  initButtons() {
    const basePath = this.getBasePath();
    this.buttons = this.buildButtons(basePath);
  }

  getBasePath() {
    return "assets/assets_sharkie/6.Botones/mobile_controls/";
  }

  buildButtons(basePath) {
    return {
      left: this.createHoldButton("LEFT", basePath + "touch_move_left_circle.png"),
      right: this.createHoldButton("RIGHT", basePath + "touch_move_right_circle.png"),
      up: this.createHoldButton("UP", basePath + "touch_jump_circle.png"),
      atk1: this.createPulseButton("ATA1", basePath + "touch_attack_bubbleshot_circle.png", 650),
      melee: this.createHoldButton("ATA2", basePath + "touch_melee_circle.png"),
      ult: this.createPulseButton("ULTIMATE", basePath + "touch_attack_ultimate_bubble_no_cross.png", 900),
    };
  }

  createHoldButton(action, imgSrc) {
    return new TouchButton({ action, hold: true, imgSrc });
  }

  createPulseButton(action, imgSrc, pulseMs) {
    return new TouchButton({ action, hold: false, pulseMs, imgSrc });
  }

  setEnabled(on) {
    const nextEnabled = !!on;
    if (this.enabled === nextEnabled) return;
    this.enabled = nextEnabled;
    if (!nextEnabled) this.clearAll();
  }

  shouldShow() {
    const isCoarsePointer = window.matchMedia && window.matchMedia("(pointer:coarse)").matches;
    const isSmallEnough = Math.min(window.innerWidth, window.innerHeight) <= this.touchMaxSize;
    return this.enabled && isCoarsePointer && isSmallEnough;
  }

  layout() {
    const layout = this.getLayoutMetrics();
    this.layoutLeft(layout);
    this.layoutRight(layout);
  }

  getLayoutMetrics() {
    const canvasWidth = this.canvas.width;
    const canvasHeight = this.canvas.height;
    const buttonSize = Math.round(Math.min(canvasWidth, canvasHeight) * 0.13);
    const padding = Math.round(buttonSize * 0.35);
    const baseY = canvasHeight - buttonSize - padding;
    return { canvasWidth, canvasHeight, buttonSize, padding, baseY };
  }

  layoutLeft({ buttonSize, padding, baseY }) {
    const leftBaseX = padding;
    const stepX = buttonSize + padding * 0.7;
    this.buttons.left.setRect(leftBaseX, baseY, buttonSize);
    this.buttons.right.setRect(leftBaseX + stepX, baseY, buttonSize);
    this.buttons.up.setRect(
      leftBaseX + Math.round(stepX / 2),
      baseY - buttonSize - padding * 0.6,
      buttonSize
    );
  }

  layoutRight({ canvasWidth, buttonSize, padding, baseY }) {
    const rightBaseX = canvasWidth - buttonSize - padding;
    const stepX = buttonSize + padding * 0.7;
    this.buttons.atk1.setRect(rightBaseX, baseY, buttonSize);
    this.buttons.melee.setRect(rightBaseX - stepX, baseY + Math.round(buttonSize * 0.08), buttonSize);
    this.buttons.ult.setRect(rightBaseX, baseY - buttonSize - padding * 0.6, buttonSize);
  }

  draw(ctx) {
    if (this.shouldSkipDraw()) return;
    this.layout();
    this.drawButtons(ctx);
  }

  shouldSkipDraw() {
    if (!this.shouldShow()) return true;
    return !!this.world.endScreen;
  }

  drawButtons(ctx) {
    Object.values(this.buttons).forEach((button) => button.draw(ctx));
  }

  pointerDown(x, y, pointerId) {
    if (this.shouldSkipPointer()) return;
    this.tryActivatePointer(pointerId, x, y);
  }

  shouldSkipPointer() {
    if (!this.shouldShow()) return true;
    return !!(this.world.isPaused || this.world.endScreen);
  }

  tryActivatePointer(pointerId, x, y) {
    const button = this.findButton(x, y);
    if (!button) return;
    button.press(this.input);
    this.activePointers.set(pointerId, button);
  }

  pointerMove(x, y, pointerId) {
    const currentButton = this.activePointers.get(pointerId);
    if (!currentButton) return;

    const nextButton = this.findButton(x, y);
    if (nextButton === currentButton) return;

    this.switchPointerButton(pointerId, currentButton, nextButton);
  }

  switchPointerButton(pointerId, currentButton, nextButton) {
    currentButton.release(this.input);
    this.activePointers.delete(pointerId);

    if (!nextButton) return;
    nextButton.press(this.input);
    this.activePointers.set(pointerId, nextButton);
  }

  pointerUp(pointerId) {
    const button = this.activePointers.get(pointerId);
    if (!button) return;
    button.release(this.input);
    this.activePointers.delete(pointerId);
  }

  findButton(x, y) {
    return Object.values(this.buttons).find((button) => button.contains(x, y)) || null;
  }

  clearAll() {
    this.activePointers.forEach((button) => button.release(this.input));
    this.activePointers.clear();
  }
}
