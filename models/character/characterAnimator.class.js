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
    const c = this.character;
    const idleMs = this.updateIdleState(c);

    if (this.handleDead(c)) return;
    if (this.handleHurt(c)) return;
    if (this.lock.tick()) return;
    if (this.handleUltimate(c, input)) return;
    if (this.handleAttack1(c, input)) return;
    if (this.handleMelee(c, input)) return;
    if (this.handleMove(c, input)) return;
    if (this.handleLongIdle(c, idleMs)) return;

    c.playAnimation(c.IMAGES_IDLE);
  }

  /**
   * @param {Character} c
   * @returns {number}
   */
  updateIdleState(c) {
    const now = Date.now();
    if (c.isPlayerActive() || this.lock.has()) this.resetIdle(c, now);
    return now - c.lastActionTime;
  }

  /**
   * @param {Character} c
   * @param {number} now
   * @returns {void}
   */
  resetIdle(c, now) {
    c.lastActionTime = now;
    c.longIdlePlayed = false;
    c.longIdleFrame = 0;
  }

  /** @param {Character} c @returns {boolean} */
  handleDead(c) {
    if (!c.dead()) return false;
    this.lock.cancel();
    c.playAnimation(c.IMAGES_DEAD_ANI1);
    c.world?.showEndScreen?.(false);
    return true;
  }

  /** @param {Character} c @returns {boolean} */
  handleHurt(c) {
    if (!c.hitHurt()) return false;
    this.lock.cancel();

    const frames = c.lastHitByEnemy1 ? c.IMAGES_HURT_ANI1 : c.IMAGES_HURT_ANI2;
    window.audioManager?.play?.("hitMaker");
    c.playAnimation(frames);
    return true;
  }

  /** @param {Character} c @param {any} input @returns {boolean} */
  handleUltimate(c, input) {
    if (!input.ULTIMATE || c.items <= 0) return this.resetUltimateReady(c);
    if (!c.ultimateReady) return false;

    c.ultimateReady = false;
    this.lock.start(c.IMAGES_UTLIMATE_ATTACK, { onLastFrame: () => c.shootUltimateBubble() });
    return true;
  }

  /** @param {Character} c @returns {boolean} */
  resetUltimateReady(c) {
    c.ultimateReady = true;
    return false;
  }

  /** @param {Character} c @param {any} input @returns {boolean} */
  handleAttack1(c, input) {
    if (!input.ATA1) return this.resetAttack1Ready(c);
    if (!c.attack1Ready) return false;

    c.attack1Ready = false;
    this.lock.start(c.IMAGES_ATTACK_ANI1, { onLastFrame: () => c.shootAttack1Bubble() });
    return true;
  }

  /** @param {Character} c @returns {boolean} */
  resetAttack1Ready(c) {
    c.attack1Ready = true;
    return false;
  }

  /** @param {Character} c @param {any} input @returns {boolean} */
  handleMelee(c, input) {
    if (!input.ATA2) return this.resetMelee(c);
    if (!this.meleeReady) return false;

    this.meleeReady = false;
    this.lock.start(c.IMAGES_ATTACK_ANI2, {
      onStart: () => (c.hitRange = true),
      onEnd: () => (c.hitRange = false),
    });
    return true;
  }

  /** @param {Character} c @returns {boolean} */
  resetMelee(c) {
    this.meleeReady = true;
    c.hitRange = false;
    return false;
  }

  /** @param {Character} c @param {any} input @returns {boolean} */
  handleMove(c, input) {
    if (!(input.RIGHT || input.LEFT || input.UP || input.DOWN)) return false;
    c.playAnimation(c.IMAGES_WALK);
    return true;
  }

  /** @param {Character} c @param {number} idleMs @returns {boolean} */
  handleLongIdle(c, idleMs) {
    if (idleMs <= c.delay) return false;
    if (!c.longIdlePlayed) c.playLongIdleOnce();
    else c.playLongIdleTail();
    return true;
  }
}
