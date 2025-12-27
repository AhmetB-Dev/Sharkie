/**
 * Chooses the correct Character animation/action based on input and state.
 * Priority: dead > hurt > locked action > ultimate > attack1 > melee > move > idle.
 */
class CharacterAnimator {
  /**
   * @param {Character} character
   * @param {CharacterActionLock} actionLock
   */
  constructor(character, actionLock) {
    /** @type {Character} */
    this.character = character;
    /** @type {CharacterActionLock} */
    this.lock = actionLock;
    /** @type {boolean} */
    this.meleeReady = true;
  }

  /**
   * @param {any} input
   * @returns {void}
   */
  tick(input) {
    const character = this.character;
    const idleMs = this.updateIdleState(character);

    if (this.handleDead(character)) return;
    if (this.handleHurt(character)) return;
    if (this.lock.tick()) return;
    if (this.handleUltimate(character, input)) return;
    if (this.handleAttack1(character, input)) return;
    if (this.handleMelee(character, input)) return;
    if (this.handleMove(character, input)) return;
    if (this.handleLongIdle(character, idleMs)) return;

    character.playAnimation(character.IMAGES_IDLE);
  }

  /**
   * @param {Character} character
   * @returns {number}
   */
  updateIdleState(character) {
    const now = Date.now();
    if (character.isPlayerActive() || this.lock.has()) this.resetIdle(character, now);
    return now - character.lastActionTime;
  }

  /**
   * @param {Character} character
   * @param {number} now
   * @returns {void}
   */
  resetIdle(character, now) {
    character.lastActionTime = now;
    character.longIdlePlayed = false;
    character.longIdleFrame = 0;
  }

  /** @param {Character} character @returns {boolean} */
  handleDead(character) {
    if (!character.dead()) return false;
    this.lock.cancel();
    character.playAnimation(character.IMAGES_DEAD_ANI1);
    character.world?.showEndScreen?.(false);
    return true;
  }

  /** @param {Character} character @returns {boolean} */
  handleHurt(character) {
    if (!character.hitHurt()) return false;
    this.lock.cancel();

    const frames = character.lastHitByEnemy1 ? character.IMAGES_HURT_ANI1 : character.IMAGES_HURT_ANI2;
    window.audioManager?.play?.("hitMaker");
    character.playAnimation(frames);
    return true;
  }

  /** @param {Character} character @param {any} input @returns {boolean} */
  handleUltimate(character, input) {
    if (!input.ULTIMATE || character.items <= 0) return this.resetUltimateReady(character);
    if (!character.ultimateReady) return false;

    character.ultimateReady = false;
    this.lock.start(character.IMAGES_UTLIMATE_ATTACK, { onLastFrame: () => character.shootUltimateBubble() });
    return true;
  }

  /** @param {Character} character @returns {boolean} */
  resetUltimateReady(character) {
    character.ultimateReady = true;
    return false;
  }

  /** @param {Character} character @param {any} input @returns {boolean} */
  handleAttack1(character, input) {
    if (!input.ATA1) return this.resetAttack1Ready(character);
    if (!character.attack1Ready) return false;

    character.attack1Ready = false;
    this.lock.start(character.IMAGES_ATTACK_ANI1, { onLastFrame: () => character.shootAttack1Bubble() });
    return true;
  }

  /** @param {Character} characterc @returns {boolean} */
  resetAttack1Ready(character) {
    character.attack1Ready = true;
    return false;
  }

  /** @param {Character} character @param {any} input @returns {boolean} */
  handleMelee(character, input) {
    if (!input.ATA2) return this.resetMelee(character);
    if (!this.meleeReady) return false;

    this.meleeReady = false;
    this.lock.start(character.IMAGES_ATTACK_ANI2, {
      onStart: () => (character.hitRange = true),
      onEnd: () => (character.hitRange = false),
    });
    return true;
  }

  /** @param {Character} character @returns {boolean} */
  resetMelee(character) {
    this.meleeReady = true;
    character.hitRange = false;
    return false;
  }

  /** @param {Character} character @param {any} input @returns {boolean} */
  handleMove(character, input) {
    if (!(input.RIGHT || input.LEFT || input.UP || input.DOWN)) return false;
    character.playAnimation(character.IMAGES_WALK);
    return true;
  }

  /** @param {Character} character @param {number} idleMs @returns {boolean} */
  handleLongIdle(character, idleMs) {
    if (idleMs <= character.delay) return false;
    if (!character.longIdlePlayed) character.playLongIdleOnce();
    else character.playLongIdleTail();
    return true;
  }
}
