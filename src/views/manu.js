class MenuView {
  _menu = document.querySelector(".controls");
  _overlay = document.querySelector(".overlay-sidebar");
  _btnOpen = document.querySelector(".ham-mani");
  _btnClose = document.querySelector(".btn-close-menu");

  constructor() {
    this._addHandlerShowWindow();
    this._addHandlerHideWindow();
  }

  toggleMenu() {
    this._menu.classList.toggle("controls--active");
    this._overlay.classList.toggle("hidden");
    // Onemogući skrolovanje pozadine dok je meni otvoren
    document.body.classList.toggle("stop-scrolling");
  }

  _addHandlerShowWindow() {
    this._btnOpen.addEventListener("click", this.toggleMenu.bind(this));
  }

  _addHandlerHideWindow() {
    this._btnClose.addEventListener("click", this.toggleMenu.bind(this));
    this._overlay.addEventListener("click", this.toggleMenu.bind(this));
  }

  // Ovu metodu zoveš iz kontrolera da zakačiš akcije na dugmiće
  addHandlerAction(handler, selector) {
    document.querySelector(selector).addEventListener("click", function (e) {
      e.preventDefault();
      handler();
    });
  }
}

export default new MenuView();
