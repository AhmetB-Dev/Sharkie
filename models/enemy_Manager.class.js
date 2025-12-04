class EnemyManager {
  constructor(level, character, throwableObjects) {
    this.level = level;
    this.character = character;
    this.throwableObjects = throwableObjects;
    this.startUpdateEnemy();
  }

  startUpdateEnemy() {
    setInterval(() => {
      this.updateEnemyAI();
      this.checkProjectileHits();
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

      if (!enemy.playerInRange && this.character.x >= enemy.triggerIntro) {
        enemy.playerInRange = true;
        enemy.isActive = true;
      }

      if (enemy.playerInRange && enemy.introPlayed) {
        enemy.followCharacter(this.character);
      }
    }
  }

  checkProjectileHits() {
    this.handleProjectileHits(this.throwableObjects);
  }

  handleProjectileHits(projectiles) {
    for (let i = projectiles.length - 1; i >= 0; i--) {
      const projectile = projectiles[i];

      for (let j = this.level.enemies.length - 1; j >= 0; j--) {
        const enemy = this.level.enemies[j];

        if (projectile.isColliding(enemy)) {
          if (enemy instanceof Enemy_Typ02) {
            enemy.die();
          }
          projectiles.splice(i, 1);
          break;
        }
      }
    }
  }
}
