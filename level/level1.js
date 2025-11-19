const level1 = new Level(
  // 1) Enemies
  [
    new Chicken(),
    new Chicken(),
    new Chicken(),
    new SmallChicken(),
    new SmallChicken(),
    new SmallChicken(),
    new Boss(),
  ],

  [
    new Coin("assets/img_pollo_locco/img/8_coin/coin_1.png", 500, 300),
    new Coin("assets/img_pollo_locco/img/8_coin/coin_1.png", 550, 300),
    new Coin("assets/img_pollo_locco/img/8_coin/coin_2.png", 600, 300),
    new Coin("assets/img_pollo_locco/img/8_coin/coin_1.png", 650, 300),
    new Coin("assets/img_pollo_locco/img/8_coin/coin_1.png", 700, 300),
    new Coin("assets/img_pollo_locco/img/8_coin/coin_1.png", 1000, 300),
    new Coin("assets/img_pollo_locco/img/8_coin/coin_1.png", 1050, 300),
    new Coin("assets/img_pollo_locco/img/8_coin/coin_2.png", 1100, 300),
    new Coin("assets/img_pollo_locco/img/8_coin/coin_1.png", 1150, 300),
    new Coin("assets/img_pollo_locco/img/8_coin/coin_1.png", 1200, 300),
  ],

  [
    new Bottle("assets/img_pollo_locco/img/6_salsa_bottle/1_salsa_bottle_on_ground.png", 600, 335),
    new Bottle("assets/img_pollo_locco/img/6_salsa_bottle/2_salsa_bottle_on_ground.png", 233, 335),
    new Bottle("assets/img_pollo_locco/img/6_salsa_bottle/1_salsa_bottle_on_ground.png", 900, 335),
    new Bottle("assets/img_pollo_locco/img/6_salsa_bottle/2_salsa_bottle_on_ground.png", 700, 335),
  ],

  // 2) Background-Objects
  [
    new BackgroundObject("assets/img_pollo_locco/img/5_background/layers/air.png", -719, 0),
    new BackgroundObject("assets/img_pollo_locco/img/5_background/layers/3_third_layer/2.png", -719, 0),
    new BackgroundObject("assets/img_pollo_locco/img/5_background/layers/2_second_layer/2.png", -719, 0),
    new BackgroundObject("assets/img_pollo_locco/img/5_background/layers/1_first_layer/2.png", -719, 0),

    new BackgroundObject("assets/img_pollo_locco/img/5_background/layers/air.png", 0, 0),
    new BackgroundObject("assets/img_pollo_locco/img/5_background/layers/3_third_layer/1.png", 0, 0),
    new BackgroundObject("assets/img_pollo_locco/img/5_background/layers/2_second_layer/1.png", 0, 0),
    new BackgroundObject("assets/img_pollo_locco/img/5_background/layers/1_first_layer/1.png", 0, 0),

    new BackgroundObject("assets/img_pollo_locco/img/5_background/layers/air.png", 719, 0),
    new BackgroundObject("assets/img_pollo_locco/img/5_background/layers/3_third_layer/2.png", 719, 0),
    new BackgroundObject("assets/img_pollo_locco/img/5_background/layers/2_second_layer/2.png", 719, 0),
    new BackgroundObject("assets/img_pollo_locco/img/5_background/layers/1_first_layer/2.png", 719, 0),

    new BackgroundObject("assets/img_pollo_locco/img/5_background/layers/air.png", 719 * 2, 0),
    new BackgroundObject("assets/img_pollo_locco/img/5_background/layers/3_third_layer/1.png", 719 * 2, 0),
    new BackgroundObject("assets/img_pollo_locco/img/5_background/layers/2_second_layer/1.png", 719 * 2, 0),
    new BackgroundObject("assets/img_pollo_locco/img/5_background/layers/1_first_layer/1.png", 719 * 2, 0),

    new BackgroundObject("assets/img_pollo_locco/img/5_background/layers/air.png", 719 * 3, 0),
    new BackgroundObject("assets/img_pollo_locco/img/5_background/layers/3_third_layer/2.png", 719 * 3, 0),
    new BackgroundObject("assets/img_pollo_locco/img/5_background/layers/2_second_layer/2.png", 719 * 3, 0),
    new BackgroundObject("assets/img_pollo_locco/img/5_background/layers/1_first_layer/2.png", 719 * 3, 0),
  ],

  // 3) Clouds
  [new Cloud(0, 0), new Cloud(720, 0)]
);
