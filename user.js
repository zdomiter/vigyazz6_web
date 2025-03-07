"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.User = void 0;
var User = /** @class */ (function () {
    function User(name, points) {
        if (points === void 0) { points = 66; }
        this._name = name;
        this._points = points;
        this._previousRounds = [];
    }

    get name() {
        return this._name;
    }
    set name(newName) {
        this._name = newName;
    }
    get points() {
        return this._points;
    }
    set points(newPoints) {
        this._points = newPoints;
    }
    get previousRounds() {
        return this._previousRounds;
    }
    set previousRounds(newPoints) {
        this._previousRounds = newPoints;
    }
    deductPoints(points) {
        this._points -= points;
        this._previousRounds.push(points);
    }
}

 