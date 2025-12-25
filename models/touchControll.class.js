/**
 * Mobile touch controls system:
 * - creates TouchButtons
 * - lays out buttons based on canvas size
 * - maps pointer events to Input flags (multi-touch supported)
 */
class TouchControls {
  /**
   * @param {World} world
   */
  constructor(world) {
    this.initRefs(world);
    this.initState();
    this.initButtons();
  }

  /**
   * Stores references to world/canvas/input.
   * @param {World} world
   * @returns {void}
   */
  initRefs(world) {
    this.world = world;
    this.canvas = world.canvas;
    this.input = world.input;
  }

  /**
   * Initializes internal state.
   * @returns {void}
   */
  initState() {
    /** @type {Map<number, TouchButton>} */
    this.activePointers = new Map();
    this.enabled = true;
    this.touchMaxSize = 1024;
  }

  /**
   * Creates all touch buttons.
   * @returns {void}
   */
  initButtons() {
    const basePath = this.getBasePath();
    this.buttons = this.buildButtons(basePath);
  }

  /**
   * Returns base asset folder for touch button images.
   * @returns {string}
   */
  getBasePath() {
    return "assets/assets_sharkie/6.Botones/mobile_controls/";
  }

  /**
   * Builds the button collection.
   * @param {string} basePath
   * @returns {{left:TouchButton,right:TouchButton,up:TouchButton,atk1:TouchButton,melee:TouchButton,ult:TouchButton}}
   */
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

  /**
   * Creates a hold-type TouchButton.
   * @param {string} action
   * @param {string} imgSrc
   * @returns {TouchButton}
   */
  createHoldButton(action, imgSrc) {
    return new TouchButton({ action, hold: true, imgSrc });
  }

  /**
   * Creates a pulse-type TouchButton.
   * @param {string} action
   * @param {string} imgSrc
   * @param {number} pulseMs
   * @returns {TouchButton}
   */
  createPulseButton(action, imgSrc, pulseMs) {
    return new TouchButton({ action, hold: false, pulseMs, imgSrc });
  }

  /**
   * Enables/disables touch controls and clears active presses when disabled.
   * @param {boolean} on
   * @returns {void}
   */
  setEnabled(on) {
    const nextEnabled = !!on;
    if (this.enabled === nextEnabled) return;
    this.enabled = nextEnabled;
    if (!nextEnabled) this.clearAll();
  }

  /**
   * Determines whether touch controls should be visible.
   * @returns {boolean}
   */
  shouldShow() {
    const isCoarsePointer = window.matchMedia && window.matchMedia("(pointer:coarse)").matches;
    const isSmallEnough = Math.min(window.innerWidth, window.innerHeight) <= this.touchMaxSize;
    return this.enabled && isCoarsePointer && isSmallEnough;
  }

  /**
   * Computes layout and assigns button rects.
   * @returns {void}
   */
  layout() {
    const layout = this.getLayoutMetrics();
    this.layoutLeft(layout);
    this.layoutRight(layout);
  }

  /**
   * Computes layout metrics from canvas dimensions.
   * @returns {{canvasWidth:number, canvasHeight:number, buttonSize:number, padding:number, baseY:number}}
   */
  getLayoutMetrics() {
    const canvasWidth = this.canvas.width;
    const canvasHeight = this.canvas.height;
    const buttonSize = Math.round(Math.min(canvasWidth, canvasHeight) * 0.13);
    const padding = Math.round(buttonSize * 0.35);
    const baseY = canvasHeight - buttonSize - padding;
    return { canvasWidth, canvasHeight, buttonSize, padding, baseY };
  }

  /**
   * Layout for movement buttons on the left side.
   * @param {{buttonSize:number, padding:number, baseY:number}} param0
   * @returns {void}
   */
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

  /**
   * Layout for attack buttons on the right side.
   * @param {{canvasWidth:number, buttonSize:number, padding:number, baseY:number}} param0
   * @returns {void}
   */
  layoutRight({ canvasWidth, buttonSize, padding, baseY }) {
    const rightBaseX = canvasWidth - buttonSize - padding;
    const stepX = buttonSize + padding * 0.7;
    this.buttons.atk1.setRect(rightBaseX, baseY, buttonSize);
    this.buttons.melee.setRect(rightBaseX - stepX, baseY + Math.round(buttonSize * 0.08), buttonSize);
    this.buttons.ult.setRect(rightBaseX, baseY - buttonSize - padding * 0.6, buttonSize);
  }

  /**
   * Draws touch controls.
   * @param {CanvasRenderingContext2D} ctx
   * @returns {void}
   */
  draw(ctx) {
    if (this.shouldSkipDraw()) return;
    this.layout();
    this.drawButtons(ctx);
  }

  /**
   * @returns {boolean}
   */
  shouldSkipDraw() {
    if (!this.shouldShow()) return true;
    return !!this.world.endScreen;
  }

  /**
   * Draws all buttons.
   * @param {CanvasRenderingContext2D} ctx
   * @returns {void}
   */
  drawButtons(ctx) {
    Object.values(this.buttons).forEach((button) => button.draw(ctx));
  }

  /**
   * Pointer down handler.
   * @param {number} x
   * @param {number} y
   * @param {number} pointerId
   * @returns {void}
   */
  pointerDown(x, y, pointerId) {
    if (this.shouldSkipPointer()) return;
    this.tryActivatePointer(pointerId, x, y);
  }

  /**
   * @returns {boolean}
   */
  shouldSkipPointer() {
    if (!this.shouldShow()) return true;
    return !!(this.world.isPaused || this.world.endScreen);
  }

  /**
   * Activates a pointer on a button if hit.
   * @param {number} pointerId
   * @param {number} x
   * @param {number} y
   * @returns {void}
   */
  tryActivatePointer(pointerId, x, y) {
    const button = this.findButton(x, y);
    if (!button) return;
    button.press(this.input);
    this.activePointers.set(pointerId, button);
  }

  /**
   * Pointer move handler (switches active button if pointer slides).
   * @param {number} x
   * @param {number} y
   * @param {number} pointerId
   * @returns {void}
   */
  pointerMove(x, y, pointerId) {
    const currentButton = this.activePointers.get(pointerId);
    if (!currentButton) return;

    const nextButton = this.findButton(x, y);
    if (nextButton === currentButton) return;

    this.switchPointerButton(pointerId, currentButton, nextButton);
  }

  /**
   * Switches a pointer from one button to another.
   * @param {number} pointerId
   * @param {TouchButton} currentButton
   * @param {TouchButton|null} nextButton
   * @returns {void}
   */
  switchPointerButton(pointerId, currentButton, nextButton) {
    currentButton.release(this.input);
    this.activePointers.delete(pointerId);

    if (!nextButton) return;
    nextButton.press(this.input);
    this.activePointers.set(pointerId, nextButton);
  }

  /**
   * Pointer up handler (releases associated button).
   * @param {number} pointerId
   * @returns {void}
   */
  pointerUp(pointerId) {
    const button = this.activePointers.get(pointerId);
    if (!button) return;
    button.release(this.input);
    this.activePointers.delete(pointerId);
  }

  /**
   * Finds the first button containing the point.
   * @param {number} x
   * @param {number} y
   * @returns {TouchButton|null}
   */
  findButton(x, y) {
    return Object.values(this.buttons).find((button) => button.contains(x, y)) || null;
  }

  /**
   * Releases all active pointers/buttons and clears the map.
   * @returns {void}
   */
  clearAll() {
    this.activePointers.forEach((button) => button.release(this.input));
    this.activePointers.clear();
  }
}
