class ThrowableObject extends MovableObject {
  IMAGE_SHOOT = CharacterAssets.IMAGE_SHOOT;
  IMAGES_SHOOTBALL = CharacterAssets.IMAGES_SHOOTBALL;

  constructor(x, y) {
    super();
    this.initFrames();
    this.initBody(x, y);
    this.initAnim();
    this.isThrown = false;
  }

  initFrames() {
    this.animationImage(this.IMAGE_SHOOT);
    this.loadImage(this.IMAGE_SHOOT[0]);
  }

  initBody(x, y) {
    this.x = x;
    this.y = y;
    this.height = 40;
    this.width = 40;
  }

  initAnim() {
    this.animFps = 10;
    this._animAcc = 0;
  }

  throw(dir = 1) {
    this.isThrown = true;
    this.speedX = 10 / 0.025;
    this.speedY = 30 / 0.05;
    this.gravity = this.acceleration / 0.05;
    this.dir = dir;
  }

  update(dtSec) {
    if (!this.isThrown) return;
    this.move(dtSec);
    this.applyGravityStep(dtSec);
    this.animate(dtSec);
  }

  move(dtSec) {
    this.x += this.dir * this.speedX * dtSec;
  }

  applyGravityStep(dtSec) {
    this.y -= this.speedY * dtSec;
    this.speedY -= this.gravity * dtSec;
  }

  animate(dtSec) {
    this._animAcc += dtSec;
    if (this._animAcc < 1 / this.animFps) return;
    this._animAcc = 0;
    this.playAnimation(this.IMAGE_SHOOT);
  }
}
