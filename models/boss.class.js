class Boss extends MovableObject {
  height = 400;
  width = 250;
  y = 60;
  attackRange = 150;
  introFrame = 0;
  triggerIntro = 4200;
  chaseSpeedFactor = 4;
  introPlayed = false;
  playerInRange = false;
  isActive = false;
  isAttacking = false;
  isDead = false;

  isDamageWindow = false;

  linkAssets() {
    this.ENEMIES_INTRODUCE = EnemyAssets.BOSS_INTRO;
    this.ENEMIES_WALK = EnemyAssets.BOSS_WALK;
    this.ENEMIES_ATTACK = EnemyAssets.BOSS_ATTACK;
    this.ENEMIES_HURT = EnemyAssets.BOSS_HURT;
    this.ENEMIES_DEAD = EnemyAssets.BOSS_DEAD;
  }

  constructor() {
    super();
    this.linkAssets();
    this.loadImage(this.ENEMIES_INTRODUCE[0]);
    this.loadAssets();
    this.animationBoss();
    this.bossSpeed();

    this.x = 4500;
  }

  loadAssets() {
    this.animationImage(this.ENEMIES_INTRODUCE);
    this.animationImage(this.ENEMIES_WALK);
    this.animationImage(this.ENEMIES_ATTACK);
    this.animationImage(this.ENEMIES_HURT);
    this.animationImage(this.ENEMIES_DEAD);
  }

  bossSpeed() {
    this.speed = 0.8 + Math.random() * 5.5;
  }

  followCharacter(character) {
    if (this.isDead || this.dead()) return;
    const dx = character.x - this.x;
    const dy = character.y - this.y;
    const distance = Math.sqrt(dx * dx + dy * dy);

    if (distance === 0) {
      this.isAttacking = true;
      return;
    }

    const nx = dx / distance;
    const ny = dy / distance;
    const step = this.speed * this.chaseSpeedFactor;

    if (distance < 5) {
      this.otherDirection = dx < 0;
      this.isAttacking = true;
      return;
    }
    this.x += nx * step;

    if (character.y < this.y) {
      this.y += ny * step;
    }

    this.otherDirection = dx > 0;
    this.isAttacking = distance < this.attackRange;
  }

  animationBoss() {
    setInterval(() => {
      if (!this.isActive) {
        return;
      }

      if (this.isDead || this.dead()) {
        this.playDeathAnimation();
        return;
      }

      if (this.hitHurt()) {
        this.playAnimation(this.ENEMIES_HURT);
        return;
      }

      if (this.playerInRange && !this.introPlayed) {
        this.playIntroOnce();
        return;
      }

      if (!this.playerInRange || !this.introPlayed) {
        return;
      }

      if (this.isAttacking) {
        this.playAnimation(this.ENEMIES_ATTACK);
        this.updateAttackDamageWindow();
      } else {
        this.playAnimation(this.ENEMIES_WALK);
        this.inDamageWindow = false;Schaden
      }
    }, 125);
  }

  die() {
    if (this.isDead) return;

    this.isDead = true;
    this.speed = 0;
    this.isAttacking = false;
    this.deathFrame = 0;
    this.deathAnimationDone = false;
  }

  playIntroOnce() {
    const frames = this.ENEMIES_INTRODUCE;

    if (this.introFrame < 0 || this.introFrame >= frames.length) {
      this.introFrame = frames.length - 1;
      this.introPlayed = true;
      return;
    }

    const path = frames[this.introFrame];
    this.img = this.imageCache[path];

    if (this.introFrame < frames.length - 1) {
      this.introFrame++;
    } else {
      this.introPlayed = true;
    }

    if (window.audioManager) window.audioManager.play("bossIntro");
  }

  playDeathAnimation() {
    const frames = this.ENEMIES_DEAD;

    if (this.deathAnimationDone) {
      const lastFrame = frames[frames.length - 1];
      this.img = this.imageCache[lastFrame];
      return;
    }

    if (this.deathFrame < 0 || this.deathFrame >= frames.length) {
      this.deathFrame = frames.length - 1;
      this.deathAnimationDone = true;
      this.img = this.imageCache[frames[this.deathFrame]];
      return;
    }
    if (window.audioManager) window.audioManager.play("enemyDeath");

    const path = frames[this.deathFrame];
    this.img = this.imageCache[path];

    if (this.deathFrame < frames.length - 1) {
      this.deathFrame++;
    } else {
      this.deathAnimationDone = true;
    }
  }

  updateAttackDamageWindow() {
    const frames = this.ENEMIES_ATTACK;
    if (!frames || frames.length === 0) {
      this.inDamageWindow = false;
      return;
    }
    const currentFrameIndex = (this.currentImage - 1) % frames.length;
    const lastFrameIndex = frames.length - 1;

    this.inDamageWindow = currentFrameIndex === lastFrameIndex;
  }

  canDamagePlayer() {
    return this.isActive && !this.isDead && !this.dead() && this.isAttacking && this.inDamageWindow;
  }

  draw(ctx) {
    if (!this.isActive) return;
    super.draw(ctx);
  }

  showHitbox(ctx) {
    if (!this.isActive) return;
    super.showHitbox(ctx);
  }

  offset = {
    top: 135,
    left: -20,
    right: 15,
    bottom: 50,
  };
}
