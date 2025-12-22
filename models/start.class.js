class StartScreen {
  constructor(onStart) {
    this.onStart = onStart;
    this.screen = document.getElementById("startScreen");

    this.muteBtn = document.getElementById("muteButton");
    this.muteHomeParent = this.muteBtn?.parentNode || null;
    this.muteHomeNext = this.muteBtn?.nextSibling || null;

    this.render();
    this.bind();
  }

  render() {
    const tpl = document.getElementById("startScreenTemplate");
    if (!tpl) throw new Error("startScreenTemplate fehlt in index.html");

    // Startscreen-Root leeren und Template rein-klonen
    this.screen.replaceChildren(tpl.content.cloneNode(true));
  }

  bind() {
    this.screen.addEventListener("click", (e) => {
      const btn = e.target.closest("button");
      if (!btn) return;
      e.preventDefault();
      e.stopPropagation();
      if (btn.id === "startBtn") return this.onStart?.();
      if (btn.id === "settingsBtn") return this.toggleSettings(true);
      if (btn.id === "closeSettingsBtn") return this.toggleSettings(false);
      if (btn.id === "fsBtn") return window.requestFullscreen?.();
    });
    this.screen.addEventListener("change", (e) => {
      if (e.target.id !== "soundToggle") return;
      e.stopPropagation();
      window.audioManager?.setEnabled?.(e.target.checked);
    });
    this.syncSoundToggleState();
  }

  loadSettings() {
    const toggle = this.screen.querySelector("#soundToggle");
    if (toggle && window.audioManager) toggle.checked = window.audioManager.enabled;
  }

  toggleSettings(open) {
    const panel = this.screen.querySelector("#settingsPanel");
    const card = this.screen.querySelector(".startCard");
    if (!panel || !card) return;

    panel.classList.toggle("show", open);
    card.classList.toggle("settingsOpen", open);

    if (open) this.mountMuteButton();
    else this.unmountMuteButton();
  }

  mountMuteButton() {
    const slot = this.screen.querySelector("#settingsMuteSlot");
    if (!slot || !this.muteBtn) return;

    slot.appendChild(this.muteBtn);
    this.muteBtn.classList.add("pillBtn", "pillBtnSmall");
  }

  unmountMuteButton() {
    if (!this.muteBtn || !this.muteHomeParent) return;

    this.muteBtn.classList.remove("pillBtn", "pillBtnSmall");
    this.muteHomeParent.insertBefore(this.muteBtn, this.muteHomeNext);
  }

  syncSoundToggleState() {
    const toggle = this.screen.querySelector("#soundToggle");
    if (toggle) toggle.checked = !!window.audioManager?.enabled;
  }

  show() {
    this.screen.classList.add("show");
  }

  hide() {
    this.toggleSettings(false);
    this.screen.classList.remove("show");
  }
}
