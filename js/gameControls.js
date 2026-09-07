import Game from "./modules/game.js";

export const gamesPool = [];


export function addGamesToPool(...games) {
    gamesPool.push(...games);
}

export function deleteGameFromPool(id) {
    const gameIndex = gamesPool.findIndex(game=>game.id === id);
    if (gameIndex <= -1) {
        return
    } 
    gamesPool.splice(gameIndex, 1);
}

export function findGameById(id) {
    const game = gamesPool.find(game=>game.id === id);
    return game ? game : null;
}

export function updateGameRating(id, newRating) {
    
    const game = gamesPool.find(game=> game.id === id);
    if (game !== undefined && Number.isFinite(newRating) && 0 <= newRating && newRating <= 10) {
        game.rating = newRating;
    }
}

export function updateGameHoursPlayed(id, newHoursPlayed) {
    const game = gamesPool.find(game=> game.id === id);

    if (game !== undefined && Number.isFinite(newHoursPlayed) && newHoursPlayed >= 0) {
        game.hoursPlayed = newHoursPlayed;
    }
}

export function toggleGameCompleted(id) {
    const game = gamesPool.find(game=> game.id === id);
    if (game !== undefined && game !== null) {
        game.completed = !game.completed;
    }
}

export function getCompletedGames() {
    const completedGames = gamesPool.filter((game)=> game.completed === true);
    return completedGames
}

export function getGamesByGenre(genre) {
    const gamesByGenre = gamesPool.filter((game)=>game.genre === genre);
    return gamesByGenre;
}

export function getGamesWithRatingAbove(rating) {
    const gamesRating = gamesPool.filter((game)=>game.rating > rating);
    return gamesRating;
}

export function getTotalHoursPlayed() {
    return gamesPool.reduce((acc, game) => acc + game.hoursPlayed, 0);
}

export function getAverageRating() {
    return Number((gamesPool.length !== 0 ? gamesPool.reduce((acc, game) => acc + game.rating, 0) / gamesPool.length : 0).toFixed(2));
}

export function getMostPlayedGame() {
    return gamesPool.length !== 0 ? gamesPool.reduce((acc, game)=> acc.hoursPlayed < game.hoursPlayed ? game : acc) : null;
}

export function getHighestRatedGame() {
    return gamesPool.length !== 0 ? gamesPool.reduce((acc, game)=> acc.rating < game.rating ? game : acc) : null;
}

export function searchGames(query) {
    return gamesPool.filter((game)=> game.title.toLowerCase().includes(query.toLowerCase()));
}

export function sortGamesByRating() {
    const sortedGamePool = [...gamesPool]
    return sortedGamePool.sort((a, b)=>b.rating - a.rating);
}

export function sortGamesByHoursPlayed() {
    const sortedGamePoolByHours = [...gamesPool];
    return sortedGamePoolByHours.sort((a, b)=>b.hoursPlayed - a.hoursPlayed);
}

export function getTopRatedGames(limit) {
    const filteredTopGames =  sortGamesByRating();
    return filteredTopGames.slice(0, limit);
}

export function getTopPlayedGames(limit) {
    const filteredTopGames = sortGamesByHoursPlayed();
    return filteredTopGames.slice(0, limit);
}

export function getGamesGenreCount() {
    if (gamesPool.length === 0) {
        return null;
    }
    
    const counter = {}
    gamesPool.forEach((game)=>{
        if (game.genre in counter) {
            ++counter[game.genre];
        } else {
            counter[game.genre]=1;   
        }
    })

    console.log(counter);

    return Object.keys(counter).reduce((a,b)=>counter[a]>counter[b] ? a : b);
} 

export function getGamesStatistics() {
    const countCompletedGames = getCompletedGames().length
    const statistic = {
        totalHoursPlayed: getTotalHoursPlayed(),
        totalGamesCount: gamesPool.length,
        totalCompletedGamesCount: countCompletedGames,
        totalNotCompletedGamesCount: gamesPool.length - countCompletedGames,
        avgGamesRating: getAverageRating(),
        mostCommonGenre: getGamesGenreCount(),
    }
    
    return statistic
}

export function groupGamesByGenre() {
    if (gamesPool.length === 0) {
        return null;
    }
    
    const genrePool = {}
    gamesPool.forEach((game)=>{
        if (game.genre in genrePool) {
            genrePool[game.genre].push(game);
        } else {
            genrePool[game.genre] = [game]
        }
    })

    return genrePool;
}

export function getGenreStatistic() {
    if (gamesPool.length === 0) {
        return null;
    }

    const gamesByGenre = groupGamesByGenre();
    const gamesStatistic = {};

    Object.keys(gamesByGenre).forEach((genreGroup)=>{
        let totalGameCount = gamesByGenre[genreGroup].length;

        gamesStatistic[genreGroup] = {
            totalGameCount: totalGameCount,
            hoursPlayed: gamesByGenre[genreGroup].reduce((acc, game)=> acc + game.hoursPlayed, 0),
            avgRating: Number((gamesByGenre[genreGroup].reduce((acc, game)=>acc + game.rating, 0) / totalGameCount).toFixed(2)),
            completedGames: gamesByGenre[genreGroup].filter((game)=>game.completed).length,
        }
    })

    return gamesStatistic;
}

export function getCompletionRate() {
    if (gamesPool.length === 0) {
        return `0%`;
    }

    const completedGame = getCompletedGames();
    return `${((completedGame.length / gamesPool.length) * 100).toFixed(0)}%`; 
}

