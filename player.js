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
        // Ikon elem létrehozása
        const icon = document.createElement("i");
        icon.classList.add("bi", "bi-person", "me-2"); // Bootstrap Icons személy ikon, kis jobb marginnal
        // Név span létrehozása
        const nameSpan = document.createElement("span");
        nameSpan.textContent = player.name;
        // Név és ikon egybe
        const nameContainer = document.createElement("div");
        nameContainer.classList.add("d-flex", "align-items-center");
        nameContainer.appendChild(icon);
        nameContainer.appendChild(nameSpan);
        // Törlés gomb
        const deleteButton = document.createElement("button");
        deleteButton.innerHTML = '<i class="bi bi-trash"></i>';
        deleteButton.classList.add("btn", "btn-sm", "btn-danger");
        deleteButton.onclick = () => deletePlayer(index);
        li.appendChild(nameContainer);
        li.appendChild(deleteButton);
        playerList.appendChild(li);
    });
    createStartButton();
    togglePlayerForm();
}
// ✅ Játékos törlése
function deletePlayer(index) {
    players.splice(index, 1);
    savePlayersToLocalStorage(players);
    updatePlayerList();
}
// ✅ Új játékos hozzáadása
function addPlayer(name) {
    const upperCaseName = name.toUpperCase();
    // 1. Levágjuk 20 karakterre és eltávolítjuk a felesleges szóközöket
    let trimmedName = upperCaseName.trim().substring(0, 20);
    // 2. Ellenőrizzük, hogy a név egyedi-e
    let uniqueName = trimmedName;
    let count = 1;
    while (players.some(player => player.name === uniqueName)) {
        count++;
        uniqueName = `${trimmedName} ${count}`;
    }
    // 3. Létrehozzuk és hozzáadjuk az új játékost
    players.push(new User(uniqueName));
    savePlayersToLocalStorage(players);
    updatePlayerList();
}
// ✅ Form kezelése
document.addEventListener("DOMContentLoaded", () => {
    let modalElement = document.getElementById("storageInfoModal");
    if (modalElement) { // Ellenőrizzük, hogy létezik-e a modal
        if (!localStorage.getItem("storageNoticeAccepted")) {
            let modal = new bootstrap.Modal(modalElement);
            modal.show();
            modalElement.addEventListener("hidden.bs.modal", function () {
                localStorage.setItem("storageNoticeAccepted", "true");
            });
        }
    }
    const form = document.getElementById("player-form");
    form === null || form === void 0 ? void 0 : form.addEventListener("submit", (event) => {
        event.preventDefault();
        const input = document.getElementById("new-player");
        if (input.value.trim() !== "") {
            addPlayer(input.value);
            input.value = "";
        }
        else {
            alert("Adj meg egy nevet!"); // Opcionálisan jelezhetjük a felhasználónak
        }
    });
    updatePlayerList();
});
function createStartButton() {
    const container = document.getElementById("button-container");
    if (!container)
        return;
    // Gomb létrehozása
    const startButton = document.createElement("button");
    startButton.id = "start-game";
    startButton.textContent = "Játék indítása";
    startButton.classList.add("btn", "btn-primary", "mt-3", "d-block", "mx-auto");
    // Eseménykezelő hozzáadása
    startButton.addEventListener("click", () => {
        localStorage.removeItem("gameSaved"); // Új játék kezdetén töröljük a flag-et
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
function togglePlayerForm() {
    const form = document.getElementById("player-form");
    if (!form)
        return;
    if (players.length >= 10) {
        form.style.display = "none"; // Elrejtés
    }
    else {
        form.style.display = "flex"; // Megjelenítés
    }
}
