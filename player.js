import { User } from "./user.js";
import { savePlayersToLocalStorage, loadPlayersFromLocalStorage } from "./storage.js";
let players = loadPlayersFromLocalStorage();
// ✅ Játékoslista frissítése
function updatePlayerList() {
    const playerList = document.getElementById("player-list");
    if (!playerList)
        return;
    playerList.innerHTML = "";
    players.forEach((player, index) => {
        const li = document.createElement("li");
        li.classList.add("list-group-item", "d-flex", "justify-content-between", "align-items-center");
        li.textContent = `${player.name}`;
        // Törlés gomb
        const deleteButton = document.createElement("button");
        deleteButton.innerHTML = '<i class="bi bi-trash"></i>';
        deleteButton.classList.add("btn", "btn-sm", "btn-danger");
        deleteButton.onclick = () => deletePlayer(index);
        li.appendChild(deleteButton);
        playerList.appendChild(li);
    });
    createStartButton();
}
// ✅ Új játékos hozzáadása
function addPlayer(name) {
    players.push(new User(name));
    savePlayersToLocalStorage(players);
    updatePlayerList();
}
// ✅ Játékos törlése
function deletePlayer(index) {
    players.splice(index, 1);
    savePlayersToLocalStorage(players);
    updatePlayerList();
}
// ✅ Form kezelése
document.addEventListener("DOMContentLoaded", () => {
    updatePlayerList();
    const form = document.getElementById("player-form");
    form === null || form === void 0 ? void 0 : form.addEventListener("submit", (event) => {
        event.preventDefault();
        const input = document.getElementById("new-player");
        if (input.value.trim() !== "") {
            addPlayer(input.value);
            input.value = "";
        }
    });
});
function createStartButton() {
    const container = document.getElementById("button-container");
    if (!container)
        return;
    // Gomb létrehozása
    const startButton = document.createElement("button");
    startButton.id = "start-game";
    startButton.textContent = "Játék indítása";
    startButton.classList.add("btn", "btn-success", "mt-3", "d-block", "mx-auto");
    // Eseménykezelő hozzáadása
    startButton.addEventListener("click", () => {
        players.forEach(player => {
            player.points = 66; // Pontok inicializálása
            player.previousRounds = []; // Előző játékok inicializálása
        });
        savePlayersToLocalStorage(players); // Játékosok mentése
        window.location.href = "index.html"; // Átirányítás
    });
    // Gomb hozzáadása az oldalhoz
    container.innerHTML = "";
    if (players.length >= 2) {
        container.appendChild(startButton);
    }
}
// Betöltéskor ellenőrzés
document.addEventListener("DOMContentLoaded", createStartButton);
