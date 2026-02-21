import * as model from "./model.js";
import view from "./views/view.js";
let isSort = false;
const controller = async function (goToPage = 1) {
  isSort = false; // Resetiraj sortiranje prilikom inicijalnog učitavanja
  await model.getGames(goToPage);
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
    const query = view.getQuery();
    if (!query) return;

    await model.searchGames(query, goToPage);
    console.log(model.state.games);
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
    isSort = false; // Resetiraj sortiranje prilikom promene stranice
    if (model.state.query) {
      await model.searchGames(model.state.query, goToPage);
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

const controlSort = function () {
  // 1. Sortiraj podatke koji su već u modelu
  model.sortGames(isSort);

  isSort = !isSort; // Prebaci stanje sortiranja

  // 2. Odmah ih renderuj ponovo (bez fetch-a!)
  view.render(
    model.state.games,
    model.state.currentPage,
    model.state.totalPages,
  );
};

const init = function () {
  controller();
  view.bindPaginationHandler(controllerPagination);
  view.bindSearchHandler(searchController);

  view.handlerSort(controlSort);
};
init();
