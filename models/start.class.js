class StartScreen {
  constructor(onStart) {
    this.onStart = onStart;
    this.el = document.getElementById("startScreen");

    this.muteBtn = document.getElementById("muteButton");
    this.muteHomeParent = this.muteBtn?.parentNode || null;
    this.muteHomeNext = this.muteBtn?.nextSibling || null;

    this.render();
    this.bind();
  }

  render() {
    this.el.innerHTML = `
    <div class="startCard">
      <h2 class="startTitle">SHARKIE</h2>

      <div class="startActions">
        <button id="startBtn" type="button" class="pillBtn">START</button>
        <button id="settingsBtn" type="button" class="pillBtn">SETTINGS</button>
        <button id="fsBtn" type="button" class="pillBtn">FULLSCREEN</button>
      </div>

      <div id="settingsPanel" class="settingsPanel">
        <h3 class="panelTitle">Settings</h3>

        <label class="settingRow">
          <span>Sound</span>
          <input id="soundToggle" type="checkbox" />
        </label>

        <div class="controlsBlock">
          <h4 class="panelSubTitle">controls</h4>
          <div class="controlsGrid">
            <img class="controlsImg" src="assets/assets_sharkie/6.Botones/controls_primary.png" />
            <img class="controlsImg" src="assets/assets_sharkie/6.Botones/controls_alternative.png" />
          </div>
        </div>

        <div class="settingsActions">
          <button id="closeSettingsBtn" type="button" class="pillBtn pillBtnSmall">BACK</button>
        </div>
      </div>
    </div>
  `;
  }

  bind() {

    this.el.addEventListener("click", (e) => {

      const btn = e.target.closest("button");

      if (!btn) return;


      e.preventDefault();

      e.stopPropagation();


      if (btn.id === "startBtn") return this.onStart?.();

      if (btn.id === "settingsBtn") return this.toggleSettings(true);

      if (btn.id === "closeSettingsBtn") return this.toggleSettings(false);

      if (btn.id === "fsBtn") return window.requestFullscreen?.();

    });


    this.el.addEventListener("change", (e) => {

      if (e.target.id !== "soundToggle") return;


      e.stopPropagation();

      window.audioManager?.setEnabled?.(e.target.checked);

    });


    this.syncSoundToggleState();

  }

  loadSettings() {
    const toggle = this.el.querySelector("#soundToggle");
    if (toggle && window.audioManager) toggle.checked = window.audioManager.enabled;
  }

  toggleSettings(open) {
    const panel = this.el.querySelector("#settingsPanel");
    const card = this.el.querySelector(".startCard");
    if (!panel || !card) return;

    panel.classList.toggle("show", open);
    card.classList.toggle("settingsOpen", open);

    if (open) this.mountMuteButton();
    else this.unmountMuteButton();
  }

  mountMuteButton() {
    const slot = this.el.querySelector("#settingsMuteSlot");
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
  const toggle = this.el.querySelector("#soundToggle");
  if (toggle) toggle.checked = !!window.audioManager?.enabled;
}
  show() {
    this.el.classList.add("show");
  }

  hide() {
    this.toggleSettings(false);
    this.el.classList.remove("show");
  }
}
