import { User } from "./user.js";
import { loadPlayersFromLocalStorage, savePlayersToLocalStorage } from "./storage.js";

let players: User[] = loadPlayersFromLocalStorage();

// ✅ Játékos állás frissítése
function updateIndexPlayerList(): void {
    const container = document.getElementById("players-container");
    if (!container) return;
    container.innerHTML = "";

    players.forEach((player, index) => {
        const card = document.createElement("div");
        card.classList.add("card", "mb-3", "w-100");

        const cardBody = document.createElement("div");
        cardBody.classList.add("card-body");

        const row = document.createElement("div");
        row.classList.add("row", "align-items-center");

        const rankDiv = document.createElement("div");
        rankDiv.classList.add("col-2", "fw-bold");
        rankDiv.textContent = `${index + 1}.`;

        const nameDiv = document.createElement("div");
        nameDiv.classList.add("col-6");
        nameDiv.textContent = player.name;

        const pointsDiv = document.createElement("div");
        pointsDiv.classList.add("col-4", "text-end", "fw-bold");
        pointsDiv.textContent = `${player.points} pont`;

        row.appendChild(rankDiv);
        row.appendChild(nameDiv);
        row.appendChild(pointsDiv);
        cardBody.appendChild(row);
        card.appendChild(cardBody);
        container.appendChild(card);
    });
}

// ✅ Pontlevonás egy játékostól
function deductPoints(index: number, points: number): void {
    players[index].deductPoints(points);
    savePlayersToLocalStorage(players);
    updateIndexPlayerList();
}

// ✅ Betöltéskor frissítés
document.addEventListener("DOMContentLoaded", () => {
    updateIndexPlayerList();
});


