import { 
    addGamesToPool,
    gamesPool, 
} from "./gameControls.js";

import {
    convertGamesToInstances,
    loadGamesFromJSON,
    validateGamesData,
} from "./services/gameService.js"


import {
    renderStatistics,
    renderIcons,
    renderLoading,
    renderError,
} from "./gameRender.js";

import { 
    applyFilter, 
    renderGenresFilters,
    bindFilterEvents,
} from "./filter.js";

import {
    bindFormEvents,
} from "./form.js"

import {
    bindGameCardActions,
} from "./gameActions.js"


// data
async function loadGamesIntoPool() {
    const games = await loadGamesFromJSON();
    addGamesToPool(...games);
}

async function reloadGames(loader) {
    const games = await loader();
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

// Events and initialise

function bindEvents() {
    bindFormEvents();
    bindFilterEvents();
    bindGameCardActions();
}

async function initialiseApp() {
    renderLoading();
    
    
    try {
        await loadGamesIntoPool();  
        bindEvents();
        renderGenresFilters();
        renderStatistics();
        renderIcons();
        applyFilter();
    } catch (error) {
        renderError(error);
    }
}

initialiseApp();