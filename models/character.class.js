class Character extends MovableObject {
  world;
  height = 270;
  width = 140;
  y = 155;
  speed = 60; // ursprünglich 23
  coins = 0;

  lastActionTime = Date.now();
  delay = 3000;
  longIdlePlayed = false;
  longIdleFrame = 0;

  attack1Ready = true;
  ultimateReady = true;
  hitRange = false;

  offset = {
    top: 130,
    left: 25,
    right: 25,
    bottom: 60,
  };

  constructor() {
    super();

    this.linkAssets();
    this.loadImage(this.IMAGES_IDLE[0]);
    this.loadAssets();

    this.controller = new CharacterController(this);

    this.applyGravity();
    this.groundY = 155;
    this.y = this.groundY;

    this.animation();
  }

  /**
   * Verknüpft die statischen Assets aus CharacterAssets mit dieser Instanz.
   */
  linkAssets() {
    this.IMAGES_IDLE = CharacterAssets.IMAGES_IDLE;
    this.IMAGES_LONG_IDLE = CharacterAssets.IMAGES_LONG_IDLE;
    this.IMAGES_WALK = CharacterAssets.IMAGES_WALK;

    this.IMAGES_ATTACK_ANI1 = CharacterAssets.IMAGES_ATTACK_ANI1;
    this.IMAGES_ATTACK_BUBBLE_ANI1 = CharacterAssets.IMAGES_ATTACK_BUBBLE_ANI1;
    this.IMAGES_ATTACK_ANI2 = CharacterAssets.IMAGES_ATTACK_ANI2;

    this.IMAGES_UTLIMATE_ATTACK = CharacterAssets.IMAGES_UTLIMATE_ATTACK;
    this.IMAGES_UTLIMATE_ATTACK_BUBBLE = CharacterAssets.IMAGES_UTLIMATE_ATTACK_BUBBLE;

    this.IMAGES_HURT_ANI1 = CharacterAssets.IMAGES_HURT_ANI1;
    this.IMAGES_HURT_ANI2 = CharacterAssets.IMAGES_HURT_ANI2;

    this.IMAGES_DEAD_ANI1 = CharacterAssets.IMAGES_DEAD_ANI1;
    this.IMAGES_DEAD_ANI2 = CharacterAssets.IMAGES_DEAD_ANI2;
  }

  loadAssets() {
    this.animationImage(this.IMAGES_IDLE);
    this.animationImage(this.IMAGES_LONG_IDLE);
    this.animationImage(this.IMAGES_WALK);

    this.animationImage(this.IMAGES_ATTACK_ANI1);
    this.animationImage(this.IMAGES_ATTACK_BUBBLE_ANI1);
    this.animationImage(this.IMAGES_ATTACK_ANI2);

    this.animationImage(this.IMAGES_UTLIMATE_ATTACK);
    this.animationImage(this.IMAGES_UTLIMATE_ATTACK_BUBBLE);

    this.animationImage(this.IMAGES_HURT_ANI1);
    this.animationImage(this.IMAGES_HURT_ANI2);

    this.animationImage(this.IMAGES_DEAD_ANI1);
    this.animationImage(this.IMAGES_DEAD_ANI2);
  }

  animation() {
    this.startWalkAnimation();
    this.startJumpAnimation();
    this.controller.start();
  }

  startWalkAnimation() {
    this.walkRight();
    this.walkLeft();
  }

  walkLeft() {
    setInterval(() => {
      if (!this.world) return;

      if (this.world.input.LEFT && this.x > 0) {
        this.x -= this.speed;
        this.otherDirection = true;
      }

      this.world.camera_x = -this.x + 100;
    }, 70);
  }

  walkRight() {
    setInterval(() => {
      if (!this.world) return;

      if (this.world.input.RIGHT && this.x < this.world.level.level_end) {
        this.x += this.speed;
        this.otherDirection = false;
      }

      this.world.camera_x = -this.x;
    }, 70);
  }

  startJumpAnimation() {
    setInterval(() => {
      if (!this.world) return;

      if (this.world.input.UP && !this.isAboveGround()) {
        this.setJumpHeight();
      }
    }, 115);
  }

  isPlayerActive() {
    if (!this.world) return false;
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

    const bubble = new BubbleProjectile(
      startX,
      startY,
      this.IMAGES_UTLIMATE_ATTACK_BUBBLE,
      shootToLeft,
      true
    );

    this.world.throwableObjects.push(bubble);
  }

  addCoin() {
    this.coins++;
    if (this.coins > 5) this.coins = 5;
  }

  hitmakerRange(enemy) {
    if (!this.hitRange) return false;

    const charCenterX = this.x + this.width / 2;
    const charCenterY = this.y + this.height / 2;
    const enemyCenterX = enemy.x + enemy.width / 2;
    const enemyCenterY = enemy.y + enemy.height / 2;

    const dx = enemyCenterX - charCenterX;
    const dy = enemyCenterY - charCenterY;

    const facingRight = !this.otherDirection;

    if (facingRight && dx <= 0) return false;
    if (!facingRight && dx >= 0) return false;

    const maxHorizontal = this.width * 0.9;
    const maxVertical = this.height * 0.7;

    return Math.abs(dx) < maxHorizontal && Math.abs(dy) < maxVertical;
  }
}
