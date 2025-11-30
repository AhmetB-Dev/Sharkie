class Character extends MovableObject {
  world;
  height = 270;
  width = 140;
  y = 155;
  speed = 60; // 23 ursprunglich
  coins = 0;
  lastActionTime = Date.now();
  delay = 3000;
  longIdlePlayed = false;
  longIdleFrame = 0;

  attack1ready = true;
  ultimateReady = true;

  offset = {
    top: 130,
    left: 25,
    right: 25,
    bottom: 60,
  };

  IMAGES_IDLE = [
    "assets/assets_sharkie/1.Sharkie/1.IDLE/1.png",
    "assets/assets_sharkie/1.Sharkie/1.IDLE/2.png",
    "assets/assets_sharkie/1.Sharkie/1.IDLE/3.png",
    "assets/assets_sharkie/1.Sharkie/1.IDLE/4.png",
    "assets/assets_sharkie/1.Sharkie/1.IDLE/5.png",
    "assets/assets_sharkie/1.Sharkie/1.IDLE/6.png",
    "assets/assets_sharkie/1.Sharkie/1.IDLE/7.png",
    "assets/assets_sharkie/1.Sharkie/1.IDLE/8.png",
    "assets/assets_sharkie/1.Sharkie/1.IDLE/10.png",
    "assets/assets_sharkie/1.Sharkie/1.IDLE/9.png",
    "assets/assets_sharkie/1.Sharkie/1.IDLE/11.png",
    "assets/assets_sharkie/1.Sharkie/1.IDLE/12.png",
    "assets/assets_sharkie/1.Sharkie/1.IDLE/14.png",
    "assets/assets_sharkie/1.Sharkie/1.IDLE/13.png",
    "assets/assets_sharkie/1.Sharkie/1.IDLE/15.png",
    "assets/assets_sharkie/1.Sharkie/1.IDLE/16.png",
    "assets/assets_sharkie/1.Sharkie/1.IDLE/17.png",
    "assets/assets_sharkie/1.Sharkie/1.IDLE/18.png",
  ];

  IMAGES_LONG_IDLE = [
    "assets/assets_sharkie/1.Sharkie/2.Long_IDLE/I2.png",
    "assets/assets_sharkie/1.Sharkie/2.Long_IDLE/i1.png",
    "assets/assets_sharkie/1.Sharkie/2.Long_IDLE/I3.png",
    "assets/assets_sharkie/1.Sharkie/2.Long_IDLE/I4.png",
    "assets/assets_sharkie/1.Sharkie/2.Long_IDLE/I5.png",
    "assets/assets_sharkie/1.Sharkie/2.Long_IDLE/I6.png",
    "assets/assets_sharkie/1.Sharkie/2.Long_IDLE/I7.png",
    "assets/assets_sharkie/1.Sharkie/2.Long_IDLE/I8.png",
    "assets/assets_sharkie/1.Sharkie/2.Long_IDLE/I9.png",
    "assets/assets_sharkie/1.Sharkie/2.Long_IDLE/I10.png",
    "assets/assets_sharkie/1.Sharkie/2.Long_IDLE/I11.png",
    "assets/assets_sharkie/1.Sharkie/2.Long_IDLE/I12.png",
    "assets/assets_sharkie/1.Sharkie/2.Long_IDLE/I13.png",
    "assets/assets_sharkie/1.Sharkie/2.Long_IDLE/I14.png",
  ];

  IMAGES_WALK = [
    "assets/assets_sharkie/1.Sharkie/3.Swim/1.png",
    "assets/assets_sharkie/1.Sharkie/3.Swim/2.png",
    "assets/assets_sharkie/1.Sharkie/3.Swim/3.png",
    "assets/assets_sharkie/1.Sharkie/3.Swim/4.png",
    "assets/assets_sharkie/1.Sharkie/3.Swim/5.png",
    "assets/assets_sharkie/1.Sharkie/3.Swim/6.png",
  ];

  IMAGES_ATTACK_ANI1 = [
    "assets/assets_sharkie/1.Sharkie/4.Attack/Bubble trap/For Whale/1.png",
    "assets/assets_sharkie/1.Sharkie/4.Attack/Bubble trap/For Whale/2.png",
    "assets/assets_sharkie/1.Sharkie/4.Attack/Bubble trap/For Whale/3.png",
    "assets/assets_sharkie/1.Sharkie/4.Attack/Bubble trap/For Whale/4.png",
    "assets/assets_sharkie/1.Sharkie/4.Attack/Bubble trap/For Whale/5.png",
    "assets/assets_sharkie/1.Sharkie/4.Attack/Bubble trap/For Whale/6.png",
    "assets/assets_sharkie/1.Sharkie/4.Attack/Bubble trap/For Whale/7.png",
    "assets/assets_sharkie/1.Sharkie/4.Attack/Bubble trap/For Whale/8.png",
  ];

  IMAGES_ATTACK_BUBBLE_ANI1 = ["assets/assets_sharkie/1.Sharkie/4.Attack/Bubble trap/Bubble.png"];

  IMAGES_UTLIMATE_ATTACK_BUBBLE = [
    "assets/assets_sharkie/2.Enemy/2 Jelly fish/Dead/Yellow/y1.png",
    "assets/assets_sharkie/2.Enemy/2 Jelly fish/Dead/Yellow/y2.png",
    "assets/assets_sharkie/2.Enemy/2 Jelly fish/Dead/Yellow/y3.png",
    "assets/assets_sharkie/2.Enemy/2 Jelly fish/Dead/Yellow/y4.png",
  ];

  IMAGES_UTLIMATE_ATTACK = [
    "assets/assets_sharkie/1.Sharkie/4.Attack/Bubble trap/For Whale/1.png",
    "assets/assets_sharkie/1.Sharkie/4.Attack/Bubble trap/For Whale/2.png",
    "assets/assets_sharkie/1.Sharkie/4.Attack/Bubble trap/For Whale/3.png",
    "assets/assets_sharkie/1.Sharkie/4.Attack/Bubble trap/For Whale/4.png",
    "assets/assets_sharkie/1.Sharkie/4.Attack/Bubble trap/For Whale/5.png",
    "assets/assets_sharkie/1.Sharkie/4.Attack/Bubble trap/For Whale/6.png",
    "assets/assets_sharkie/1.Sharkie/4.Attack/Bubble trap/For Whale/7.png",
    "assets/assets_sharkie/1.Sharkie/4.Attack/Bubble trap/For Whale/8.png",
    "assets/assets_sharkie/2.Enemy/2 Jelly fish/Dead/Yellow/y1.png",
    "assets/assets_sharkie/2.Enemy/2 Jelly fish/Dead/Yellow/y2.png",
    "assets/assets_sharkie/2.Enemy/2 Jelly fish/Dead/Yellow/y3.png",
    "assets/assets_sharkie/2.Enemy/2 Jelly fish/Dead/Yellow/y4.png",
  ];

  IMAGES_ATTACK_ANI2 = [
    "assets/assets_sharkie/1.Sharkie/4.Attack/Fin slap/1.png",
    "assets/assets_sharkie/1.Sharkie/4.Attack/Fin slap/4.png",
    "assets/assets_sharkie/1.Sharkie/4.Attack/Fin slap/5.png",
    "assets/assets_sharkie/1.Sharkie/4.Attack/Fin slap/6.png",
    "assets/assets_sharkie/1.Sharkie/4.Attack/Fin slap/7.png",
    "assets/assets_sharkie/1.Sharkie/4.Attack/Fin slap/8.png",
  ];

  IMAGES_HURT_ANI1 = [
    "assets/assets_sharkie/1.Sharkie/5.Hurt/1.Poisoned/1.png",
    "assets/assets_sharkie/1.Sharkie/5.Hurt/1.Poisoned/2.png",
    "assets/assets_sharkie/1.Sharkie/5.Hurt/1.Poisoned/3.png",
    "assets/assets_sharkie/1.Sharkie/5.Hurt/1.Poisoned/4.png",
    "assets/assets_sharkie/1.Sharkie/5.Hurt/1.Poisoned/5.png",
  ];

  IMAGES_HURT_ANI2 = [
    "assets/assets_sharkie/1.Sharkie/5.Hurt/2.Electric shock/1.png",
    "assets/assets_sharkie/1.Sharkie/5.Hurt/2.Electric shock/2.png",
    "assets/assets_sharkie/1.Sharkie/5.Hurt/2.Electric shock/3.png",
  ];

  IMAGES_DEAD_ANI1 = [
    "assets/assets_sharkie/1.Sharkie/6.dead/1.Poisoned/1.png",
    "assets/assets_sharkie/1.Sharkie/6.dead/1.Poisoned/2.png",
    "assets/assets_sharkie/1.Sharkie/6.dead/1.Poisoned/3.png",
    "assets/assets_sharkie/1.Sharkie/6.dead/1.Poisoned/4.png",
    "assets/assets_sharkie/1.Sharkie/6.dead/1.Poisoned/5.png",
    "assets/assets_sharkie/1.Sharkie/6.dead/1.Poisoned/6.png",
    "assets/assets_sharkie/1.Sharkie/6.dead/1.Poisoned/7.png",
    "assets/assets_sharkie/1.Sharkie/6.dead/1.Poisoned/8.png",
    "assets/assets_sharkie/1.Sharkie/6.dead/1.Poisoned/9.png",
    "assets/assets_sharkie/1.Sharkie/6.dead/1.Poisoned/10.png",
    "assets/assets_sharkie/1.Sharkie/6.dead/1.Poisoned/11.png",
    "assets/assets_sharkie/1.Sharkie/6.dead/1.Poisoned/12.png",
  ];

  IMAGES_DEAD_ANI2 = [
    "assets/assets_sharkie/1.Sharkie/6.dead/2.Electro_shock/1.png",
    "assets/assets_sharkie/1.Sharkie/6.dead/2.Electro_shock/2.png",
    "assets/assets_sharkie/1.Sharkie/6.dead/2.Electro_shock/3.png",
    "assets/assets_sharkie/1.Sharkie/6.dead/2.Electro_shock/4.png",
    "assets/assets_sharkie/1.Sharkie/6.dead/2.Electro_shock/5.png",
    "assets/assets_sharkie/1.Sharkie/6.dead/2.Electro_shock/6.png",
    "assets/assets_sharkie/1.Sharkie/6.dead/2.Electro_shock/7.png",
    "assets/assets_sharkie/1.Sharkie/6.dead/2.Electro_shock/8.png",
    "assets/assets_sharkie/1.Sharkie/6.dead/2.Electro_shock/9.png",
    "assets/assets_sharkie/1.Sharkie/6.dead/2.Electro_shock/10.png",
  ];

  constructor() {
    super().loadImage("assets/assets_sharkie/1.Sharkie/1.IDLE/1.png");
    this.loadAssets();
    this.applyGravity();
    this.animation();
  }

  loadAssets() {
    this.animationImage(this.IMAGES_IDLE);
    this.animationImage(this.IMAGES_LONG_IDLE);
    this.animationImage(this.IMAGES_WALK);
    this.animationImage(this.IMAGES_ATTACK_ANI1);
    this.animationImage(this.IMAGES_ATTACK_ANI2);
    this.animationImage(this.IMAGES_UTLIMATE_ATTACK);
    this.animationImage(this.IMAGES_HURT_ANI1);
    this.animationImage(this.IMAGES_HURT_ANI2);
    this.animationImage(this.IMAGES_DEAD_ANI1);
    this.animationImage(this.IMAGES_DEAD_ANI2);
  }

  animation() {
    this.startWalkAnimation();
    this.startJumpAnimation();
    this.startAnimationLoop();
  }

  isPlayerActive() {
    const input = this.world.input;
    return (
      input.RIGHT ||
      input.LEFT ||
      input.UP ||
      input.DOWN ||
      input.SPACE ||
      input.THROW ||
      input.ATA1 ||
      input.ATA2 ||
      input.ULTIMATE
    );
  }

  playLongIdleTail() {
    const frames = this.IMAGES_LONG_IDLE;
    const startIndex = Math.max(frames.length - 4, 0);
    const tailFrames = frames.slice(startIndex);

    this.playAnimation(tailFrames);
  }

  playLongIdleOnce() {
    const frames = this.IMAGES_LONG_IDLE;

    if (this.longIdleFrame < 0 || this.longIdleFrame >= frames.length) {
      this.longIdleFrame = 0;
    }

    const path = frames[this.longIdleFrame];
    this.img = this.imageCache[path];

    if (this.longIdleFrame < frames.length - 1) {
      this.longIdleFrame++;
    } else {
      this.longIdlePlayed = true;
    }
  }

  shootAttack1Bubble() {
    if (!this.world) return;

    const shootToLeft = this.otherDirection;
    const offsetX = shootToLeft ? -20 : this.width;
    const startX = this.x + offsetX;
    const startY = this.y + this.height * 0.5;

    const bubble = new BubbleProjectile(startX, startY, this.IMAGES_ATTACK_BUBBLE_ANI1, shootToLeft);

    this.world.throwableObjects.push(bubble);
  }

  shootUltimateBubble() {
    if (!this.world) return;

    const shootToLeft = this.otherDirection;
    const offsetX = shootToLeft ? -20 : this.width;
    const startX = this.x + offsetX;
    const startY = this.y + this.height * 0.5;

    const bubble = new BubbleProjectile(startX, startY, this.IMAGES_UTLIMATE_ATTACK_BUBBLE, shootToLeft);

    this.world.throwableObjects.push(bubble);
  }

  startAnimationLoop() {
    setInterval(() => {
      const now = Date.now();

      if (this.isPlayerActive()) {
        this.lastActionTime = now;
        this.longIdlePlayed = false;
        this.longIdleFrame = 0;
      }

      const idleTime = now - this.lastActionTime;

      if (this.dead()) {
        this.playAnimation(this.IMAGES_DEAD_ANI1);
        return;
      }

      if (this.hitHurt()) {
        this.playAnimation(this.IMAGES_HURT_ANI1);
        return;
      }

      if (this.world.input.UP && !this.isAboveGround()) {
        this.playAnimation(this.IMAGES_WALK);
        return;
      }

      if (this.world.input.RIGHT || this.world.input.LEFT) {
        this.playAnimation(this.IMAGES_WALK);
        return;
      }

      if (this.world.input.ULTIMATE) {
        this.playAnimation(this.IMAGES_UTLIMATE_ATTACK);

        if (this.ultimateReady) {
          this.shootUltimateBubble();
          this.ultimateReady = false;
        }

        return;
      } else {
        this.ultimateReady = true;
      }

      if (this.world.input.ATA2) {
        this.playAnimation(this.IMAGES_ATTACK_ANI2);
        return;
      }

      if (this.world.input.ATA1) {
        this.playAnimation(this.IMAGES_ATTACK_ANI1);

        if (this.attack1Ready) {
          this.shootAttack1Bubble();
          this.attack1Ready = false;
        }

        return;
      } else {
        this.attack1Ready = true;
      }


      if (idleTime > this.delay && !this.longIdlePlayed) {
        this.playLongIdleOnce();
        return;
      }

      if (idleTime > this.delay && this.longIdlePlayed) {
        this.playLongIdleTail();
        return;
      }

      this.playAnimation(this.IMAGES_IDLE);
    }, 1000 / 10);
  }

  // animationAttack1() {
  //   setInterval(() => {
  //     if (this.world.input.ATA1) {
  //       this.playAnimation(this.IMAGES_ATTACK_ANI1);
  //       return;
  //     }
  //   }, 1000 / 10);
  // }

  // animationAttack2() {
  //   setInterval(() => {
  //     if (this.world.input.ATA2) {
  //       this.playAnimation(this.IMAGES_ATTACK_ANI2);
  //       return;
  //     }
  //   }, 1000 / 10);
  // }

  // animationUltimateAttack() {
  //   setInterval(() => {
  //     if (this.world.input.ULTIMATE) {
  //       this.playAnimation(this.IMAGES_UTLIMATE_ATTACK);
  //       return;
  //     }
  //   }, 1000 / 10);
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
      }
      this.world.camera_x = -this.x + 100;
    }, 70);
  }

  walkRight() {
    setInterval(() => {
      if (this.world.input.RIGHT && this.x < this.world.level.level_end) {
        this.x += this.speed;
        this.otherDirection = false;
      }
      this.world.camera_x = -this.x;
    }, 70);
  }

  startJumpAnimation() {
    setInterval(() => {
      if (this.world.input.UP && !this.isAboveGround()) {
        this.setJumpHeight();
      }
    }, 115);
  }

  startHurtAnimation() {
    setInterval(() => {
      if (this.hitHurt()) {
        this.playAnimation(this.IMAGES_HURT_ANI1);
      }
    }, 200);
  }

  startDeadAnimation() {
    setInterval(() => {
      if (this.dead()) {
        this.playAnimation(this.IMAGES_DEAD_ANI1);
      }
    }, 300);
  }

  addCoin() {
    this.coins++;
    if (this.coins > 5) this.coins = 5;
  }
}
