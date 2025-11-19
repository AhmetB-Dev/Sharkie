class Level {
  enemies;
  coin;
  bottels;
  backgroundObjects;
  clouds;
  level_end = 2400;

  constructor(enemies, coin, bottels, backgroundObjects, clouds) {
    this.enemies = enemies;
    this.coin = coin;
    this.bottels = bottels;
    this.backgroundObjects = backgroundObjects;
    this.clouds = clouds;
  }
}
