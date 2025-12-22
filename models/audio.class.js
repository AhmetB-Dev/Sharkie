class AudioManager {
  constructor() {
    this.enabled = true;
    this.cooldownMs = 120;
    this.lastPlay = {};
    this.soundData();
    this.currentMusic = null;
  }

  soundData() {
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
    this.music = {
      title: this.createMusic("assets/assets_sharkie/audio/bg_menu.wav"),
      game: this.createMusic("assets/assets_sharkie/audio/bg_main.wav"),
    };
  }

  createSound(path) {
    const audio = new Audio(path);
    audio.volume = 0.3;
    return audio;
  }
  createMusic(path) {
    const audio = new Audio(path);
    audio.loop = true;
    audio.volume = 0.2;
    return audio;
  }

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

  stopMusic() {
    if (!this.currentMusic) return;
    this.currentMusic.pause();
    this.currentMusic.currentTime = 0;
    this.currentMusic = null;
  }

  applyMusicState() {
    if (!this.currentMusic) return;

    if (!this.enabled) {
      this.currentMusic.pause();
      return;
    }

    this.currentMusic.play().catch(() => {});
  }

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

  toggleMute() {
    this.enabled = !this.enabled;
    this.applyMusicState();
  }

  setEnabled(enabled) {
    this.enabled = enabled;
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

window.addEventListener("DOMContentLoaded", () => {
  const btn = document.getElementById("muteButton");
  if (btn) {
    btn.addEventListener("click", () => {
      audioManager.toggleMute();
      btn.textContent = audioManager.enabled ? "🔊 Sound an" : "🔇 Sound aus";
    });
  }
});

