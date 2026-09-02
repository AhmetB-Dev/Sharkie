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
    const character = this.character;
    if (!this.canMove()) return;
    if (!character.world.input.LEFT || character.x <= 0) return;
    character.x -= character.speed;
    character.otherDirection = true;
    character.world.camera_x = -character.x + 100;
  }

  /** @returns {void} */
  stepRight() {
    const character = this.character;
    if (!this.canMove()) return;
    if (!character.world.input.RIGHT || character.x >= character.world.level.level_end) return;
    character.x += character.speed;
    character.otherDirection = false;
    character.world.camera_x = -character.x + 100;
  }

  /** @returns {void} */
  stepJump() {
    const character = this.character;
    if (!this.canMove()) return;
    if (!character.world.input.UP || character.isAboveGround()) return;
    character.setJumpHeight();
  }

  /** @returns {void} */
  stepVertical() {
    const character = this.character;
    if (!this.canMove()) return;
    const input = character.world.input;
    if (input.UP) character.y -= character.speed;
    if (input.DOWN) character.y += character.speed;
    this.clampYToCanvas();
  }

  /** @returns {void} */
  clampYToCanvas() {
    const character = this.character;
    const characterHeight = character.world?.canvas?.height ?? 0;
    if (!characterHeight) return;

    const maxY = Math.max(0, characterHeight - character.height);
    if (character.y < 0) character.y = 0;
    if (character.y > maxY) character.y = maxY;
  }

  /** @returns {boolean} */
  canMove() {
    const character = this.character;
    if (!character.world) return false;
    if (character.dead() || character.world.endScreen) return false;
    return !character.world.isPaused;
  }

  /** @returns {void} */
  stopMovementLoops() {
    for (const id of this.intervalIds) clearInterval(id);
    this.intervalIds.length = 0;
    this.started = false;
  }
}
