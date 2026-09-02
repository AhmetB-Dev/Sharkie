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
    this.intervalId = this.character.timers.every(() => this.update(), 1000 / 10);
  }

  /**
   * Stops the controller tick loop.
   * @returns {void}
   */
  stop() {
    if (!this.intervalId) return;
    clearInterval(this.intervalId);
    this.intervalId = null;
  }
  
  /** @returns {void} */
  update() {
    const world = this.character.world;
    if (!world || world.endScreen || world.isPaused) return;
    if (!world.input) return;
    this.animator.tick(world.input);
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
