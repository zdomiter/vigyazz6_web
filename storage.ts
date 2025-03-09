import { User } from "./user.js";

export function savePlayersToLocalStorage(players: User[]): void {
    localStorage.setItem("players", JSON.stringify(players));
}

export function loadPlayersFromLocalStorage(): User[] {
    const storedPlayers = localStorage.getItem("players");
    if (storedPlayers) {
        return JSON.parse(storedPlayers).map((p: any) => new User(p._name, p._points, p._previousRounds));
    }
    return [];
}
