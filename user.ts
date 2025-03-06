export class User {
    private _name: string;
    private _points: number;

    constructor(name: string, points: number = 66) {
        this._name = name;
        this._points = points;
    }

    get name(): string {
        return this._name;
    }

    set name(newName: string) {
        this._name = newName;
    }

    get points(): number {
        return this._points;
    }

    set points(newPoints: number) {
        this._points = newPoints;
    }

    deductPoints(pointsToDeduct: number): void {
        this._points -= pointsToDeduct;
    }
}
