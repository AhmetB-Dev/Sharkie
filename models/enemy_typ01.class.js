class Enemy_Typ01 extends MovableObject {
  y = 300;
  height = 70;
  width = 90;
  isDead = false;
  isAttacking = false;
  deathAnimationDone = false;
  deathFrame = 0;

  constructor() {
    super();
    this.linkAssets();
    this.loadImage(this.ENEMIES_WALK[0]);
    this.loadAssets();
    this.spawnRandomTyp1();
    this.enemySpeedTyp1();
    this.startPatrol(300);
    this.animationTyp1();
    this.otherDirection = true;
    this.groundY = 300;
  }

  linkAssets() {
    this.ENEMIES_WALK = EnemyAssets.TYPE1_WALK;
    this.ENEMIES_ATTACK = EnemyAssets.TYPE1_ATTACK;
    this.ENEMIES_DEAD = EnemyAssets.TYPE1_DEAD;
  }

  loadAssets() {
    this.animationImage(this.ENEMIES_WALK);
    this.animationImage(this.ENEMIES_ATTACK);
    this.animationImage(this.ENEMIES_DEAD);
  }

  animationTyp1() {
    this.animationWalkTyp1();
    this.animationDeadTyp1();
  }

  die() {
    if (this.isDead) return;
    this.isDead = true;
    this.speed = 0;
    this.currentImage = 0;
    this.deathFrame = 0;
    this.deathAnimationDone = false;
  }

  spawnRandomTyp1() {
    const minX = 600;
    const maxX = 1800;
    this.x = minX + Math.random() * (maxX - minX);
    const minY = 150;
    const maxY = 300;
    this.y = minY + Math.random() * (maxY - minY);
  }

  enemySpeedTyp1() {
    this.speed = 0.8 + Math.random() * 1.5;
  }

  updateAI(character) {
    const dx = character.x - this.x;
    const dy = character.y - this.y;
    const distance = Math.sqrt(dx * dx + dy * dy);
    this.isAttacking = distance < 250;

    this.otherDirection = character.x < this.x;
  }

  animationWalkTyp1() {
    setInterval(() => {
      if (this.isDead) {
        return;
      }

      if (this.isAttacking) {
        this.playAnimation(this.ENEMIES_ATTACK);
      } else {
        this.playAnimation(this.ENEMIES_WALK);
      }
    }, 175);
  }

  animationDeadTyp1() {
    setInterval(() => {
      if (!this.isDead || this.deathAnimationDone) {
        return;
      }
      const frames = this.ENEMIES_DEAD;
      if (!frames || frames.length === 0) {
        return;
      }
      if (this.deathFrame < 0 || this.deathFrame >= frames.length) {
        this.deathFrame = frames.length - 1;
      }
      const path = frames[this.deathFrame];
      this.img = this.imageCache[path];
      if (this.deathFrame < frames.length - 1) {
        this.deathFrame++;
      } else {
        this.deathAnimationDone = true;
      }
      this.applyGravity();
    }, 175);
  }
}
