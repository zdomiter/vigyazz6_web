import { User } from "./user.js";
export function savePlayersToLocalStorage(players) {
    localStorage.setItem("players", JSON.stringify(players));
}
export function loadPlayersFromLocalStorage() {
    const storedPlayers = localStorage.getItem("players");
    if (storedPlayers) {
        return JSON.parse(storedPlayers).map((p) => new User(p._name, p._points, p._previousRounds, p.rank));
    }
    return [];
}
export function saveGamesToLocalStorage(players) {
    const storedGames = localStorage.getItem("games");
    const games = storedGames ? JSON.parse(storedGames) : [];
    const newGame = {
        timestamp: new Date().toLocaleString("hu-HU", { timeZone: "Europe/Budapest" }),
        players: players.map(player => ({
            name: player.name,
            points: player.points,
            rank: player.rank
        }))
    };
    games.unshift(newGame);
    localStorage.setItem("games", JSON.stringify(games));
}
export function getGamesFromLocalStorage() {
    const gamesData = localStorage.getItem("games");
    return gamesData ? JSON.parse(gamesData) : [];
}
