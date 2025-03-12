import { getGamesFromLocalStorage } from "./storage.js";

function renderGameHistory(): void {
    const games = getGamesFromLocalStorage();
    const container = document.getElementById("history-container");

    if (!container) return;

    container.innerHTML = ""; // Előző elemek törlése

    games.forEach((game, index) => {
        const card = document.createElement("div");
        card.classList.add("card", "mb-3", "w-100");

        const cardHeader = document.createElement("div");
        cardHeader.classList.add("card-header");

        const toggleButton = document.createElement("a");
        toggleButton.classList.add("btn", "w-100", "text-start");
        toggleButton.setAttribute("data-bs-toggle", "collapse");
        toggleButton.setAttribute("href", `#game${index}`);
        toggleButton.innerHTML = `
            📅<span style="color: #3088A4;">
                ${game.timestamp.split("T")[0]}
            </span> <br>
               <span style="float: right; text-align: right;">
                    ${game.players
                        .filter(p => p.rank === 1) // Csak a győztesek
                        .map(p => p.name) // Csak a nevek
                        .join(" - ")}
                </span>
            `;


        cardHeader.appendChild(toggleButton);

        const collapseDiv = document.createElement("div");
        collapseDiv.id = `game${index}`;
        collapseDiv.classList.add("collapse");

        const cardBody = document.createElement("div");
        cardBody.classList.add("card-body");

        const list = document.createElement("ul");
        list.classList.add("list-unstyled", "mb-0");

        game.players.forEach(player => {
            const listItem = document.createElement("div");
            listItem.classList.add("row", "align-items-center", "mb-1");
        
            const rankDiv = document.createElement("div");
            rankDiv.classList.add("col-2", "fw-bold");
            rankDiv.textContent = `${player.rank}.`;
        
            const nameDiv = document.createElement("div");
            nameDiv.classList.add("col-6");
            nameDiv.textContent = player.name;
        
            const pointsDiv = document.createElement("div");
            pointsDiv.classList.add("col-4", "text-end", "fw-bold");
            pointsDiv.textContent = `${player.points} pont`;
        
            listItem.appendChild(rankDiv);
            listItem.appendChild(nameDiv);
            listItem.appendChild(pointsDiv);
            list.appendChild(listItem);
        });
        

        cardBody.appendChild(list);
        collapseDiv.appendChild(cardBody);
        card.appendChild(cardHeader);
        card.appendChild(collapseDiv);
        container.appendChild(card);
    });
}

document.addEventListener("DOMContentLoaded", renderGameHistory);
