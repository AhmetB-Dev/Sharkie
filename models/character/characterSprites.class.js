/**
 * Handles linking and preloading character animation assets.
 * Keeps Character.class.js small and focused.
 */
class CharacterSprites {
  /**
   * @param {Character} character
   */
  constructor(character) {
    /** @type {Character} */
    this.c = character;
  }

  /**
   * Initializes character animation arrays, loads first frame and preloads all frames.
   * @returns {void}
   */
  init() {
    this.linkAssets();
    this.loadFirstFrame();
    this.preloadAllFrames();
  }

  /**
   * Links animation frame arrays from CharacterAssets onto the Character instance.
   * @returns {void}
   */
  linkAssets() {
    const c = this.c;
    c.IMAGES_IDLE = CharacterAssets.IMAGES_IDLE;
    c.IMAGES_LONG_IDLE = CharacterAssets.IMAGES_LONG_IDLE;
    c.IMAGES_WALK = CharacterAssets.IMAGES_WALK;

    c.IMAGES_ATTACK_ANI1 = CharacterAssets.IMAGES_ATTACK_ANI1;
    c.IMAGES_ATTACK_BUBBLE_ANI1 = CharacterAssets.IMAGES_ATTACK_BUBBLE_ANI1;
    c.IMAGES_ATTACK_ANI2 = CharacterAssets.IMAGES_ATTACK_ANI2;

    c.IMAGES_UTLIMATE_ATTACK = CharacterAssets.IMAGES_UTLIMATE_ATTACK;
    c.IMAGES_UTLIMATE_ATTACK_BUBBLE = CharacterAssets.IMAGES_UTLIMATE_ATTACK_BUBBLE;

    c.IMAGES_HURT_ANI1 = CharacterAssets.IMAGES_HURT_ANI1;
    c.IMAGES_HURT_ANI2 = CharacterAssets.IMAGES_HURT_ANI2;
    c.IMAGES_DEAD_ANI1 = CharacterAssets.IMAGES_DEAD_ANI1;
    c.IMAGES_DEAD_ANI2 = CharacterAssets.IMAGES_DEAD_ANI2;
  }

  /**
   * Loads the first idle frame (so Character has an image immediately).
   * @returns {void}
   */
  loadFirstFrame() {
    const c = this.c;
    if (!c.IMAGES_IDLE || !c.IMAGES_IDLE.length) return;
    c.loadImage(c.IMAGES_IDLE[0]);
  }

  /**
   * Preloads all animation frames into the image cache.
   * @returns {void}
   */
  preloadAllFrames() {
    const c = this.c;
    this.preloadList(c.IMAGES_IDLE);
    this.preloadList(c.IMAGES_LONG_IDLE);
    this.preloadList(c.IMAGES_WALK);

    this.preloadList(c.IMAGES_ATTACK_ANI1);
    this.preloadList(c.IMAGES_ATTACK_BUBBLE_ANI1);
    this.preloadList(c.IMAGES_ATTACK_ANI2);

    this.preloadList(c.IMAGES_UTLIMATE_ATTACK);
    this.preloadList(c.IMAGES_UTLIMATE_ATTACK_BUBBLE);

    this.preloadList(c.IMAGES_HURT_ANI1);
    this.preloadList(c.IMAGES_HURT_ANI2);
    this.preloadList(c.IMAGES_DEAD_ANI1);
    this.preloadList(c.IMAGES_DEAD_ANI2);
  }

  /**
   * @param {string[]} frames
   * @returns {void}
   */
  preloadList(frames) {
    if (!frames || !frames.length) return;
    this.c.animationImage(frames);
  }
}
