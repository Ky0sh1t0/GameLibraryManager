import {
    deleteGameFromPool,
    toggleGameCompleted,
} from "./gameControls.js"

import {
    renderStatistics,
} from "./gameRender.js"

import {
    renderGenresFilters,
    applyFilter,
} from "./filter.js"

import {
    cardsCont,
} from "./dom.js"

import {
    editGame,
} from "./form.js"

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


export function bindGameCardActions() {
    cardsCont.addEventListener('click', actionsWithGameCard);
}