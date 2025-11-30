class Enemy_Variant02 extends MovableObject {
  y = 300;
  height = 60;
  width = 90;

  isDead = false;
  isAttacking = false;

  ENEMIES_WALK = [
    "assets/assets_sharkie/2.Enemy/2 Jelly fish/Regular damage/Yellow 1.png",
    "assets/assets_sharkie/2.Enemy/2 Jelly fish/Regular damage/Yellow 2.png",
    "assets/assets_sharkie/2.Enemy/2 Jelly fish/Regular damage/Yellow 3.png",
    "assets/assets_sharkie/2.Enemy/2 Jelly fish/Regular damage/Yellow 4.png",
  ];

  ENEMIES_ATTACK = [
    "assets/assets_sharkie/2.Enemy/2 Jelly fish/Súper dangerous/Green 1.png",
    "assets/assets_sharkie/2.Enemy/2 Jelly fish/Súper dangerous/Green 2.png",
    "assets/assets_sharkie/2.Enemy/2 Jelly fish/Súper dangerous/Green 3.png",
    "assets/assets_sharkie/2.Enemy/2 Jelly fish/Súper dangerous/Green 4.png",
  ];

  ENEMIES_DEAD = [
    "assets/assets_sharkie/2.Enemy/2 Jelly fish/Dead/Yellow/y1.png",
    "assets/assets_sharkie/2.Enemy/2 Jelly fish/Dead/Yellow/y2.png",
    "assets/assets_sharkie/2.Enemy/2 Jelly fish/Dead/Yellow/y3.png",
    "assets/assets_sharkie/2.Enemy/2 Jelly fish/Dead/Yellow/y4.png",
  ];

  constructor() {
    super().loadImage("assets/assets_sharkie/2.Enemy/2 Jelly fish/Regular damage/Yellow 1.png");
    this.loadAssets();
    this.animationSmallChicken();
    this.spawnSmallChickenRandom();
    this.smallChickenSpeed();
  }

  loadAssets() {
    this.animationImage(this.ENEMIES_WALK);
    this.animationImage(this.ENEMIES_ATTACK);
    this.animationImage(this.ENEMIES_DEAD);
  }

  animationSmallChicken() {
    this.animationSmallChickenWalk();
    this.animationSmallChickenDead();
  }

  spawnSmallChickenRandom() {
    this.x = 300 + Math.random() * 800;
  }

  smallChickenSpeed() {
    this.speed = 0.8 + Math.random() * 1.5;
  }

  die() {
    if (this.isDead) return;
    this.isDead = true;
    this.speed = 0;
    this.currentImage = 0;
  }

  updateAI(character) {
    const dx = character.x - this.x;
    const dy = character.y - this.y;
    const distance = Math.sqrt(dx * dx + dy * dy);

    this.isAttacking = distance < 250;

    this.otherDirection = character.x < this.x;
  }

  animationSmallChickenWalk() {
    this.moveLeft();

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

  animationSmallChickenDead() {
    setInterval(() => {
      if (this.isDead) {
        this.playAnimation(this.ENEMIES_DEAD);
      }
    }, 175);
  }
}
