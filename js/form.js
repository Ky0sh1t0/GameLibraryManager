import Game from "./models/Game.js";

import {
    gamesPool,
    updateGame,
    addGameIfNotDuplicate,
    hasDuplicateGameSameTitle,
    findGameById,
} from "./gameControls.js"

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
import { 
    saveToLocalStorage 
} from "./services/storageService.js";

import { 
    refreshFullUI 
} from "./refreshUI.js";


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

function normalizeStates() {
    title = title.trim();
    genre = genre.trim();
}

// form events

function addGame(e) {
    e.preventDefault();

    try {
        let newGameId = gamesPool.reduce((acc, game)=>acc >= game.id ? acc : game.id, 0) + 1;
    
        formValidation();

        normalizeStates();

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

        saveToLocalStorage(gamesPool);
        setToDefault();
        refreshFullUI();

        closeForm();
    } catch (error) {
        errorMsgEl.classList.remove("none");
        errorMsgEl.textContent = error.message;   
    }

}


function formEdit(e) {
    e.preventDefault();
    try {
        formValidation();

        normalizeStates();

        const editBool = hasDuplicateGameSameTitle(gameId,title);

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

        saveToLocalStorage(gamesPool);
        closeForm();
        refreshFullUI();

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

function fillFormForEdit(game) {
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

function closeForm() {
    formCont.classList.remove('is-open');
}

function openForm() {
    formCont.classList.add('is-open');
}

function handleFormSubmit(e) {
    if (gameId !== null) {
        formEdit(e);
    } else {
        addGame(e);
    }
}

function handleBackdropClick(e) {
    if (e.target.classList.contains("game-form-cont")) {
        setToDefault();
        closeForm();
    }
}

function openAddForm() {
    setToDefault();
    openForm();
}

// public
export function editGame(id) {
    const game = findGameById(id);
    if (!game) {
        return ;
    }

    gameId = id;
    fillFormForEdit(game);
    openForm();
}


export function bindFormEvents() {
    // modal
    formCont.addEventListener("click", handleBackdropClick);
    
    // form
    addBtnEl.addEventListener("click", openAddForm);
    form.addEventListener("submit", handleFormSubmit);

    //form inputs
    titleInput.addEventListener('input', (e)=>setTitle(e.target.value));
    genreInput.addEventListener('input', (e)=>setGenre(e.target.value));
    hoursPlayedInput.addEventListener('input', (e)=>setHoursPlayed(e.target.value));
    completedCheckbox.addEventListener('change', (e)=>setCompleted(e.target.checked));
    ratingInput.addEventListener('input', (e)=>setRating(e.target.value));
}