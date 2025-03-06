var User = /** @class */ (function () {
    function User(name, points) {
        if (points === void 0) { points = 66; }
        this._name = name;
        this._points = points;
    }
    Object.defineProperty(User.prototype, "name", {
        get: function () {
            return this._name;
        },
        set: function (newName) {
            this._name = newName;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(User.prototype, "points", {
        get: function () {
            return this._points;
        },
        enumerable: false,
        configurable: true
    });
    User.prototype.deductPoints = function (pointsToDeduct) {
        this._points -= pointsToDeduct;
    };
    return User;
}());
// ✅ Játékosokat tároló tömb
var players = [];
// ✅ Játékosok frissítése és listázása
function updatePlayerList() {
    var playerList = document.getElementById("player-list");
    if (!playerList)
        return;
    // Töröljük a korábbi elemeket
    playerList.innerHTML = "";
    // Új elemek létrehozása
    players.forEach(function (player, index) {
        var li = document.createElement("li");
        li.textContent = "".concat(player.name, " - ").concat(player.points, " pont");
        // Szerkesztés gomb
        var editButton = document.createElement("button");
        editButton.innerHTML = "<i class=\"bi bi-pencil\"></i>";
        editButton.onclick = function () { return editPlayer(index); };
        // Törlés gomb
        var deleteButton = document.createElement("button");
        deleteButton.innerHTML = "<i class=\"bi bi-trash\"></i>";
        deleteButton.onclick = function () { return deletePlayer(index); };
        // Gombok hozzáadása az elemhez
        li.appendChild(editButton);
        li.appendChild(deleteButton);
        // Listaelem hozzáadása a listához
        playerList.appendChild(li);
    });
}
// ✅ Játékosok mentése LocalStorage-ba
function savePlayersToLocalStorage() {
    localStorage.setItem("players", JSON.stringify(players));
}
// ✅ Játékosok betöltése LocalStorage-ból
function loadPlayersFromLocalStorage() {
    var storedPlayers = localStorage.getItem("players");
    if (storedPlayers) {
        players = JSON.parse(storedPlayers).map(function (p) { return new User(p._name, p._points); });
    }
}
// ✅ Játékos hozzáadása és mentése
function addPlayer(name) {
    players.push(new User(name));
    savePlayersToLocalStorage();
    updatePlayerList();
    updateIndexPlayerList();
}
// ✅ Játékos törlése és mentése
function deletePlayer(index) {
    players.splice(index, 1);
    savePlayersToLocalStorage();
    updatePlayerList();
    updateIndexPlayerList();
}
// ✅ Játékos szerkesztése és mentése
function editPlayer(index) {
    var newName = prompt("Új név megadása:", players[index].name);
    if (newName) {
        players[index].name = newName;
        savePlayersToLocalStorage();
        updatePlayerList();
        updateIndexPlayerList();
    }
}
// ✅ Oldal betöltésekor betöltjük az adatokat
document.addEventListener("DOMContentLoaded", function () {
    loadPlayersFromLocalStorage();
    updatePlayerList();
    updateIndexPlayerList();
});
function deductPoints(index, points) {
    players[index].deductPoints(points);
    savePlayersToLocalStorage();
    updatePlayerList();
    updateIndexPlayerList();
}
// ✅ Form eseménykezelő hozzáadása
document.addEventListener("DOMContentLoaded", function () {
    var form = document.getElementById("player-form");
    form === null || form === void 0 ? void 0 : form.addEventListener("submit", function (event) {
        event.preventDefault();
        var input = document.getElementById("new-player");
        if (input.value.trim() !== "") {
            addPlayer(input.value);
            input.value = "";
        }
    });
    updatePlayerList();
});
function updateIndexPlayerList() {
    var container = document.getElementById("players-container");
    if (!container)
        return;
    // Előző lista törlése
    container.innerHTML = "";
    // Új kártyák létrehozása
    players.forEach(function (player) {
        // Kártya létrehozása
        var card = document.createElement("div");
        card.classList.add("player-card");
        // Név megjelenítése
        var nameDiv = document.createElement("div");
        nameDiv.classList.add("player-name");
        nameDiv.textContent = player.name;
        // Pontszám megjelenítése
        var pointsDiv = document.createElement("div");
        pointsDiv.classList.add("player-points");
        pointsDiv.textContent = "".concat(player.points, " pont");
        // Kártyához hozzáadjuk az elemeket
        card.appendChild(nameDiv);
        card.appendChild(pointsDiv);
        // Kártyát hozzáadjuk a konténerhez
        container.appendChild(card);
    });
}
