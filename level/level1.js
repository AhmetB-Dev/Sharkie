const level1 = new Level(
  // 1) Enemies
  [
    new Enemy_Typ01(),
    new Enemy_Typ01(),
    new Enemy_Typ01(),
    new Enemy_Typ02(),
    new Enemy_Typ02(),
    new Enemy_Typ02(),
    new Boss(),
  ],

  [
    new Coin(500, 300),
    new Coin(558, 192),
    new Coin(664, 128),
    new Coin(786, 128),
    new Coin(892, 192),
    new Coin(950, 300),

    new Coin(500 * 2, 300),
    new Coin(500 * 2, 300),
    new Coin(558 * 2, 192),
    new Coin(558 * 2, 192),
    new Coin(558 * 2, 192),
    new Coin(664 * 2, 128),

    new Coin(500 * 3, 300),
    new Coin(500 * 3, 300),
    new Coin(558 * 3, 192),
    new Coin(558 * 3, 192),
    new Coin(558 * 3, 192),
    new Coin(664 * 3, 128),

    new Coin(500 * 4, 300),
    new Coin(500 * 4, 300),
    new Coin(558 * 4, 192),
    new Coin(558 * 4, 192),
    new Coin(558 * 4, 192),
    new Coin(664 * 4, 128),

    new Coin(500 * 5, 300),
    new Coin(500 * 5, 300),
    new Coin(558 * 5, 192),
    new Coin(558 * 5, 192),
    new Coin(558 * 5, 192),
    new Coin(664 * 5, 128),

    new Coin(500 * 6, 300),
    new Coin(500 * 6, 300),
    new Coin(558 * 6, 192),
  ],

  [
    new AmmoPickup("assets/assets_sharkie/4. Marcadores/Posión/Light - Left.png", 150, 320),
    new AmmoPickup("assets/assets_sharkie/4. Marcadores/Posión/Light - Right.png", 700, 320),
    new AmmoPickup("assets/assets_sharkie/4. Marcadores/Posión/Light - Left.png", 900, 320),
    new AmmoPickup("assets/assets_sharkie/4. Marcadores/Posión/Light - Right.png", 1000, 320),
    new AmmoPickup("assets/assets_sharkie/4. Marcadores/Posión/Light - Right.png", 1300, 320),

    new AmmoPickup("assets/assets_sharkie/4. Marcadores/Posión/Light - Left.png", 1700, 320),
    new AmmoPickup("assets/assets_sharkie/4. Marcadores/Posión/Dark - Left.png", 2000, 320),
    new AmmoPickup("assets/assets_sharkie/4. Marcadores/Posión/Dark - Right.png", 2500, 320),
    new AmmoPickup("assets/assets_sharkie/4. Marcadores/Posión/Dark - Left.png", 2800, 320),
    new AmmoPickup("assets/assets_sharkie/4. Marcadores/Posión/Dark - Right.png", 3200, 320),
    new AmmoPickup("assets/assets_sharkie/4. Marcadores/Posión/Dark - Right.png", 3600, 320),
    new AmmoPickup("assets/assets_sharkie/4. Marcadores/Posión/Dark - Left.png", 3750, 320),
    new AmmoPickup("assets/assets_sharkie/4. Marcadores/Posión/Dark - Right.png", 4000, 320),
    new AmmoPickup("assets/assets_sharkie/4. Marcadores/Posión/Dark - Right.png", 4200, 320),
  ],

  [
    new BackgroundObject("assets/assets_sharkie/3. Background/Layers/5. Water/L1.png", -719 * 2, 0, 720, 480),
    new BackgroundObject(
      "assets/assets_sharkie/3. Background/Layers/4.Fondo 2/L1.png",
      -719 * 2,
      0,
      720,
      480
    ),
    new BackgroundObject(
      "assets/assets_sharkie/3. Background/Layers/3.Fondo 1/L1.png",
      -719 * 2,
      0,
      720,
      480
    ),
    new BackgroundObject("assets/assets_sharkie/3. Background/Layers/2. Floor/L1.png", -719 * 2, 0, 720, 480),

    new BackgroundObject("assets/assets_sharkie/3. Background/Layers/5. Water/L.png", -719, 0, 720, 480),
    new BackgroundObject("assets/assets_sharkie/3. Background/Layers/4.Fondo 2/L.png", -719, 0, 720, 480),
    new BackgroundObject("assets/assets_sharkie/3. Background/Layers/3.Fondo 1/L.png", -719, 0, 720, 480),
    new BackgroundObject("assets/assets_sharkie/3. Background/Layers/2. Floor/L.png", -719, 0, 720, 480),

    new BackgroundObject("assets/assets_sharkie/3. Background/Layers/5. Water/L.png", 0, 0, 720, 480),
    new BackgroundObject("assets/assets_sharkie/3. Background/Layers/4.Fondo 2/L.png", 0, 0, 720, 480),
    new BackgroundObject("assets/assets_sharkie/3. Background/Layers/3.Fondo 1/L.png", 0, 0, 720, 480),
    new BackgroundObject("assets/assets_sharkie/3. Background/Layers/2. Floor/L.png", 0, 0, 720, 480),

    new BackgroundObject("assets/assets_sharkie/3. Background/Layers/5. Water/L1.png", 719, 0, 720, 480),
    new BackgroundObject("assets/assets_sharkie/3. Background/Layers/4.Fondo 2/L1.png", 719, 0, 720, 480),
    new BackgroundObject("assets/assets_sharkie/3. Background/Layers/3.Fondo 1/L1.png", 719, 0, 720, 480),
    new BackgroundObject("assets/assets_sharkie/3. Background/Layers/2. Floor/L1.png", 719, 0, 720, 480),

    new BackgroundObject("assets/assets_sharkie/3. Background/Layers/5. Water/L2.png", 719 * 2, 0, 720, 480),
    new BackgroundObject("assets/assets_sharkie/3. Background/Layers/4.Fondo 2/L2.png", 719 * 2, 0, 720, 480),
    new BackgroundObject("assets/assets_sharkie/3. Background/Layers/3.Fondo 1/L2.png", 719 * 2, 0, 720, 480),
    new BackgroundObject("assets/assets_sharkie/3. Background/Layers/2. Floor/L2.png", 719 * 2, 0, 720, 480),

    new BackgroundObject("assets/assets_sharkie/3. Background/Layers/5. Water/D.png", 719 * 3, 0, 720, 480),
    new BackgroundObject("assets/assets_sharkie/3. Background/Layers/4.Fondo 2/D.png", 719 * 3, 0, 720, 480),
    new BackgroundObject("assets/assets_sharkie/3. Background/Layers/3.Fondo 1/D.png", 719 * 3, 0, 720, 480),
    new BackgroundObject("assets/assets_sharkie/3. Background/Layers/2. Floor/D.png", 719 * 3, 0, 720, 480),

    new BackgroundObject("assets/assets_sharkie/3. Background/Barrier/1.png", 1850, 0, 600, 480),

    new BackgroundObject("assets/assets_sharkie/3. Background/Layers/5. Water/D1.png", 719 * 4, 0, 720, 480),
    new BackgroundObject("assets/assets_sharkie/3. Background/Layers/4.Fondo 2/D1.png", 719 * 4, 0, 720, 480),
    new BackgroundObject("assets/assets_sharkie/3. Background/Layers/3.Fondo 1/D1.png", 719 * 4, 0, 720, 480),
    new BackgroundObject("assets/assets_sharkie/3. Background/Layers/2. Floor/D1.png", 719 * 4, 0, 720, 480),

    new BackgroundObject("assets/assets_sharkie/3. Background/Layers/5. Water/D2.png", 719 * 5, 0, 720, 480),
    new BackgroundObject("assets/assets_sharkie/3. Background/Layers/4.Fondo 2/D2.png", 719 * 5, 0, 720, 480),
    new BackgroundObject("assets/assets_sharkie/3. Background/Layers/3.Fondo 1/D2.png", 719 * 5, 0, 720, 480),
    new BackgroundObject("assets/assets_sharkie/3. Background/Layers/2. Floor/D2.png", 719 * 5, 0, 720, 480),

    new BackgroundObject("assets/assets_sharkie/3. Background/Layers/5. Water/D1.png", 719 * 6, 0, 720, 480),
    new BackgroundObject("assets/assets_sharkie/3. Background/Layers/4.Fondo 2/D1.png", 719 * 6, 0, 720, 480),
    new BackgroundObject("assets/assets_sharkie/3. Background/Layers/3.Fondo 1/D1.png", 719 * 6, 0, 720, 480),
    new BackgroundObject("assets/assets_sharkie/3. Background/Layers/2. Floor/D1.png", 719 * 6, 0, 720, 480),

    new BackgroundObject("assets/assets_sharkie/3. Background/Layers/5. Water/D2.png", 719 * 7, 0, 720, 480),
    new BackgroundObject("assets/assets_sharkie/3. Background/Layers/4.Fondo 2/D2.png", 719 * 7, 0, 720, 480),
    new BackgroundObject("assets/assets_sharkie/3. Background/Layers/3.Fondo 1/D2.png", 719 * 7, 0, 720, 480),
    new BackgroundObject("assets/assets_sharkie/3. Background/Layers/2. Floor/D2.png", 719 * 7, 0, 720, 480),
  ],
  [
    new AmbientObject("assets/assets_sharkie/3. Background/Layers/1. Light/1.png", 0, 0, 1000, 500),
    new AmbientObject("assets/assets_sharkie/3. Background/Layers/1. Light/2.png", 0, 1000, 1000, 500),
    new AmbientObject("assets/assets_sharkie/3. Background/Layers/1. Light/2.png", 0, 3800, 1000, 500),
    new AmbientObject("assets/assets_sharkie/3. Background/Layers/1. Light/1.png", 0, 2800, 1000, 500),
  ]
);
