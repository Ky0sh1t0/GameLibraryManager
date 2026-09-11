import { 
    addGamesToPool,
    deleteGameFromPool, 
    gamesPool, 
    toggleGameCompleted 
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
    cardsCont,
} from "./dom.js"

import { 
    applyFilter, 
    renderGenresFilters,
    bindFilterEvents,
} from "./filter.js";


import {
    editGame,
    bindFormEvents,
} from "./form.js"

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

// Part 4


// filter

function deleteGame(id) {
    deleteGameFromPool(id);
    renderStatistics();
    renderGenresFilters();
    applyFilter();
}


function toggleGameCompletion(gameId) {
    toggleGameCompleted(gameId);
    renderStatistics();
    applyFilter();
}

// form 


function actionsWithGameCard(e) {
    const deleteBtn = e.target.closest(".btn-danger");
    const editBtn = e.target.closest(".btn-edit");
    const completeBtn = e.target.closest(".badge");
    if (!deleteBtn && !editBtn && !completeBtn) {
        return ;
    }

    const card = e.target.closest(".game-card");

    if (!card) {
        return ;
    }

    let cardGameId = Number(card.dataset.gameId);

    if (deleteBtn) {
        deleteGame(cardGameId);
    } else if (editBtn) {
        editGame(cardGameId);
    } else if (completeBtn) {
        toggleGameCompletion(cardGameId);
    }
}

function bindEvents() {
    bindFormEvents();
    bindFilterEvents();
    // actions with game
    cardsCont.addEventListener('click', actionsWithGameCard);
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