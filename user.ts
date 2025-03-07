export class User {
    private _name: string;
    private _points: number;
    private _previousRounds: number[]

    constructor(name: string, points: number = 66) {
        this._name = name;
        this._points = points;
        this._previousRounds = [];
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

    get previousRounds(): number[] {
        return this._previousRounds;
    }

    set previousRounds(newPoints: number[]) {
        this._previousRounds = newPoints;
    }

    deductPoints(points: number): void {
        this._points -= points;
        this._previousRounds.push(points); 
    }

   /* addPreviousRound(points: number): void {
        this._previousRounds.push(points);
    }*/
}
