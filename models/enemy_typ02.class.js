class Enemy_Typ02 extends MovableObject {
  y = 300;
  height = 60;
  width = 90;
  isDead = false;
  isAttacking = false;
  isHittingPlayer = false;

  constructor() {
    super();
    this.linkAssets();
    this.loadImage(this.ENEMIES_WALK[0]);
    this.loadAssets();
    this.animationTyp2();
    this.spawnTyp2Random();
    this.enemySpeedTyp2();
    this.startPatrol(250);
  }
  linkAssets() {
    this.ENEMIES_WALK = EnemyAssets.TYPE2_WALK;
    this.ENEMIES_ATTACK = EnemyAssets.TYPE2_ATTACK;
    this.ENEMIES_DEAD = EnemyAssets.TYPE2_DEAD;
  }
  loadAssets() {
    this.animationImage(this.ENEMIES_WALK);
    this.animationImage(this.ENEMIES_ATTACK);
    this.animationImage(this.ENEMIES_DEAD);
  }

  animationTyp2() {
    this.animationWalktyp2();
    this.animationDeadtyp2();
  }

  spawnTyp2Random() {
    const minX = 1950;
    const maxX = 2600;
    this.x = minX + Math.random() * (maxX - minX);

    const minY = 150;
    const maxY = 300;
    this.y = minY + Math.random() * (maxY - minY);
  }

  enemySpeedTyp2() {
    this.speed = 0.8 + Math.random() * 1.5;
  }

  die() {
    if (this.isDead) return;
    this.isDead = true;
    this.speed = 0;
    this.currentImage = 0;
    this.width = 50;
    this.height = 80;
  }

  startHitAnimation() {
    this.isHittingPlayer = true;
    setTimeout(() => {
      this.isHittingPlayer = false;
    }, 150);
  }

  updateAI(character) {
    const dx = character.x - this.x;
    const dy = character.y - this.y;
    const distance = Math.sqrt(dx * dx + dy * dy);
    this.isAttacking = distance < 250;
  }

  animationWalktyp2() {
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

  animationDeadtyp2() {
    setInterval(() => {
      if (this.isDead) {
        this.playAnimation(this.ENEMIES_DEAD);
      }
    }, 175);
  }
}
