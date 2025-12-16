let canvas, world, input;

const BASE_W = 720;
const BASE_H = 480;
const ROTATE_BREAKPOINT = 900;

function init() {
  canvas = document.getElementById("canvas");
  input = new Input();
  world = new World(canvas, input);
  window.world = world;

  setupResponsive();
  applyResponsiveLayout(); 
  registerEndScreenInput();
}

function setupResponsive() {
  window.addEventListener("resize", applyResponsiveLayout);
  window.addEventListener("orientationchange", applyResponsiveLayout);
}
function restartGame() {
  location.reload();
}

function applyResponsiveLayout() {
  if (!canvas) return;

  const overlay = document.getElementById("rotateOverlay");
  const vw = window.innerWidth;
  const vh = window.innerHeight;

  const scale = Math.min(vw / BASE_W, vh / BASE_H);
  canvas.style.width = `${Math.floor(BASE_W * scale)}px`;
  canvas.style.height = `${Math.floor(BASE_H * scale)}px`;

  const shouldRotate = vw < ROTATE_BREAKPOINT && vh > vw;
  overlay?.classList.toggle("show", shouldRotate);

  if (world) world.isPaused = shouldRotate;
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

  return {
    x: (e.clientX - rect.left) * scaleX,
    y: (e.clientY - rect.top) * scaleY,
  };
}
