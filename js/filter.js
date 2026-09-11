import { 
    searchEl,
    genresEl,
    sortEl,
    completionEl,
} from "./dom.js";

import { 
    gamesPool,
    groupGamesByGenre, 
    searchGames 
} from "./gameControls.js";

import {
    renderGames 
} from "./gameRender.js";

// setters for filter
let searchFilter = "";
let genresFilter = "allGenres";
let sortFilters = "Name";
let completionFilter = "allGames";


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


// genre render for filter
export function renderGenresFilters() {
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

//filter
export function applyFilter() {
    let filteredGames = [...gamesPool];

    if (searchFilter !== "") {
        filteredGames = searchGames(searchFilter);
    }
    if (genresFilter !== "allGenres") {
        filteredGames = filteredGames.filter(
            (game)=>game.genre.toLowerCase() === genresFilter.trim().toLowerCase()
        );
    }

    switch(completionFilter) {
        case "allGames":
            filteredGames = filteredGames;
            break;
        case "completed":
            filteredGames = filteredGames.filter((game)=>game.completed === true);
            break;
        case "notCompleted":
            filteredGames = filteredGames.filter((game)=>game.completed === false);
            break;
    }

    switch(sortFilters) {
        case "Name": 
            filteredGames = filteredGames.sort((game1, game2)=>game1.title.localeCompare(game2.title));
            break;
        case "Rating":
            filteredGames = filteredGames.sort((game1, game2)=>game2.rating - game1.rating);
            break;
        case "Completion":
            filteredGames = filteredGames.sort((game1,game2)=>game2.completed - game1.completed);
            break;
        case "Hours":
            filteredGames = filteredGames.sort((game1, game2)=>game2.hoursPlayed - game1.hoursPlayed);
            break;
    }

    renderGames(filteredGames);
}

export function bindFilterEvents() {
    //sort
    searchEl.addEventListener("input", setSearchFilter);
    genresEl.addEventListener("change", setGenresFilter);
    sortEl.addEventListener("change", setSortFilter);
    completionEl.addEventListener("change", setCompletionFilter);
}