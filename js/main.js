import { addGamesToPool, gamesPool } from "./gameControls.js";

import {
    convertGamesToInstances,
    loadGamesFromJSON,
    validateGamesData,
} from "./services/gameService.js"


async function loadGamesIntoPool() {
    const games = await loadGamesFromJSON();
    addGamesToPool(...games);
}

async function reloadGames(func) {
    const games = await func();
    replaceGames(games);
}

function replaceGames(games) {
    gamesPool.splice(0, gamesPool.length);
    addGamesToPool(...games);
}

function saveGamesToJSON() {
    return JSON.stringify(gamesPool);
}

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

function importGamesFromJSONString(jsonString) {
    const games = loadGamesFromJSONString(jsonString);
    replaceGames(games);
}


await loadGamesIntoPool();

console.log(gamesPool);

await reloadGames(loadGamesFromJSON);
console.log(gamesPool);

const json = saveGamesToJSON();
console.log(json);
const data = loadGamesFromJSONString(json);
console.log(data);

importGamesFromJSONString(json);
console.log(gamesPool);
