class Character extends MovableObject {
  world;
  height = 270;
  width = 140;
  y = 155;
  speed = 233;

  IMAGES_IDLE = [
    "assets/img_pollo_locco/img/2_character_pepe/1_idle/idle/I-1.png",
    "assets/img_pollo_locco/img/2_character_pepe/1_idle/idle/I-2.png",
    "assets/img_pollo_locco/img/2_character_pepe/1_idle/idle/I-4.png",
    "assets/img_pollo_locco/img/2_character_pepe/1_idle/idle/I-3.png",
    "assets/img_pollo_locco/img/2_character_pepe/1_idle/idle/I-5.png",
    "assets/img_pollo_locco/img/2_character_pepe/1_idle/idle/I-6.png",
    "assets/img_pollo_locco/img/2_character_pepe/1_idle/idle/I-7.png",
    "assets/img_pollo_locco/img/2_character_pepe/1_idle/idle/I-9.png",
    "assets/img_pollo_locco/img/2_character_pepe/1_idle/idle/I-8.png",
    "assets/img_pollo_locco/img/2_character_pepe/1_idle/idle/I-10.png",
  ];

  IMAGES_LONG_IDLE = [
    "assets/img_pollo_locco/img/2_character_pepe/1_idle/long_idle/I-11.png",
    "assets/img_pollo_locco/img/2_character_pepe/1_idle/long_idle/I-12.png",
    "assets/img_pollo_locco/img/2_character_pepe/1_idle/long_idle/I-13.png",
    "assets/img_pollo_locco/img/2_character_pepe/1_idle/long_idle/I-14.png",
    "assets/img_pollo_locco/img/2_character_pepe/1_idle/long_idle/I-15.png",
    "assets/img_pollo_locco/img/2_character_pepe/1_idle/long_idle/I-16.png",
    "assets/img_pollo_locco/img/2_character_pepe/1_idle/long_idle/I-17.png",
    "assets/img_pollo_locco/img/2_character_pepe/1_idle/long_idle/I-18.png",
    "assets/img_pollo_locco/img/2_character_pepe/1_idle/long_idle/I-19.png",
    "assets/img_pollo_locco/img/2_character_pepe/1_idle/long_idle/I-20.png",
  ];

  IMAGES_WALK = [
    "assets/img_pollo_locco/img/2_character_pepe/2_walk/W-21.png",
    "assets/img_pollo_locco/img/2_character_pepe/2_walk/W-22.png",
    "assets/img_pollo_locco/img/2_character_pepe/2_walk/W-23.png",
    "assets/img_pollo_locco/img/2_character_pepe/2_walk/W-24.png",
    "assets/img_pollo_locco/img/2_character_pepe/2_walk/W-25.png",
    "assets/img_pollo_locco/img/2_character_pepe/2_walk/W-26.png",
  ];

  IMAGES_JUMP = [
    "assets/img_pollo_locco/img/2_character_pepe/3_jump/J-36.png",
    "assets/img_pollo_locco/img/2_character_pepe/3_jump/J-37.png",
    "assets/img_pollo_locco/img/2_character_pepe/3_jump/J-31.png",
    "assets/img_pollo_locco/img/2_character_pepe/3_jump/J-32.png",
    "assets/img_pollo_locco/img/2_character_pepe/3_jump/J-33.png",
    "assets/img_pollo_locco/img/2_character_pepe/3_jump/J-34.png",
    "assets/img_pollo_locco/img/2_character_pepe/3_jump/J-35.png",
    "assets/img_pollo_locco/img/2_character_pepe/3_jump/J-38.png",
    "assets/img_pollo_locco/img/2_character_pepe/3_jump/J-39.png",
  ];

  IMAGES_HURT = [
    "assets/img_pollo_locco/img/2_character_pepe/4_hurt/H-43.png",
    "assets/img_pollo_locco/img/2_character_pepe/4_hurt/H-42.png",
    "assets/img_pollo_locco/img/2_character_pepe/4_hurt/H-41.png",
  ];

  IMAGES_DEAD = [
    "assets/img_pollo_locco/img/2_character_pepe/5_dead/D-51.png",
    "assets/img_pollo_locco/img/2_character_pepe/5_dead/D-52.png",
    "assets/img_pollo_locco/img/2_character_pepe/5_dead/D-53.png",
    "assets/img_pollo_locco/img/2_character_pepe/5_dead/D-54.png",
    "assets/img_pollo_locco/img/2_character_pepe/5_dead/D-55.png",
    "assets/img_pollo_locco/img/2_character_pepe/5_dead/D-56.png",
    "assets/img_pollo_locco/img/2_character_pepe/5_dead/D-57.png",
  ];

  constructor() {
    super().loadImage("assets/img_pollo_locco/img/2_character_pepe/1_idle/idle/I-1.png");
    this.loadAssets();
    this.animation();
  }

  loadAssets() {
    this.animationImage(this.IMAGES_IDLE);
    this.animationImage(this.IMAGES_LONG_IDLE);
    this.animationImage(this.IMAGES_WALK);
    this.animationImage(this.IMAGES_JUMP);
    this.animationImage(this.IMAGES_HURT);
    this.animationImage(this.IMAGES_DEAD);
  }

  animation() {
    this.startIdleAnimation();
    // this.startLongIdleAnimation();
    this.startWalkAnimation();
    this.startJumpAnimation();
    this.startHurtAnimation();
    this.startDeadAnimation();
  }

  startIdleAnimation() {
    setInterval(() => {
      let i = this.currentImage % this.IMAGES_IDLE.length;
      let path = this.IMAGES_IDLE[i];
      this.img = this.imageCache[path];
      this.currentImage++;
    }, 780);
  }

  // startLongIdleAnimation() {
  //   setInterval(() => {
  //     let i = this.currentImage % this.IMAGES_LONG_IDLE.length;
  //     let path = this.IMAGES_LONG_IDLE[i];
  //     this.img = this.imageCache[path];
  //     this.currentImage++;
  //   }, 780);
  // }

  startWalkAnimation() {
    this.walkRight();
    this.walkLeft();
  }

  walkLeft() {
    setInterval(() => {
      if (this.world.input.LEFT && this.x > 0) {
        this.x -= this.speed;
        this.otherDirection = true;
        this.playAnimation(this.IMAGES_WALK);
      }
      this.world.camera_x = -this.x + 100;
    }, 70);
  }

  walkRight() {
    setInterval(() => {
      if (this.world.input.RIGHT && this.x < this.world.level.level_end) {
        this.x += this.speed;
        this.otherDirection = false;
        this.playAnimation(this.IMAGES_WALK);
      }
      this.world.camera_x = -this.x;
    }, 70);
  }

  startJumpAnimation() {
    setInterval(() => {
      if (this.world.input.UP) {
        // this.moveRight();
        this.playAnimation(this.IMAGES_JUMP);
      }
    }, 70);
  }

  startHurtAnimation() {}

  startDeadAnimation() {}
}
