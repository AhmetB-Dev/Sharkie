class Boss extends MovableObject {
  height = 400;
  width = 250;
  y = 60;
  triggerIntro = 4200;

  offset = {
    top: 135,
    left: 15,
    right: 15,
    bottom: 50,
  };

  introPlayed = false;
  introFrame = 0;
  playerInRange = false;

  isActive = false;
  chaseSpeedFactor = 4;
  isAttacking = false;
  attackRange = 150;

  linkAssets() {
    this.ENEMIES_INTRODUCE = EnemyAssets.BOSS_INTRO;
    this.ENEMIES_WALK = EnemyAssets.BOSS_WALK;
    this.ENEMIES_ATTACK = EnemyAssets.BOSS_ATTACK;
    this.ENEMIES_HURT = EnemyAssets.BOSS_HURT;
    this.ENEMIES_DEAD = EnemyAssets.BOSS_DEAD;
  }

  constructor() {
    super();
    this.loadImage("assets/assets_sharkie/2.Enemy/3 Final Enemy/1.Introduce/1.png");
    this.linkAssets();
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

      if (this.playerInRange && !this.introPlayed) {
        this.playIntroOnce();
        return;
      }

      if (!this.playerInRange || !this.introPlayed) {
        return;
      }

      if (this.isAttacking) {
        this.playAnimation(this.ENEMIES_ATTACK);
      } else {
        this.playAnimation(this.ENEMIES_WALK);
      }
    }, 125);
  }

  playIntroOnce() {
    const frames = this.ENEMIES_INTRODUCE;

    if (this.introFrame < 0 || this.introFrame >= frames.length) {
      this.introFrame = 0;
    }

    const path = frames[this.introFrame];
    this.img = this.imageCache[path];

    if (this.introFrame < frames.length - 1) {
      this.introFrame++;
    } else {
      this.introPlayed = true;
    }
  }

  draw(ctx) {
    if (!this.isActive) return;
    super.draw(ctx);
  }

  showHitbox(ctx) {
    if (!this.isActive) return;
    super.showHitbox(ctx);
  }
}
