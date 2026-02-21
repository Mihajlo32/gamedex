const API_KEY = "943c7e5ad518433491f0d3028d732a1f";

export const state = {
  query: "",
  currentPage: 1,
  totalPages: 0,
  totalResults: 0,
  resultsPerPage: 32,
  games: [],
  originalGames: [],
};

export const getGames = async function (page = 1) {
  try {
    state.currentPage = page;
    const response = await fetch(
      `https://api.rawg.io/api/games?key=${API_KEY}&page_size=${state.resultsPerPage}&${page ? `page=${state.currentPage}` : ""}`,
    );
    if (!response.ok) throw new Error("Failed to fetch games data");
    const data = await response.json();

    state.games = data.results;
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

    state.games = data.results;
    state.originalGames = [...data.results]; // Čuvamo originalne podatke za lokalno sortiranje
    state.totalPages = Math.ceil(data.count / state.resultsPerPage);
  } catch (err) {
    console.error(err);
  }
};

// export const sortGamesLocally = function () {
//   // Sortiramo state.games niz po imenu (A-Z)
//   state.games.sort((a, b) => {
//     if (a.name.toLowerCase() < b.name.toLowerCase()) return -1;
//     if (a.name.toLowerCase() > b.name.toLowerCase()) return 1;
//     return 0;
//   });
// };

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
