/**
 * Start screen UI controller (start/settings/fullscreen/sound toggle).
 */
class StartScreen {
  /**
   * @param {Function} onStart - Callback executed when "Start" is clicked.
   */
  constructor(onStart) {
    this.onStart = onStart;
    this.cacheElements();
    this.cacheMuteHomePosition();
    this.render();
    this.bind();
  }

  /**
   * Caches key DOM elements used by the start screen.
   * @returns {void}
   */
  cacheElements() {
    this.screen = document.getElementById("startScreen");
    this.muteBtn = document.getElementById("muteButton");
  }

  /**
   * Stores original mute button parent/sibling to restore later.
   * @returns {void}
   */
  cacheMuteHomePosition() {
    this.muteHomeParent = this.muteBtn?.parentNode || null;
    this.muteHomeNext = this.muteBtn?.nextSibling || null;
  }

  /**
   * Renders start screen from HTML template.
   * @returns {void}
   */
  render() {
    const template = this.getTemplateOrThrow();
    this.screen.replaceChildren(template.content.cloneNode(true));
  }

  /**
   * @throws {Error} If the template element is missing.
   * @returns {HTMLTemplateElement}
   */
  getTemplateOrThrow() {
    const tpl = document.getElementById("startScreenTemplate");
    if (!tpl) throw new Error("startScreenTemplate fehlt in index.html");
    return tpl;
  }

  /**
   * Binds click/change handlers and syncs UI state.
   * @returns {void}
   */
  bind() {
    this.bindClick();
    this.bindChange();
    this.syncSoundToggleState();
  }

  /**
   * Delegated click handling for all buttons inside start screen.
   * @returns {void}
   */
  bindClick() {
    this.screen.addEventListener("click", (event) => {
      const button = this.getClickedButton(event);
      if (!button) return;
      this.handleButtonClick(button, event);
    });
  }

  /**
   * @param {MouseEvent} event
   * @returns {HTMLButtonElement|null}
   */
  getClickedButton(event) {
    return event.target.closest("button");
  }

  /**
   * Normalizes button click behavior and routes action.
   * @param {HTMLButtonElement} button
   * @param {MouseEvent} event
   * @returns {void}
   */
  handleButtonClick(button, event) {
    event.preventDefault();
    event.stopPropagation();
    this.runButtonAction(button.id);
  }

  /**
   * Executes the action for a specific button id.
   * @param {string} buttonId
   * @returns {void}
   */
  runButtonAction(buttonId) {
    if (buttonId === "startBtn") return this.onStart?.();
    if (buttonId === "settingsBtn") return this.toggleSettings(true);
    if (buttonId === "closeSettingsBtn") return this.toggleSettings(false);
    if (buttonId === "fsBtn") return window.requestFullscreen?.();
  }

  /**
   * Delegated change handling (sound toggle).
   * @returns {void}
   */
  bindChange() {
    this.screen.addEventListener("change", (event) => {
      if (!this.isSoundToggle(event.target)) return;
      event.stopPropagation();
      window.audioManager?.setEnabled?.(event.target.checked);
    });
  }

  /**
   * @param {any} target
   * @returns {boolean}
   */
  isSoundToggle(target) {
    return target?.id === "soundToggle";
  }

  /**
   * Loads settings UI state from AudioManager.
   * @returns {void}
   */
  loadSettings() {
    const toggle = this.screen.querySelector("#soundToggle");
    if (toggle && window.audioManager) toggle.checked = window.audioManager.enabled;
  }

  /**
   * Opens/closes settings panel and moves mute button into settings when open.
   * @param {boolean} open
   * @returns {void}
   */
  toggleSettings(open) {
    const elements = this.getSettingsElements();
    if (!elements) return;
    this.applySettingsClasses(elements, open);
    this.toggleMuteButton(open);
  }

  /**
   * @returns {{panel: Element, card: Element}|null}
   */
  getSettingsElements() {
    const panel = this.screen.querySelector("#settingsPanel");
    const card = this.screen.querySelector(".startCard");
    if (!panel || !card) return null;
    return { panel, card };
  }

  /**
   * Applies CSS classes for open/closed settings state.
   * @param {{panel: Element, card: Element}} elements
   * @param {boolean} open
   * @returns {void}
   */
  applySettingsClasses({ panel, card }, open) {
    panel.classList.toggle("show", open);
    card.classList.toggle("settingsOpen", open);
  }

  /**
   * Moves mute button between header and settings slot.
   * @param {boolean} open
   * @returns {void}
   */
  toggleMuteButton(open) {
    if (open) this.mountMuteButton();
    else this.unmountMuteButton();
  }

  /**
   * Mounts mute button into the settings slot.
   * @returns {void}
   */
  mountMuteButton() {
    const slot = this.screen.querySelector("#settingsMuteSlot");
    if (!slot || !this.muteBtn) return;

    slot.appendChild(this.muteBtn);
    this.muteBtn.classList.add("pillBtn", "pillBtnSmall");
  }

  /**
   * Restores mute button to its original DOM position.
   * @returns {void}
   */
  unmountMuteButton() {
    if (!this.muteBtn || !this.muteHomeParent) return;

    this.muteBtn.classList.remove("pillBtn", "pillBtnSmall");
    this.muteHomeParent.insertBefore(this.muteBtn, this.muteHomeNext);
  }

  /**
   * Syncs sound toggle checkbox state with AudioManager.
   * @returns {void}
   */
  syncSoundToggleState() {
    const toggle = this.screen.querySelector("#soundToggle");
    if (toggle) toggle.checked = !!window.audioManager?.enabled;
  }

  /**
   * Shows the start screen.
   * @returns {void}
   */
  show() {
    this.screen.classList.add("show");
  }

  /**
   * Hides the start screen and closes settings.
   * @returns {void}
   */
  hide() {
    this.toggleSettings(false);
    this.screen.classList.remove("show");
  }
}
