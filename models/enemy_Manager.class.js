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
    const char = this.character;
    const w = char.world;
    return char.dead() || (w && (w.endScreen || w.isPaused));
  }

  updateEnemyAI() {
    this.updateTyp1();
    this.updateTyp2();
    this.updateBoss();
  }

  updateTyp1() {
    for (const e of this.level.enemies) {
      if (e instanceof Enemy_Typ01 && !e.isDead) e.updateAI(this.character);
    }
  }

  updateTyp2() {
    for (const e of this.level.enemies) {
      if (e instanceof Enemy_Typ02 && !e.isDead) e.updateAI(this.character);
    }
  }

  updateBoss() {
    for (const e of this.level.enemies) {
      if (!(e instanceof Boss)) continue;
      this.activateBoss(e);
      this.followBoss(e);
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
    const char = this.character;
    const bar = this.healthBar;
    if (this.shouldSkipTick()) return;

    for (let i = this.level.enemies.length - 1; i >= 0; i--) {
      const enemy = this.level.enemies[i];
      if (this.handleDeadEnemy(enemy, i, char)) continue;
      if (this.handleMeleeKill(enemy, char)) continue;
      this.handleContactDamage(enemy, char, bar);
    }
  }

  handleDeadEnemy(enemy, index, char) {
    if (!enemy?.isDead) return false;
    if (char.isColliding(enemy)) this.level.enemies.splice(index, 1);
    return true;
  }

  // ✅ Design-Regel: Melee killt nur Typ01
  handleMeleeKill(enemy, char) {
    if (!(enemy instanceof Enemy_Typ01)) return false;
    if (enemy.isDead) return false;
    if (!char.hitmakerRange(enemy)) return false;

    enemy.die();
    if (window.audioManager) window.audioManager.play("enemyDeath");
    return true;
  }

  handleContactDamage(enemy, char, bar) {
    if (!enemy || enemy.isDead || enemy.dead()) return;
    if (!char.isColliding(enemy)) return;
    if (!this.canEnemyDamagePlayer(enemy, char)) return;

    this.markLastHitSource(enemy, char);
    char.hit();
    bar.setPercentrage(char.energy);
  }

  isPlayerHurt(character) {
    if (character?.isHurt) return character.isHurt();
    if (character?.hitHurt) return character.hitHurt();
    return false;
  }

  canEnemyDamagePlayer(enemy, char) {
    if (enemy instanceof Boss) return enemy.canDamagePlayer(char);
    return !this.isPlayerHurt(char);
  }

  markLastHitSource(enemy, char) {
    if (enemy instanceof Boss) return (char.lastHitByEnemy1 = true);
    char.lastHitByEnemy1 = !(enemy instanceof Enemy_Typ02);
  }

  checkProjectileHits() {
    const list = this.throwableObjects;

    for (let p = list.length - 1; p >= 0; p--) {
      const proj = list[p];
      const hitEnemy = this.findFirstHitEnemy(proj);
      if (!hitEnemy) continue;

      const consumed = this.applyProjectileRules(hitEnemy, proj);
      if (consumed) list.splice(p, 1);
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
