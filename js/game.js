/** @type {HTMLCanvasElement|null} */
let canvas,
  /** @type {World|undefined} */
  world,
  /** @type {Input|undefined} */
  input,
  /** @type {StartScreen|undefined} */
  startScreen;

/** @type {number} */
const BASE_W = 720;
/** @type {number} */
const BASE_H = 480;
/** @type {number} */
const ROTATE_BREAKPOINT = 900;
/** @type {number} */
const TOUCH_MAX = 1024;

/**
 * Boots the app: prepares canvas, responsive behavior, start screen and pointer handlers.
 * @returns {void}
 */
function boot() {
  initCanvas();
  setupResponsive();
  applyResponsiveLayout();
  initStartScreen();
  registerCanvasPointerHandlers();
}

/**
 * Caches the canvas element and hides it initially.
 * @returns {void}
 */
function initCanvas() {
  canvas = document.getElementById("canvas");
  canvas.classList.add("d-none");
}

/**
 * Creates and shows the start screen. Starts title music on first pointerdown.
 * @returns {void}
 */
function initStartScreen() {
  startScreen = new StartScreen(() => startGame());
  startScreen.show();
  startScreen.screen.addEventListener("pointerdown", startTitleMusicOnce, { once: true });
}

/**
 * Starts the game: hides start screen, shows canvas, starts music and creates World + Input.
 * @returns {void}
 */
function startGame() {
  startScreen.hide();
  canvas.style.display = "block";
  window.audioManager?.playMusic("game");
  input = new Input();
  input.attachKeyboard();
  world = new World(canvas, input);
  window.world = world;
  applyResponsiveLayout();
}

/**
 * Plays title music once (first interaction on start screen).
 * @returns {void}
 */
function startTitleMusicOnce() {
  window.audioManager?.playMusic("title");
}

/**
 * Registers resize/orientation listeners for responsive layout updates.
 * @returns {void}
 */
function setupResponsive() {
  window.addEventListener("resize", applyResponsiveLayout);
  window.addEventListener("orientationchange", applyResponsiveLayout);
}

/**
 * Applies responsive rules: rotate overlay, pause state and touch enable/disable.
 * @returns {void}
 */
function applyResponsiveLayout() {
  if (!canvas) return;
  const overlay = document.getElementById("rotateOverlay");
  const viewportWidth = window.innerWidth;
  const viewportHeight = window.innerHeight;
  const shouldRotate = shouldShowRotateOverlay(viewportWidth, viewportHeight);
  overlay?.classList.toggle("show", shouldRotate);

  if (world) world.isPaused = shouldRotate;
  world?.touchControls?.setEnabled?.(shouldEnableTouch(shouldRotate, viewportWidth, viewportHeight));
}

/**
 * Determines if rotate overlay should be shown.
 * @param {number} viewportWidth
 * @param {number} viewportHeight
 * @returns {boolean}
 */
function shouldShowRotateOverlay(viewportWidth, viewportHeight) {
  const isPortrait = viewportHeight > viewportWidth;
  return viewportWidth < ROTATE_BREAKPOINT && isPortrait;
}

/**
 * Determines if touch controls should be enabled.
 * @param {boolean} shouldRotate
 * @param {number} viewportWidth
 * @param {number} viewportHeight
 * @returns {boolean}
 */
function shouldEnableTouch(shouldRotate, viewportWidth, viewportHeight) {
  if (shouldRotate) return false;
  const isCoarsePointer = window.matchMedia("(pointer:coarse)").matches;
  const isSmallEnough = Math.min(viewportWidth, viewportHeight) <= TOUCH_MAX;
  return isCoarsePointer && isSmallEnough;
}

/**
 * Reloads the page to restart the game.
 * @returns {void}
 */
function restartGame() {
  location.reload();
}

/**
 * Toggles fullscreen (enter/exit) and reapplies responsive layout.
 * @returns {Promise<void>}
 */
async function requestFullscreen() {
  const full = document.documentElement;
  try {
    if (document.fullscreenElement) {
      await document.exitFullscreen();
      return;
    }
    if (full.requestFullscreen) await full.requestFullscreen();
  } finally {
    applyResponsiveLayout?.();
  }
}

/**
 * Registers pointer handlers for touch controls and end screen clicks.
 * @returns {void}
 */
function registerCanvasPointerHandlers() {
  canvas.addEventListener("pointerdown", onPointerDown, { passive: false });
  canvas.addEventListener("pointermove", onPointerMove, { passive: false });
  window.addEventListener("pointerup", onPointerUp);
  window.addEventListener("pointercancel", onPointerUp);
}

/**
 * Pointer down handler: end screen click or touch control press.
 * @param {PointerEvent} event
 * @returns {void}
 */
function onPointerDown(event) {
  event.preventDefault();
  const pos = getCanvasPointerPos(event);

  if (world?.endScreen) {
    world.endScreen.handleClick(pos.x, pos.y);
    return;
  }
  
  world?.touchControls?.pointerDown(pos.x, pos.y, event.pointerId);
}

/**
 * Pointer move handler: touch control move/slide.
 * @param {PointerEvent} event
 * @returns {void}
 */
function onPointerMove(event) {
  event.preventDefault();
  const pos = getCanvasPointerPos(event);
  world?.touchControls?.pointerMove(pos.x, pos.y, event.pointerId);
}

/**
 * Pointer up/cancel handler: releases touch control pointer.
 * @param {PointerEvent} event
 * @returns {void}
 */
function onPointerUp(event) {
  world?.touchControls?.pointerUp(event.pointerId);
}

/**
 * Converts pointer screen coords into canvas coords (accounts for CSS scaling).
 * @param {PointerEvent} event
 * @returns {{x:number, y:number}}
 */
function getCanvasPointerPos(event) {
  const rect = canvas.getBoundingClientRect();
  const scaleX = canvas.width / rect.width;
  const scaleY = canvas.height / rect.height;

  return {
    x: (event.clientX - rect.left) * scaleX,
    y: (event.clientY - rect.top) * scaleY,
  };
}
