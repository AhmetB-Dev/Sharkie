"use strict";

/** @type {HTMLCanvasElement|null} */
let canvas;
/** @type {World|undefined} */
let world;
/** @type {Input|undefined} */
let input;
/** @type {StartScreen|undefined} */
let startScreen;
/** @type {HTMLElement|null} */
let pauseMenuReturnFocus = null;

/** Base canvas dimensions (game coordinate system). */
const BASE_W = 720;
const BASE_H = 480;

/** Responsive thresholds. */
const ROTATE_BREAKPOINT = 900;
const TOUCH_MAX = 1024;

/** DOM ids. */
const ROTATE_OVERLAY_ID = "rotateOverlay";
const CANVAS_ID = "canvas";
const GAME_STAGE_ID = "gameStage";
const GAME_MENU_BUTTON_ID = "gameMenuButton";
const PAUSE_MENU_OVERLAY_ID = "pauseMenuOverlay";

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
  registerPauseMenuHandlers();
}

/**
 * Caches the canvas element and hides it initially.
 * @returns {void}
 */
function initCanvas() {
  canvas = document.getElementById(CANVAS_ID);
  if (!canvas) return;
  canvas.style.webkitTouchCallout = "none";
  canvas.style.webkitUserSelect = "none";
  canvas.style.userSelect = "none";
  canvas.style.webkitUserDrag = "none";
  canvas.style.touchAction = "none";
  canvas.classList.add("d-none");
  document.getElementById(GAME_STAGE_ID)?.classList.add("d-none");
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
  closePauseMenu(false);
  startScreen?.hide?.();
  document.getElementById(GAME_STAGE_ID)?.classList.remove("d-none");
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

  const pauseMenuOpen = isPauseMenuOpen();
  if (world) world.isPaused = shouldRotate || pauseMenuOpen;

  const touchEnabled = !pauseMenuOpen && shouldEnableTouch(shouldRotate, viewportWidth, viewportHeight);
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
  closePauseMenu(false);
  stopWorld();
  startGame();
}

/**
 * Stops the current world instance and releases resources.
 * @returns {void}
 */
function stopWorld() {
  resetInputState();
  world?.destroy?.();
  world = undefined;
  window.world = undefined;
  if (typeof Input !== "undefined" && Input.active === input) Input.active = null;
  if (window.input === input) window.input = undefined;
  input = undefined;
}

/**
 * Returns to the start screen without reloading the page.
 * @returns {void}
 */
function showMainMenu() {
  closePauseMenu(false);
  stopWorld();

  if (canvas) {
    canvas.classList.add("d-none");
    canvas.style.display = "none";
  }
  document.getElementById(GAME_STAGE_ID)?.classList.add("d-none");

  startScreen?.show?.();
  startScreen?.syncSoundToggleState?.();
  window.audioManager?.playMusic?.("title");
  applyResponsiveLayout();
  window.setTimeout(() => document.getElementById("startBtn")?.focus?.(), 0);
}

/**
 * Registers the in-game pause menu controls.
 * @returns {void}
 */
function registerPauseMenuHandlers() {
  const menuButton = document.getElementById(GAME_MENU_BUTTON_ID);
  const overlay = document.getElementById(PAUSE_MENU_OVERLAY_ID);
  if (!menuButton || !overlay) return;

  menuButton.addEventListener("click", togglePauseMenu);
  overlay.addEventListener("click", handlePauseMenuClick);
  window.addEventListener("keydown", handlePauseMenuKeydown);
}

/**
 * Opens or closes the pause menu.
 * @returns {void}
 */
function togglePauseMenu() {
  if (isPauseMenuOpen()) closePauseMenu();
  else openPauseMenu();
}

/**
 * Pauses gameplay and opens the centered menu dialog.
 * @returns {void}
 */
function openPauseMenu() {
  const overlay = document.getElementById(PAUSE_MENU_OVERLAY_ID);
  const menuButton = document.getElementById(GAME_MENU_BUTTON_ID);
  if (!overlay || !world) return;

  pauseMenuReturnFocus = document.activeElement instanceof HTMLElement ? document.activeElement : menuButton;
  overlay.classList.add("show");
  overlay.setAttribute("aria-hidden", "false");
  menuButton?.setAttribute("aria-expanded", "true");
  document.body.classList.add("pauseMenuOpen");

  world.isPaused = true;
  world.touchControls?.setEnabled?.(false);
  resetInputState();
  syncPauseSoundState();

  overlay.querySelector('[data-menu-action="resume"]')?.focus?.();
}

