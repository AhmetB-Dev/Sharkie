class MovableObject extends DrawableObject {
  speed = 0.15;
  otherDirection = false;
  speedY = 0;
  acceleration = 2.5;
  energy = 100;
  lastHit = 0;
  items = 0;
  groundY = 155;
  gravityAutoDisable = true;
  gravityActive = false;
  _gravAcc = 0;
  patrolActive = false;
  patrolRangeX = 0;
  patrolOriginX = 0;
  patrolDirectionX = 1;
  timers = new TimerBag();

  offset = { top: 0, left: 0, right: 0, bottom: 0 };

  isColliding(other) {
    if (!other) return false;

    const a = this.getHitbox(this);
    const b = this.getHitbox(other);

    const overlapX = a.left < b.right && a.right > b.left;
    const overlapY = a.top < b.bottom && a.bottom > b.top;
    return overlapX && overlapY;
  }

  getHitbox(obj) {
    const left = obj.x + obj.offset.left;
    const right = obj.x + obj.width - obj.offset.right;
    const top = obj.y + obj.offset.top;
    const bottom = obj.y + obj.height - obj.offset.bottom;
    return { left, right, top, bottom };
  }

  hit() {
    this.energy -= 20;
    if (this.energy < 0) {
      this.energy = 0;
      return;
    }
    this.lastHit = Date.now();
  }

  hitHurt() {
    const elapsedMs = Date.now() - this.lastHit;
    const elapsedSec = elapsedMs / 1000;
    return elapsedSec < 1;
  }

  isHurt() {
    return this.hitHurt();
  }

  getItems() {
    this.items += 1;
    if (this.items > 5) this.items = 5;
  }

  dead() {
    return this.energy === 0;
  }

  applyGravity() {
    this.enableGravity();
  }

  enableGravity() {
    this.gravityActive = true;
  }

  disableGravity() {
    this.gravityActive = false;
    this._gravAcc = 0;
  }

  updateGravity(dtSec) {
    if (!Number.isFinite(dtSec) || dtSec <= 0) return;
    if (!this.gravityActive && this.speedY > 0) this.enableGravity();
    if (!this.gravityActive) return;

    const fixedStepSec = 1 / 20;
    this._gravAcc = (this._gravAcc || 0) + dtSec;

    while (this._gravAcc >= fixedStepSec) {
      this.gravityStep();
      this._gravAcc -= fixedStepSec;
    }
  }

  gravityStep() {
    const fallingOrJumping = this.isAboveGround() || this.speedY > 0;
    if (fallingOrJumping) {
      this.y -= this.speedY;
      this.speedY -= this.acceleration;
      return;
    }

    this.speedY = 0;
    if (this.gravityAutoDisable) this.disableGravity();
  }

  isAboveGround() {
    if (this instanceof ThrowableObject) return true;
    return this.y < this.groundY;
  }

  playAnimation(images) {
    const frameIndex = this.currentImage % images.length;
    const framePath = images[frameIndex];
    this.img = this.imageCache[framePath];
    this.currentImage++;
  }

  setJumpHeight() {
    this.speedY = 25;
  }

  startPatrol(rangeX) {
    this.patrolRangeX = rangeX;
    this.patrolOriginX = this.x;
    this.patrolDirectionX = 1;
    this.patrolActive = true;
  }

  stopPatrol() {
    this.patrolActive = false;
  }

  updatePatrol(dtSec) {
    if (!this.patrolActive || this.isDead) return;

    const pxPerSec = this.speed * 60;
    this.x += this.patrolDirectionX * pxPerSec * dtSec;
    this.otherDirection = this.patrolDirectionX > 0;

    if (this.x < this.patrolOriginX - this.patrolRangeX) this.patrolDirectionX = 1;
    if (this.x > this.patrolOriginX + this.patrolRangeX) this.patrolDirectionX = -1;
  }

  clearTimers() {
    this.timers?.clearAll();
  }
}
