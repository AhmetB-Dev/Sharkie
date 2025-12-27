/**
 * Character controller facade.
 * - Tick loop (10 FPS) decides animations/actions.
 * - Movement loops (interval based) update position/camera.
 */
class CharacterController {
  /**
   * @param {Character} character
   */
  constructor(character) {
    /** @type {Character} */
    this.character = character;
    /** @type {number|null} */
    this.intervalId = null;

    this.lock = new CharacterActionLock(character);
    this.animator = new CharacterAnimator(character, this.lock);
    this.movement = new CharacterMovement(character);
  }

  /** @returns {void} */
  start() {
    if (this.intervalId) return;
    this.intervalId = setInterval(() => this.update(), 1000 / 10);
  }

  /** @returns {void} */
  update() {
    const w = this.character.world;
    if (!w || w.endScreen || w.isPaused) return;
    if (!w.input) return;
    this.animator.tick(w.input);
  }

  /** @returns {void} */
  startMovementLoops() {
    this.movement.startMovementLoops();
  }

  /** @returns {void} */
  walkLeft() {
    this.movement.walkLeft();
  }

  /** @returns {void} */
  walkRight() {
    this.movement.walkRight();
  }

  /** @returns {void} */
  startJumpAnimation() {
    this.movement.startJumpAnimation();
  }

  /** @returns {void} */
  stopMovementLoops() {
    this.movement.stopMovementLoops();
  }
}
