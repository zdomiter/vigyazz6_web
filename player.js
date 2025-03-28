import { User } from "./user.js";
import { savePlayersToLocalStorage, loadPlayersFromLocalStorage } from "./storage.js";
let players = loadPlayersFromLocalStorage();
function updatePlayerList() {
    const playerList = document.getElementById("player-list");
    if (!playerList)
        return;
    playerList.innerHTML = "";
    players.forEach((player, index) => {
        const li = document.createElement("li");
        li.classList.add("list-group-item", "d-flex", "justify-content-between", "align-items-center");
        const icon = document.createElement("i");
        icon.classList.add("bi", "bi-person", "me-2");
        const nameSpan = document.createElement("span");
        nameSpan.textContent = player.name;
        const nameContainer = document.createElement("div");
        nameContainer.classList.add("d-flex", "align-items-center");
        nameContainer.appendChild(icon);
        nameContainer.appendChild(nameSpan);
        const deleteButton = document.createElement("button");
        deleteButton.innerHTML = '<i class="bi bi-trash"></i>';
        deleteButton.classList.add("btn", "btn-sm", "btn-danger");
        deleteButton.onclick = () => deletePlayer(index);
        li.appendChild(nameContainer);
        li.appendChild(deleteButton);
        playerList.appendChild(li);
    });
    toggleStartButton();
    togglePlayerForm();
}
function deletePlayer(index) {
    players.splice(index, 1);
    initializeGame();
    updatePlayerList();
}
function addPlayer(name) {
    const upperCaseName = name.toUpperCase();
    let trimmedName = upperCaseName.trim().substring(0, 35);
    let uniqueName = trimmedName;
    let count = 1;
    while (players.some(player => player.name === uniqueName)) {
        count++;
        uniqueName = `${trimmedName} ${count}`;
    }
    players.push(new User(uniqueName));
    initializeGame();
    updatePlayerList();
}
document.addEventListener("DOMContentLoaded", () => {
    let modalElement = document.getElementById("storageInfoModal");
    if (modalElement) {
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
    });
    createStartButton();
    updatePlayerList();
});
function createStartButton() {
    const container = document.getElementById("button-container");
    if (!container)
        return;
    let startButton = document.getElementById("start-game");
    if (!startButton) {
        startButton = document.createElement("button");
        startButton.id = "start-game";
        startButton.classList.add("btn", "btn-primary", "mt-3", "mb-5", "d-block", "mx-auto");
        startButton.addEventListener("click", () => {
            initializeGame();
            window.location.href = "index.html";
        });
        container.appendChild(startButton);
    }
}
export function initializeGame() {
    localStorage.removeItem("gameSaved");
    players.forEach(player => {
        player.points = 66;
        player.previousRounds = [];
    });
    savePlayersToLocalStorage(players);
}
function togglePlayerForm() {
    const form = document.getElementById("player-form");
    if (!form)
        return;
    if (players.length >= 10) {
        form.style.display = "none";
    }
    else {
        form.style.display = "flex";
    }
}
function toggleStartButton() {
    const startButton = document.getElementById("start-game");
    if (!startButton)
        return;
    if (players.length < 2) {
        startButton.style.visibility = "hidden";
    }
    else {
        startButton.style.visibility = "visible";
    }
}
