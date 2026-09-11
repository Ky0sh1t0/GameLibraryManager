import Game from "./models/Game.js";

import {
    gamesPool,
    updateGame,
    addGameIfNotDuplicate,
    hasDuplicateGameSameId,
    findGameById,
} from "./gameControls.js"

import {
    renderStatistics
} from "./gameRender.js"

import {
    renderGenresFilters,
    applyFilter,
} from "./filter.js"

import {
    formCont,
    addBtnEl,
    errorMsgEl, 
    form,
    titleInput,
    genreInput,
    hoursPlayedInput,
    completedCheckbox,
    ratingInput 
} from "./dom.js"


// variables
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


// validation 
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

// form events

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

// form values

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

// bind
function toggleForm() {
    formCont.classList.toggle("is-open");
}

function formChoice(e) {
    if (gameId !== null) {
        formEdit(e);
    } else {
        addGame(e);
    }
}

function exitModalWindow(e) {
    if (e.target.classList.contains("game-form-cont")) {
        setToDefault();
        toggleForm();
    }
}

function addBtnEvent() {
    setToDefault();
    toggleForm();
}


// public
export function editGame(id) {
    const game = findGameById(id);
    if (!game) {
        return ;
    }

    toggleForm();
    gameId = id;
    giveValueForEdit(game);
}


export function bindFormEvents() {
    // modal
    formCont.addEventListener("click", exitModalWindow);
    
    // form
    addBtnEl.addEventListener("click", addBtnEvent);
    form.addEventListener("submit", formChoice);

    //form inputs
    titleInput.addEventListener('input', (e)=>setTitle(e.target.value));
    genreInput.addEventListener('input', (e)=>setGenre(e.target.value));
    hoursPlayedInput.addEventListener('input', (e)=>setHoursPlayed(e.target.value));
    completedCheckbox.addEventListener('change', (e)=>setCompleted(e.target.checked));
    ratingInput.addEventListener('input', (e)=>setRating(e.target.value));
}