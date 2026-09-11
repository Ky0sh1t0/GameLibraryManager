import { addGameIfNotDuplicate, addGamesToPool, deleteGameFromPool, findGameById, gamesPool, hasDuplicateGameSameId, toggleGameCompleted, updateGame } from "./gameControls.js";

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

    formCont,
    form,
    titleInput,
    genreInput,
    hoursPlayedInput,
    completedCheckbox,
    ratingInput,

    addBtnEl,

    searchEl,
    genresEl,
    sortEl,
    completionEl,

    errorMsgEl,
} from "./dom.js"

import { 
    setSearchFilter,
    setGenresFilter, 
    setCompletionFilter, 
    setSortFilter, 
    applyFilter, 
    renderGenresFilters
} from "./filter.js";

import Game from "./models/Game.js";

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

function exitModalWindow(e) {
    if (e.target.classList.contains("game-form-cont")) {
        setToDefault();
        toggleForm();
    }
}

function toggleForm() {
    formCont.classList.toggle("is-open");
}


// form 


let gameId = null;

let title = "";
const setTitle = (newTitle)=>{title = newTitle};

let genre = "";
const setGenre = (newGenre)=>{genre = newGenre;};

let hoursPlayed = 0;
const setHoursPlayed = (newHoursPlayed)=>{hoursPlayed=Number(newHoursPlayed)};

let completed = false;
const setCompleted = (newCompleted)=>{completed = newCompleted;}

let rating = 0;
const setRating = (newRating)=>{rating = Number(newRating)}



function formValidation() {

    if (hoursPlayed < 0 || !Number.isFinite(hoursPlayed)) {
        throw new Error(`Unexpected hoursPlayed`)
    }

    if (rating > 10  || rating < 0 || !Number.isFinite(rating)) {
        throw new Error(`Unexpected rating`)
    }

    if (typeof completed !== "boolean") {
        throw new Error(`Unexpected completed`)
    }

    if (
        (typeof title !== "string" || typeof genre !== "string") 
        || (title.trim() === "" || genre.trim() === "")
    ) {
        throw new Error(`Unexpected title or genre`)
    }

}


function formChoice(e) {
    if (gameId !== null) {
        formEdit(e);
    } else {
        addGame(e);
    }
}

function addGame(e) {
    e.preventDefault();

    try {
        let newGameId = gamesPool.reduce((acc, game)=>acc >= game.id ? acc : game.id, 0) + 1;
    
        formValidation();

        const game = new Game(
            newGameId,
            title,
            genre,
            hoursPlayed,
            completed,
            rating,
        )



        const add = addGameIfNotDuplicate(game);
        if (!add) {
            throw new Error("The game already exist");
        }

        setToDefault();
        renderGenresFilters();
        renderStatistics();
        applyFilter();
        toggleForm();
    } catch (error) {
        errorMsgEl.classList.remove("none");
        errorMsgEl.textContent = error.message;   
    }

}

function editGame(id) {
    const game = findGameById(id);
    if (!game) {
        return ;
    }
    toggleForm();
    gameId = id;
    giveValueForEdit(game);
}

function formEdit(e) {
    e.preventDefault();
    try {
        formValidation();

        const editBool = hasDuplicateGameSameId(gameId,title);

        if (editBool) {
            throw new Error("The game with that title already exist")
        }

        updateGame(gameId, {
            title,
            genre,
            hoursPlayed: hoursPlayed,
            completed,
            rating: rating,
        })

        toggleForm();
        renderGenresFilters();
        renderStatistics();
        applyFilter();
    
        setToDefault();
    } catch (error) {
        errorMsgEl.classList.remove("none");
        errorMsgEl.textContent = error.message;   
    }
}

function setToDefault() {
    gameId = null;
    setTitle("");
    setGenre("");
    setHoursPlayed(0);
    setCompleted(false);
    setRating("");

    errorMsgEl.textContent = "";
    errorMsgEl.classList.add("none");
        

    form.reset();
}

function giveValueForEdit(game) {
    setTitle(game.title);
    setGenre(game.genre);
    setHoursPlayed(game.hoursPlayed)
    setCompleted(game.completed);
    setRating(game.rating);

    titleInput.value = title;
    genreInput.value = genre;
    hoursPlayedInput.value = hoursPlayed;
    completedCheckbox.checked = completed;
    ratingInput.value = rating;
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

function addBtnEvent() {
    setToDefault();
    toggleForm();
}

function bindEvents() {
    //sort
    searchEl.addEventListener("input", setSearchFilter);
    genresEl.addEventListener("change", setGenresFilter);
    sortEl.addEventListener("change", setSortFilter);
    completionEl.addEventListener("change", setCompletionFilter);
    
    // modal exit
    formCont.addEventListener("click", exitModalWindow);

    // actions with game
    cardsCont.addEventListener('click', actionsWithGameCard);
    addBtnEl.addEventListener("click", addBtnEvent);
    form.addEventListener("submit", formChoice);

    //form inputs
    titleInput.addEventListener('input', (e)=>setTitle(e.target.value));
    genreInput.addEventListener('input', (e)=>setGenre(e.target.value));
    hoursPlayedInput.addEventListener('input', (e)=>setHoursPlayed(e.target.value));
    completedCheckbox.addEventListener('change', (e)=>setCompleted(e.target.checked));
    ratingInput.addEventListener('input', (e)=>setRating(e.target.value));
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