/**
 * Creates a fresh Level 1 instance.
 *
 * Why this exists:
 * - During gameplay enemies/coins/ammo are removed from arrays when collected/defeated.
 * - If Level 1 is a single global instance, a "restart" without page reload would reuse
 *   that mutated instance (missing enemies/boss, wrong HUD state, etc.).
 *
 * @returns {Level}
 */
function createLevel1() {
  return new Level(
    // 1) Enemies
    [
      new Enemy_pufferFish(),
      new Enemy_pufferFish(),
      new Enemy_pufferFish(),
      new Enemy_jellyfish(),
      new Enemy_jellyfish(),
      new Enemy_jellyfish(),
      new Boss(),
    ],

    // 2) Coins
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

    // 3) Ammo pickups
    [
      new AmmoPickup("assets/ui/poison/light-left.webp", 150, 320),
      new AmmoPickup("assets/ui/poison/light-right.webp", 700, 320),
      new AmmoPickup("assets/ui/poison/light-left.webp", 900, 320),
      new AmmoPickup("assets/ui/poison/light-right.webp", 1000, 320),
      new AmmoPickup("assets/ui/poison/light-right.webp", 1300, 320),

      new AmmoPickup("assets/ui/poison/light-left.webp", 1700, 320),
      new AmmoPickup("assets/ui/poison/dark-left.webp", 2000, 320),
      new AmmoPickup("assets/ui/poison/dark-right.webp", 2500, 320),
      new AmmoPickup("assets/ui/poison/dark-left.webp", 2800, 320),
      new AmmoPickup("assets/ui/poison/dark-right.webp", 3200, 320),
      new AmmoPickup("assets/ui/poison/dark-right.webp", 3600, 320),
      new AmmoPickup("assets/ui/poison/dark-left.webp", 3750, 320),
      new AmmoPickup("assets/ui/poison/dark-right.webp", 4000, 320),
      new AmmoPickup("assets/ui/poison/dark-right.webp", 4200, 320),
    ],

    // 4) Background objects (layers + barrier)
    [
      new BackgroundObject("assets/backgrounds/layers/water/l1.webp", -719 * 2, 0, 720, 480),
      new BackgroundObject("assets/backgrounds/layers/backdrop-2/l1.webp", -719 * 2, 0, 720, 480),
      new BackgroundObject("assets/backgrounds/layers/backdrop-1/l1.webp", -719 * 2, 0, 720, 480),
      new BackgroundObject("assets/backgrounds/layers/floor/l1.webp", -719 * 2, 0, 720, 480),

      new BackgroundObject("assets/backgrounds/layers/water/l.webp", -719, 0, 720, 480),
      new BackgroundObject("assets/backgrounds/layers/backdrop-2/l.webp", -719, 0, 720, 480),
      new BackgroundObject("assets/backgrounds/layers/backdrop-1/l.webp", -719, 0, 720, 480),
      new BackgroundObject("assets/backgrounds/layers/floor/l.webp", -719, 0, 720, 480),

      new BackgroundObject("assets/backgrounds/layers/water/l.webp", 0, 0, 720, 480),
      new BackgroundObject("assets/backgrounds/layers/backdrop-2/l.webp", 0, 0, 720, 480),
      new BackgroundObject("assets/backgrounds/layers/backdrop-1/l.webp", 0, 0, 720, 480),
      new BackgroundObject("assets/backgrounds/layers/floor/l.webp", 0, 0, 720, 480),

      new BackgroundObject("assets/backgrounds/layers/water/l1.webp", 719, 0, 720, 480),
      new BackgroundObject("assets/backgrounds/layers/backdrop-2/l1.webp", 719, 0, 720, 480),
      new BackgroundObject("assets/backgrounds/layers/backdrop-1/l1.webp", 719, 0, 720, 480),
      new BackgroundObject("assets/backgrounds/layers/floor/l1.webp", 719, 0, 720, 480),

      new BackgroundObject("assets/backgrounds/layers/water/l2.webp", 719 * 2, 0, 720, 480),
      new BackgroundObject("assets/backgrounds/layers/backdrop-2/l2.webp", 719 * 2, 0, 720, 480),
      new BackgroundObject("assets/backgrounds/layers/backdrop-1/l2.webp", 719 * 2, 0, 720, 480),
      new BackgroundObject("assets/backgrounds/layers/floor/l2.webp", 719 * 2, 0, 720, 480),

      new BackgroundObject("assets/backgrounds/layers/water/d.webp", 719 * 3, 0, 720, 480),
      new BackgroundObject("assets/backgrounds/layers/backdrop-2/d.webp", 719 * 3, 0, 720, 480),
      new BackgroundObject("assets/backgrounds/layers/backdrop-1/d.webp", 719 * 3, 0, 720, 480),
      new BackgroundObject("assets/backgrounds/layers/floor/d.webp", 719 * 3, 0, 720, 480),

      new BackgroundObject("assets/backgrounds/barrier/1.webp", 1850, 0, 600, 480),

      new BackgroundObject("assets/backgrounds/layers/water/d1.webp", 719 * 4, 0, 720, 480),
      new BackgroundObject("assets/backgrounds/layers/backdrop-2/d1.webp", 719 * 4, 0, 720, 480),
      new BackgroundObject("assets/backgrounds/layers/backdrop-1/d1.webp", 719 * 4, 0, 720, 480),
      new BackgroundObject("assets/backgrounds/layers/floor/d1.webp", 719 * 4, 0, 720, 480),

      new BackgroundObject("assets/backgrounds/layers/water/d2.webp", 719 * 5, 0, 720, 480),
      new BackgroundObject("assets/backgrounds/layers/backdrop-2/d2.webp", 719 * 5, 0, 720, 480),
      new BackgroundObject("assets/backgrounds/layers/backdrop-1/d2.webp", 719 * 5, 0, 720, 480),
      new BackgroundObject("assets/backgrounds/layers/floor/d2.webp", 719 * 5, 0, 720, 480),

      new BackgroundObject("assets/backgrounds/layers/water/d1.webp", 719 * 6, 0, 720, 480),
      new BackgroundObject("assets/backgrounds/layers/backdrop-2/d1.webp", 719 * 6, 0, 720, 480),
      new BackgroundObject("assets/backgrounds/layers/backdrop-1/d1.webp", 719 * 6, 0, 720, 480),
      new BackgroundObject("assets/backgrounds/layers/floor/d1.webp", 719 * 6, 0, 720, 480),

      new BackgroundObject("assets/backgrounds/layers/water/d2.webp", 719 * 7, 0, 720, 480),
      new BackgroundObject("assets/backgrounds/layers/backdrop-2/d2.webp", 719 * 7, 0, 720, 480),
      new BackgroundObject("assets/backgrounds/layers/backdrop-1/d2.webp", 719 * 7, 0, 720, 480),
      new BackgroundObject("assets/backgrounds/layers/floor/d2.webp", 719 * 7, 0, 720, 480),
    ],

    // 5) Ambient objects
    [
      new AmbientObject("assets/backgrounds/layers/1-light/1.webp", 0, 0, 1000, 500),
      new AmbientObject("assets/backgrounds/layers/1-light/2.webp", 0, 1000, 1000, 500),
      new AmbientObject("assets/backgrounds/layers/1-light/2.webp", 0, 3800, 1000, 500),
      new AmbientObject("assets/backgrounds/layers/1-light/1.webp", 0, 2800, 1000, 500),
    ],
  );
}

/** @type {Level} */
const level1 = createLevel1();
