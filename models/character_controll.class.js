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
    const character = this.character;
    const world = character.world;
    if (!world || world.endScreen || world.isPaused) return;

    const input = world.input;
    if (!input) return;

    this.updateCharacter(character, input);
  }

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

  updateIdleState(character) {
    const now = Date.now();
    if (character.isPlayerActive()) {
      character.lastActionTime = now;
      character.longIdlePlayed = false;
      character.longIdleFrame = 0;
    }
    return now - character.lastActionTime;
  }

  handleDead(character) {
    if (!character.dead()) return false;

    character.playAnimation(character.IMAGES_DEAD_ANI1);

    if (character.world) {
      character.world.showEndScreen(false);
    }

    return true;
  }

  handleHurt(character) {
    if (!character.hitHurt()) return false;

    const hurtFrames = character.lastHitByEnemy1 ? character.IMAGES_HURT_ANI1 : character.IMAGES_HURT_ANI2;

    if (window.audioManager) window.audioManager.play("hitMaker");
    character.playAnimation(hurtFrames);
    return true;
  }

  handleVerticalMove(character, input) {
    if (!(input.UP && !character.isAboveGround())) return false;
    character.playAnimation(character.IMAGES_WALK);
    return true;
  }

  handleHorizontalMove(character, input) {
    if (!(input.RIGHT || input.LEFT)) return false;
    character.playAnimation(character.IMAGES_WALK);
    return true;
  }

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

  handleMelee(character, input) {
    if (!input.ATA2) {
      character.hitRange = false;
      return false;
    }

    character.playAnimation(character.IMAGES_ATTACK_ANI2);
    character.hitRange = true;
    return true;
  }

  handleLongIdle(character, idleDurationMs) {
    if (idleDurationMs <= character.delay) return false;

    if (!character.longIdlePlayed) {
      character.playLongIdleOnce();
    } else {
      character.playLongIdleTail();
    }
    return true;
  }

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
