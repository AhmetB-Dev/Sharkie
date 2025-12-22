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

  offset = {
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  };

  isColliding(mo) {
    return (
      this.x + this.width - this.offset.right > mo.x + mo.offset.left &&
      this.x + this.offset.left < mo.x + mo.width - mo.offset.right &&
      this.y + this.height - this.offset.bottom > mo.y + mo.offset.top &&
      this.y + this.offset.top < mo.y + mo.height - mo.offset.bottom
    );
  }

  hit() {
    this.energy -= 20;
    if (this.energy < 0) this.energy = 0;
    else this.lastHit = new Date().getTime();
  }

  hitHurt() {
    let timepassed = new Date().getTime() - this.lastHit;
    timepassed = timepassed / 1000;
    return timepassed < 1;
  }

  isHurt() {
    return this.hitHurt();
  }

  getItems() {
    this.items += 1;
    if (this.items > 5) this.items = 5;
  }

  dead() {
    return this.energy == 0;
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

    const step = 1 / 20;
    this._gravAcc = (this._gravAcc || 0) + dtSec;

    while (this._gravAcc >= step) {
      this.gravityStep();
      this._gravAcc -= step;
    }
  }

  gravityStep() {
    if (this.isAboveGround() || this.speedY > 0) {
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
    let i = this.currentImage % images.length;
    let path = images[i];
    this.img = this.imageCache[path];
    this.currentImage++;
  }

  setJumpHeight() {
    this.speedY = 25;
  }

  moveRight() {
    this.timers.every(() => (this.x += this.speed), 1000 / 60);
  }

  moveLeft() {
    this.timers.every(() => (this.x -= this.speed), 1000 / 60);
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
