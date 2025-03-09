import { User } from "./user.js";
import { loadPlayersFromLocalStorage, savePlayersToLocalStorage } from "./storage.js";

let players: User[] = loadPlayersFromLocalStorage();

// ✅ Játékos állás frissítése

function updateIndexPlayerList() {
    const container = document.getElementById("players-container");
    if (!container) return;
    container.innerHTML = "";

    // 1. Játékosok rendezése pontszám szerint
    players.sort((a, b) => b.points - a.points);

    let prevPoints: number | null = null;
    let displayedRank: number = 0;

    
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
                badge.classList.add("badge", "bg-secondary", "me-1");
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
function deductPoints(index: number, points: number): void {
    players[index].deductPoints(points);
    savePlayersToLocalStorage(players);
    updateIndexPlayerList();
}

// ✅ Betöltéskor frissítés
document.addEventListener("DOMContentLoaded", () => {
    const container = document.getElementById("players-container");
    if (!container) return;

    // Új kör gomb LÉTREHOZÁSA csak EGYSZER
    const newRoundButton = document.createElement("button");
    newRoundButton.textContent = "Új kör";
    newRoundButton.classList.add("btn", "btn-primary", "mb-3");
    newRoundButton.onclick = startNewRound;

    // Gomb hozzáadása a DOM-hoz
    if (players.length >= 2) {
        container.before(newRoundButton);
    }else {

        //Ezt javítani kell
        /*container.before("<h2>Üdvözöllek! Ez a Vigyázz6-os játék segédje.</h2>"
            + "<p>A játékhoz legalább két játékosra lesz szükség.</p>"
            + "<a href=player.html>Tovább a játékhoz</a>"
        );*/
    }

    updateIndexPlayerList();
});
function startNewRound() {
    players.forEach((player, index) => {
        const input = prompt(`${player.name} hány pontot gyűjtött ebben a körben?`);
        if (input === null) return; // Ha megszakítják a promptot, kilépünk

        const pointsToDeduct = parseInt(input, 10);
        if (!isNaN(pointsToDeduct) && pointsToDeduct >= 0) {
            players[index].deductPoints(pointsToDeduct);

        }
    });

    savePlayersToLocalStorage(players);
    updateIndexPlayerList();
}

function checkGameOver() {
    const newRoundButton = document.getElementById("button") as HTMLButtonElement;
    
    // Van-e olyan játékos, akinek 0 vagy kevesebb pontja van?
    const hasLoser = players.some(player => player.points <= 0);

    if (hasLoser) {
        // Kiemeljük a győztest (aki "win" ID-t kapott)
        document.querySelectorAll("#win").forEach((card) => {
            (card as HTMLElement).classList.add("bg-danger", "text-white");
        });

        // Az "Új kör" gomb elrejtése
        if (newRoundButton) {
            newRoundButton.style.display = "none";
        }
    } else {
        // Ha nincs vesztes, az "Új kör" gomb maradjon látható
        if (newRoundButton) {
            newRoundButton.style.display = "block";
        }
    }
}






