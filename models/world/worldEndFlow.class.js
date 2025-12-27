/**
 * End screen + end audio flow for the World.
 */
class WorldEndFlow {
  /**
   * @param {World} world
   */
  constructor(world) {
    /** @type {World} */
    this.world = world;
  }

  /**
   * Shows the end screen once and plays end sounds.
   * @param {boolean} hasWon
   * @returns {void}
   */
  showEndScreen(hasWon) {
    const world = this.world;
    if (world.endScreen) return;

    this.stopBackgroundMusic();
    this.playEndSfx(hasWon);

    world.endScreen = new EndScreen(hasWon, world.canvas.width, world.canvas.height);
  }

  /**
   * Stops background music (requires window.audioManager).
   * @returns {void}
   */
  stopBackgroundMusic() {
    window.audioManager?.stopMusic?.();
  }

  /**
   * Plays win/lose SFX (requires window.audioManager).
   * @param {boolean} hasWon
   * @returns {void}
   */
  playEndSfx(hasWon) {
    const soundKey = hasWon ? "winSfx" : "deathSfx";
    window.audioManager?.play?.(soundKey);
  }
}
