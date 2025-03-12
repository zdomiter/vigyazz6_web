import { loadPlayersFromLocalStorage, saveGamesToLocalStorage, savePlayersToLocalStorage } from "./storage.js";
let players = loadPlayersFromLocalStorage();
// ✅ Játékos állás frissítése
function updateIndexPlayerList() {
    const container = document.getElementById("players-container");
    if (!container)
        return;
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
        if (displayedRank === 1) {
            card.id = "win";
        }
        const cardBody = document.createElement("div");
        cardBody.classList.add("card-body");
        const row = document.createElement("div");
        row.classList.add("row", "align-items-center");
        const rankDiv = document.createElement("div");
        rankDiv.classList.add("col-2", "fw-bold");
        rankDiv.textContent = `${displayedRank}.`;
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
        // Korábbi körök pontjai badge-ekben
        if (player.previousRounds && player.previousRounds.length > 0) {
            const previousRoundsDiv = document.createElement("div");
            previousRoundsDiv.classList.add("mt-2");
            player.previousRounds.forEach((roundPoints) => {
                const badge = document.createElement("span");
                badge.classList.add("badge", "me-1");
                badge.textContent = roundPoints.toString();
                previousRoundsDiv.appendChild(badge);
            });
            cardBody.appendChild(previousRoundsDiv);
        }
        card.appendChild(cardBody);
        container.appendChild(card);
    });
    checkGameOver();
}
// ✅ Pontlevonás egy játékostól
function deductPoints(index, points) {
    players[index].deductPoints(points);
    savePlayersToLocalStorage(players);
    updateIndexPlayerList();
}
// ✅ Betöltéskor frissítés
document.addEventListener("DOMContentLoaded", () => {
    const container = document.getElementById("players-container");
    if (!container)
        return;
    // Új kör gomb LÉTREHOZÁSA csak EGYSZER
    const newRoundButton = document.createElement("button");
    newRoundButton.id = "newRoundButton";
    newRoundButton.textContent = "Új kör";
    newRoundButton.classList.add("btn", "btn-primary", "mb-3");
    newRoundButton.onclick = () => {
        closeBootstrapMenuIfOpen(); // Menü bezárása
        startNewRound();
    };
    // Gomb hozzáadása a DOM-hoz
    if (players.length >= 2) {
        container.before(newRoundButton);
    }
    else if (players.length === 0) {
        // Üzenet létrehozása és Bootstrap-stílus alkalmazása
        const messageDiv = document.createElement("div");
        messageDiv.classList.add("alert", "alert-warning", "text-center", "mt-3", "p-4", "rounded");
        messageDiv.innerHTML = `
        <h2 class="mb-3">Üdvözöllek! Ez a Vigyáz(z)6! játék segédje.</h2>
        <p class="mb-3">A játékhoz legalább két játékosra lesz szükség.</p>
        <a href="player.html" class="btn btn-primary">Tovább a játékosokhoz</a>
    `;
        container.before(messageDiv);
    }
    updateIndexPlayerList();
});
function startNewRound() {
    let currentIndex = 0;
    function showModalForPlayer() {
        if (currentIndex >= players.length) {
            savePlayersToLocalStorage(players);
            updateIndexPlayerList();
            return;
        }
        const player = players[currentIndex];
        const playerPrompt = document.getElementById("playerPrompt");
        const pointsInput = document.getElementById("pointsInput");
        const saveButton = document.getElementById("savePoints");
        const modalElement = document.getElementById("pointsModal");
        playerPrompt.innerHTML = `${player.name}`;
        pointsInput.value = ""; // Alapértelmezett érték törlése
        const modal = new bootstrap.Modal(modalElement);
        modal.show();
        // Fókusz automatikus beállítása a beviteli mezőre a modál megnyitásakor
        modalElement.addEventListener("shown.bs.modal", () => {
            pointsInput.focus();
        }, { once: true });
        saveButton.onclick = function savePoints() {
            const pointsToDeduct = parseInt(pointsInput.value.trim(), 10);
            console.log(`${players[currentIndex].name} pontszáma: ${pointsToDeduct}`);
            if (!isNaN(pointsToDeduct) && pointsToDeduct >= 0) {
                players[currentIndex].deductPoints(pointsToDeduct);
                currentIndex++;
                modal.hide();
                // Ellenőrizzük, hogy a modal ténylegesen bezárult-e
                const modalBackdrop = document.querySelector('.modal-backdrop');
                if (modalBackdrop) {
                    // Ha a backdrop még nem tűnt el, manuálisan eltávolítjuk
                    document.body.classList.remove('modal-open');
                    document.body.removeChild(modalBackdrop);
                }
                showModalForPlayer(); // Következő játékos megjelenítése
            }
            else {
                alert("Érvényes számot adj meg!"); // Hibakezelés
            }
        };
    }
    showModalForPlayer();
}
function checkGameOver() {
    const newRoundButton = document.getElementById("newRoundButton");
    // Van-e olyan játékos, akinek 0 vagy kevesebb pontja van?
    const hasLoser = players.some(player => player.points <= 0);
    if (hasLoser) {
        // Kiemeljük a győztest (aki "win" ID-t kapott)
        document.querySelectorAll("#win").forEach((card) => {
            card.classList.add("bg-danger", "text-white");
        });
        saveGamesToLocalStorage(players);
        // Az "Új kör" gomb elrejtése
        if (newRoundButton) {
            newRoundButton.style.display = "none";
        }
    }
    else {
        // Ha nincs vesztes, az "Új kör" gomb maradjon látható
        if (newRoundButton) {
            newRoundButton.style.display = "block";
        }
    }
}
function closeBootstrapMenuIfOpen() {
    const menu = document.querySelector(".navbar-collapse");
    if (menu === null || menu === void 0 ? void 0 : menu.classList.contains("show")) {
        const bsCollapse = new bootstrap.Collapse(menu, { toggle: false });
        bsCollapse.hide();
    }
}
