let canvas, world, input, startScreen;

const BASE_W = 720;
const BASE_H = 480;
const ROTATE_BREAKPOINT = 900;

function boot() {
  canvas = document.getElementById("canvas");
  setupResponsive();
  applyResponsiveLayout();

  startScreen = new StartScreen(() => startGame());
  startScreen.show();
  startScreen.el.addEventListener("pointerdown", startTitleMusicOnce, { once: true });
}

function startGame() {
  startScreen.hide();
  window.audioManager?.playMusic("game");

  input = new Input();
  world = new World(canvas, input);
  window.world = world;

  registerEndScreenInput();
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
  const vw = window.innerWidth;
  const vh = window.innerHeight;

  const shouldRotate = vw < ROTATE_BREAKPOINT && vh > vw;
  overlay?.classList.toggle("show", shouldRotate);

  if (world) world.isPaused = shouldRotate;
}

function restartGame() {
  location.reload();
}

function registerEndScreenInput() {
  canvas.addEventListener("pointerdown", onCanvasPointerDown);
}

function onCanvasPointerDown(e) {
  if (!world || !world.endScreen) return;
  const pos = getCanvasPointerPos(e);
  world.endScreen.handleClick(pos.x, pos.y);
}

function getCanvasPointerPos(e) {
  const rect = canvas.getBoundingClientRect();
  const scaleX = canvas.width / rect.width;
  const scaleY = canvas.height / rect.height;
  return { x: (e.clientX - rect.left) * scaleX, y: (e.clientY - rect.top) * scaleY };
}
async function requestFullscreen() {
  const el = document.documentElement;

  try {
    if (document.fullscreenElement) {
      await document.exitFullscreen();
      return;
    }

    if (el.requestFullscreen) {
      await el.requestFullscreen();
    }

  } finally {
    if (typeof applyResponsiveLayout === "function") {
      applyResponsiveLayout();
    }
  }
}
