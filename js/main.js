import { addGameIfNotDuplicate, addGamesToPool, deleteGameFromPool, findGameById, gamesPool, getGamesStatistics, groupGamesByGenre, hasDuplicateGameSameId, searchGames, toggleGameCompleted, updateGame } from "./gameControls.js";

import {
    convertGamesToInstances,
    loadGamesFromJSON,
    validateGamesData,
} from "./services/gameService.js"

import { icons } from "./icons.js";
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

const cardsCont = document.querySelector(".games-grid");

function renderLoading() {
    cardsCont.innerHTML = "";
    const loadingEl = document.createElement("div");
    loadingEl.className = "loading-state";
    loadingEl.textContent = "Loading games..."
    cardsCont.appendChild(loadingEl);
}

function renderGames(games) {
    const gamesCount = document.querySelector(".games-count span");

    gamesCount.innerText = `${games.length}`

    cardsCont.innerHTML = "";

    let emptyNotif = document.createElement("div");
    if (gamesPool.length === 0) {
        emptyNotif.className = "games-empty";
        emptyNotif.innerText = "Library empty"
        cardsCont.appendChild(emptyNotif);
    } else if (games.length === 0) {
        emptyNotif.className = "games-filter-empty";
        emptyNotif.innerText = "Games not found by filter";
        cardsCont.appendChild(emptyNotif);
    } else {
        games.forEach((game) => {
            let card = document.createElement("div");
            card.className = "game-card";
            card.dataset.gameId = game.id
            card.innerHTML = `
                <div class="game-content">
                    <h3 class="game-title">${game?.title}</h3>
                    <p class="game-genre">${game?.genre}</p>
                    <div class="game-meta">
                        <span class="hours">${icons.clock} ${game?.hoursPlayed}</span>
                        <span class="rating">${icons.star} ${game?.rating} / 10</span>
                    </div>
                    <span class="badge ${game?.completed ? "badge-success" : "badge-pending"}">
                        ${game?.completed ? `${icons.check} Completed` : "Not completed"}
                    </span>
                    <div class="game-actions">
                        <button class="btn btn-primary btn-edit">${icons.edit} Edit</button>
                        <button class="btn btn-danger">${icons.trash} Delete</button>
                    </div>
                </div>
            `
            cardsCont.appendChild(card);
        });
    }

}

function renderStatistics() {
    const statCont = document.querySelector(".stats-grid");

    statCont.innerHTML = "";

    const stats = getGamesStatistics();
    const statsConfig = {
        totalGamesCount: {
            label: "Total games",
            icon: icons.gamepad,
            iconClass: "stat-icon-games",
        },
        totalCompletedGamesCount:{
            label: "Completed",
            icon: icons.check,
            iconClass: "stat-icon-completed",
        },
        totalHoursPlayed: {
            label: "Total hours",
            icon: icons.clock,
            iconClass: "stat-icon-hours"
        },
        avgGamesRating: {
            label: "Average rating",
            icon: icons.star,
            iconClass: "stat-icon-rating"
        },
    }

    Object.keys(statsConfig).forEach((stat)=>{
        let card = document.createElement("div");
        card.className="stat-card";
        card.innerHTML=`
            <div class="stat-icon ${statsConfig[stat].iconClass}">
                ${statsConfig[stat].icon}
            </div>
            <div class="stat-content">
                <h2 class="stat-label">${statsConfig[stat].label}</h2>
                <p class="stat-value">${stats[stat]}</p>
            </div>
        `
        statCont.appendChild(card);
    })
}

function renderIcons() {
    const iconsEl = document.querySelectorAll('.icon-wrap');
    iconsEl.forEach((icon)=>{
        icon.innerHTML = `
            ${icons[icon.getAttribute("data-icon")]}
        `
    })
}


// filter

let searchFilter = "";
const searchEl = document.querySelector(".search-input");

let genresFilter = "allGenres";
const genresEl = document.querySelector(".select-genres"); 

let sortFilters = "Name";
const sortEl = document.querySelector(".select-sort");

let completionFilter = "allGames";
const completionEl = document.querySelector(".select-completion");

