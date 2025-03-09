import { User } from "./user.js";
export function savePlayersToLocalStorage(players) {
    localStorage.setItem("players", JSON.stringify(players));
}
export function loadPlayersFromLocalStorage() {
    const storedPlayers = localStorage.getItem("players");
    if (storedPlayers) {
        return JSON.parse(storedPlayers).map((p) => new User(p._name, p._points, p._previousRounds));
    }
    return [];
}
