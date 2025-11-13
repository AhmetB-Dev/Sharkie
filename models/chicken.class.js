class Chicken extends MovableObject {
  y = 370;
  height = 50;
  width = 90;

  ENEMIES_WALK = [
    "assets/img_pollo_locco/img/3_enemies_chicken/chicken_normal/1_walk/1_w.png",
    "assets/img_pollo_locco/img/3_enemies_chicken/chicken_normal/1_walk/2_w.png",
    "assets/img_pollo_locco/img/3_enemies_chicken/chicken_normal/1_walk/3_w.png",
  ];

  ENEMIES_DEAD = ["assets/img_pollo_locco/img/3_enemies_chicken/chicken_normal/2_dead/dead.png"];

  constructor() {
    super().loadImage("assets/img_pollo_locco/img/3_enemies_chicken/chicken_normal/1_walk/1_w.png");
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
