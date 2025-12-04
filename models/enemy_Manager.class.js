class EnemyManager {
  constructor(level, character) {
    this.level = level;
    this.character = character;
    this.updateEnemyAI;
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
}
