import { state } from "../model";

class View {
  _perentEl = document.querySelector("#game-container");
  _paginationEl = document.querySelector(".pagination-container");
  _searchEl = document.querySelector(".search-box");
  _bookmarkEl = document.querySelector(".bookmarks__list");

  _errorMessage = "No games found. Please try a different search.";
  _data;

  render(data, page, totalPages) {
    if (!data || (Array.isArray(data) && data.length === 0))
      return this.renderError();

    this._data = data;
    const html = this._generateMarjup(this._data);
    this.clear();
    this._perentEl.insertAdjacentHTML("afterbegin", html);
    this._renderPagination(page, totalPages);
  }

  update(data) {
    this._data = data;
    const newHtml = this._generateMarjup(this._data);
    const newDom = document.createRange().createContextualFragment(newHtml);
    const newElement = Array.from(newDom.querySelectorAll("*"));
    const curElement = Array.from(this._perentEl.querySelectorAll("*"));
    newElement.forEach((newEl, i) => {
      const curEl = curElement[i];
      if (
        !newEl.isEqualNode(curEl) &&
        newEl.firstChild?.nodeValue.trim() !== ""
      ) {
        curEl.textContent = newEl.textContent;
      }
      if (!newEl.isEqualNode(curEl)) {
        Array.from(newEl.attributes).forEach((attr) =>
          curEl.setAttribute(attr.name, attr.value),
        );
      }
    });
  }

  clear() {
    this._perentEl.innerHTML = "";
  }

  renderError(message = this._errorMessage) {
    this.clear();
    const markup = `
      <div class="error-message">
        <p>⚠️ ${message}</p>
      </div>
    `;
    this._parentElement.innerHTML = markup;
  }

  getQuery() {
    const input = this._searchEl.querySelector("#searchInput");
    const query = input.value.trim();

    input.value = "";
    return query;
  }

  bindSearchHandler(handler) {
    this._searchEl.addEventListener("submit", function (e) {
      e.preventDefault();
      // const btn = e.target.closest("#searchBtn");
      // if (!btn) return;
      handler();
    });
  }

  _optimizeImageUrl(url) {
    if (!url) return; // Zamenska slika ako URL nije dostupan
    return url.replace("/media/", "/media/crop/600/400/");
  }

  _generateMarjup(igra) {
    return igra

      .map((igra) => {
        return ` <div class="game-card" data-id="${igra.id}">
        
                      <img src="${this._optimizeImageUrl(igra.background_image) || "https://via.placeholder.com/250"}" alt="">
                      <div class="game-info">
                          <h3>${igra.name}</h3>
                          <p class="rating">Ocena: ${igra.rating} ⭐</p>
                         <button class= "btn-bookmark ${igra.isBookmarked ? "acctive" : ""}">${igra.isBookmarked ? "📖" : "📘"}</button>

                      </div>
                     
                  </div>`;
      })
      .join("");
  }

  _renderPagination(currentPage, totalPages) {
    const total = totalPages;
    const markup = `
   
    
    
    
    <button id="prevBtn" class="nav-btn ${
      currentPage === 1 ? "hidden" : ""
    }"  data-goto="${currentPage - 1}"> <svg class="w-6 h-6 text-gray-800 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
  <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m15 19-7-7 7-7"/>
</svg></button>
    <span id="pageNumber">Page ${currentPage} - ${total}</span>
    <button id="nextBtn" class="nav-btn ${
      currentPage === totalPages ? "hidden" : ""
    }"  data-goto="${currentPage + 1}">
       <svg class="w-6 h-6 text-gray-800 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
  <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m9 5 7 7-7 7"/>
</svg>

    </button>`;
    this._paginationEl.innerHTML = markup;
  }

  bindPaginationHandler(handler) {
    this._paginationEl.addEventListener("click", (e) => {
      const btn = e.target.closest(".nav-btn");
      if (!btn) return;
      const goToPage = +btn.dataset.goto;
      handler(goToPage);
    });
  }

  handlerSort(handler) {
    const sortBtn = document.querySelector(".sort-btn");
    if (!sortBtn) return;

    sortBtn.addEventListener("click", function () {
      handler();
    });
  }

  _generateDetailsMarjup(game) {
    return `<div class="overlay"></div> <div class="game-modal">
      <button class="btn-close-modal">&times;</button>
      <div class="modal-content" data-id="${game.id}">
        <img src="${game.background_image}" class="modal-img" />
        <div class="modal-data">
          <h1>${game.name}</h1>
          <div class="modal-description">${game.description}</div>
          <div class="modal-info">
             <span>Rating: ⭐${game.rating}</span>
             <span>Released: ${game.released}</span>
             
          </div>
        </div>
      </div>
    </div>`;
  }

