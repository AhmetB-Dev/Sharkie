class Input extends MovableObject {
  LEFT = false;
  RIGHT = false;
  UP = false;
  THROW = false;
  ATA1 = false;
  ATA2 = false;
  ULTIMATE = false;

  static active = null;
  static _installed = false;

  attachKeyboard() {
    Input.active = this;
    window.input = this; 
    Input.installOnce();
  }

  static installOnce() {
    if (Input._installed) return;
    Input._installed = true;

    window.addEventListener("keydown", (e) => Input.onKey(e, true));
    window.addEventListener("keyup", (e) => Input.onKey(e, false));
  }

  static onKey(e, down) {
    const i = Input.active || window.input;
    if (!i) return;

    const key = e.key;
    const k = key.toLowerCase();

    if (k === "d" || k === "arrowright") i.RIGHT = down;
    if (k === "a" || k === "arrowleft") i.LEFT = down;
    if (k === "w" || k === "arrowup") i.UP = down;

    if (k === "k" || k === "x") i.ATA1 = down;
    if (k === "j" || k === "y" || key === "z") i.ATA2 = down;
    if (k === "l" || k === "c") i.ULTIMATE = down;
  }
}
