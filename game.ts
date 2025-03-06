class User {
    private _name: string;
    private _points: number;

    constructor(name: string, points: number = 66) {
        this._name = name;
        this._points = points;
    }

    get name(): string {
        return this._name;
    }

    get points(): number {
        return this._points;
    }

    set name(newName: string) {
        this._name = newName;
    }

    deductPoints(pointsToDeduct: number) {
        this._points -= pointsToDeduct;
    }
}

// ✅ Játékosokat tároló tömb
let players: User[] = [];

// ✅ Játékosok frissítése és listázása
function updatePlayerList(): void {
    const playerList = document.getElementById("player-list");
    if (!playerList) return;

    // Töröljük a korábbi elemeket
    playerList.innerHTML = "";

    // Új elemek létrehozása
    players.forEach((player, index) => {
        const li = document.createElement("li");
        li.textContent = `${player.name} - ${player.points} pont`;

        // Szerkesztés gomb
        const editButton = document.createElement("button");
        editButton.innerHTML = `<i class="bi bi-pencil"></i>`;
        editButton.onclick = () => editPlayer(index);

        // Törlés gomb
        const deleteButton = document.createElement("button");
        deleteButton.innerHTML = `<i class="bi bi-trash"></i>`;
        deleteButton.onclick = () => deletePlayer(index);

        // Gombok hozzáadása az elemhez
        li.appendChild(editButton);
        li.appendChild(deleteButton);

        // Listaelem hozzáadása a listához
        playerList.appendChild(li);
    });
}


// ✅ Játékosok mentése LocalStorage-ba
function savePlayersToLocalStorage(): void {
    localStorage.setItem("players", JSON.stringify(players));
}

// ✅ Játékosok betöltése LocalStorage-ból
function loadPlayersFromLocalStorage(): void {
    const storedPlayers = localStorage.getItem("players");
    if (storedPlayers) {
        players = JSON.parse(storedPlayers).map((p: any) => new User(p._name, p._points));
    }
}

// ✅ Játékos hozzáadása és mentése
function addPlayer(name: string): void {
    players.push(new User(name));
    savePlayersToLocalStorage();
    updatePlayerList();
    updateIndexPlayerList();
}

// ✅ Játékos törlése és mentése
function deletePlayer(index: number): void {
    players.splice(index, 1);
    savePlayersToLocalStorage();
    updatePlayerList();
    updateIndexPlayerList();
}

// ✅ Játékos szerkesztése és mentése
function editPlayer(index: number): void {
    const newName = prompt("Új név megadása:", players[index].name);
    if (newName) {
        players[index].name = newName;
        savePlayersToLocalStorage();
        updatePlayerList();
        updateIndexPlayerList();
    }
}

// ✅ Oldal betöltésekor betöltjük az adatokat
document.addEventListener("DOMContentLoaded", () => {
    loadPlayersFromLocalStorage();
    updatePlayerList();
    updateIndexPlayerList();
});

function deductPoints(index: number, points: number): void {
    players[index].deductPoints(points);
    savePlayersToLocalStorage();
    updatePlayerList();
    updateIndexPlayerList();
}


// ✅ Form eseménykezelő hozzáadása
document.addEventListener("DOMContentLoaded", () => {
    const form = document.getElementById("player-form");
    form?.addEventListener("submit", (event) => {
        event.preventDefault();
        const input = document.getElementById("new-player") as HTMLInputElement;
        if (input.value.trim() !== "") {
            addPlayer(input.value);
            input.value = "";
        }
    });

    updatePlayerList();
});

function updateIndexPlayerList(): void {
    const container = document.getElementById("players-container");
    if (!container) return;

    // Előző lista törlése
    container.innerHTML = "";

    // Új kártyák létrehozása
    players.forEach((player) => {
        // Kártya létrehozása
        const card = document.createElement("div");
        card.classList.add("player-card");

        // Név megjelenítése
        const nameDiv = document.createElement("div");
        nameDiv.classList.add("player-name");
        nameDiv.textContent = player.name;

        // Pontszám megjelenítése
        const pointsDiv = document.createElement("div");
        pointsDiv.classList.add("player-points");
        pointsDiv.textContent = `${player.points} pont`;

        // Kártyához hozzáadjuk az elemeket
        card.appendChild(nameDiv);
        card.appendChild(pointsDiv);

        // Kártyát hozzáadjuk a konténerhez
        container.appendChild(card);
    });
}

