class StartScreen {
  constructor(onStart) {
    this.onStart = onStart;
    this.cacheElements();
    this.cacheMuteHomePosition();
    this.render();
    this.bind();
  }

  cacheElements() {
    this.screen = document.getElementById("startScreen");
    this.muteBtn = document.getElementById("muteButton");
  }

  cacheMuteHomePosition() {
    this.muteHomeParent = this.muteBtn?.parentNode || null;
    this.muteHomeNext = this.muteBtn?.nextSibling || null;
  }

  render() {
    const template = this.getTemplateOrThrow();
    this.screen.replaceChildren(template.content.cloneNode(true));
  }

  getTemplateOrThrow() {
    const tpl = document.getElementById("startScreenTemplate");
    if (!tpl) throw new Error("startScreenTemplate fehlt in index.html");
    return tpl;
  }

  bind() {
    this.bindClick();
    this.bindChange();
    this.syncSoundToggleState();
  }

  bindClick() {
    this.screen.addEventListener("click", (event) => {
      const button = this.getClickedButton(event);
      if (!button) return;
      this.handleButtonClick(button, event);
    });
  }

  getClickedButton(event) {
    return event.target.closest("button");
  }

  handleButtonClick(button, event) {
    event.preventDefault();
    event.stopPropagation();
    this.runButtonAction(button.id);
  }

  runButtonAction(buttonId) {
    if (buttonId === "startBtn") return this.onStart?.();
    if (buttonId === "settingsBtn") return this.toggleSettings(true);
    if (buttonId === "closeSettingsBtn") return this.toggleSettings(false);
    if (buttonId === "fsBtn") return window.requestFullscreen?.();
  }

  bindChange() {
    this.screen.addEventListener("change", (event) => {
      if (!this.isSoundToggle(event.target)) return;
      event.stopPropagation();
      window.audioManager?.setEnabled?.(event.target.checked);
    });
  }

  isSoundToggle(target) {
    return target?.id === "soundToggle";
  }

  loadSettings() {
    const toggle = this.screen.querySelector("#soundToggle");
    if (toggle && window.audioManager) toggle.checked = window.audioManager.enabled;
  }

  toggleSettings(open) {
    const elements = this.getSettingsElements();
    if (!elements) return;
    this.applySettingsClasses(elements, open);
    this.toggleMuteButton(open);
  }

  getSettingsElements() {
    const panel = this.screen.querySelector("#settingsPanel");
    const card = this.screen.querySelector(".startCard");
    if (!panel || !card) return null;
    return { panel, card };
  }

  applySettingsClasses({ panel, card }, open) {
    panel.classList.toggle("show", open);
    card.classList.toggle("settingsOpen", open);
  }

  toggleMuteButton(open) {
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
