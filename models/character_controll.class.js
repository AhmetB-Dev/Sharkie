/**
 * Controller that decides which character animation/action runs based on input and state.
 * Runs in a low-frequency interval (10 FPS) to keep logic simple.
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
  }

  /**
   * Starts the controller update loop (10 FPS).
   * @returns {void}
   */
  start() {
    if (this.intervalId) return;
    this.intervalId = setInterval(() => this.update(), 1000 / 10);
  }

  /**
   * Main controller tick: reads world/input and updates character state.
   * @returns {void}
   */
  update() {
    const character = this.character;
    const world = character.world;
    if (!world || world.endScreen || world.isPaused) return;

    const input = world.input;
    if (!input) return;

    this.updateCharacter(character, input);
  }

  /**
   * Executes state priority order (dead > hurt > ultimate > attack1 > melee > move > idle).
   * @param {Character} character
   * @param {any} input
   * @returns {void}
   */
  updateCharacter(character, input) {
    const idleDurationMs = this.updateIdleState(character);
    if (this.handleDead(character)) return;
    if (this.handleHurt(character)) return;
    if (this.handleUltimate(character, input)) return;
    if (this.handleAttack1(character, input)) return;
    if (this.handleMelee(character, input)) return;
    if (this.handleVerticalMove(character, input)) return;
    if (this.handleHorizontalMove(character, input)) return;
    if (this.handleLongIdle(character, idleDurationMs)) return;
    character.playAnimation(character.IMAGES_IDLE);
  }

  /**
   * Updates lastActionTime and resets long-idle flags when player is active.
   * @param {Character} character
   * @returns {number} Idle duration in milliseconds.
   */
  updateIdleState(character) {
    const now = Date.now();
    if (character.isPlayerActive()) {
      character.lastActionTime = now;
      character.longIdlePlayed = false;
      character.longIdleFrame = 0;
    }
    return now - character.lastActionTime;
  }

  /**
   * Handles death animation and triggers losing end screen.
   * @param {Character} character
   * @returns {boolean} True when handled.
   */
  handleDead(character) {
    if (!character.dead()) return false;

    character.playAnimation(character.IMAGES_DEAD_ANI1);

    if (character.world) {
      character.world.showEndScreen(false);
    }

    return true;
  }

  /**
   * Handles hurt animation (different sets depending on last hit source).
   * @param {Character} character
   * @returns {boolean} True when handled.
   */
  handleHurt(character) {
    if (!character.hitHurt()) return false;

    const hurtFrames = character.lastHitByEnemy1 ? character.IMAGES_HURT_ANI1 : character.IMAGES_HURT_ANI2;

    if (window.audioManager) window.audioManager.play("hitMaker");
    character.playAnimation(hurtFrames);
    return true;
  }

  /**
   * Handles "UP" input (jumping/swim up) animation.
   * @param {Character} character
   * @param {any} input
   * @returns {boolean} True when handled.
   */
  handleVerticalMove(character, input) {
    if (!(input.UP && !character.isAboveGround())) return false;
    character.playAnimation(character.IMAGES_WALK);
    return true;
  }

  /**
   * Handles left/right movement animation.
   * @param {Character} character
   * @param {any} input
   * @returns {boolean} True when handled.
   */
  handleHorizontalMove(character, input) {
    if (!(input.RIGHT || input.LEFT)) return false;
    character.playAnimation(character.IMAGES_WALK);
    return true;
  }

  /**
   * Handles ultimate attack animation and fires bubble on last frame.
   * @param {Character} character
   * @param {any} input
   * @returns {boolean} True when handled.
   */
  handleUltimate(character, input) {
    if (!input.ULTIMATE || character.items <= 0) {
      character.ultimateReady = true;
      return false;
    }

    character.playAnimation(character.IMAGES_UTLIMATE_ATTACK);
    this.handleFrameShot(
      character,
      character.IMAGES_UTLIMATE_ATTACK,
      () => character.shootUltimateBubble(),
      "ultimateReady"
    );
    return true;
  }

  /**
   * Handles attack 1 animation and fires bubble on last frame.
   * @param {Character} character
   * @param {any} input
   * @returns {boolean} True when handled.
   */
  handleAttack1(character, input) {
    if (!input.ATA1) {
      character.attack1Ready = true;
      return false;
    }

    character.playAnimation(character.IMAGES_ATTACK_ANI1);
    this.handleFrameShot(
      character,
      character.IMAGES_ATTACK_ANI1,
      () => character.shootAttack1Bubble(),
      "attack1Ready"
    );
    return true;
  }

  /**
   * Handles melee animation and toggles `hitRange` flag.
   * @param {Character} character
   * @param {any} input
   * @returns {boolean} True when handled.
   */
  handleMelee(character, input) {
    if (!input.ATA2) {
      character.hitRange = false;
      return false;
    }

    character.playAnimation(character.IMAGES_ATTACK_ANI2);
    character.hitRange = true;
    return true;
  }

  /**
   * Handles long idle sequence after `character.delay` milliseconds.
   * @param {Character} character
   * @param {number} idleDurationMs
   * @returns {boolean} True when handled.
   */
  handleLongIdle(character, idleDurationMs) {
    if (idleDurationMs <= character.delay) return false;

    if (!character.longIdlePlayed) {
      character.playLongIdleOnce();
    } else {
      character.playLongIdleTail();
    }
    return true;
  }

  /**
   * Fires a shot once on the last animation frame using a readiness flag.
   * @param {Character} character
   * @param {string[]} animationFrames
   * @param {Function} shootFn
   * @param {string} readyFlagName
   * @returns {void}
   */
  handleFrameShot(character, animationFrames, shootFn, readyFlagName) {
    const currentFrameIndex = (character.currentImage - 1) % animationFrames.length;
    const lastFrameIndex = animationFrames.length - 1;

    if (currentFrameIndex === lastFrameIndex && character[readyFlagName]) {
      shootFn();
      character[readyFlagName] = false;
    }

    if (currentFrameIndex !== lastFrameIndex) character[readyFlagName] = true;
  }
}
