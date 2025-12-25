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

    window.addEventListener("keydown", (event) => Input.onKey(event, true));
    window.addEventListener("keyup", (event) => Input.onKey(event, false));
  }

  static onKey(event, isDown) {
    const input = Input.getActiveInput();
    if (!input) return;

    const key = event.key;
    const keyLower = key.toLowerCase();

    Input.handleMoveKeys(input, keyLower, isDown);
    Input.handleAttackKeys(input, keyLower, key, isDown);
  }

  static getActiveInput() {
    return Input.active || window.input || null;
  }

  static handleMoveKeys(input, keyLower, isDown) {
    if (keyLower === "d" || keyLower === "arrowright") input.RIGHT = isDown;
    if (keyLower === "a" || keyLower === "arrowleft") input.LEFT = isDown;
    if (keyLower === "w" || keyLower === "arrowup") input.UP = isDown;
  }

  static handleAttackKeys(input, keyLower, key, isDown) {
    if (keyLower === "k" || keyLower === "x") input.ATA1 = isDown;
    if (keyLower === "j" || keyLower === "y" || key === "z") input.ATA2 = isDown;
    if (keyLower === "l" || keyLower === "c") input.ULTIMATE = isDown;
  }
}