function renderGenresFilters() {
    const genresGroup = groupGamesByGenre();
    const genres = genresGroup ? Object.keys(genresGroup) : [];
    genresEl.innerHTML = `<option value="allGenres">All Genres</option>`; 
    genres.forEach((genre)=>{
        let genreOpt = document.createElement('option');
        genreOpt.value = genre;
        genreOpt.text = genre;
        genresEl.appendChild(genreOpt);
    })

    if (genres.includes(genresFilter)) {
        genresEl.value = genresFilter;
    } else {
        genresFilter = "allGenres";
        genresEl.value = genresFilter;
    }
}


function setSearchFilter(e) {
    searchFilter = e.target.value.trim();
    applyFilter();
}

function setGenresFilter(e) {
    genresFilter = e.target.value;
    applyFilter();
}

function setSortFilter(e) {
    sortFilters = e.target.value;
    applyFilter();
}

function setCompletionFilter(e) {
    completionFilter = e.target.value;
    applyFilter();
}

function applyFilter() {
    let filtredGames = [...gamesPool];

    if (searchFilter !== "") {
        filtredGames = searchGames(searchFilter);
    }
    if (genresFilter !== "allGenres") {
        filtredGames = filtredGames.filter(
            (game)=>game.genre.toLowerCase() === genresFilter.trim().toLowerCase()
        );
    }

    switch(completionFilter) {
        case "allGames":
            filtredGames = filtredGames;
            break;
        case "completed":
            filtredGames = filtredGames.filter((game)=>game.completed === true);
            break;
        case "notCompleted":
            filtredGames = filtredGames.filter((game)=>game.completed === false);
            break;
    }

    switch(sortFilters) {
        case "Name": 
            filtredGames = filtredGames.sort((game1, game2)=>game1.title.localeCompare(game2.title));
            break;
        case "Rating":
            filtredGames = filtredGames.sort((game1, game2)=>game2.rating - game1.rating);
            break;
        case "Completion":
            filtredGames = filtredGames.sort((game1,game2)=>game2.completed - game1.completed);
            break;
        case "Hours":
            filtredGames = filtredGames.sort((game1, game2)=>game2.hoursPlayed - game1.hoursPlayed);
            break;
    }

    renderGames(filtredGames);
}


function deleteGame(id) {
    deleteGameFromPool(id);
    renderStatistics();
    renderGenresFilters();
    applyFilter();
}


// form 
const formCont = document.querySelector(".game-form-cont");


let gameId = null;

const form = document.querySelector('.game-form');

let title = "";
const titleInput = document.querySelector(".game-input[name='title']");
const setTitle = (newTitle)=>{title = newTitle};
titleInput.addEventListener('input', (e)=>setTitle(e.target.value));

let genre = "";
const genreInput = document.querySelector(".game-input[name='genre']");
const setGenre = (newGenre)=>{genre = newGenre;};
genreInput.addEventListener('input', (e)=>setGenre(e.target.value));

let hoursPlayed = 0;
const hoursPlayedInput = document.querySelector(".game-input[name='hoursPlayed']");
const setHoursPlayed = (newHoursPlayed)=>{hoursPlayed=Number(newHoursPlayed)};
hoursPlayedInput.addEventListener('input', (e)=>setHoursPlayed(e.target.value));

let completed = false;
const completedCheckbox = document.querySelector(".game-input[name='completed']");
const setCompleted = (newCompleted)=>{completed = newCompleted;}
completedCheckbox.addEventListener('change', (e)=>setCompleted(e.target.checked));

let rating = 0;
const ratingInput = document.querySelector(".game-input[name='rating']");
const setRating = (newRating)=>{rating = Number(newRating)}
ratingInput.addEventListener('input', (e)=>setRating(e.target.value));


function exitModalWindow(e) {
    if (e.target.classList.contains("game-form-cont")) {
        setToDefault();
        toggleForm();
    }
}

function toggleForm() {
    formCont.classList.toggle("is-open");
}


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

const errorMsgEl = document.querySelector(".form-error");

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
const addBtnEl = document.querySelector(".btn-add");

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