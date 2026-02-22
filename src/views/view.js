import { state } from "../model";

class View {
  _perentEl = document.querySelector("#game-container");
  _paginationEl = document.querySelector(".pagination-container");
  _searchEl = document.querySelector(".search-box");

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
                         <button class="btn-bookmark">
                                    

                         </button>
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
}
export default new View();
