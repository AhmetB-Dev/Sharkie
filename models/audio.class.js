class AudioManager {
  constructor() {
    this.enabled = true; 
    this.cooldownMs = 120;
    this.lastPlay = {};
    this.sounds = {
      coin: this.createSound("assets/assets_sharkie/audio/coin_collect_soft.wav"),
      tailHit: this.createSound("assets/assets_sharkie/audio/tail_hit.wav"),
      bubbleShot: this.createSound("assets/assets_sharkie/audio/bubble_shot_soft.wav"),
      ammoPickup: this.createSound("assets/assets_sharkie/audio/ammo_pickup_soft.wav"),
      bossHit: this.createSound("assets/assets_sharkie/audio/boss_hit_v1.wav"),
      bossIntro: this.createSound("assets/assets_sharkie/audio/boss_roar_soft.wav"),
      hitMaker: this.createSound("assets/assets_sharkie/audio/player_hit_soft.wav"),
      enemyDeath: this.createSound("assets/assets_sharkie/audio/enemy_die_soft.wav"),
    };
  }

  createSound(path) {
    const audio = new Audio(path);
    audio.volume = 0.4;
    return audio;
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
    console.log("Audio mute:", !this.enabled);
  }

  setEnabled(enabled) {
    this.enabled = enabled;
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
