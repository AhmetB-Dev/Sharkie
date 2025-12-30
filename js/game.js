"use strict";

/** @type {HTMLCanvasElement|null} */
let canvas;
/** @type {World|undefined} */
let world;
/** @type {Input|undefined} */
let input;
/** @type {StartScreen|undefined} */
let startScreen;

/** Base canvas dimensions (game coordinate system). */
const BASE_W = 720;
const BASE_H = 480;

/** Responsive thresholds. */
const ROTATE_BREAKPOINT = 900;
const TOUCH_MAX = 1024;

/** DOM ids. */
const ROTATE_OVERLAY_ID = "rotateOverlay";
const CANVAS_ID = "canvas";

/** Loading overlay id and minimum display time. */
const LOADING_OVERLAY_ID = "loadingOverlay";
const LOADING_MIN_MS = 2200;

/**
 * Boots the app: prepares canvas, responsive behavior, start screen and pointer handlers.
 * @returns {void}
 */
function boot() {
  showLoadingOverlayFor(LOADING_MIN_MS);
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
  canvas = document.getElementById(CANVAS_ID);
  if (!canvas) return;
  canvas.classList.add("d-none");
}

/**
 * Shows the loading overlay for a minimum time, then fades it out and removes it.
 * @param {number} ms
 * @returns {void}
 */
function showLoadingOverlayFor(ms) {
  const overlay = document.getElementById(LOADING_OVERLAY_ID);
  if (!overlay) return;
  window.setTimeout(() => hideAndRemoveLoadingOverlay(overlay), ms);
}

/**
 * Fades out and removes the loading overlay.
 * @param {HTMLElement} overlay
 * @returns {void}
 */
function hideAndRemoveLoadingOverlay(overlay) {
  overlay.classList.add("hide");
  window.setTimeout(() => overlay.remove(), 220);
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
  if (!canvas) return;
  startScreen?.hide?.();
  canvas.classList.remove("d-none");
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

  const viewportWidth = window.innerWidth;
  const viewportHeight = window.innerHeight;

  const shouldRotate = shouldShowRotateOverlay(viewportWidth, viewportHeight);
  toggleRotateOverlay(shouldRotate);

  if (world) world.isPaused = shouldRotate;

  const touchEnabled = shouldEnableTouch(shouldRotate, viewportWidth, viewportHeight);
  world?.touchControls?.setEnabled?.(touchEnabled);
}

/**
 * Shows/hides the rotate overlay.
 * @param {boolean} show
 * @returns {void}
 */
function toggleRotateOverlay(show) {
  const overlay = document.getElementById(ROTATE_OVERLAY_ID);
  overlay?.classList.toggle("show", show);
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
 * Restarts the game immediately ("Try again") without returning to the main menu.
 * Creates a fresh World instance so the level starts from the beginning.
 * @returns {void}
 */
function restartGame() {
  stopWorld();
  startGame();
}

/**
 * Stops the current world instance and releases resources.
 * @returns {void}
 */
function stopWorld() {
  world?.destroy?.();
  world = undefined;
  window.world = undefined;
  input = undefined;
}

/**
 * Returns to the start screen without reloading the page.
 * @returns {void}
 */
function showMainMenu() {
  if (canvas) {
    canvas.classList.add("d-none");
    canvas.style.display = "none";
  }

  startScreen?.show?.();
  window.audioManager?.playMusic?.("title");
  applyResponsiveLayout();
}

/**
 * Toggles fullscreen (enter/exit) and reapplies responsive layout.
 * @returns {Promise<void>}
 */
async function requestFullscreen() {
  try {
    if (document.fullscreenElement) {
      await document.exitFullscreen();
      return;
    }
    await document.documentElement.requestFullscreen?.();
  } finally {
    applyResponsiveLayout();
  }
}

/**
 * Registers pointer handlers for touch controls and end screen clicks.
 * @returns {void}
 */
function registerCanvasPointerHandlers() {
  if (!canvas) return;
  canvas.addEventListener("pointerdown", onPointerDown, { passive: false });
  canvas.addEventListener("pointermove", onPointerMove, { passive: false });
  window.addEventListener("pointerup", onPointerUp);
  window.addEventListener("pointercancel", onPointerUp);
  canvas.addEventListener("pointermove", updateCanvasCursor);
  canvas.addEventListener("pointerleave", () => setCanvasCursor("default"));
}

/**
 * Updates canvas cursor based on end screen.
 * @returns {void}
 */
function updateCanvasCursor() {
  setCanvasCursor(world?.endScreen ? "pointer" : "default");
}

/**
 * Sets canvas cursor style safely.
 * @param {string} value
 * @returns {void}
 */
function setCanvasCursor(value) {
  if (!canvas) return;
  canvas.style.cursor = value;
}

/**
 * Pointer down handler: end screen click or touch control press.
 * @param {PointerEvent} event
 * @returns {void}
 */
function onPointerDown(event) {
  if (!canvas) return;
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
  if (!canvas) return;

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
