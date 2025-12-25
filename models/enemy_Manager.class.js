class EnemyManager {
  constructor(level, character, throwableObjects, healthBar, autoStart = false) {
    this.level = level;
    this.character = character;
    this.throwableObjects = throwableObjects;
    this.healthBar = healthBar;
    if (autoStart) this.startUpdateEnemy();
  }

  startUpdateEnemy() {
    setInterval(() => this.tick(), 100);
  }

  tick() {
    if (this.shouldSkipTick()) return;
    this.updateEnemyAI();
    this.checkProjectileHits();
    this.updateCharacterHealth();
  }

  shouldSkipTick() {
    const character = this.character;
    const world = character.world;
    return character.dead() || (world && (world.endScreen || world.isPaused));
  }

  updateEnemyAI() {
    this.updateTyp1();
    this.updateTyp2();
    this.updateBoss();
  }

  updateTyp1() {
    for (const enemy of this.level.enemies) {
      if (enemy instanceof Enemy_Typ01 && !enemy.isDead) enemy.updateAI(this.character);
    }
  }

  updateTyp2() {
    for (const enemy of this.level.enemies) {
      if (enemy instanceof Enemy_Typ02 && !enemy.isDead) enemy.updateAI(this.character);
    }
  }

  updateBoss() {
    for (const enemy of this.level.enemies) {
      if (!(enemy instanceof Boss)) continue;
      this.activateBoss(enemy);
      this.followBoss(enemy);
    }
  }

  activateBoss(boss) {
    if (boss.playerInRange) return;
    if (this.character.x < boss.triggerIntro) return;
    boss.playerInRange = true;
    boss.isActive = true;
  }

  followBoss(boss) {
    if (boss.isDead || boss.dead()) return;
    if (!boss.playerInRange || !boss.introPlayed) return;
    boss.followCharacter(this.character);
  }

  updateCharacterHealth() {
    const character = this.character;
    const healthBar = this.healthBar;
    if (this.shouldSkipTick()) return;

    for (let enemyIndex = this.level.enemies.length - 1; enemyIndex >= 0; enemyIndex--) {
      const enemy = this.level.enemies[enemyIndex];
      if (this.handleDeadEnemy(enemy, enemyIndex, character)) continue;
      if (this.handleMeleeKill(enemy, character)) continue;
      this.handleContactDamage(enemy, character, healthBar);
    }
  }

  handleDeadEnemy(enemy, index, character) {
    if (!enemy?.isDead) return false;
    if (character.isColliding(enemy)) this.level.enemies.splice(index, 1);
    return true;
  }

  handleMeleeKill(enemy, character) {
    if (!(enemy instanceof Enemy_Typ01)) return false;
    if (enemy.isDead) return false;
    if (!character.hitmakerRange(enemy)) return false;

    enemy.die();
    if (window.audioManager) window.audioManager.play("enemyDeath");
    return true;
  }

  handleContactDamage(enemy, character, healthBar) {
    if (!enemy || enemy.isDead || enemy.dead()) return;
    if (!character.isColliding(enemy)) return;
    if (!this.canEnemyDamagePlayer(enemy, character)) return;

    this.markLastHitSource(enemy, character);
    character.hit();
    healthBar.setPercentrage(character.energy);
  }

  isPlayerHurt(character) {
    if (character?.isHurt) return character.isHurt();
    if (character?.hitHurt) return character.hitHurt();
    return false;
  }

  canEnemyDamagePlayer(enemy, character) {
    if (enemy instanceof Boss) return enemy.canDamagePlayer(character);
    return !this.isPlayerHurt(character);
  }

  markLastHitSource(enemy, character) {
    if (enemy instanceof Boss) return (character.lastHitByEnemy1 = true);
    character.lastHitByEnemy1 = !(enemy instanceof Enemy_Typ02);
  }

  checkProjectileHits() {
    const projectiles = this.throwableObjects;

    for (let projectileIndex = projectiles.length - 1; projectileIndex >= 0; projectileIndex--) {
      const projectile = projectiles[projectileIndex];
      const hitEnemy = this.findFirstHitEnemy(projectile);
      if (!hitEnemy) continue;

      const consumed = this.applyProjectileRules(hitEnemy, projectile);
      if (consumed) projectiles.splice(projectileIndex, 1);
    }
  }

  findFirstHitEnemy(projectile) {
    for (const enemy of this.level.enemies) {
      if (!enemy || enemy.isDead) continue;
      if (projectile.isColliding(enemy)) return enemy;
    }
    return null;
  }

  applyProjectileRules(enemy, projectile) {
    if (enemy instanceof Boss) return this.hitBossWithUltimate(enemy, projectile);
    if (enemy instanceof Enemy_Typ02) return this.killTyp2WithNormalBubble(enemy, projectile);
    return false;
  }

  hitBossWithUltimate(boss, projectile) {
    if (!projectile.isUltimate) return false;

    if (window.audioManager) window.audioManager.play("bossHit");
    boss.hit(20);

    if (boss.dead()) {
      boss.die();
      boss.character?.world?.showEndScreen?.(true);
      this.character.world?.showEndScreen?.(true);
    }
    return true;
  }

  killTyp2WithNormalBubble(enemy, projectile) {
    if (projectile.isUltimate) return false;

    enemy.die();
    if (window.audioManager) window.audioManager.play("enemyDeath");
    return true;
  }
}
