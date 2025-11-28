class Enemy_Variant02 extends MovableObject {
  y = 370;
  height = 50;
  width = 90;

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

  animationSmallChickenWalk() {
    this.moveLeft();
    // this.moveRight();
    setInterval(() => {
      this.playAnimation(this.ENEMIES_WALK);
    }, 175);
  }

  animationSmallChickenDead() {}
}