/**
 * Closes the pause menu and optionally resumes the current game.
 * @param {boolean} resumeGame
 * @returns {void}
 */
function closePauseMenu(resumeGame = true) {
  const overlay = document.getElementById(PAUSE_MENU_OVERLAY_ID);
  const menuButton = document.getElementById(GAME_MENU_BUTTON_ID);
  if (!overlay) return;

  const wasOpen = overlay.classList.contains("show");
  overlay.classList.remove("show");
  overlay.setAttribute("aria-hidden", "true");
  menuButton?.setAttribute("aria-expanded", "false");
  document.body.classList.remove("pauseMenuOpen");

  if (resumeGame && world) {
    resetInputState();
    applyResponsiveLayout();
  }

  if (wasOpen && resumeGame) (pauseMenuReturnFocus || menuButton)?.focus?.();
  pauseMenuReturnFocus = null;
}

/**
 * Routes clicks within the pause menu.
 * @param {MouseEvent} event
 * @returns {void}
 */
function handlePauseMenuClick(event) {
  const overlay = document.getElementById(PAUSE_MENU_OVERLAY_ID);
  if (event.target === overlay) return closePauseMenu();

  const actionButton = event.target.closest?.("[data-menu-action]");
  if (!actionButton) return;

  const action = actionButton.dataset.menuAction;
  if (action === "resume") return closePauseMenu();
  if (action === "retry") return restartGame();
  if (action === "sound") return togglePauseSound();
  if (action === "main-menu") return showMainMenu();
}

/**
 * Handles Escape and keeps the sound label synced with the M shortcut.
 * @param {KeyboardEvent} event
 * @returns {void}
 */
function handlePauseMenuKeydown(event) {
  if (!isPauseMenuOpen()) return;

  if (event.key === "Escape") {
    event.preventDefault();
    closePauseMenu();
    return;
  }

  if (event.key === "m" || event.key === "M") {
    window.setTimeout(syncPauseSoundState, 0);
  }
}

/**
 * Toggles the existing global music/sound setting from the pause menu.
 * @returns {void}
 */
function togglePauseSound() {
  window.audioManager?.toggleMute?.();
  syncPauseSoundState();
}

/**
 * Updates the pause menu music state text and accessibility state.
 * @returns {void}
 */
function syncPauseSoundState() {
  const button = document.getElementById("pauseSoundButton");
  const state = document.getElementById("pauseSoundState");
  const enabled = !!window.audioManager?.enabled;

  if (state) state.textContent = enabled ? "ON" : "OFF";
  button?.classList.toggle("isMuted", !enabled);
  button?.setAttribute("aria-pressed", String(!enabled));
  button?.setAttribute("aria-label", enabled ? "Mute music" : "Turn music on");
}

/**
 * Returns whether the pause menu is currently visible.
 * @returns {boolean}
 */
function isPauseMenuOpen() {
  return !!document.getElementById(PAUSE_MENU_OVERLAY_ID)?.classList.contains("show");
}

/**
 * Releases keyboard and touch flags so the character cannot keep moving after a pause.
 * @returns {void}
 */
function resetInputState() {
  if (!input) return;

  ["LEFT", "RIGHT", "UP", "DOWN", "SPACE", "THROW", "ATA1", "ATA2", "ULTIMATE"].forEach((key) => {
    input[key] = false;
  });

  Object.values(input._pulseTimers || {}).forEach((timerId) => clearTimeout(timerId));
  input._pulseTimers = {};
  world?.touchControls?.clearAll?.();
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
  canvas.addEventListener("contextmenu", (e) => e.preventDefault());
  canvas.addEventListener("dragstart", (e) => e.preventDefault());
  canvas.addEventListener("selectstart", (e) => e.preventDefault());
  canvas.addEventListener("gesturestart", (e) => e.preventDefault());

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
