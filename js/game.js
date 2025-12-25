let canvas, world, input, startScreen;
const BASE_W = 720;
const BASE_H = 480;
const ROTATE_BREAKPOINT = 900;
const TOUCH_MAX = 1024;

function boot() {
  initCanvas();
  setupResponsive();
  applyResponsiveLayout();
  initStartScreen();
  registerCanvasPointerHandlers();
}

function initCanvas() {
  canvas = document.getElementById("canvas");
  canvas.classList.add("d-none");
}

function initStartScreen() {
  startScreen = new StartScreen(() => startGame());
  startScreen.show();
  startScreen.screen.addEventListener("pointerdown", startTitleMusicOnce, { once: true });
}

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

function startTitleMusicOnce() {
  window.audioManager?.playMusic("title");
}

function setupResponsive() {
  window.addEventListener("resize", applyResponsiveLayout);
  window.addEventListener("orientationchange", applyResponsiveLayout);
}

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

function shouldShowRotateOverlay(viewportWidth, viewportHeight) {
  const isPortrait = viewportHeight > viewportWidth;
  return viewportWidth < ROTATE_BREAKPOINT && isPortrait;
}

function shouldEnableTouch(shouldRotate, viewportWidth, viewportHeight) {
  if (shouldRotate) return false;
  const isCoarsePointer = window.matchMedia("(pointer:coarse)").matches;
  const isSmallEnough = Math.min(viewportWidth, viewportHeight) <= TOUCH_MAX;
  return isCoarsePointer && isSmallEnough;
}

function restartGame() {
  location.reload();
}

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

function registerCanvasPointerHandlers() {
  canvas.addEventListener("pointerdown", onPointerDown, { passive: false });
  canvas.addEventListener("pointermove", onPointerMove, { passive: false });
  window.addEventListener("pointerup", onPointerUp);
  window.addEventListener("pointercancel", onPointerUp);
}

function onPointerDown(event) {
  event.preventDefault();
  const pos = getCanvasPointerPos(event);

  if (world?.endScreen) {
    world.endScreen.handleClick(pos.x, pos.y);
    return;
  }

  world?.touchControls?.pointerDown(pos.x, pos.y, event.pointerId);
}

function onPointerMove(event) {
  event.preventDefault();
  const pos = getCanvasPointerPos(event);
  world?.touchControls?.pointerMove(pos.x, pos.y, event.pointerId);
}

function onPointerUp(event) {
  world?.touchControls?.pointerUp(event.pointerId);
}

function getCanvasPointerPos(event) {
  const rect = canvas.getBoundingClientRect();
  const scaleX = canvas.width / rect.width;
  const scaleY = canvas.height / rect.height;

  return {
    x: (event.clientX - rect.left) * scaleX,
    y: (event.clientY - rect.top) * scaleY,
  };
}
