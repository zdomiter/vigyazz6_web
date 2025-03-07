import { User } from "./user.js";
import { loadPlayersFromLocalStorage, savePlayersToLocalStorage } from "./storage.js";

let players: User[] = loadPlayersFromLocalStorage();

// ✅ Játékos állás frissítése

function updateIndexPlayerList() {
    const container = document.getElementById("players-container");
    if (!container) return;

    // Gomb létrehozása az új kör indítására
    const newRoundButton = document.createElement("button");
    newRoundButton.textContent = "Új kör";
    newRoundButton.classList.add("btn", "btn-primary", "mb-3");
    newRoundButton.onclick = startNewRound; // Gomb eseménykezelője
    container.appendChild(newRoundButton);

    // 1. Játékosok rendezése pontszám szerint
    players.sort((a, b) => b.points - a.points);

    let rank = 1;
    let prevPoints = null;
    let displayedRank = 0;


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

        // Korábbi körök pontjai badge-ekben
        if (player.previousRounds && player.previousRounds.length > 0) {
            const previousRoundsDiv = document.createElement("div");
            previousRoundsDiv.classList.add("mt-2");

            player.previousRounds.forEach((roundPoints) => {
                const badge = document.createElement("span");
                badge.classList.add("badge", "bg-secondary", "me-1");
                badge.textContent = roundPoints.toString();
                previousRoundsDiv.appendChild(badge);
            });

            cardBody.appendChild(previousRoundsDiv);
        }

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
function startNewRound() {
    players.forEach((player, index) => {
        const input = prompt(`${player.name} hány pontot gyűjtött ebben a körben?`);
        if (input === null) return; // Ha megszakítják a promptot, kilépünk

        const pointsToDeduct = parseInt(input, 10);
        if (!isNaN(pointsToDeduct) && pointsToDeduct >= 0) {
            players[index].deductPoints(pointsToDeduct);

            // Hozzáadjuk a kör pontszámát a korábbi körökhöz
            if (!players[index].previousRounds) {
                players[index].previousRounds = [];
            }
            players[index].previousRounds.push(pointsToDeduct);
        }
    });

    savePlayersToLocalStorage(players);
    updateIndexPlayerList();
}




