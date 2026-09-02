/**
 * @typedef {"coin"|"tailHit"|"bubbleShot"|"ammoPickup"|"bossHit"|"bossIntro"|"hitMaker"|"enemyDeath"} SoundName
 * @typedef {"title"|"game"} MusicKey
 */

/**
 * Central audio manager for SFX and background music.
 */
class AudioManager {
  constructor() {
    /** @type {boolean} */
    this.enabled = this.loadEnabled();

    /** @type {number} */
    this.cooldownMs = 120;

    /** @type {Record<string, number>} */
    this.lastPlay = {};

    /** @type {HTMLAudioElement|null} */
    this.currentMusic = null;

    this.soundData();
  }

  /**
   * LocalStorage key for audio enabled state.
   * @returns {string}
   */
  storageKey() {
    return "sharkie.audio.enabled";
  }

  /**
   * Loads persisted audio enabled state (defaults to true).
   * @returns {boolean}
   */
  loadEnabled() {
    try {
      const raw = localStorage.getItem(this.storageKey());
      if (raw === null) return true;
      return raw === "1" || raw === "true";
    } catch (_) {
      return true;
    }
  }

  /**
   * Persists current audio enabled state.
   * @returns {void}
   */
  saveEnabled() {
    try {
      localStorage.setItem(this.storageKey(), this.enabled ? "1" : "0");
    } catch (_) {}
  }

  /**
   * Initializes all sound and music assets.
   * @returns {void}
   */
  soundData() {
    /** @type {Record<SoundName, HTMLAudioElement>} */
    this.sounds = {
      coin: this.createSound("assets/assets_sharkie/audio/coin.wav"),
      tailHit: this.createSound("assets/assets_sharkie/audio/tail.wav"),
      bubbleShot: this.createSound("assets/assets_sharkie/audio/shot.wav"),
      ammoPickup: this.createSound("assets/assets_sharkie/audio/ammo.wav"),
      bossHit: this.createSound("assets/assets_sharkie/audio/boss_hit.wav"),
      bossIntro: this.createSound("assets/assets_sharkie/audio/boss_roar.wav"),
      hitMaker: this.createSound("assets/assets_sharkie/audio/hit.wav"),
      enemyDeath: this.createSound("assets/assets_sharkie/audio/enemy.wav"),
    };

    /** @type {Record<MusicKey, HTMLAudioElement>} */
    this.music = {
      title: this.createMusic("assets/assets_sharkie/audio/bg_menu.wav"),
      game: this.createMusic("assets/assets_sharkie/audio/bg_main.wav"),
    };
  }

  /**
   * Creates a non-looping SFX audio element.
   * @param {string} path
   * @returns {HTMLAudioElement}
   */
  createSound(path) {
    const audio = new Audio(path);
    audio.volume = 0.3;
    return audio;
  }

  /**
   * Creates a looping music audio element.
   * @param {string} path
   * @returns {HTMLAudioElement}
   */
  createMusic(path) {
    const audio = new Audio(path);
    audio.loop = true;
    audio.volume = 0.2;
    return audio;
  }

  /**
   * Switches and plays background music by key.
   * @param {MusicKey|string} key
   * @returns {void}
   */
  playMusic(key) {
    const next = this.music[key];
    if (!next) return;

    if (this.currentMusic && this.currentMusic !== next) {
      this.currentMusic.pause();
      this.currentMusic.currentTime = 0;
    }

    this.currentMusic = next;
    this.applyMusicState();
  }

  /**
   * Stops current music and resets playback position.
   * @returns {void}
   */
  stopMusic() {
    if (!this.currentMusic) return;
    this.currentMusic.pause();
    this.currentMusic.currentTime = 0;
    this.currentMusic = null;
  }

  /**
   * Applies mute state to current music (play/pause).
   * @returns {void}
   */
  applyMusicState() {
    if (!this.currentMusic) return;

    if (!this.enabled) {
      this.currentMusic.pause();
      return;
    }

    this.currentMusic.play().catch(() => {});
  }

  /**
   * Plays a sound effect (with cooldown throttling).
   * @param {SoundName|string} name
   * @returns {void}
   */
  play(name) {
    if (!this.enabled) return;

    const now = performance.now();
    const last = this.lastPlay[name] || 0;
    if (now - last < this.cooldownMs) return;
    this.lastPlay[name] = now;

    const sound = this.sounds[name];
    if (!sound) return;

    const clone = sound.cloneNode();
    clone.volume = sound.volume;
    clone.play().catch(() => {});
  }

  /**
   * Toggles global audio enabled state.
   * @returns {void}
   */
  toggleMute() {
    this.enabled = !this.enabled;
    this.saveEnabled();
    this.applyMusicState();
  }

  /**
   * Sets global audio enabled state.
   * @param {boolean} enabled
   * @returns {void}
   */
  setEnabled(enabled) {
    this.enabled = enabled;
    this.saveEnabled();
    this.applyMusicState();
  }
}

const audioManager = new AudioManager();
window.audioManager = audioManager;

document.addEventListener("keydown", (e) => {
  if (e.key === "m" || e.key === "M") {
    audioManager.toggleMute();
  }
});
