import * as model from "./model.js";
import view from "./views/view.js";

const controller = async function (goToPage = 1) {
  view.renderSpinner();
  // Resetiraj sortiranje prilikom inicijalnog učitavanja
  await model.getGames(goToPage);
  view.toggleActiveButtonSortRatin(model.state.search.sortRating);

  // console.log(model.games);

  view.render(
    model.state.games,
    model.state.currentPage,
    model.state.totalPages,
  );
  window.scrollTo({ top: 0, behavior: "smooth" });
};

const searchController = async function (goToPage = 1) {
  try {
    // Učitaj sve igre da bismo mogli da označimo koje su bookmarkovane
    view.renderSpinner();

    const query = view.getQuery();
    if (!query) return;

    await model.searchGames(query, goToPage);

    view.render(
      model.state.games,
      model.state.currentPage,
      model.state.totalPages,
    );
  } catch (err) {
    console.error(err);
  }
};

const controllerPagination = async function (goToPage) {
  try {
    if (model.state.search.query) {
      await model.searchGames(model.state.search.query, goToPage);
    } else if (model.state.search.isSort) {
      await model.sortGames(goToPage);
    } else {
      await model.getGames(goToPage);
    }
    view.render(
      model.state.games,
      model.state.currentPage,
      model.state.totalPages,
    );
    window.scrollTo({ top: 0, behavior: "smooth" });
  } catch (err) {
    console.error(err);
  }
};

const controlSort = async function () {
  // 1. Sortiraj podatke koji su već u modelu
  view.renderSpinner();

  model.state.search.isSort = !model.state.search.isSort;
  model.state.search.sortRating = false;
  view.toggleActiveButtonSortRatin(model.state.search.sortRating);

  await model.sortGames();

  // Prebaci stanje sortiranja
  // 2. Odmah ih renderuj ponovo (bez fetch-a!)

  // view.render(
  //   model.state.games,
  //   model.state.currentPage,
  //   model.state.totalPages,
  // );
  view.render(
    model.state.games,
    model.state.currentPage,
    model.state.totalPages,
  );
};

const controlSortRating = async function () {
  try {
    view.renderSpinner();

    model.state.search.sortRating = !model.state.search.sortRating;
    model.state.search.isSort = false;
    model.state.currentPage = 1;

    await model.getGames();
    view.toggleActiveButtonSortRatin(model.state.search.sortRating);

    view.render(
      model.state.games,
      model.state.currentPage,
      model.state.totalPages,
    );
  } catch (err) {
    console.error(err);
  }
};

const controlGameDetails = async function (gameId) {
  try {
    // view.renderSpinner();

    await model.getGameDetails(gameId);

    view.renderGameDetails(model.state.activeGame);
  } catch (err) {
    console.error(err);
  }
};

const controlCloseModal = function () {
  model.state.activeGame = null;

  view.clearGameDetails();
};

const controlBookmark = function (gameId) {
  if (!model.state.bookmarks.some((b) => b.id === +gameId)) {
    const game = model.state.games.find((g) => g.id === +gameId);
    model.addBookmark(game);
  } else {
    model.removeBookmark(+gameId);
  }
  view.update(model.state.games);

  view.renderBookmarks(model.state.bookmarks);
};

const controlShowBookmarks = function () {
  view.renderBookmarks(model.state.bookmarks);
};

const controllCloseBook = function () {
  view.clearBookmark();
};

const controllerRemoveBookFormList = function (id) {
  model.removeBookmark(id);
  view.update(model.state.bookmarks);
  view.update(model.state.games);
};

const coontrolSuug = async function (query) {
  const sugg = await model.getSuggetstions(query);

  view.renderSugg(sugg);
};

const controlSugSearch = async function (query, goToPage = 1) {
  try {
    view.renderSpinner();

    await model.searchGames(query, goToPage);
    view.render(
      model.state.games,
      model.state.currentPage,
      model.state.totalPages,
    );
  } catch (err) {
    console.error(err);
  }
};

const init = function () {
  controller();
  view.bindPaginationHandler(controllerPagination);

  view.bindSearchHandler(searchController);

  view.handlerSort(controlSort);

  view.addHandelrDetails(controlGameDetails);

  view.addHandlerCloseModal(controlCloseModal);

  view.addHandelrBookmark(controlBookmark);

  view.addHandlerShowBookmarks(controlShowBookmarks);

  view.addHandlerCloseBookmark(controllCloseBook);

  view.addHandlerRemoveFromBookmarkList(controllerRemoveBookFormList);

  view.addHandlerClickBook(controlGameDetails);

  view.addHandlerSortByRating(controlSortRating);

  view.addHandlerSuggestions(coontrolSuug);

  view.addHandleClikcSug(controlSugSearch);
};
init();
