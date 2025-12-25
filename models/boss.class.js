class Boss extends MovableObject {
  height = 350;
  width = 400;
  y = 70;
  energy = 100;
  speed = 1;
  attackRange = 200;
  isDead = false;
  deathFrame = 0;
  deathAnimationDone = false;
  isActive = false;
  playerInRange = false;
  introPlayed = false;
  introFrame = 0;
  isAttacking = false;
  inDamageWindow = false;
  triggerIntro = 4000;

  constructor() {
    super();
    this.linkAssets();
    this.loadImage(this.ENEMIES_INTRODUCE[0]);
    this.loadAssets();
    this.initAnim();
    this.bossSpeed();
    this.x = 4500;
  }

  linkAssets() {
    this.ENEMIES_INTRODUCE = EnemyAssets.BOSS_INTRO;
    this.ENEMIES_WALK = EnemyAssets.BOSS_WALK;
    this.ENEMIES_ATTACK = EnemyAssets.BOSS_ATTACK;
    this.ENEMIES_HURT = EnemyAssets.BOSS_HURT;
    this.ENEMIES_DEAD = EnemyAssets.BOSS_DEAD;
  }

  loadAssets() {
    this.animationImage(this.ENEMIES_INTRODUCE);
    this.animationImage(this.ENEMIES_WALK);
    this.animationImage(this.ENEMIES_ATTACK);
    this.animationImage(this.ENEMIES_HURT);
    this.animationImage(this.ENEMIES_DEAD);
  }

  initAnim() {
    this.animStepSec = 0.125;
    this._animAcc = 0;
    this._deathAcc = 0;
  }

  bossSpeed() {
    this.speed = 1.5;
  }

  update(dtSec) {
    if (!this.isActive) return;
    if (this.isDead || this.dead()) return this.stepDeath(dtSec);
    if (this.hitHurt()) return this.stepAnim(dtSec, this.ENEMIES_HURT);
    if (this.playerInRange && !this.introPlayed) return this.stepIntro(dtSec);
    if (!this.playerInRange || !this.introPlayed) return;
    this.stepCombat(dtSec);
  }

  stepIntro(dtSec) {
    const introFrames = this.ENEMIES_INTRODUCE;
    this._animAcc += dtSec;
    if (this._animAcc < this.animStepSec) return;
    this._animAcc = 0;

    const frameIndex = this.introFrame;
    this.img = this.imageCache[introFrames[frameIndex]];
    if (frameIndex >= introFrames.length - 1) return this.finishIntro();
    this.introFrame++;
  }

  finishIntro() {
    this.introPlayed = true;
    if (window.audioManager) window.audioManager.play("bossIntro");
  }

  stepCombat(dtSec) {
    if (this.isAttacking) return this.stepAttack(dtSec);
    this.stepAnim(dtSec, this.ENEMIES_WALK);
    this.inDamageWindow = false;
  }

  stepAttack(dtSec) {
    this.stepAnim(dtSec, this.ENEMIES_ATTACK);
    this.updateAttackDamageWindow();
  }

  stepAnim(dtSec, frames) {
    this._animAcc += dtSec;
    if (this._animAcc < this.animStepSec) return;
    this._animAcc = 0;
    this.playAnimation(frames);
  }

  stepDeath(dtSec) {
    this._deathAcc += dtSec;
    if (this._deathAcc < this.animStepSec) return;
    this._deathAcc = 0;
    this.playDeathAnimation();
  }

  die() {
    if (this.isDead) return;
    this.isDead = true;
    this.speed = 0;
    this.isAttacking = false;
    this.deathFrame = 0;
    this.deathAnimationDone = false;
  }

  followCharacter(character) {
    const deltaX = character.x - this.x;
    const deltaY = character.y - this.y;
    const distanceToCharacter = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
    const moveStep = 2;

    const normX = deltaX / (distanceToCharacter || 1);
    const normY = deltaY / (distanceToCharacter || 1);

    this.x += normX * moveStep;
    this.y += normY * moveStep;

    this.otherDirection = deltaX > 0;
    this.isAttacking = distanceToCharacter < this.attackRange;
  }

  updateAttackDamageWindow() {
    const attackFrames = this.ENEMIES_ATTACK;
    if (!attackFrames || attackFrames.length === 0) {
      this.inDamageWindow = false;
      return;
    }

    const currentFrameIndex = (this.currentImage - 1) % attackFrames.length;
    const lastFrameIndex = attackFrames.length - 1;
    this.inDamageWindow = currentFrameIndex === lastFrameIndex;
  }

  canDamagePlayer(character) {
    return (
      this.isActive &&
      !this.isDead &&
      !this.dead() &&
      this.isAttacking &&
      this.inDamageWindow &&
      !character.isHurt()
    );
  }

  playDeathAnimation() {
    const deathFrames = this.ENEMIES_DEAD;
    if (!deathFrames || deathFrames.length === 0) return;

    if (this.deathAnimationDone) {
      const lastFrame = deathFrames[deathFrames.length - 1];
      this.img = this.imageCache[lastFrame];
      return;
    }

    const frameIndex = Math.min(this.deathFrame, deathFrames.length - 1);
    this.img = this.imageCache[deathFrames[frameIndex]];

    if (frameIndex >= deathFrames.length - 1) this.deathAnimationDone = true;
    else this.deathFrame++;
  }

  draw(ctx) {
    if (!this.isActive) return;
    super.draw(ctx);
  }

  showHitbox(ctx) {
    if (!this.isActive) return;
    super.showHitbox(ctx);
  }
}
