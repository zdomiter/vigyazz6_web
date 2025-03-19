import { loadPlayersFromLocalStorage, saveGamesToLocalStorage, savePlayersToLocalStorage } from "./storage.js";
let players = loadPlayersFromLocalStorage();
// Játékos állás frissítése
function assignPlayerRanks(players) {
    players.sort((a, b) => b.points - a.points);
    let prevPoints = null;
    let displayedRank = 0;
    players.forEach((player) => {
        if (player.points !== prevPoints) {
            displayedRank++;
        }
        player.rank = displayedRank;
        prevPoints = player.points;
    });
}
function updateIndexPlayerList() {
    const container = document.getElementById("players-container");
    if (!container)
        return;
    container.innerHTML = "";
    assignPlayerRanks(players);
    const baseColor = [220, 80, 40]; // HSL: Sötétkék (hue: 220, saturation: 80%, lightness: 40%)
    const lightnessIncrement = 20 / players.length; // Minden kártyánál növeljük a világosságot 5%-kal
    players.forEach((player, index) => {
        setTimeout(() => {
            const lightness = Math.min(baseColor[2] + index * lightnessIncrement, 60); // Ne legyen túl világos
            const card = document.createElement("div");
            card.classList.add("card", "mb-3", "w-100", "popIn-animation");
            card.style.backgroundColor = `hsl(${baseColor[0]}, ${baseColor[1]}%, ${lightness}%)`; // HSL szín beállítása
            if (player.rank === 1) {
                card.id = "win";
            }
            const cardBody = document.createElement("div");
            cardBody.classList.add("card-body");
            const row = document.createElement("div");
            row.classList.add("row", "align-items-center");
            // Helyezés fehér négyzetben
            const rankDiv = document.createElement("div");
            rankDiv.classList.add("col-2", "d-flex", "text-start");
            rankDiv.innerHTML = `<div class="rank-box">${player.rank}</div>`;
            const nameDiv = document.createElement("div");
            nameDiv.classList.add("col-8", "fw-bold");
            nameDiv.textContent = player.name;
            const pointsDiv = document.createElement("div");
            pointsDiv.classList.add("col-2", "text-end", "fw-bold");
            pointsDiv.textContent = `${player.points}`;
            row.appendChild(rankDiv);
            row.appendChild(nameDiv);
            row.appendChild(pointsDiv);
            cardBody.appendChild(row);
            // Korábbi körök pontjai badge-ekben
            if (player.previousRounds && player.previousRounds.length > 0) {
                const separator = document.createElement("div");
                separator.classList.add("separator");
                const previousRoundsDiv = document.createElement("div");
                previousRoundsDiv.classList.add("mt-2");
                player.previousRounds.forEach((roundPoints) => {
                    const badge = document.createElement("span");
                    badge.classList.add("round-badge");
                    badge.textContent = roundPoints.toString();
                    previousRoundsDiv.appendChild(badge);
                });
                cardBody.appendChild(separator);
                cardBody.appendChild(previousRoundsDiv);
            }
            card.appendChild(cardBody);
            container.appendChild(card);
        }, index * 100); // Egyenként jelennek meg 100ms késéssel
    });
    checkGameOver();
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
        if (!localStorage.getItem("gameSaved")) {
            saveGamesToLocalStorage(players); // Eredmény mentése
            localStorage.setItem("gameSaved", "true"); // Mentés megtörtént
        }
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
    if (hasLoser) {
        // Késleltetés után futtatjuk a győztes kiemelését
        setTimeout(() => {
            highlightWinner();
        }, players.length * 100 + 50); // 50ms biztonsági ráhagyás
    }
}
function highlightWinner() {
    // Keresd meg az összes győztes kártyát (akik a "win" ID-t kapták)
    const winners = document.querySelectorAll("#win");
    if (winners.length === 0)
        return;
    // Késleltetés, hogy minden kártya előbb megjelenjen
    winners.forEach(winner => {
        setTimeout(() => {
            winner.classList.remove("popIn-animation");
            winner.classList.add("popEffect-animation", "text-white", "border-danger", "bg-danger");
        }, 500); // Biztosítjuk, hogy a kártyák előbb megjelenjenek "border-danger", "bg-danger" kivéve
    });
}
function closeBootstrapMenuIfOpen() {
    const menu = document.querySelector(".navbar-collapse");
    if (menu === null || menu === void 0 ? void 0 : menu.classList.contains("show")) {
        const bsCollapse = new bootstrap.Collapse(menu, { toggle: false });
        bsCollapse.hide();
    }
}
