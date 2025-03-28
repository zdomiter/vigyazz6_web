import { getGamesFromLocalStorage } from "./storage.js";
function renderGameHistory() {
    const games = getGamesFromLocalStorage();
    const container = document.getElementById("history-container");
    if (!container)
        return;
    container.innerHTML = "";
    const baseColor = [220, 80, 40];
    const lightnessIncrement = 30 / games.length;
    games.forEach((game, index) => {
        setTimeout(() => {
            const lightness = Math.min(baseColor[2] + index * lightnessIncrement, 80);
            const card = document.createElement("div");
            card.classList.add("card", "mb-3", "w-100");
            card.style.backgroundColor = `hsl(${baseColor[0]}, ${baseColor[1]}%, ${lightness}%)`;
            const cardHeader = document.createElement("div");
            cardHeader.classList.add("card-header");
            const toggleButton = document.createElement("a");
            toggleButton.classList.add("btn", "w-100", "text-start");
            toggleButton.setAttribute("data-bs-toggle", "collapse");
            toggleButton.setAttribute("href", `#game${index}`);
            toggleButton.innerHTML = `
                <span>
                    📅<span style="color:white;">
                        ${game.timestamp.split("T")[0]}
                    </span> <br>
                </span>
                <i class="bi bi-chevron-right toggle-icon" style="color: white;"></i>
                <span style="float: right; text-align: right; color: white;">
                    <i class="bi bi-trophy me-2" style="color: white;"></i>
                    ${game.players
                .filter(p => p.rank === 1)
                .map(p => p.name)
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
                nameDiv.classList.add("col-8");
                nameDiv.textContent = player.name;
                const pointsDiv = document.createElement("div");
                pointsDiv.classList.add("col-2", "text-end", "fw-bold");
                pointsDiv.textContent = `${player.points}`;
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
            setTimeout(() => {
                const collapseElement = document.getElementById(`game${index}`);
                if (collapseElement) {
                    collapseElement.addEventListener("show.bs.collapse", () => {
                        const icon = toggleButton.querySelector(".toggle-icon");
                        if (icon) {
                            icon.classList.replace("bi-chevron-right", "bi-chevron-down");
                        }
                    });
                    collapseElement.addEventListener("hide.bs.collapse", () => {
                        const icon = toggleButton.querySelector(".toggle-icon");
                        if (icon) {
                            icon.classList.replace("bi-chevron-down", "bi-chevron-right");
                        }
                    });
                }
            }, 0);
        }, index * 100);
    });
}
document.addEventListener("DOMContentLoaded", renderGameHistory);
