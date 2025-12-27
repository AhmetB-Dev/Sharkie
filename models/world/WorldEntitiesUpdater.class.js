/**
 * Entity update subsystem for the World.
 * - enemies update
 * - projectile update + cleanup
 * - boss death animation update (behind end screen)
 */
class WorldEntitiesUpdater {
  /**
   * @param {World} world
   */
  constructor(world) {
    /** @type {World} */
    this.world = world;
  }

  /**
   * Updates all enemies for the current frame.
   * @param {number} deltaSec
   * @returns {void}
   */
  updateEnemies(deltaSec) {
    const world = this.world;
    for (const enemy of world.level.enemies) {
      this.updateSingleEnemy(enemy, deltaSec);
    }
  }

  /**
   * Updates a single enemy using its available update method.
   * @param {any} enemy
   * @param {number} deltaSec
   * @returns {void}
   */
  updateSingleEnemy(enemy, deltaSec) {
    if (!enemy) return;
    if (enemy.update) return enemy.update(deltaSec);
    enemy.updatePatrol?.(deltaSec);
  }

  /**
   * Updates all projectiles and removes those outside the viewport.
   * @param {number} deltaSec
   * @returns {void}
   */
  updateProjectiles(deltaSec) {
    const world = this.world;
    for (let index = world.throwableObjects.length - 1; index >= 0; index--) {
      const projectile = world.throwableObjects[index];
      projectile?.update?.(deltaSec);
      if (this.isOutOfView(projectile)) {
        projectile?.timers?.clearAll?.();
        world.throwableObjects.splice(index, 1);
      }
    }
  }

  /**
   * Checks if a projectile is outside the camera view (+padding).
   * @param {any} projectile
   * @returns {boolean}
   */
  isOutOfView(projectile) {
    const world = this.world;
    if (!projectile) return true;
    const viewLeft = -world.camera_x;
    const viewRight = viewLeft + world.canvas.width;
    const padding = 300;
    return projectile.x + projectile.width < viewLeft - padding || projectile.x > viewRight + padding;
  }

  /**
   * Updates the boss death animation while the end screen is visible.
   * @param {number} deltaSec
   * @returns {void}
   */
  updateBossDeath(deltaSec) {
    const world = this.world;
    if (!world.level?.enemies) return;
    for (const enemy of world.level.enemies) {
      if (!(enemy instanceof Boss)) continue;
      if (!(enemy.isDead || enemy.dead?.())) continue;
      enemy.update?.(deltaSec);
    }
  }
}
