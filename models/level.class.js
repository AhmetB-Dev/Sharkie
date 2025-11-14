class Level {
  enemies;
  coin;
  backgroundObjects;
  clouds;
  level_end = 2400;

  constructor(enemies, coin, backgroundObjects, clouds) {
    this.enemies = enemies;
    this.coin = coin;
    this.backgroundObjects = backgroundObjects;
    this.clouds = clouds;
  }
}
