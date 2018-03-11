import { IGameState } from "./game";

export interface IGameStorage {
    load(): IGameState | null;
    save(state: IGameState): void;
    storeHighScore(gameSize: number, score: number): void;
    getHighScore(gameSize: number): number;
}

interface IHighScores {
    [size: number]: number;
}

interface IData {
    [key: string]: any;
}
class FakeStorage implements Storage {
    get length() {
        return Object.keys(this._data).length;
    }
    private _data: IData;
    constructor() {
        this._data = {};
    }
    public clear() {
        this._data = {};
    }
    public getItem(key: string): string | null {
        return this._data.hasOwnProperty(key) ? this._data[key] : undefined;
    }
    public key(index: number): string | null {
        return Object.keys(this._data)[index];
    }
    public removeItem(key: string) {
        delete this._data[key];
    }
    public setItem(key: string, data: string) {
        this._data[key] = data;
    }
    [key: string]: any;
    [index: number]: string;
}

const theFakeStorage = new FakeStorage();

const gameStateKey = 'gamestate';
const highscoreKey = 'highscore_';

export class GameStorage implements IGameStorage {
    private _highscores: IHighScores;
    private _storage: Storage;
    constructor() {
        this._highscores = [];
        if (!this.localStorageSupported()) {
            this._storage = theFakeStorage;
        } else {
            this._storage = localStorage;
        }
    }
    public load(): IGameState | null {
        const stateJSON = this._storage.getItem(gameStateKey);
        if (stateJSON) {
            return JSON.parse(stateJSON) as IGameState;
        } else {
            return null;
        }
    }

    public save(state: IGameState) {
        const stateJSON = JSON.stringify(state);
        this._storage.setItem(gameStateKey, stateJSON);
    }

    public storeHighScore(gameSize: number, score: number) {
        const key = highscoreKey + gameSize.toString();
        this._storage.setItem(key, score.toString());
    }

    public getHighScore(gameSize: number): number {
        const key = highscoreKey + gameSize.toString();
        const scoreStr = this._storage.getItem(key);
        const score = scoreStr ? parseInt(scoreStr, 10) : NaN;
        return isNaN(score) ? 0 : score;
    }

    private localStorageSupported(): boolean {
        const testKey = "test";
        try {
            const storage = window.localStorage;
            storage.setItem(testKey, "1");
            storage.removeItem(testKey);
            return true;
        } catch (error) {
            return false;
        }
    }
}