  renderGameDetails(game) {
    const detailsContainer = document.querySelector(".details-container");
    const markup = this._generateDetailsMarjup(game);
    detailsContainer.innerHTML = markup;
  }

  addHandelrDetails(handler) {
    this._perentEl.addEventListener("click", function (e) {
      if (e.target.classList.contains("btn-bookmark")) {
        return;
      }

      const card = e.target.closest(".game-card");
      if (!card) return;

      const gameId = card.dataset.id;
      handler(gameId);
    });
  }

  addHandlerCloseModal(handler) {
    const detailsContainer = document.querySelector(".details-container");
    detailsContainer.addEventListener("click", function (e) {
      const btnClose = e.target.closest(".btn-close-modal");
      const overlay = e.target.closest(".overlay");

      e.stopImmediatePropagation();
      e.preventDefault();
      if (btnClose || overlay) {
        handler();
      }
    });

    window.addEventListener("keydown", function (e) {
      if (e.key === "Escape") {
        handler();
      }
    });
  }

  clearGameDetails() {
    const detailsContainer = document.querySelector(".details-container");
    detailsContainer.innerHTML = "";
  }

  addHandelrBookmark(handler) {
    this._perentEl.addEventListener("click", function (e) {
      const bookmarkBtn = e.target.closest(".btn-bookmark");
      if (!bookmarkBtn) return;

      e.stopPropagation(); // Sprečava da se klik na bookmark dugme tretira kao klik na kartu igre
      e.preventDefault();
      const gameCard = bookmarkBtn.closest(".game-card");
      const gameId = gameCard.dataset.id;

      handler(gameId);
    });
  }

  _generateBookmarkMarkap(data) {
    return data
      .map(
        (game) =>
          `<div class="bookmark-item" data-id="${game.id}">
        <div class="game--name">
          <img src="${game.background_image}" width="100" alt="${game.name}">
          <div class="bookmark-info">
            <h4>${game.name}</h4>
          </div>
          </div>
          <button class="btn-remove-bookmark" data-id="${game.id}">
             <i class="ph-trash">X</i>
          </button>
        </div>
      `,
      )
      .join("");
  }

  renderBookmarks(data) {
    const markup = this._generateBookmarkMarkap(data);
    this._bookmarkEl.innerHTML = markup;
  }

  addHandlerShowBookmarks(handler) {
    const bookmarkBtn = document.querySelector("#bookmarkBtn");
    if (!bookmarkBtn) return;
    bookmarkBtn.addEventListener("click", function () {
      const bookmarkWindow = document.querySelector(".bookmarks-overlay");
      bookmarkWindow.classList.remove("hidden");
      handler();
    });
  }

  addHandlerCloseBookmark(handler) {
    const book = document.querySelector(".bookmark--container");
    book.addEventListener("click", function (e) {
      const btn = e.target.closest(".btn--close-bookmarks");
      if (!btn) return;

      handler();
    });

    const over = document.querySelector(".bookmarks-overlay");
    over.addEventListener("click", function (e) {
      if (e.target.classList.contains("bookmarks-overlay")) handler();
    });

    window.addEventListener("keydown", function (e) {
      const over = document.querySelector(".bookmarks-overlay");
      // Zatvaraj samo ako prozor NIJE sakriven
      if (e.key === "Escape" && !over.classList.contains("hidden")) {
        handler();
      }
    });
  }

  clearBookmark() {
    const over = document.querySelector(".bookmarks-overlay");
    over.classList.add("hidden");
  }

  addHandlerRemoveFromBookmarkList(handler) {
    this._bookmarkEl.addEventListener("click", function (e) {
      const remove = e.target.closest(".btn-remove-bookmark");
      if (!remove) return;

      e.stopImmediatePropagation();
      e.preventDefault();
      const bookmarkItem = e.target.closest(".bookmark-item");
      bookmarkItem.classList.add("remove");

      const id = bookmarkItem.dataset.id;

      handler(id);
    });
  }

  addHandlerClickBook(handler) {
    this._bookmarkEl.addEventListener("click", function (e) {
      const bookGame = e.target.closest(".bookmark-item");
      if (!bookGame) return;
      const id = bookGame.dataset.id;
      handler(id);
    });
  }
}
export default new View();
