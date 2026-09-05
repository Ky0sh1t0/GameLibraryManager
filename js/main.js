import Game from "./modules/game.js";

import {
    gamesPool,
    addGamesToPool,
    deleteGameFromPool,
    findGameById,
    updateGameRating,
    updateGameHoursPlayed,
    toggleGameCompleted,
    getCompletedGames,
    getGamesByGenre,
    getGamesWithRatingAbove,
    getTotalHoursPlayed,
    getAverageRating,
    getMostPlayedGame,
    searchGames,
    sortGamesByRating,
    sortGamesByHoursPlayed,
    getTopRatedGames,
    getTopPlayedGames,
    getGamesStatistics,
    groupGamesByGenre,
    getGenreStatistic,
    getCompletionRate,
    getUnfinishedGames,
    getGamesByPlaytimeRange,
    getGamesByCompletionAndRating,
    removeGamesByGenre,
    removeCompletedGames,
    resetAllRatings,
    resetAllProgress,
} from "./gameControls.js";


const gothic = new Game(
    1,
    "Gothic",
    "RPG",
    45,
    true,
    9
);

const darkSouls = new Game(
    2,
    "Dark Souls",
    "Action RPG",
    120,
    true,
    10
);

const residentEvil = new Game(
    3,
    "Resident Evil 4",
    "Survival Horror",
    35,
    true,
    9
);

const valorant = new Game(
    4,
    "Valorant",
    "Shooter",
    1500,
    false,
    8
);

const signalis = new Game(
    5,
    "Signalis",
    "Survival Horror",
    20,
    false,
    9
);

const eldenRing = new Game(
    6,
    "Elden Ring",
    "Action RPG",
    210,
    true,
    10
);

const residentEvil2 = new Game(
    3,
    "Resident Evil 9: Requiem",
    "Survival Horror",
    35,
    true,
    9
);


// // ==============================
// // ADD
// // ==============================

// console.log("===== ADD GAMES =====");

addGamesToPool(
    gothic,
    darkSouls,
    residentEvil,
    valorant,
    signalis,
    eldenRing,
    residentEvil2
);

console.log(gamesPool);


console.log(searchGames("Resident"))
console.log(sortGamesByRating());
console.log(sortGamesByHoursPlayed());
console.log(getTopRatedGames(2));
console.log(getGamesStatistics());

console.log(groupGamesByGenre());
console.log(getGenreStatistic());
console.log(getCompletionRate());
console.log(getUnfinishedGames());
console.log(getGamesByPlaytimeRange(35, 200));
console.log(getGamesByCompletionAndRating(true, 10));
console.log(getGamesByCompletionAndRating("sus", 10));

// console.log(removeGamesByGenre("Action RPG"));
// console.log(removeCompletedGames());

// console.log(resetAllRatings());
console.log(resetAllProgress());
// // ==============================
// // FIND
// // ==============================

// console.log("\n===== FIND GAME =====");

// console.log("Find id 3:");
// console.log(findGameById(3));

// console.log("Find id 999:");
// console.log(findGameById(999));


// // ==============================
// // UPDATE RATING
// // ==============================

// console.log("\n===== UPDATE RATING =====");

// console.log("Before:");
// console.log(findGameById(1));

// updateGameRating("Gothic", 10);

// console.log("After:");
// console.log(findGameById(1));


// // ==============================
// // UPDATE HOURS
// // ==============================

// console.log("\n===== UPDATE HOURS =====");

// console.log("Before:");
// console.log(findGameById(5));

// updateGameHoursPlayed("Signalis", 30);

// console.log("After:");
// console.log(findGameById(5));


// // ==============================
// // TOGGLE COMPLETED
// // ==============================

// console.log("\n===== TOGGLE COMPLETED =====");

// console.log("Before:");
// console.log(findGameById(5));

// toggleGameCompleted("Signalis");

// console.log("After:");
// console.log(findGameById(5));


// // ==============================
// // COMPLETED GAMES
// // ==============================

// console.log("\n===== COMPLETED GAMES =====");

// getCompletedGames();


// // ==============================
// // GAMES BY GENRE
// // ==============================

// console.log("\n===== SURVIVAL HORROR =====");

// getGamesByGenre("Survival Horror");

// console.log("\n===== ACTION RPG =====");

// getGamesByGenre("Action RPG");


// // ==============================
// // RATING ABOVE
// // ==============================

// console.log("\n===== RATING ABOVE 8 =====");

// getGamesWithRatingAbove(8);

// console.log("\n===== RATING ABOVE 9 =====");

// getGamesWithRatingAbove(9);


// // ==============================
// // TOTAL HOURS
// // ==============================

// console.log("\n===== TOTAL HOURS =====");

// console.log(getTotalHoursPlayed());


// // ==============================
// // AVERAGE RATING
// // ==============================

// console.log("\n===== AVERAGE RATING =====");

// console.log(getAverageRating());


// // ==============================
// // MOST PLAYED GAME
// // ==============================

// console.log("\n===== MOST PLAYED GAME =====");

// // Когда реализуешь функцию:
// console.log(getMostPlayedGame());


// // ==============================
// // DELETE
// // ==============================

// console.log("\n===== DELETE GAME =====");

// console.log("Before delete:");
// console.log(gamesPool);

// deleteGameFromPool(3);

// console.log("After deleting id 3:");
// console.log(gamesPool);
