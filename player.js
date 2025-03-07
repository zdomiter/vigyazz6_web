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
        li.textContent = `${player.name} - ${player.points} pont`;
        // Szerkesztés gomb
        const editButton = document.createElement("button");
        editButton.innerHTML = '<i class="bi bi-pencil"></i>';
        editButton.classList.add("btn", "btn-sm", "btn-warning");
        editButton.onclick = () => editPlayer(index);
        // Törlés gomb
        const deleteButton = document.createElement("button");
        deleteButton.innerHTML = '<i class="bi bi-trash"></i>';
        deleteButton.classList.add("btn", "btn-sm", "btn-danger");
        deleteButton.onclick = () => deletePlayer(index);
        li.appendChild(editButton);
        li.appendChild(deleteButton);
        playerList.appendChild(li);
    });
}
// ✅ Új játékos hozzáadása
function addPlayer(name) {
    players.push(new User(name));
    savePlayersToLocalStorage(players);
    updatePlayerList();
}
// ✅ Játékos szerkesztése
function editPlayer(index) {
    const newName = prompt("Új név megadása:", players[index].name);
    if (newName) {
        players[index].name = newName;
        savePlayersToLocalStorage(players);
        updatePlayerList();
    }
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
    form?.addEventListener("submit", (event) => {
        event.preventDefault();
        const input = document.getElementById("new-player");
        if (input.value.trim() !== "") {
            addPlayer(input.value);
            input.value = "";
        }
    });
});
