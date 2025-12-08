class MovableObject extends DrawableObject {
  speed = 0.15;
  otherDirection = false;
  speedY = 0;
  acceleration = 2.5;
  energy = 100;
  lastHit = 0;
  items = 0;
  groundY = 155;
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
    if (this.energy < 0) {
      this.energy = 0;
    } else {
      this.lastHit = new Date().getTime();
    }
  }

  hitHurt() {
    let timepassed = new Date().getTime() - this.lastHit;
    timepassed = timepassed / 1000;
    return timepassed < 1;
  }

  getItems() {
    this.items += 1;
    if (this.items > 5) {
      this.items = 5;
    }
  }

  dead() {
    return this.energy == 0;
  }

  applyGravity() {
    setInterval(() => {
      if (this.isAboveGround() || this.speedY > 0) {
        this.y -= this.speedY;
        this.speedY -= this.acceleration;
      }
    }, 1000 / 20);
  }

  isAboveGround() {
    if (this instanceof ThrowableObject) {
      return true;
    } else {
      return this.y < this.groundY;
    }
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
    setInterval(() => {
      this.x += this.speed;
    }, 1000 / 60);
  }

  moveLeft() {
    setInterval(() => {
      this.x -= this.speed;
    }, 1000 / 60);
  }

  startPatrol(rangeX) {
    this.patrolRangeX = rangeX;
    this.patrolOriginX = this.x;
    this.patrolDirectionX = 1;

    setInterval(() => {
      if (this.isDead) return;
      this.x += this.patrolDirectionX * this.speed;
      if (this.patrolDirectionX > 0) {
        this.otherDirection = true;
      } else if (this.patrolDirectionX < 0) {
        this.otherDirection = false;
      }
      if (this.x < this.patrolOriginX - this.patrolRangeX) {
        this.patrolDirectionX = 1;
      }

      if (this.x > this.patrolOriginX + this.patrolRangeX) {
        this.patrolDirectionX = -1;
      }
    }, 1000 / 60);
  }
}