export function getUnfinishedGames() {
    const uncompletedGames = gamesPool.length !== 0 ? gamesPool.filter((game)=>!game.completed) : [];
    return uncompletedGames;
}

export function getGamesByPlaytimeRange(minHours, maxHours) {
    if (minHours > maxHours) {
        return [];
    }
    const playtimeGames = gamesPool.filter((game)=> game.hoursPlayed >= minHours && game.hoursPlayed <= maxHours);
    return playtimeGames;
}

export function getGamesByRatingRange(minRating, maxRating) {
    if (minRating < 0 || minRating > 10 || maxRating < 0 || maxRating > 10) {
        return [];
    }

    const ratingGames = minRating <= maxRating ? gamesPool.filter((game)=>game.rating >= minRating && game.rating <= maxRating) : [];
    return ratingGames;
}

export function getGamesByCompletionAndRating(completed, minRating) {
    if (minRating < 0 || minRating > 10 || typeof completed !== "boolean") {
        return [];
    }

    const filteredGames = gamesPool.filter((game)=>game.completed === completed && game.rating >= minRating);
    return filteredGames;
}

export function removeGamesByGenre(genre) {
    for (let i=0; i < gamesPool.length; i++) {
        if (gamesPool[i].genre === genre) {
            gamesPool.splice(i, 1);
            --i;
        }
    }

    return gamesPool;
}

export function removeCompletedGames() {
    for (let i=0; i<gamesPool.length; i++) {
        if (gamesPool[i].completed) {
            gamesPool.splice(i, 1);
            --i;
        }
    }

    return gamesPool;
}

export function resetAllRatings() {
    gamesPool.forEach(game=> game.rating = 0)

    return gamesPool;
}

export function resetAllProgress() {
    resetAllRatings();
    gamesPool.forEach((game)=>{
        game.hoursPlayed = 0;
        game.completed = false;
    })
    return gamesPool;
}

export function getCompletedGamesByGenre(genre) {
    return gamesPool.filter((game)=> game.genre === genre && game.completed);
}

export function getCompletedGamesCountByGenre(genre) {
    return getCompletedGamesByGenre(genre).length;
}

export function getUncompletedGamesByGenre(genre) {
    return gamesPool.filter((game)=> game.genre === genre && !game.completed);
}

export function getUncompletedGamesByGenreCount(genre) {
    return getUncompletedGamesByGenre(genre).length;
}

export function getGenreCompletionRate(genre) {
    const gamesByGenre = getGamesByGenre(genre);
    if (gamesByGenre.length === 0) {
        return 0;
    }
    const completedGamesCount = gamesByGenre.filter(game=>game.completed).length 
    return Number(((completedGamesCount / gamesByGenre.length) * 100).toFixed(0));
}

// block 2

export function cloneGame(id) {
    const game = findGameById(id);
    if (game === null) {
        return null;
    }

    const maxId = gamesPool.reduce((acc, game)=>acc >= game.id ? acc : game.id, 0);

    const clonedGame = new Game(
        maxId + 1,
        game.title,
        game.genre,
        game.hoursPlayed,
        game.completed,
        game.rating
    )

    return clonedGame;
}

export function hasDuplicateGame(title) {
    return gamesPool.some((game)=>game.title.toLowerCase() === title.toLowerCase());
}

export function addGameIfNotDuplicate(game) {
    if (!hasDuplicateGame(game.title)) {
        gamesPool.push(game);
        return true;
    }

    return false;
}

export function updateGame(id, updates) {
    const game = findGameById(id);
    if (!game) {
        return false;
    }

    if ((updates?.rating > 10 || updates?.rating < 0 || !Number.isFinite(updates?.rating)) && updates?.rating !== undefined) {
        throw new Error("Not valid value for rating");
    }

    if ((updates?.hoursPlayed < 0 || !Number.isFinite(updates?.hoursPlayed))&& updates?.hoursPlayed !== undefined) {
        throw new Error("Not valid value for playing hours")
    }

    if (typeof updates?.completed !== "boolean" && updates?.completed !== undefined) {
        throw new Error("Not valid value")
    }

    game.title = updates?.title !== undefined ? updates.title : game.title;
    game.genre = updates?.genre !== undefined ? updates.genre : game.genre;
    game.hoursPlayed = updates?.hoursPlayed !== undefined ? updates.hoursPlayed : game.hoursPlayed;
    game.completed = updates?.completed !== undefined ? updates.completed : game.completed;
    game.rating = updates?.rating !== undefined ? updates.rating : game.rating;

    return game;
}

export function bulkUpdateGames(ids, updates) {
    ids.forEach((id)=>{
        updateGame(id, updates);
    })

    return gamesPool;
}

export function removeGamesByIds(ids) {
    ids.forEach((id)=>{
        deleteGameFromPool(id);
    })

    return gamesPool
}

export function getGamesByIds(ids) {
    const gamePoolByIds = [];
    ids.forEach((id)=>{
        let game = findGameById(id);
        if (!game) {
            return ;
        }
        gamePoolByIds.push(game);

    })
    return gamePoolByIds;
}

export function getExistingGameIds() {
    const idsPool = gamesPool.map((game)=>game.id);
    return idsPool;
}

export function mergeGames(newGames) {
    newGames.forEach((game)=>{
        if (!hasDuplicateGame(game.title)) {
            gamesPool.push(game);
        }
    })

    return gamesPool;
}