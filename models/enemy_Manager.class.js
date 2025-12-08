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

      // Boss ist tot → AI überspringen
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

        // Nur weitermachen, wenn wirklich Kollision
        if (!projectile.isColliding(enemy)) {
          continue;
        }

        // 1. Boss während Intro → Treffer ignorieren (kein Schaden)
        if (enemy instanceof Boss && !enemy.introPlayed) {
          // Bubble platzt am Boss, aber macht keinen Schaden
          projectiles.splice(i, 1);
          break;
        }

        // 2. Boss NACH Intro & Ultimate-Bubble → Schaden + Hurt/Death
        if (enemy instanceof Boss && projectile.isUltimate && enemy.introPlayed) {
          enemy.hit(); // -20 Energie, triggert hitHurt() über lastHit
          if (enemy.dead()) {
            enemy.die(); // setzt isDead, stoppt Bewegung, Death-Anim
          }
          projectiles.splice(i, 1);
          break;
        }

        // 3. Normaler Typ-2 Gegner → stirbt sofort
        if (enemy instanceof Enemy_Typ02) {
          // ✅ nur der gültige Klassenname
          enemy.die();
          projectiles.splice(i, 1);
          break;
        }

        // 4. Standard-Fall für andere Gegner: Bubble einfach entfernen
        projectiles.splice(i, 1);
        break;
      }
    }
  }
}
