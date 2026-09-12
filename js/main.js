import { 
    addGamesToPool,
} from "./gameControls.js";

import {
    loadGamesFromJSON,
} from "./services/gameService.js"

import {
    loadFromLocalStorage,
    saveToLocalStorage,
} from "./services/storageService.js"

import {
    renderIcons,
    renderLoading,
    renderError,
} from "./gameRender.js";

import { 
    bindFilterEvents,
} from "./filter.js";

import {
    bindFormEvents,
} from "./form.js"

import {
    bindGameCardActions,
} from "./gameActions.js"
import { 
    refreshFullUI 
} from "./refreshUI.js";


// data
async function loadGamesIntoPool() {
    let games = loadFromLocalStorage();
    if (games === null) {
        games = await loadGamesFromJSON();
        saveToLocalStorage(games);
    }
    addGamesToPool(...games);
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
        renderIcons();
        await loadGamesIntoPool();  
        bindEvents();
        refreshFullUI();
    } catch (error) {
        renderError(error);
    }
}

initialiseApp();