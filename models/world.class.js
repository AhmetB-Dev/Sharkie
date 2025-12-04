class World {
  canvas;
  ctx;
  input;

  level = level1;

  character = new Character();
  otherDirection = false;
  camera_x = 0;

  healthBar = new Statusbars();
  coinBar = new Statusbars();
  ammoBar = new Statusbars();
  throwableObjects = [];

  enemyManager;

  constructor(canvas, input) {
    this.ctx = canvas.getContext("2d");
    this.canvas = canvas;
    this.input = input;
    this.enemyManager = new EnemyManager(this.level, this.character, this.throwableObjects);
    this.loadStatusBar();
    this.draw();
    this.setWorld();
    this.handlePlayerInteractions();
  }

  loadStatusBar() {
    this.loadAmmoBar();
    this.loadHealthBar();
    this.loadCoinBar();
  }

  loadAmmoBar() {
    this.ammoBar = new Statusbars();
    this.ammoBar.initAmmoBar(0, 0);
  }

  loadHealthBar() {
    this.healthBar = new Statusbars();
    this.healthBar.initHealthBar(0, 50);
  }

  loadCoinBar() {
    this.coinBar = new Statusbars();
    this.coinBar.initCoinBar(0, 105);
  }

  setWorld() {
    this.character.world = this;
  }

  handlePlayerInteractions() {
    setInterval(() => {
      this.checkCollisions();
    }, 100);
  }

  checkCollisions() {
    this.updateHealthBar();
    this.updateAmmoBar();
    this.updateCoinBar();
  }

  updateHealthBar() {
    const char = this.character;

    for (let i = this.level.enemies.length - 1; i >= 0; i--) {
      const enemy = this.level.enemies[i];

      if (enemy.isDead) {
        if (char.isColliding(enemy)) {
          this.level.enemies.splice(i, 1);
        }
        continue;
      }

      if (enemy instanceof Enemy_Typ01 && char.hitmakerRange(enemy)) {
        enemy.die();
        continue;
      }

      if (char.isColliding(enemy)) {
        if (!char.hitHurt()) {
          char.hit();
          this.healthBar.setPercentrage(char.energy);
        }
      }
    }
  }

  updateAmmoBar() {
    setInterval(() => {
      for (let i = this.level.ammo.length - 1; i >= 0; i--) {
        const ammoPickup = this.level.ammo[i];

        if (this.character.isColliding(ammoPickup)) {
          this.level.ammo.splice(i, 1);
          this.character.getItems();

          const ammoPercent = this.character.items * 20;

          this.ammoBar.setStack(ammoPercent);

          console.log("Ammo collected:", this.character.items);
        }
      }
    }, 100);
  }

  updateCoinBar() {
    setInterval(() => {
      for (let i = this.level.coin.length - 1; i >= 0; i--) {
        const coin = this.level.coin[i];

        if (this.character.isColliding(coin)) {
          this.level.coin.splice(i, 1);

          this.character.addCoin();

          const coinPercent = this.character.coins * 20;
          this.coinBar.setStack(coinPercent);

          console.log("Coins collected: ", this.character.coins);
        }
      }
    }, 100);
  }

  draw() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.renderWorldScene();
    let self = this;
    requestAnimationFrame(() => self.draw());
  }

  renderWorldScene() {
    this.ctx.translate(this.camera_x, 0);
    this.addObjectsToMap(this.level.backgroundObjects);
    this.renderStatusBars();
    this.drawWorldActors();
    this.addLevelObjectsToMap();
    this.ctx.translate(-this.camera_x, 0);
  }

  drawWorldActors() {
    this.addToMap(this.character);
    this.addObjectsToMap(this.level.enemies);
  }

  addLevelObjectsToMap() {
    this.addObjectsToMap(this.level.coin);
    this.addObjectsToMap(this.level.ammo);
    this.addObjectsToMap(this.level.ambient);
    this.addObjectsToMap(this.throwableObjects);
  }
  renderStatusBars() {
    this.ctx.translate(-this.camera_x, 0);
    this.addToMap(this.ammoBar);
    this.addToMap(this.healthBar);
    this.addToMap(this.coinBar);
    this.ctx.translate(this.camera_x, 0);
  }

  addObjectsToMap(object) {
    object.forEach((o) => {
      this.addToMap(o);
    });
  }

  addToMap(movableObject) {
    if (movableObject.otherDirection) {
      this.flipImage(movableObject);
    }
    movableObject.draw(this.ctx);
    movableObject.showHitbox(this.ctx);
    if (movableObject.otherDirection) {
      this.flipImageBack(movableObject);
    }
  }

  flipImage(movableObject) {
    this.ctx.save();
    this.ctx.translate(movableObject.width, 0);
    this.ctx.scale(-1, 1);
    movableObject.x = movableObject.x * -1;
  }

  flipImageBack(movableObject) {
    movableObject.x = movableObject.x * -1;
    this.ctx.restore();
  }
}
