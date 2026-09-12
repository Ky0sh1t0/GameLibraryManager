export const gamesPool = [];


export function addGamesToPool(...games) {
    gamesPool.push(...games);
}

export function deleteGameFromPool(id) {
    const gameIndex = gamesPool.findIndex(game=>game.id === id);
    if (gameIndex === -1) {
        return
    } 
    gamesPool.splice(gameIndex, 1);
}

export function findGameById(id) {
    const game = gamesPool.find(game=>game.id === id);
    return game ? game : null;
}

export function toggleGameCompleted(id) {
    const game = gamesPool.find(game=> game.id === id);
    if (game !== undefined && game !== null) {
        game.completed = !game.completed;
    }
}

export function searchGames(query, games) {
    return games.filter((game)=> game.title.toLowerCase().includes(query));
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

export function hasDuplicateGameSameTitle(gameId, title) {
    return gamesPool.some((game)=>game.title.toLowerCase().trim()===title.toLowerCase().trim() && game.id !== gameId);
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


// private 

function getCompletedGames() {
    const completedGames = gamesPool.filter((game)=> game.completed === true);
    return completedGames
}


function getTotalHoursPlayed() {
    return gamesPool.reduce((acc, game) => acc + game.hoursPlayed, 0);
}

function getAverageRating() {
    return Number((gamesPool.length !== 0 ? gamesPool.reduce((acc, game) => acc + game.rating, 0) / gamesPool.length : 0).toFixed(2));
}

function getGamesGenreCount() {
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

    return Object.keys(counter).reduce((a,b)=>counter[a]>counter[b] ? a : b);
} 

function hasDuplicateGame(title) {
    return gamesPool.some((game)=>game.title.toLowerCase().trim() === title.toLowerCase().trim());
}