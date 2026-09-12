import Game from "../models/Game.js";

export async function loadGamesFromJSON() {
    const res = await fetch("./data/games.json");
    if (!res.ok) {
        throw new Error(`Failed to load games. Please try again`)
    }

    const data = await res.json();
    validateGamesData(data);
    const convertedData = convertGamesToInstances(data);
    return convertedData;
}

export function convertGamesToInstances(data) {
    return data.map((game) => {
        return new Game(
            game.id,
            game.title,
            game.genre,
            game.hoursPlayed,
            game.completed,
            game.rating
        )
    });
}

export function validateGamesData(data) {
    if (!Array.isArray(data)) {
        throw new Error (`Expected an Array received ${typeof data}`);
    }

    const idsArray = [];

    data.forEach(game => {
        if (game === null || game === undefined || typeof game !== "object" || Array.isArray(game)) {
            throw new Error(`Corrupted dataset`)
        }

        if (!Number.isInteger(game.id) || game.id < 0) {
            throw new Error(`Unexpected id`)
        }
        if (game.hoursPlayed < 0 || !Number.isFinite(game.hoursPlayed)) {
            throw new Error(`Unexpected hoursPlayed`)
        }
        if (game.rating > 10  || game.rating < 0 || !Number.isFinite(game.rating)) {
            throw new Error(`Unexpected rating`)
        }
        if (typeof game.completed !== "boolean") {
            throw new Error(`Unexpected completed`)
        }
        if ((typeof game.title !== "string" || typeof game.genre !== "string" ) && (game.title.trim() !== "" || game.genre.trim() !== "")) {
            throw new Error(`Unexpected title or genre`)
        }

        if (idsArray.some((id)=>id === game.id)) {
            throw new Error("Duplicated id")
        }

        idsArray.push(game.id);
    });

    return true
}