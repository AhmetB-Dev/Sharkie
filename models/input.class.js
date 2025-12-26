/**
 * Input state holder (keyboard -> boolean flags).
 * Uses static singleton-like access via `Input.active` and `window.input`.
 * @extends MovableObject
 */
class Input extends MovableObject {
  /** @type {boolean} */ LEFT = false;
  /** @type {boolean} */ RIGHT = false;
  /** @type {boolean} */ UP = false;
  /** @type {boolean} */ DOWN = false;
  /** @type {boolean} */ THROW = false;
  /** @type {boolean} */ ATA1 = false;
  /** @type {boolean} */ ATA2 = false;
  /** @type {boolean} */ ULTIMATE = false;

  /** @type {Input|null} */
  static active = null;
  /** @type {boolean} */
  static _installed = false;

  /** @type {number} */
  static ATTACK_PULSE_MS = 180;

  /**
   * Registers this instance as active input and installs keyboard listeners once.
   * @returns {void}
   */
  attachKeyboard() {
    Input.active = this;
    window.input = this;
    Input.installOnce();
  }

  /**
   * Installs global keydown/keyup listeners once.
   * @returns {void}
   */
  static installOnce() {
    if (Input._installed) return;
    Input._installed = true;

    window.addEventListener("keydown", (event) => Input.onKey(event, true));
    window.addEventListener("keyup", (event) => Input.onKey(event, false));
  }

  /**
   * Main key handler; routes to move/attack key mapping.
   * @param {KeyboardEvent} event
   * @param {boolean} isDown
   * @returns {void}
   */

  /**
   * Sets a flag to true for a short time so taps are not missed by the 10 FPS controller.
   * @param {Input} input
   * @param {"ATA1"|"ATA2"|"ULTIMATE"} flagName
   * @param {number} durationMs
   * @returns {void}
   */
  static pulseFlag(input, flagName, durationMs) {
    input._pulseTimers = input._pulseTimers || {};
    clearTimeout(input._pulseTimers[flagName]);
    input[flagName] = true;
    input._pulseTimers[flagName] = setTimeout(() => (input[flagName] = false), durationMs);
  }

  static onKey(event, isDown) {
    const input = Input.getActiveInput();
    if (!input) return;

    const key = event.key;
    const keyLower = key.toLowerCase();

    // Prevent arrow keys / space from scrolling the page while playing.
    if (["arrowup", "arrowdown", "arrowleft", "arrowright", " "].includes(keyLower) || key === " ") {
      event.preventDefault();
    }

    Input.handleMoveKeys(input, keyLower, key, isDown);
    Input.handleAttackKeys(input, keyLower, key, isDown, event.repeat);
  }

  /**
   * Returns the active input instance (static or global).
   * @returns {Input|null}
   */
  static getActiveInput() {
    return Input.active || window.input || null;
  }

  /**
   * Maps movement keys to flags.
   * @param {Input} input
   * @param {string} keyLower
   * @param {string} key
   * @param {boolean} isDown
   * @returns {void}
   */
  static handleMoveKeys(input, keyLower, key, isDown) {
    if (keyLower === "d" || keyLower === "arrowright") input.RIGHT = isDown;
    if (keyLower === "a" || keyLower === "arrowleft") input.LEFT = isDown;
    if (keyLower === "w" || keyLower === "arrowup") input.UP = isDown;
    if (keyLower === "s" || keyLower === "arrowdown") input.DOWN = isDown;
    if (key === " " || keyLower === "spacebar") input.SPACE = isDown;
  }

  /**
   * Maps attack keys to flags.
   * @param {Input} input
   * @param {string} keyLower
   * @param {string} key
   * @param {boolean} isDown
   * @returns {void}
   */
  static handleAttackKeys(input, keyLower, key, isDown, isRepeat) {
    if (!isDown) return;
    if (isRepeat) return;

    if (keyLower === "k" || keyLower === "x") Input.pulseFlag(input, "ATA1", Input.ATTACK_PULSE_MS);
    if (keyLower === "j" || keyLower === "y" || key === "z")
      Input.pulseFlag(input, "ATA2", Input.ATTACK_PULSE_MS);
    if (keyLower === "l" || keyLower === "c") Input.pulseFlag(input, "ULTIMATE", Input.ATTACK_PULSE_MS);
  }
}
