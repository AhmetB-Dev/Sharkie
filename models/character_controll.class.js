class CharacterController {
  constructor(character) {
    this.character = character;
    this.intervalId = null;
  }

  start() {
    if (this.intervalId) return;
    this.intervalId = setInterval(() => this.update(), 1000 / 10);
  }

  update() {
    const c = this.character;
    const world = c.world;
    if (!world || world.endScreen || world.isPaused) return;

    const input = c.world && c.world.input;
    if (!input) return;

    this.updateCharacter(c, input);
  }

  updateCharacter(c, input) {
    const idleTime = this.updateIdleState(c);
    if (this.handleDead(c)) return;
    if (this.handleHurt(c)) return;
    if (this.handleUltimate(c, input)) return;
    if (this.handleAttack1(c, input)) return;
    if (this.handleMelee(c, input)) return;
    if (this.handleVerticalMove(c, input)) return;
    if (this.handleHorizontalMove(c, input)) return;
    if (this.handleLongIdle(c, idleTime)) return;
    c.playAnimation(c.IMAGES_IDLE);
  }

  updateIdleState(c) {
    const now = Date.now();
    if (c.isPlayerActive()) {
      c.lastActionTime = now;
      c.longIdlePlayed = false;
      c.longIdleFrame = 0;
    }
    return now - c.lastActionTime;
  }

  handleDead(c) {
    if (!c.dead()) return false;

    c.playAnimation(c.IMAGES_DEAD_ANI1);

    if (c.world) {
      c.world.showEndScreen(false);
    }

    return true;
  }

  handleHurt(c) {
    if (!c.hitHurt()) return false;

    const frames = c.lastHitByEnemy1 ? c.IMAGES_HURT_ANI1 : c.IMAGES_HURT_ANI2;

    if (window.audioManager) window.audioManager.play("hitMaker");
    c.playAnimation(frames);
    return true;
  }

  handleVerticalMove(c, input) {
    if (!(input.UP && !c.isAboveGround())) return false;
    c.playAnimation(c.IMAGES_WALK);
    return true;
  }

  handleHorizontalMove(c, input) {
    if (!(input.RIGHT || input.LEFT)) return false;
    c.playAnimation(c.IMAGES_WALK);
    return true;
  }

  handleUltimate(c, input) {

    if (!input.ULTIMATE || c.items <= 0) {
      c.ultimateReady = true;
      return false;
    }

    c.playAnimation(c.IMAGES_UTLIMATE_ATTACK);
    this.handleFrameShot(c, c.IMAGES_UTLIMATE_ATTACK, () => c.shootUltimateBubble(), "ultimateReady");
    return true;
  }
  handleAttack1(c, input) {
    if (!input.ATA1) {
      c.attack1Ready = true;
      return false;
    }
    c.playAnimation(c.IMAGES_ATTACK_ANI1);
    this.handleFrameShot(c, c.IMAGES_ATTACK_ANI1, () => c.shootAttack1Bubble(), "attack1Ready");
    return true;
  }

  handleMelee(c, input) {
    if (!input.ATA2) {
      c.hitRange = false;
      return false;
    }
    c.playAnimation(c.IMAGES_ATTACK_ANI2);
    c.hitRange = true;
    return true;
  }

  handleLongIdle(c, idleTime) {
    if (idleTime <= c.delay) return false;
    if (!c.longIdlePlayed) {
      c.playLongIdleOnce();
    } else {
      c.playLongIdleTail();
    }
    return true;
  }

  handleFrameShot(c, frames, shootFn, readyFlag) {
    const idx = (c.currentImage - 1) % frames.length;
    const last = frames.length - 1;

    if (idx === last && c[readyFlag]) {
      shootFn();
      c[readyFlag] = false;
    }

    if (idx !== last) c[readyFlag] = true;
  }
}
