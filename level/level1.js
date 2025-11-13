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
