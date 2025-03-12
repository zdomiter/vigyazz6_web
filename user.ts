export class User {
    private _name: string;
    private _points: number;
    private _previousRounds: number[]
    private _rank: number;

    constructor(name: string, points: number = 66, previousRounds: number[] = [], rank: number = 1) {
        this._name = name;
        this._points = points;
        this._previousRounds = previousRounds;
        this._rank = rank;
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

    get rank(): number {
        return this._rank;
    }

    set rank(newRank: number) {
        this._rank = newRank;
    }

    deductPoints(points: number): void {
        this._points -= points;
        this._previousRounds.push(points); 
    }
}
