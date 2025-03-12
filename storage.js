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
export function saveGamesToLocalStorage(players) {
    // Betöltjük a korábbi játékokat
    const storedGames = localStorage.getItem("games");
    const games = storedGames ? JSON.parse(storedGames) : [];
    // Új játék létrehozása
    const newGame = {
        timestamp: new Date().toISOString(), // Aktuális idő ISO formátumban
        players: players
            .sort((a, b) => b.points - a.points) // Pontszám szerint rendezve
            .map((player, index) => ({
            name: player.name,
            points: player.points,
            rank: index + 1, // 1-től kezdődő helyezés
        })),
    };
    // Hozzáadjuk az új játékot
    games.push(newGame);
    // Elmentjük a localStorage-be
    localStorage.setItem("games", JSON.stringify(games));
}
