class Character extends MovableObject {
  world;
  height = 270;
  width = 140;
  y = 155;
  speed = 60;
  normalSpeed = 60;
  hurtSpeedFactor = 0.3;
  isSlowed = false;
  coins = 0;

  lastActionTime = Date.now();
  delay = 3000;
  longIdlePlayed = false;
  longIdleFrame = 0;

  attack1Ready = true;
  ultimateReady = true;
  hitRange = false;
  lastHitByEnemy1 = false;

  offset = {
    top: 130,
    left: 25,
    right: 25,
    bottom: 60,
  };

  constructor() {
    super();
    this.normalSpeed = this.speed;
    this.linkAssets();
    this.loadImage(this.IMAGES_IDLE[0]);
    this.loadAssets();

    this.controller = new CharacterController(this);

    this.applyGravity();
    this.groundY = 155;
    this.y = this.groundY;

    this.animation();
  }

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
      if (this.dead() || this.world.endScreen) return;

      if (this.world.input.LEFT && this.x > 0) {
        this.x -= this.speed;
        this.otherDirection = true;
      }
      if (this.dead() || this.world.endScreen || this.world.isPaused) return;

      this.world.camera_x = -this.x + 100;
    }, 70);
  }

  walkRight() {
    setInterval(() => {
      if (!this.world) return;
      if (this.dead() || this.world.endScreen) return;

      if (this.world.input.RIGHT && this.x < this.world.level.level_end) {
        this.x += this.speed;
        this.otherDirection = false;
      }
      if (this.dead() || this.world.endScreen || this.world.isPaused) return;

      this.world.camera_x = -this.x;
    }, 70);
  }

  startJumpAnimation() {
    setInterval(() => {
      if (!this.world) return;
      if (this.dead() || this.world.endScreen) return;

      if (this.world.input.UP && !this.isAboveGround()) {
        this.setJumpHeight();
      }
      if (this.dead() || this.world.endScreen || this.world.isPaused) return;
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
    this.playAnimation(frames.slice(startIndex));
  }

  playLongIdleOnce() {
    const frames = this.IMAGES_LONG_IDLE;

    if (this.longIdleFrame < 0 || this.longIdleFrame >= frames.length) {
      this.longIdleFrame = 0;
    }
    this.img = this.imageCache[frames[this.longIdleFrame]];

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
    if (window.audioManager) window.audioManager.play("bubbleShot");
  }

  shootUltimateBubble() {
    if (!this.canShootUltimate()) return;
    this.consumeUltimateAmmo();
    const startPos = this.getUltimateShotStart();
    const projectile = this.createUltimateBubble(startPos);
    this.spawnProjectile(projectile);
    this.playBubbleShotSound();
  }

  canShootUltimate() {
    if (!this.world) return false;
    return this.items > 0;
  }

  consumeUltimateAmmo() {
    this.items--;
    this.updateAmmoBar();
  }

  updateAmmoBar() {
    const ammoPercent = this.items * 20;
    this.world.ammoBar.setStack(ammoPercent);
  }

  getUltimateShotStart() {
    const shootToLeft = this.otherDirection;
    const offsetX = shootToLeft ? -20 : this.width;
    return {
      x: this.x + offsetX,
      y: this.y + this.height * 0.5,
      shootToLeft,
    };
  }

  createUltimateBubble(pos) {
    return new BubbleProjectile(pos.x, pos.y, this.IMAGES_UTLIMATE_ATTACK_BUBBLE, pos.shootToLeft, true);
  }

  spawnProjectile(projectile) {
    this.world.throwableObjects.push(projectile);
  }

  playBubbleShotSound() {
    if (window.audioManager) window.audioManager.play("bubbleShot");
  }

  addCoin() {
    this.coins++;
    if (this.coins > 5) this.coins = 5;
  }

  hitmakerRange(enemy) {
    if (!this.canUseHitRange(enemy)) return false;
    const delta = this.getCenterDelta(enemy);
    if (!this.isTargetInFront(delta.dx)) return false;
    return this.isDeltaWithinHitRange(delta);
  }

  canUseHitRange(enemy) {
    if (!this.hitRange) return false;
    return !!enemy;
  }

  getCenterDelta(enemy) {
    const center = this.getCenter(this);
    const enemyCenter = this.getCenter(enemy);
    return { dx: enemyCenter.x - center.x, dy: enemyCenter.y - center.y };
  }

  getCenter(obj) {
    return { x: obj.x + obj.width / 2, y: obj.y + obj.height / 2 };
  }

  isTargetInFront(dx) {
    const facingRight = !this.otherDirection;
    if (facingRight) return dx > 0;
    return dx < 0;
  }

  isDeltaWithinHitRange(delta) {
    const limits = this.getHitRangeLimits();
    return Math.abs(delta.dx) < limits.maxX && Math.abs(delta.dy) < limits.maxY;
  }

  getHitRangeLimits() {
    return { maxX: this.width * 0.9, maxY: this.height * 0.7 };
  }

  hit() {
    super.hit();

    if (this.dead()) {
      this.speed = 0;
      return;
    }

    this.applyHitSlowdown();
  }

  applyHitSlowdown() {
    if (this.isSlowed) return;

    this.isSlowed = true;
    this.speed = this.normalSpeed * this.hurtSpeedFactor;

    setTimeout(() => {
      if (!this.dead() && this.world && !this.world.endScreen) {
        this.speed = this.normalSpeed;
      }
      this.isSlowed = false;
    }, 400);
  }
}
