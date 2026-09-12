import { applyFilter, renderGenresFilters } from "./filter";
import { renderStatistics } from "./gameRender";

export function refreshFullUI() {
    renderGenresFilters();
    renderStatistics();
    applyFilter();
}

export function refreshSomeUI() {
    renderStatistics();
    applyFilter();
}