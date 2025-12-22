// touchButton.class.js

class TouchButton {
  constructor({ action, hold = true, imgSrc = null, pulseMs = 550, shape = "circle" }) {
    this.action = action;
    this.hold = hold;
    this.shape = shape;

    this.pressed = false;
    this.pulseMs = pulseMs;
    this.pulseTimer = null;

    this.x = 0;
    this.y = 0;
    this.size = 64;

    this.img = imgSrc ? new Image() : null;
    if (this.img) this.img.src = imgSrc;
  }

  setRect(x, y, size) {
    this.x = x;
    this.y = y;
    this.size = size;
  }

  contains(px, py) {
    if (this.shape !== "circle") {
      return px >= this.x && px <= this.x + this.size && py >= this.y && py <= this.y + this.size;
    }
    const cx = this.x + this.size / 2;
    const cy = this.y + this.size / 2;
    const r = this.size / 2;
    const dx = px - cx;
    const dy = py - cy;
    return dx * dx + dy * dy <= r * r;
  }

  press(input) {
    if (this.pressed) return;
    this.pressed = true;

    if (this.hold) {
      input[this.action] = true;
      return;
    }

    input[this.action] = true;
    clearTimeout(this.pulseTimer);

    this.pulseTimer = setTimeout(() => {
      input[this.action] = false;
      this.pressed = false;
    }, this.pulseMs);
  }

  release(input) {
    if (!this.pressed) return;

    if (this.hold) {
      this.pressed = false;
      input[this.action] = false;
      return;
    }

    this.pressed = false;
  }

  draw(ctx) {
    if (!this.img) return;

    ctx.save();
    ctx.globalAlpha = this.pressed ? 0.95 : 0.75;

    if (this.img.complete) {
      ctx.drawImage(this.img, this.x, this.y, this.size, this.size);
    }

    ctx.restore();
  }
}

class TouchControls {
  constructor(world) {
    this.world = world;
    this.canvas = world.canvas;
    this.input = world.input;

    this.active = new Map();

    this.enabled = true;
    this.TOUCH_MAX = 1024;

    const BASE = "assets/assets_sharkie/6.Botones/mobile_controls/";
    this.buttons = {
      left: new TouchButton({ action: "LEFT", hold: true, imgSrc: BASE + "touch_move_left_circle.png" }),
      right: new TouchButton({ action: "RIGHT", hold: true, imgSrc: BASE + "touch_move_right_circle.png" }),
      up: new TouchButton({ action: "UP", hold: true, imgSrc: BASE + "touch_jump_circle.png" }),

      atk1: new TouchButton({
        action: "ATA1",
        hold: false,
        pulseMs: 650,
        imgSrc: BASE + "touch_attack_bubbleshot_circle.png",
      }),
      melee: new TouchButton({ action: "ATA2", hold: true, imgSrc: BASE + "touch_melee_circle.png" }),
      ult: new TouchButton({
        action: "ULTIMATE",
        hold: false,
        pulseMs: 900,
        imgSrc: BASE + "touch_attack_ultimate_bubble_no_cross.png",
      }),
    };
  }

  setEnabled(on) {
    const next = !!on;
    if (this.enabled === next) return;
    this.enabled = next;
    if (!next) this.clearAll(); 
  }

  shouldShow() {
    const coarse = window.matchMedia && window.matchMedia("(pointer:coarse)").matches;
    const smallEnough = Math.min(window.innerWidth, window.innerHeight) <= this.TOUCH_MAX;
    return this.enabled && coarse && smallEnough;
  }

  layout() {
    const w = this.canvas.width;
    const h = this.canvas.height;

    const size = Math.round(Math.min(w, h) * 0.13);
    const pad = Math.round(size * 0.35);
    const yBase = h - size - pad;

    const xL = pad;
    this.buttons.left.setRect(xL, yBase, size);
    this.buttons.right.setRect(xL + size + pad * 0.7, yBase, size);
    this.buttons.up.setRect(xL + Math.round((size + pad * 0.7) / 2), yBase - size - pad * 0.6, size);

    const xR = w - size - pad;
    this.buttons.atk1.setRect(xR, yBase, size);
    this.buttons.melee.setRect(xR - size - pad * 0.7, yBase + Math.round(size * 0.08), size);
    this.buttons.ult.setRect(xR, yBase - size - pad * 0.6, size);
  }

  draw(ctx) {
    if (!this.shouldShow()) return;
    if (this.world.endScreen) return;

    this.layout();
    Object.values(this.buttons).forEach((b) => b.draw(ctx));
  }

  pointerDown(x, y, pointerId) {
    if (!this.shouldShow()) return;
    if (this.world.isPaused || this.world.endScreen) return;

    const btn = this.findButton(x, y);
    if (!btn) return;

    btn.press(this.input);
    this.active.set(pointerId, btn);
  }

  pointerMove(x, y, pointerId) {
    const current = this.active.get(pointerId);
    if (!current) return;

    const next = this.findButton(x, y);
    if (next === current) return;

    current.release(this.input);
    this.active.delete(pointerId);

    if (next) {
      next.press(this.input);
      this.active.set(pointerId, next);
    }
  }

  pointerUp(pointerId) {
    const btn = this.active.get(pointerId);
    if (!btn) return;

    btn.release(this.input);
    this.active.delete(pointerId);
  }

  findButton(x, y) {
    return Object.values(this.buttons).find((b) => b.contains(x, y)) || null;
  }

  clearAll() {
    this.active.forEach((btn) => btn.release(this.input));
    this.active.clear();
  }
}
