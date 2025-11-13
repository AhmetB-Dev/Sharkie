class SmallChicken extends MovableObject {
  y = 370;
  height = 50;
  width = 90;

  ENEMIES_WALK = [
    "assets/img_pollo_locco/img/3_enemies_chicken/chicken_small/1_walk/1_w.png",
    "assets/img_pollo_locco/img/3_enemies_chicken/chicken_small/1_walk/2_w.png",
    "assets/img_pollo_locco/img/3_enemies_chicken/chicken_small/1_walk/3_w.png",
  ];

  ENEMIES_DEAD = ["assets/img_pollo_locco/img/3_enemies_chicken/chicken_small/2_dead/dead.png"];

  constructor() {
    super().loadImage("assets/img_pollo_locco/img/3_enemies_chicken/chicken_small/1_walk/1_w.png");
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
