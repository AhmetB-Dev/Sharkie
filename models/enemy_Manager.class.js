/**
 * Enemy manager/system:
 * - updates enemy AI (typ1/typ2/boss)
 * - checks projectile hits
 * - applies contact/melee damage rules and updates health HUD
 */
class EnemyManager {
  /**
   * @param {any} level - Level data (expects `enemies` array).
   * @param {Character} character - Player character reference.
   * @param {Array<any>} throwableObjects - Active projectile list.
   * @param {Statusbars} healthBar - HUD health bar.
   * @param {boolean} [autoStart=false] - If true, starts internal interval ticking.
   */
  constructor(level, character, throwableObjects, healthBar, autoStart = false) {
    this.level = level;
    this.character = character;
    this.throwableObjects = throwableObjects;
    this.healthBar = healthBar;
    if (autoStart) this.startUpdateEnemy();
  }

  /**
   * Starts internal update interval (10 FPS).
   * @returns {void}
   */
  startUpdateEnemy() {
    setInterval(() => this.tick(), 100);
  }

  /**
   * Main tick: AI + projectile hits + player health rules.
   * @returns {void}
   */
  tick() {
    if (this.shouldSkipTick()) return;
    this.updateEnemyAI();
    this.checkProjectileHits();
    this.updateCharacterHealth();
  }

  /**
   * Checks global stop conditions (dead, paused, end screen).
   * @returns {boolean}
   */
  shouldSkipTick() {
    const character = this.character;
    const world = character.world;
    return character.dead() || (world && (world.endScreen || world.isPaused));
  }

  /**
   * Updates all enemy types.
   * @returns {void}
   */
  updateEnemyAI() {
    this.updateTyp1();
    this.updateTyp2();
    this.updateBoss();
  }

  /**
   * Updates AI for Enemy_Typ01 instances.
   * @returns {void}
   */
  updateTyp1() {
    for (const enemy of this.level.enemies) {
      if (enemy instanceof Enemy_Typ01 && !enemy.isDead) enemy.updateAI(this.character);
    }
  }

  /**
   * Updates AI for Enemy_Typ02 instances.
   * @returns {void}
   */
  updateTyp2() {
    for (const enemy of this.level.enemies) {
      if (enemy instanceof Enemy_Typ02 && !enemy.isDead) enemy.updateAI(this.character);
    }
  }

  /**
   * Handles boss activation and follow behavior.
   * @returns {void}
   */
  updateBoss() {
    for (const enemy of this.level.enemies) {
      if (!(enemy instanceof Boss)) continue;
      this.activateBoss(enemy);
      this.followBoss(enemy);
    }
  }

  /**
   * Activates boss once player reaches trigger position.
   * @param {Boss} boss
   * @returns {void}
   */
  activateBoss(boss) {
    if (boss.playerInRange) return;
    if (this.character.x < boss.triggerIntro) return;
    boss.playerInRange = true;
    boss.isActive = true;
  }

  /**
   * Makes boss follow character after intro is done.
   * @param {Boss} boss
   * @returns {void}
   */
  followBoss(boss) {
    if (boss.isDead || boss.dead()) return;
    if (!boss.playerInRange || !boss.introPlayed) return;
    boss.followCharacter(this.character);
  }

  /**
   * Applies enemy/player interaction rules and updates HUD.
   * @returns {void}
   */
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

  /**
   * Removes dead enemies when the character collides with them.
   * @param {any} enemy
   * @param {number} index
   * @param {Character} character
   * @returns {boolean} True if handled.
   */
  handleDeadEnemy(enemy, index, character) {
    if (!enemy?.isDead) return false;
    if (character.isColliding(enemy)) this.level.enemies.splice(index, 1);
    return true;
  }

  /**
   * Kills Enemy_Typ01 via melee range check.
   * @param {any} enemy
   * @param {Character} character
   * @returns {boolean} True if enemy was killed.
   */
  handleMeleeKill(enemy, character) {
    if (!(enemy instanceof Enemy_Typ01)) return false;
    if (enemy.isDead) return false;
    if (!character.hitmakerRange(enemy)) return false;

    enemy.die();
    if (window.audioManager) window.audioManager.play("enemyDeath");
    return true;
  }

  /**
   * Applies contact damage when colliding and allowed by rules.
   * @param {any} enemy
   * @param {Character} character
   * @param {Statusbars} healthBar
   * @returns {void}
   */
  handleContactDamage(enemy, character, healthBar) {
    if (!enemy || enemy.isDead || enemy.dead()) return;
    if (!character.isColliding(enemy)) return;
    if (!this.canEnemyDamagePlayer(enemy, character)) return;

    this.markLastHitSource(enemy, character);
    character.hit();
    healthBar.setPercentrage(character.energy);
  }

  /**
   * Checks if player is currently in hurt invulnerability window.
   * @param {Character} character
   * @returns {boolean}
   */
  isPlayerHurt(character) {
    if (character?.isHurt) return character.isHurt();
    if (character?.hitHurt) return character.hitHurt();
    return false;
  }

  /**
   * Damage permission rules (boss has its own window; others depend on player hurt state).
   * @param {any} enemy
   * @param {Character} character
   * @returns {boolean}
   */
  canEnemyDamagePlayer(enemy, character) {
    if (enemy instanceof Boss) return enemy.canDamagePlayer(character);
    return !this.isPlayerHurt(character);
  }

  /**
   * Marks hit source to choose correct hurt animation on character.
   * @param {any} enemy
   * @param {Character} character
   * @returns {void}
   */
  markLastHitSource(enemy, character) {
    if (enemy instanceof Boss) return (character.lastHitByEnemy1 = true);
    character.lastHitByEnemy1 = !(enemy instanceof Enemy_Typ02);
  }

  /**
   * Checks projectile collisions vs enemies and applies per-enemy rules.
   * @returns {void}
   */
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

  /**
   * Finds first enemy hit by projectile.
   * @param {any} projectile
   * @returns {any|null}
   */
  findFirstHitEnemy(projectile) {
    for (const enemy of this.level.enemies) {
      if (!enemy || enemy.isDead) continue;
      if (projectile.isColliding(enemy)) return enemy;
    }
    return null;
  }

  /**
   * Dispatches projectile rules based on enemy type.
   * @param {any} enemy
   * @param {any} projectile
   * @returns {boolean} True if projectile should be removed.
   */
  applyProjectileRules(enemy, projectile) {
    if (enemy instanceof Boss) return this.hitBossWithUltimate(enemy, projectile);
    if (enemy instanceof Enemy_Typ02) return this.killTyp2WithNormalBubble(enemy, projectile);
    return false;
  }

  /**
   * Boss can only be hit by ultimate projectile.
   * @param {Boss} boss
   * @param {any} projectile
   * @returns {boolean}
   */
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

  /**
   * Enemy_Typ02 can be killed by normal bubble (not ultimate).
   * @param {Enemy_Typ02} enemy
   * @param {any} projectile
   * @returns {boolean}
   */
  killTyp2WithNormalBubble(enemy, projectile) {
    if (projectile.isUltimate) return false;

    enemy.die();
    if (window.audioManager) window.audioManager.play("enemyDeath");
    return true;
  }
}
