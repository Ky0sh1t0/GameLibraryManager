import { 
    validateGamesData,
    convertGamesToInstances,
} from "./gameService.js";

const STORAGE_KEY = "game-state";


// private functions

function loadGamesFromJSONString(jsonString) {
    try {
        const games = JSON.parse(jsonString);
        validateGamesData(games)
        const converted = convertGamesToInstances(games)
        return converted;
    } catch (error) {
        console.log(error);
        throw error        
    }
}

function saveGamesToJSON(games) {
    return JSON.stringify(games);
}

// public 

export function saveToLocalStorage(games) {
    const gamesJSON = saveGamesToJSON(games);
    localStorage.setItem(STORAGE_KEY, gamesJSON);
}

export function loadFromLocalStorage() {
    const gamesJSON = localStorage.getItem(STORAGE_KEY);
    if (gamesJSON === null) {
        console.log("got null")
        return null;
    }
    console.log(`got the ${STORAGE_KEY} item`)
    return loadGamesFromJSONString(gamesJSON);
}

export function clearLocalStorage() {
    localStorage.removeItem(STORAGE_KEY);
}