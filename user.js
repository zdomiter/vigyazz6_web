export class User {
    constructor(name, points = 66) {
        this._name = name;
        this._points = points;
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
    deductPoints(pointsToDeduct) {
        this._points -= pointsToDeduct;
    }
}
