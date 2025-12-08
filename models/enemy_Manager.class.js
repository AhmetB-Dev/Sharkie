class EnemyManager {
  constructor(level, character, throwableObjects, healthBar) {
    this.level = level;
    this.character = character;
    this.throwableObjects = throwableObjects;
    this.healthBar = healthBar;
    this.startUpdateEnemy();
  }

  startUpdateEnemy() {
    setInterval(() => {
      this.updateEnemyAI();
      this.checkProjectileHits();
      this.updateCharacterHealth();
    }, 100);
  }

  updateEnemyAI() {
    this.updateTyp1();
    this.updateTyp2();
    this.updateBoss();
  }

  updateTyp1() {
    for (const enemy of this.level.enemies) {
      if (enemy instanceof Enemy_Typ01 && !enemy.isDead) {
        enemy.updateAI(this.character);
      }
    }
  }

  updateTyp2() {
    for (const enemy of this.level.enemies) {
      if (enemy instanceof Enemy_Typ02 && !enemy.isDead) {
        enemy.updateAI(this.character);
      }
    }
  }

  updateBoss() {
    for (const enemy of this.level.enemies) {
      if (!(enemy instanceof Boss)) continue;
      if (enemy.isDead || enemy.dead()) continue;
      if (!enemy.playerInRange && this.character.x >= enemy.triggerIntro) {
        enemy.playerInRange = true;
        enemy.isActive = true;
      }

      if (enemy.playerInRange && enemy.introPlayed) {
        enemy.followCharacter(this.character);
      }
    }
  }

  updateCharacterHealth() {
    const char = this.character;
    const healthBar = this.healthBar;

    for (let i = this.level.enemies.length - 1; i >= 0; i--) {
      const enemy = this.level.enemies[i];

      if (this.handleDeadEnemy(enemy, i, char)) continue;
      if (this.handleMeleeKill(enemy, char)) continue;

      this.handleContactDamage(enemy, char, healthBar);
    }
  }

  handleDeadEnemy(enemy, index, char) {
    if (!enemy.isDead) return false;

    if (char.isColliding(enemy)) {
      this.level.enemies.splice(index, 1);
    }
    return true;
  }

  handleMeleeKill(enemy, char) {
    if (!(enemy instanceof Enemy_Typ01)) return false;
    if (!char.hitmakerRange(enemy)) return false;

    enemy.die();
    return true;
  }
  handleContactDamage(enemy, char, healthBar) {
    if (!char.isColliding(enemy)) return;
    if (char.hitHurt()) return;
    if (enemy instanceof Enemy_Typ02) {
      char.lastHitByEnemy1 = false;
    } else {
      char.lastHitByEnemy1 = true;
    }
    char.hit();
    healthBar.setPercentrage(char.energy);
  }

  checkProjectileHits() {
    this.handleProjectileHits(this.throwableObjects);
  }

  handleProjectileHits(projectiles) {
    for (let i = projectiles.length - 1; i >= 0; i--) {
      const projectile = projectiles[i];

      for (let j = this.level.enemies.length - 1; j >= 0; j--) {
        const enemy = this.level.enemies[j];

        if (!projectile.isColliding(enemy)) {
          continue;
        }

        if (enemy instanceof Boss && !enemy.introPlayed) {
          projectiles.splice(i, 1);
          break;
        }

        if (enemy instanceof Boss && projectile.isUltimate && enemy.introPlayed) {
          if (enemy.dead()) {
            enemy.die();
          }
          projectiles.splice(i, 1);
          break;
        }

        if (enemy instanceof Enemy_Typ02) {
          enemy.die();
          projectiles.splice(i, 1);
          break;
        }

        projectiles.splice(i, 1);
        break;
      }
    }
  }
}
