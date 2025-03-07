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
        set: function (newPoints) {
            this._points = newPoints;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(User.prototype, "previousRounds", {
        get: function () {
            return this._previousRounds;
        },
        set: function (newPoints) {
            this._previousRounds = newPoints;
        },
        enumerable: false,
        configurable: true
    });
    User.prototype.deductPoints = function (pointsToDeduct) {
        this._points -= pointsToDeduct;
    };
    return User;
}());
exports.User = User;
