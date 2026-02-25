const API_KEY = "943c7e5ad518433491f0d3028d732a1f";
import { getJSON } from "./halpers";

export const state = {
  search: {
    query: "",
    results: [],
    page: 1,
    sortRating: false,
  },
  currentPage: 1,
  totalPages: 0,
  totalResults: 0,
  resultsPerPage: 32,
  games: [],
  originalGames: [],
  activeGame: null,
  bookmarks: [],
  topGames: [],
};

export const getGames = async function (page = 1) {
  try {
    state.currentPage = page;

    const sort = state.search.sortRating ? "&ordering=-rating" : "";
    const response = await fetch(
      `https://api.rawg.io/api/games?key=${API_KEY}&page_size=${state.resultsPerPage}&${page ? `page=${state.currentPage}` : ""}${sort}`,
    );
    if (!response.ok) throw new Error("Failed to fetch games data");
    const data = await response.json();

    state.games = data.results.map((game) => {
      return {
        ...game,

        isBookmarked: state.bookmarks.some((b) => b.id === game.id),
      };
    });
    state.originalGames = [...data.results]; // Čuvamo originalne podatke za lokalno sortiranje

    state.totalPages = Math.ceil(data.count / state.resultsPerPage);
  } catch (err) {
    console.error(err);
  }
};

export const searchGames = async function (query, page = 1) {
  try {
    state.currentPage = page;
    state.query = query;
    const response = await fetch(
      `https://api.rawg.io/api/games?key=${API_KEY}&search=${state.query}&search=${query}&page=${page}&page_size=${state.resultsPerPage}`,
    );
    if (!response.ok) throw new Error("Failed to fetch search results");
    const data = await response.json();

    state.games = data.results.map((game) => {
      return {
        ...game,

        isBookmarked: state.bookmarks.some((b) => b.id === game.id),
      };
    });

    state.originalGames = [...data.results]; // Čuvamo originalne podatke za lokalno sortiranje
    state.totalPages = Math.ceil(data.count / state.resultsPerPage);
  } catch (err) {
    console.error(err);
  }
};

export const sortGames = function (isSorted) {
  if (isSorted) {
    state.games = [...state.originalGames];
  } else {
    state.games.sort((a, b) => {
      if (a.name.toLowerCase() < b.name.toLowerCase()) return -1;
      if (a.name.toLowerCase() > b.name.toLowerCase()) return 1;
      return 0;
    });
  }
};

// export const sortByRating = async function (page = 1) {
//   try {
//     state.currentPage = page;

//     const sort = state.search.sortRating ? "&ordering=-rating" : "";
//     const url = `https://api.rawg.io/api/games?key=${API_KEY}&${sort}&page=${page}&page_size=${state.resultsPerPage}`;

//     const data = await getJSON(url);

//     state.games = data.results.map((game) => {
//       return {
//         ...game,
//       };
//     });
//     return state.games;
//   } catch (err) {
//     console.error(err);
//   }
// };

export const getGameDetails = async function (gameId) {
  try {
    const response = await fetch(
      `https://api.rawg.io/api/games/${gameId}?key=${API_KEY}`,
    );
    if (!response.ok) throw new Error("Failed to fetch game details");
    const data = await response.json();
    state.activeGame = data;
  } catch (err) {
    console.error(err);
  }
};

const persistBookmarks = function () {
  localStorage.setItem("bookmarks", JSON.stringify(state.bookmarks));
};

export const addBookmark = function (game) {
  state.bookmarks.push(game);

  const gameInState = state.games.find((g) => g.id === game.id);
  if (gameInState) {
    gameInState.isBookmarked = true;
  }
  persistBookmarks();
};

export const removeBookmark = function (gameId) {
  const index = state.bookmarks.findIndex((b) => b.id === +gameId);
  state.bookmarks.splice(index, 1);

  const gameInState = state.games.find((g) => g.id === +gameId);
  if (gameInState) {
    gameInState.isBookmarked = false;
  }
  persistBookmarks();
};

const init = function () {
  const storage = localStorage.getItem("bookmarks");
  if (storage) state.bookmarks = JSON.parse(storage);
};

init();
