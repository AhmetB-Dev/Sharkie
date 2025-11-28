class Enemy_Variant01 extends MovableObject {
  y = 370;
  height = 50;
  width = 90;

  ENEMIES_WALK = [
    "assets/assets_sharkie/2.Enemy/1.Puffer fish (3 color options)/1.Swim/3.swim1.png",
    "assets/assets_sharkie/2.Enemy/1.Puffer fish (3 color options)/1.Swim/3.swim3.png",
    "assets/assets_sharkie/2.Enemy/1.Puffer fish (3 color options)/1.Swim/3.swim2.png",
    "assets/assets_sharkie/2.Enemy/1.Puffer fish (3 color options)/1.Swim/3.swim4.png",
    "assets/assets_sharkie/2.Enemy/1.Puffer fish (3 color options)/1.Swim/3.swim5.png",
  ];

  ENEMIES_ATTACK = [
    "assets/assets_sharkie/2.Enemy/1.Puffer fish (3 color options)/3.Bubbleeswim/3.bubbleswim1.png",
    "assets/assets_sharkie/2.Enemy/1.Puffer fish (3 color options)/3.Bubbleeswim/3.bubbleswim2.png",
    "assets/assets_sharkie/2.Enemy/1.Puffer fish (3 color options)/3.Bubbleeswim/3.bubbleswim4.png",
    "assets/assets_sharkie/2.Enemy/1.Puffer fish (3 color options)/3.Bubbleeswim/3.bubbleswim3.png",
    "assets/assets_sharkie/2.Enemy/1.Puffer fish (3 color options)/3.Bubbleeswim/3.bubbleswim5.png",
  ];

  ENEMIES_DEAD = [
    "assets/assets_sharkie/2.Enemy/1.Puffer fish (3 color options)/4.DIE/3.2.png",
    "assets/assets_sharkie/2.Enemy/1.Puffer fish (3 color options)/4.DIE/3.3.png",
    "assets/assets_sharkie/2.Enemy/1.Puffer fish (3 color options)/4.DIE/3.png",
  ];

  constructor() {
    super().loadImage("assets/assets_sharkie/2.Enemy/1.Puffer fish (3 color options)/1.Swim/3.swim1.png");
    this.loadAssets();
    this.animationChicken();
    this.spawnChickenRandom();
    this.chickenSpeed();
  }

  loadAssets() {
    this.animationImage(this.ENEMIES_WALK);
    this.animationImage(this.ENEMIES_DEAD);
  }

  animationChicken() {
    this.animationChickenWalk();
    this.animationChickenDead();
  }

  spawnChickenRandom() {
    this.x = 300 + Math.random() * 700;
  }

  chickenSpeed() {
    this.speed = 0.8 + Math.random() * 1.5;
  }

  animationChickenWalk() {
    this.moveLeft();
    // this.moveRight();
    setInterval(() => {
      this.playAnimation(this.ENEMIES_WALK);
    }, 175);
  }

  animationChickenDead() {}
}
