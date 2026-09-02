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
    this.character = character;
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
    const character = this.character;
    character.IMAGES_IDLE = CharacterAssets.IMAGES_IDLE;
    character.IMAGES_LONG_IDLE = CharacterAssets.IMAGES_LONG_IDLE;
    character.IMAGES_WALK = CharacterAssets.IMAGES_WALK;

    character.IMAGES_ATTACK_ANI1 = CharacterAssets.IMAGES_ATTACK_ANI1;
    character.IMAGES_ATTACK_BUBBLE_ANI1 = CharacterAssets.IMAGES_ATTACK_BUBBLE_ANI1;
    character.IMAGES_ATTACK_ANI2 = CharacterAssets.IMAGES_ATTACK_ANI2;

    character.IMAGES_UTLIMATE_ATTACK = CharacterAssets.IMAGES_UTLIMATE_ATTACK;
    character.IMAGES_UTLIMATE_ATTACK_BUBBLE = CharacterAssets.IMAGES_UTLIMATE_ATTACK_BUBBLE;

    character.IMAGES_HURT_ANI1 = CharacterAssets.IMAGES_HURT_ANI1;
    character.IMAGES_HURT_ANI2 = CharacterAssets.IMAGES_HURT_ANI2;
    character.IMAGES_DEAD_ANI1 = CharacterAssets.IMAGES_DEAD_ANI1;
    character.IMAGES_DEAD_ANI2 = CharacterAssets.IMAGES_DEAD_ANI2;
  }

  /**
   * Loads the first idle frame (so Character has an image immediately).
   * @returns {void}
   */
  loadFirstFrame() {
    const character = this.character;
    if (!character.IMAGES_IDLE || !character.IMAGES_IDLE.length) return;
    character.loadImage(character.IMAGES_IDLE[0]);
  }

  /**
   * Preloads all animation frames into the image cache.
   * @returns {void}
   */
  preloadAllFrames() {
    const character = this.character;
    this.preloadList(character.IMAGES_IDLE);
    this.preloadList(character.IMAGES_LONG_IDLE);
    this.preloadList(character.IMAGES_WALK);
    this.preloadList(character.IMAGES_ATTACK_ANI1);
    this.preloadList(character.IMAGES_ATTACK_BUBBLE_ANI1);
    this.preloadList(character.IMAGES_ATTACK_ANI2);
    this.preloadList(character.IMAGES_UTLIMATE_ATTACK);
    this.preloadList(character.IMAGES_UTLIMATE_ATTACK_BUBBLE);
    this.preloadList(character.IMAGES_HURT_ANI1);
    this.preloadList(character.IMAGES_HURT_ANI2);
    this.preloadList(character.IMAGES_DEAD_ANI1);
    this.preloadList(character.IMAGES_DEAD_ANI2);
  }

  /**
   * @param {string[]} frames
   * @returns {void}
   */
  preloadList(frames) {
    if (!frames || !frames.length) return;
    this.character.animationImage(frames);
  }
}
