import { 
    validateGamesData,
    convertGamesToInstances,
} from "./gameService.js";

const STORAGE_KEY = "game-state";


// private functions

function parseGamesJSON(jsonString) {
    const games = JSON.parse(jsonString);
    validateGamesData(games)
    const converted = convertGamesToInstances(games)
    return converted;
}

function serializeGames(games) {
    return JSON.stringify(games);
}

// public 

export function saveToLocalStorage(games) {
    const gamesJSON = serializeGames(games);
    localStorage.setItem(STORAGE_KEY, gamesJSON);
}

export function loadFromLocalStorage() {
    const gamesJSON = localStorage.getItem(STORAGE_KEY);
    if (gamesJSON === null) {
        return null;
    }
    return parseGamesJSON(gamesJSON);
}

export function clearLocalStorage() {
    localStorage.removeItem(STORAGE_KEY);
}