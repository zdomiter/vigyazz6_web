import { User } from "./user.js";
import { initializeGame } from "./player.js"
import { loadPlayersFromLocalStorage, saveGamesToLocalStorage, savePlayersToLocalStorage } from "./storage.js";
import { currentLanguageData } from "./language.js";
declare var bootstrap: any;

interface GameResult {
    timestamp: string;
    players: { name: string; points: number; rank: number }[];
}

let players: User[] = loadPlayersFromLocalStorage();

function assignPlayerRanks(players: any[]) {

    players.sort((a: { points: number; }, b: { points: number; }) => b.points - a.points);

    let prevPoints: number | null = null;
    let displayedRank: number = 0;

    players.forEach((player: { points: number | null; rank: number; }) => {
        if (player.points !== prevPoints) {
            displayedRank++;
        }
        player.rank = displayedRank;
        prevPoints = player.points;
    });
}

function updateIndexPlayerList() {
    const container = document.getElementById("players-container");
    if (!container) return;
    container.innerHTML = "";

    assignPlayerRanks(players);

    const baseColor = [220, 80, 40];
    const lightnessIncrement = 20 / players.length;

    players.forEach((player, index) => {
        setTimeout(() => {
            const lightness = Math.min(baseColor[2] + index * lightnessIncrement, 60); 

            const card = document.createElement("div");
            card.classList.add("card", "mb-3", "w-100", "popIn-animation");
            card.style.backgroundColor = `hsl(${baseColor[0]}, ${baseColor[1]}%, ${lightness}%)`;

            if (player.rank === 1) {
                card.id = "win";
            }

            const cardBody = document.createElement("div");
            cardBody.classList.add("card-body");

            const row = document.createElement("div");
            row.classList.add("row", "align-items-center");

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

        }, index * 100);
    });
    checkGameOver();

}
document.addEventListener("languageLoaded", () => {
    initGameUI();
});
function initGameUI() {
    const container = document.getElementById("players-container");
    if (!container) return;

    let newRoundButton = document.getElementById("newRoundButton") as HTMLButtonElement;

    if (!newRoundButton) {
        newRoundButton = document.createElement("button");
        newRoundButton.id = "newRoundButton";
        newRoundButton.classList.add("btn", "btn-primary", "mb-3");

        if (players.length >= 2) {
            container.before(newRoundButton);
        }
    }
    if (players.length < 2) {
        let messageDiv = document.querySelector(".alert.alert-warning");
        if (!messageDiv) {
            const messageDiv = document.createElement("div");
            messageDiv.classList.add("alert", "alert-warning", "text-center", "mt-3", "p-4", "rounded");
            messageDiv.innerHTML = `
            <h1 id="gameTitle" class="mb-3"></h1>
            <h2 id="gameDescription" class="mb-3"></h2>
            <p id="minPlayersRequired" class="mb-3"></p>
            <a id="goToPlayers" href="player.html" class="btn btn-primary"></a>
            `;
            container.parentElement?.insertBefore(messageDiv, container);
        }
        
    }

    const modalElement = document.getElementById("pointsModal");

    modalElement?.addEventListener("hidden.bs.modal", () => {
        if (document.activeElement instanceof HTMLElement) {
            document.activeElement.blur();
        }
    });
    updateIndexPlayerList();
}

function startNewRound() {
    let currentIndex = 0;
    const playerPrompt = document.getElementById("playerPrompt")!;
    const pointsInput = document.getElementById("pointsInput")! as HTMLInputElement;
    const saveButton = document.getElementById("savePoints")! as HTMLButtonElement;
    const modalElement = document.getElementById("pointsModal")!;
    const modal = new bootstrap.Modal(modalElement);

    function updateModalForPlayer() {
        if (currentIndex >= players.length) {
            savePlayersToLocalStorage(players);
            updateIndexPlayerList();
            modal.hide();
            return;
        }

        playerPrompt.innerHTML = `${players[currentIndex].name}`;
        pointsInput.value = "";
        pointsInput.focus();
    }

    modalElement.addEventListener("shown.bs.modal", () => {
        pointsInput.focus();
    });

    saveButton.onclick = function savePoints() {
        const pointsToDeduct = parseInt(pointsInput.value.trim(), 10);

        if (!isNaN(pointsToDeduct) && pointsToDeduct >= 0 && pointsToDeduct <= 171) {
            players[currentIndex].deductPoints(pointsToDeduct);
            currentIndex++;
            updateModalForPlayer(); 
        } else {
            const alertMessage = currentLanguageData.errors?.invalidNumber
            alert(alertMessage); 
        }
    };

    modal.show();
    updateModalForPlayer();
}

function checkGameOver() {
    updateNewRoundButton();

    const hasLoser = players.some(player => player.points <= 0);

    if (hasLoser) {
        if (!localStorage.getItem("gameSaved")) {
            saveGamesToLocalStorage(players); 
            localStorage.setItem("gameSaved", "true"); 
        }
        setTimeout(() => {
            highlightWinner();
        }, players.length * 100 + 50);
    }
}
function updateNewRoundButton() {
    const newRoundButton = document.getElementById("newRoundButton") as HTMLButtonElement;
    if (!newRoundButton) return;

    if (!currentLanguageData?.buttons) {
        console.warn("Nyelvi adatok még nem elérhetők, újrapróbálkozás...");
        setTimeout(updateNewRoundButton, 100); 
        return;
    }

    const hasLoser = players.some(player => player.points <= 0);

    if (hasLoser) {
        newRoundButton.textContent = currentLanguageData.buttons?.startNewGame;
        newRoundButton.onclick = () => {
            initializeGame();
            location.reload();
        };
        setInterval(() => {
            newRoundButton.classList.add("pulsing"); 
            setTimeout(() => {
                newRoundButton.classList.remove("pulsing");
            }, 1000);
        }, 5000);
    } else {
        newRoundButton.textContent = currentLanguageData.buttons?.newRound;
        newRoundButton.onclick = () => {
            closeBootstrapMenuIfOpen();
            startNewRound();
        };

        setInterval(() => {
            newRoundButton.classList.add("pulsing"); 
            setTimeout(() => {
                newRoundButton.classList.remove("pulsing"); 
            }, 500);
        }, 3000); 

    }
}

function highlightWinner() {
    const winners = document.querySelectorAll("#win");

    if (winners.length === 0) return;

    winners.forEach(winner => {

        setTimeout(() => {
            winner.classList.remove("popIn-animation");
            winner.classList.add("popEffect-animation", "text-white", "border-danger", "bg-danger");
        }, 500);

    });
}
function closeBootstrapMenuIfOpen() {
    const menu = document.querySelector(".navbar-collapse");
    if (menu?.classList.contains("show")) {
        const bsCollapse = new bootstrap.Collapse(menu, { toggle: false });
        bsCollapse.hide();
    }
}



