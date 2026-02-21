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
        return ` <div class="game-card">
        
                      <img src="${this._optimizeImageUrl(igra.background_image) || "https://via.placeholder.com/250"}" alt="">
                      <div class="game-info">
                          <h3>${igra.name}</h3>
                          <p class="rating">Ocena: ${igra.rating} ⭐</p>
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
    console.log(sortBtn);
    sortBtn.addEventListener("click", function () {
      handler();
    });
  }
}

export default new View();
