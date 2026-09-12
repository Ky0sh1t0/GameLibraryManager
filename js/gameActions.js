import {
    deleteGameFromPool,
    gamesPool,
    toggleGameCompleted,
} from "./gameControls.js"

import {
    cardsCont,
} from "./dom.js"

import {
    editGame,
} from "./form.js"
import { 
    saveToLocalStorage 
} from "./services/storageService.js"

import {
    refreshFullUI, 
    refreshGameAndState 
} from "./refreshUI.js"

function deleteGame(id) {
    deleteGameFromPool(id);
    saveToLocalStorage(gamesPool);
    refreshFullUI();
}


function toggleGameCompletion(gameId) {
    toggleGameCompleted(gameId);
    saveToLocalStorage(gamesPool);
    refreshGameAndState();
}

function handleGameCardAction(e) {
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

    const cardGameId = Number(card.dataset.gameId);

    if (deleteBtn) {
        deleteGame(cardGameId);
    } else if (editBtn) {
        editGame(cardGameId);
    } else if (completeBtn) {
        toggleGameCompletion(cardGameId);
    }
}


export function bindGameCardActions() {
    cardsCont.addEventListener('click', handleGameCardAction);
}