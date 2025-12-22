class CollectibleSystem {
  constructor(level, character, coinBar, ammoBar) {
    this.level = level;
    this.character = character;
    this.coinBar = coinBar;
    this.ammoBar = ammoBar;
  }

  update() {
    this.collectAmmo();
    this.collectCoins();
  }

  collectAmmo() {
    for (let i = this.level.ammo.length - 1; i >= 0; i--) {
      const pickup = this.level.ammo[i];
      if (!this.character.isColliding(pickup)) continue;

      this.level.ammo.splice(i, 1);
      this.character.getItems();
      this.ammoBar.setStack(this.character.items * 20);
      window.audioManager?.play("ammoPickup");
    }
  }

  collectCoins() {
    for (let i = this.level.coin.length - 1; i >= 0; i--) {
      const coin = this.level.coin[i];
      if (!this.character.isColliding(coin)) continue;

      coin.clearTimers?.();
      this.level.coin.splice(i, 1);
      this.character.addCoin();
      this.coinBar.setStack(this.character.coins * 20);
      window.audioManager?.play("coin");
    }
  }
}
