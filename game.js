"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var storage_js_1 = require("./storage.js");
var players = (0, storage_js_1.loadPlayersFromLocalStorage)();
// ✅ Játékos állás frissítése
function updateIndexPlayerList() {
    var container = document.getElementById("players-container");
    if (!container)
        return;
    // Gomb létrehozása az új kör indítására
    var newRoundButton = document.createElement("button");
    newRoundButton.textContent = "Új kör";
    newRoundButton.classList.add("btn", "btn-primary", "mb-3");
    newRoundButton.onclick = startNewRound; // Gomb eseménykezelője
    container.appendChild(newRoundButton);
    // 1. Játékosok rendezése pontszám szerint
    players.sort(function (a, b) { return b.points - a.points; });
    var rank = 1;
    var prevPoints = null;
    var displayedRank = 0;
    container.innerHTML = "";

    // 1. Játékosok rendezése pontszám szerint
    players.sort((a, b) => b.points - a.points);
    let prevPoints = null;
    let displayedRank = 0;
    players.forEach((player, index) => {
        if (player.points !== prevPoints) {
            displayedRank++;
        }
        prevPoints = player.points;
        const card = document.createElement("div");

        card.classList.add("card", "mb-3", "w-100");
        var cardBody = document.createElement("div");
        cardBody.classList.add("card-body");
        var row = document.createElement("div");
        row.classList.add("row", "align-items-center");
        var rankDiv = document.createElement("div");
        rankDiv.classList.add("col-2", "fw-bold");

        rankDiv.textContent = `${displayedRank}.`;
        const nameDiv = document.createElement("div");

        nameDiv.classList.add("col-6");
        nameDiv.textContent = player.name;
        var pointsDiv = document.createElement("div");
        pointsDiv.classList.add("col-4", "text-end", "fw-bold");
        pointsDiv.textContent = "".concat(player.points, " pont");
        row.appendChild(rankDiv);
        row.appendChild(nameDiv);
        row.appendChild(pointsDiv);
        cardBody.appendChild(row);
        // Korábbi körök pontjai badge-ekben
        if (player.previousRounds && player.previousRounds.length > 0) {
            var previousRoundsDiv_1 = document.createElement("div");
            previousRoundsDiv_1.classList.add("mt-2");
            player.previousRounds.forEach(function (roundPoints) {
                var badge = document.createElement("span");
                badge.classList.add("badge", "bg-secondary", "me-1");
                badge.textContent = roundPoints.toString();
                previousRoundsDiv_1.appendChild(badge);
            });
            cardBody.appendChild(previousRoundsDiv_1);
        }
        card.appendChild(cardBody);
        container.appendChild(card);
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
function deductPoints(index, points) {
    players[index].deductPoints(points);
    (0, storage_js_1.savePlayersToLocalStorage)(players);
    updateIndexPlayerList();
}
// ✅ Betöltéskor frissítés

document.addEventListener("DOMContentLoaded", () => {
    const container = document.getElementById("players-container");
    if (!container)
        return;
    // Új kör gomb LÉTREHOZÁSA csak EGYSZER
    const newRoundButton = document.createElement("button");
    newRoundButton.textContent = "Új kör";
    newRoundButton.classList.add("btn", "btn-primary", "mb-3");
    newRoundButton.onclick = startNewRound;
    // Gomb hozzáadása a DOM-hoz
    container.before(newRoundButton);
    updateIndexPlayerList();
});
function startNewRound() {
    players.forEach((player, index) => {
        const input = prompt(`${player.name} hány pontot gyűjtött ebben a körben?`);
        if (input === null)
            return; // Ha megszakítják a promptot, kilépünk
        const pointsToDeduct = parseInt(input, 10);
        if (!isNaN(pointsToDeduct) && pointsToDeduct >= 0) {
            players[index].deductPoints(pointsToDeduct);
        }
    });
    savePlayersToLocalStorage(players);

    updateIndexPlayerList();
}
