import { User } from "./user.js";
import { savePlayersToLocalStorage, loadPlayersFromLocalStorage } from "./storage.js";
declare var bootstrap: any;

let players: User[] = loadPlayersFromLocalStorage();

// ✅ Játékoslista frissítése
function updatePlayerList(): void {
    const playerList = document.getElementById("player-list");
    if (!playerList) return;
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
}


// ✅ Új játékos hozzáadása
function addPlayer(name: string): void {
    players.push(new User(name));
    savePlayersToLocalStorage(players);
    updatePlayerList();
}

// ✅ Játékos törlése
function deletePlayer(index: number): void {
    players.splice(index, 1);
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
    updatePlayerList();

    const form = document.getElementById("player-form");
    form?.addEventListener("submit", (event) => {
        event.preventDefault();
        const input = document.getElementById("new-player") as HTMLInputElement;
        if (input.value.trim() !== "") {
            addPlayer(input.value);
            input.value = "";
        }
    });
});

function createStartButton() {
    const container = document.getElementById("button-container");
    if (!container) return;

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

// Betöltéskor ellenőrzés
document.addEventListener("DOMContentLoaded", createStartButton);