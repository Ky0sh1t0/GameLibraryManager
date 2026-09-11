import { gamesPool, getGamesStatistics } from "./gameControls.js";
import { icons } from "./icons.js";
import { cardsCont, gamesCount, statCont, iconsEl } from "./dom.js";

// card render
export function renderGames(games) {

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

export function renderStatistics() {

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

export function renderIcons() {
    iconsEl.forEach((icon)=>{
        icon.innerHTML = `
            ${icons[icon.getAttribute("data-icon")]}
        `
    })
}

// state render
export function renderLoading() {
    cardsCont.innerHTML = "";
    const loadingEl = document.createElement("div");
    loadingEl.className = "loading-state";
    loadingEl.textContent = "Loading games..."
    cardsCont.appendChild(loadingEl);
}

export function renderError(err) {
    cardsCont.innerHTML = `
        <div class="error-message">
            ${err.message}
        </div>
    `
}
