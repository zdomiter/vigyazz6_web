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
    players.forEach(function (player, index) {
        var card = document.createElement("div");
        card.classList.add("card", "mb-3", "w-100");
        var cardBody = document.createElement("div");
        cardBody.classList.add("card-body");
        var row = document.createElement("div");
        row.classList.add("row", "align-items-center");
        var rankDiv = document.createElement("div");
        rankDiv.classList.add("col-2", "fw-bold");
        rankDiv.textContent = "".concat(index + 1, ".");
        var nameDiv = document.createElement("div");
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
    });
}
// ✅ Pontlevonás egy játékostól
function deductPoints(index, points) {
    players[index].deductPoints(points);
    (0, storage_js_1.savePlayersToLocalStorage)(players);
    updateIndexPlayerList();
}
// ✅ Betöltéskor frissítés
document.addEventListener("DOMContentLoaded", function () {
    updateIndexPlayerList();
});
function startNewRound() {
    players.forEach(function (player, index) {
        var input = prompt("".concat(player.name, " h\u00E1ny pontot gy\u0171jt\u00F6tt ebben a k\u00F6rben?"));
        if (input === null)
            return; // Ha megszakítják a promptot, kilépünk
        var pointsToDeduct = parseInt(input, 10);
        if (!isNaN(pointsToDeduct) && pointsToDeduct >= 0) {
            players[index].deductPoints(pointsToDeduct);
            // Hozzáadjuk a kör pontszámát a korábbi körökhöz
            if (!players[index].previousRounds) {
                players[index].previousRounds = [];
            }
            players[index].previousRounds.push(pointsToDeduct);
        }
    });
    (0, storage_js_1.savePlayersToLocalStorage)(players);
    updateIndexPlayerList();
}
