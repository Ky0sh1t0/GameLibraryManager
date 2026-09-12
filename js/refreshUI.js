import { applyFilter, renderGenresFilters } from "./filter.js";
import { renderStatistics } from "./gameRender.js";

export function refreshFullUI() {
    renderGenresFilters();
    renderStatistics();
    applyFilter();
}

export function refreshGameAndState() {
    renderStatistics();
    applyFilter();
}