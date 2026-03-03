const API_KEY = "943c7e5ad518433491f0d3028d732a1f";
import { getJSON } from "./halpers";

export const state = {
  search: {
    query: "",
    genre: "",
    results: [],
    page: 1,
    sortRating: false,
    isSort: false,
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
  ganders: [],
};

export const getGames = async function (page = 1) {
  try {
    state.currentPage = page;

    const response = await fetch(
      `https://api.rawg.io/api/games?key=${API_KEY}&page_size=${state.resultsPerPage}&${page ? `page=${state.currentPage}` : ""}`,
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
    state.search.query = query;

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

export const sortGames = async function (page = 1) {
  state.currentPage = page;
  const sort = state.search.isSort ? "&ordering=name" : "";
  const response = await fetch(
    `https://api.rawg.io/api/games?key=${API_KEY}&page_size=${state.resultsPerPage}&${page ? `page=${state.currentPage}` : ""}${sort}&metacritic=1,100`,
  );

  const data = await response.json();

  state.games = data.results.map((game) => {
    return {
      ...game,
      isBookmarked: state.bookmarks.some((b) => b.id === game.id),
    };
  });
  state.totalPages = Math.ceil(data.count / state.resultsPerPage);
};
export const sortGamesRating = async function (page = 1) {
  state.currentPage = page;
  const sort = state.search.sortRating ? "&ordering=-rating" : "";
  const response = await fetch(
    `https://api.rawg.io/api/games?key=${API_KEY}&page_size=${state.resultsPerPage}&${page ? `page=${state.currentPage}` : ""}${sort}`,
  );

  const data = await response.json();

  state.games = data.results.map((game) => {
    return {
      ...game,
      isBookmarked: state.bookmarks.some((b) => b.id === game.id),
    };
  });
  state.totalPages = Math.ceil(data.count / state.resultsPerPage);
};

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

export const getSuggetstions = async function (query) {
  try {
    if (query === 0) return;
    const url = `https://api.rawg.io/api/games?key=${API_KEY}&page_size=${state.resultsPerPage}&search=${query}`;

    const data = await getJSON(url);

    return data.results.map((game) => {
      return {
        id: game.id,
        name: game.name,
      };
    });
  } catch (err) {
    console.error(err);
  }
};

export const getGanders = async function () {
  const response = await fetch(
    `https://api.rawg.io/api/genres?key=${API_KEY}&page_size=50`,
  );
  if (!response.ok) throw new Error("Failed to fetch games data");
  const data = await response.json();
  state.ganders = data.results.map((gen) => {
    return {
      id: gen.id,
      name: gen.name,
      slug: gen.slug,
    };
  });
};

export const loadGamesGanders = async function (gener, page = 1) {
  try {
    state.currentPage = page;
    state.search.genre = gener;
    const res = await fetch(
      `https://api.rawg.io/api/games?genres=${gener}&key=${API_KEY}&page_size=${state.resultsPerPage}&page=${page}`,
    );
    const data = await res.json();

    state.games = data.results.map((game) => {
      return {
        ...game,
        isBookmarked: state.bookmarks.some((b) => b.id === game.id),
      };
    });
    state.totalPages = Math.ceil(data.count / state.resultsPerPage);
  } catch (err) {
    console.error(err);
  }
};
init();
