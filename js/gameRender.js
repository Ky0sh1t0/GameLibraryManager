import { gamesPool, getGamesStatistics } from "./gameControls.js";
import { icons } from "./icons.js";
import { cardsCont, gamesCount, statCont, iconsEl, cardTemplate } from "./dom.js";

// card render
export function renderGames(games) {

    gamesCount.textContent = `${games.length}`
        
    cardsCont.replaceChildren();

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
            const card = cardTemplate.content.firstElementChild.cloneNode(true);
            card.dataset.gameId = game.id;
            
            // card html data
            const title = card.querySelector(".game-title"); 
            const genre = card.querySelector(".game-genre");
            const hours = card.querySelector(".game-meta .hours");
            const rating = card.querySelector(".game-meta .rating");
            const badge = card.querySelector(".badge");
            const btnEdit = card.querySelector(".btn-edit");
            const btnDel = card.querySelector(".btn-danger");

            // card fields
            
            title.textContent = game.title;
            genre.textContent = game.genre;
            
            hours.innerHTML = icons.clock;
            const hoursText = document.createTextNode(` ${game.hoursPlayed}`);
            hours.append(hoursText);
            
            rating.innerHTML = icons.star;
            const ratingText = document.createTextNode(` ${game.rating} / 10`);
            rating.append(ratingText);            

            badge.classList.add(game.completed ? "badge-success" : "badge-pending")
            badge.innerHTML = game.completed ? `${icons.check} Completed` : "Not completed";           

            btnEdit.innerHTML = `${icons.edit} Edit`;
            btnDel.innerHTML = `${icons.trash} Delete`;

            cardsCont.appendChild(card);
        });
    }

}

export function renderStatistics() {

    statCont.replaceChildren();

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
        const card = document.createElement("div");
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

export function renderIcons() {
    iconsEl.forEach((icon)=>{
        icon.innerHTML = icons[icon.getAttribute("data-icon")]
    })
}

// state render
export function renderLoading() {
    cardsCont.replaceChildren();
    const loadingEl = document.createElement("div");
    loadingEl.className = "loading-state";
    loadingEl.textContent = "Loading games..."
    cardsCont.appendChild(loadingEl);
}

export function renderError(err) {
    cardsCont.replaceChildren();
    const errorEl = document.createElement("div");
    errorEl.className = "error-message";
    errorEl.textContent = err.message;
    cardsCont.append(errorEl);
}
