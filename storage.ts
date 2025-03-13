import { User } from "./user.js";

export interface GameResult {
    timestamp: string; // Időbélyeg (pl. "2025-03-11 14:30:00")
    players: { name: string; points: number; rank: number }[]; // Játékosok adatai
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
    // Betöltjük a korábbi játékokat
    const storedGames = localStorage.getItem("games");
    const games: GameResult[] = storedGames ? JSON.parse(storedGames) : [];

    // Új játék létrehozása
    const newGame: GameResult = {
        timestamp: new Date().toLocaleString("hu-HU", { timeZone: "Europe/Budapest" }), // Helyi idő
        players: players.map(player => ({
            name: player.name,
            points: player.points,
            rank: player.rank // Már tárolt helyezés
        }))
    };

    // Hozzáadjuk az új játékot
    games.unshift(newGame);

    // Elmentjük a localStorage-be
    localStorage.setItem("games", JSON.stringify(games));
}

export function getGamesFromLocalStorage(): GameResult[] {
    const gamesData = localStorage.getItem("games");
    return gamesData ? JSON.parse(gamesData) : [];
}