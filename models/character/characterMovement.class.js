/**
 * Handles movement-related intervals for Character (left/right + vertical swim).
 * Keeps the original interval-based movement to avoid behavior changes.
 */
class CharacterMovement {
  /**
   * @param {Character} character
   */
  constructor(character) {
    /** @type {Character} */
    this.character = character;
    /** @type {boolean} */
    this.started = false;
    /** @type {number[]} */
    this.intervalIds = [];
  }

  /** @returns {void} */
  startMovementLoops() {
    if (this.started) return;
    this.started = true;
    this.startHorizontalLoops();
    this.startVerticalLoop();
  }

  /** @returns {void} */
  startHorizontalLoops() {
    this.walkRight();
    this.walkLeft();
  }

  /** @returns {void} */
  walkLeft() {
    this.intervalIds.push(setInterval(() => this.stepLeft(), 70));
  }

  /** @returns {void} */
  walkRight() {
    this.intervalIds.push(setInterval(() => this.stepRight(), 70));
  }

  /** @returns {void} */
  startJumpAnimation() {
    this.intervalIds.push(setInterval(() => this.stepJump(), 115));
  }

  /** @returns {void} */
  startVerticalLoop() {
    this.intervalIds.push(setInterval(() => this.stepVertical(), 70));
  }

  /** @returns {void} */
  stepLeft() {
    const c = this.character;
    if (!this.canMove()) return;
    if (!c.world.input.LEFT || c.x <= 0) return;
    c.x -= c.speed;
    c.otherDirection = true;
    c.world.camera_x = -c.x + 100;
  }

  /** @returns {void} */
  stepRight() {
    const c = this.character;
    if (!this.canMove()) return;
    if (!c.world.input.RIGHT || c.x >= c.world.level.level_end) return;
    c.x += c.speed;
    c.otherDirection = false;
    c.world.camera_x = -c.x + 100;
  }

  /** @returns {void} */
  stepJump() {
    const c = this.character;
    if (!this.canMove()) return;
    if (!c.world.input.UP || c.isAboveGround()) return;
    c.setJumpHeight();
  }

  /** @returns {void} */
  stepVertical() {
    const c = this.character;
    if (!this.canMove()) return;
    const input = c.world.input;
    if (input.UP) c.y -= c.speed;
    if (input.DOWN) c.y += c.speed;
    this.clampYToCanvas();
  }

  /** @returns {void} */
  clampYToCanvas() {
    const c = this.character;
    const h = c.world?.canvas?.height ?? 0;
    if (!h) return;

    const maxY = Math.max(0, h - c.height);
    if (c.y < 0) c.y = 0;
    if (c.y > maxY) c.y = maxY;
  }

  /** @returns {boolean} */
  canMove() {
    const c = this.character;
    if (!c.world) return false;
    if (c.dead() || c.world.endScreen) return false;
    return !c.world.isPaused;
  }

  /** @returns {void} */
  stopMovementLoops() {
    for (const id of this.intervalIds) clearInterval(id);
    this.intervalIds.length = 0;
    this.started = false;
  }
}
