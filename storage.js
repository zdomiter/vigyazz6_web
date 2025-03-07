"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.savePlayersToLocalStorage = savePlayersToLocalStorage;
exports.loadPlayersFromLocalStorage = loadPlayersFromLocalStorage;
var user_js_1 = require("./user.js");
function savePlayersToLocalStorage(players) {
    localStorage.setItem("players", JSON.stringify(players));
}
function loadPlayersFromLocalStorage() {
    var storedPlayers = localStorage.getItem("players");
    if (storedPlayers) {
        return JSON.parse(storedPlayers).map(function (p) { return new user_js_1.User(p._name, p._points); });
    }
    return [];
}
