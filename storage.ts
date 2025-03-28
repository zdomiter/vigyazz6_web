import { User } from "./user.js";

export interface GameResult {
    timestamp: string;
    players: { name: string; points: number; rank: number }[];
}

export function savePlayersToLocalStorage(players: User[]): void {
    localStorage.setItem("players", JSON.stringify(players));
}

export function loadPlayersFromLocalStorage(): User[] {
    const storedPlayers = localStorage.getItem("players");
    if (storedPlayers) {
        return JSON.parse(storedPlayers).map((p: any) => new User(p._name, p._points, p._previousRounds, p.rank));
    }
    return [];
}
export function saveGamesToLocalStorage(players: User[]): void {
    const storedGames = localStorage.getItem("games");
    const games: GameResult[] = storedGames ? JSON.parse(storedGames) : [];

    const newGame: GameResult = {
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

export function getGamesFromLocalStorage(): GameResult[] {
    const gamesData = localStorage.getItem("games");
    return gamesData ? JSON.parse(gamesData) : [];
}