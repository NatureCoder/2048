import { Pos } from './position';
import { Grid, IGridState } from './grid';
import { Direction, direction, DIRECTIONS } from './direction';
import { Cell, CellOrNull } from './cell';
import { randomInt } from './helpers';
import { InputHandler } from './inputhandler';

export type GridOrSize = Grid | number;
export interface IGameState {
    won: boolean;
    done: boolean;
    score: number;
    highscore: number;
    grid: IGridState;
}

export interface IRenderer {
    render(state: IGameState): void;
    updatescores(score: number, highscore: number): void;
}

export class Game {
    public static fromState(state: IGameState, renderer?: IRenderer, inputHandler?: InputHandler): Game {
        const grid = Grid.fromState(state.grid);
        const game = new Game(grid, renderer, inputHandler);
        game._won = state.won;
        game._done = state.done;
        game._score = state.score;
        game._highscore = state.highscore;
        return game;
    }

    public readonly grid: Grid;
    private _won: boolean = false;
    private _done: boolean = false;
    private _score: number = 0;
    private _highscore: number = 0;
    private _renderer?: IRenderer;
    private _inputHandler?: InputHandler;
    get won() {
        return this._won;
    }
    get done() {
        return this._done;
    }
    set done(val) {
        this._done = val;
    }
    get highscore() {
        return this._highscore;
    }
    set highscore(val) {
        this._highscore = val;
    }
    get score() {
        return this._score;
    }
    set score(val) {
        this._score = val;
        if (val > this.highscore) {
            this._highscore = val;
        }
        if (this._renderer) {
            this._renderer.updatescores(val, this.highscore);
        }
    }

    constructor(gridOrSize: GridOrSize = 4, renderer?: IRenderer, inputHandler?: InputHandler) {
        if (gridOrSize instanceof Grid) {
             this.grid = gridOrSize;
        } else {
            this.grid = new Grid(gridOrSize);
        }
        this._renderer = renderer;
        this._inputHandler = inputHandler;
        if (this._inputHandler) {
            this._inputHandler.on('move', this.playMove.bind(this));
            this._inputHandler.on('restart', this.restart.bind(this));
        }
        this.reset();
    }

    public restart() {
        this.grid.reset();
        this.reset();
        this.start();
    }

    public reset() {
        this._done = false;
        this._won = false;
        this.score = 0;
    }

    public start(fillAtStart: number = 2) {
        for (let i = 0; i < fillAtStart; i++) {
            const pos = this.grid.randomEmptyPosition();
            if (pos) {
                this.grid.addCell(pos, this.newCellValue());
            }
        }
        this.render();
    }

    public toState(): IGameState {
        return {
            won: this.won,
            done: this.done,
            score: this.score,
            highscore: this.highscore,
            grid: this.grid.toState()
        };
    }

    public newCellValue(): number {
        return randomInt(100) < 50 ? 2 : 4;
    }

    public hasWon(): boolean {
       return (this.grid.toArray().indexOf(2048) >= 0);
    }

    public canMakeMove(): boolean {
        return (this.grid.canShiftCells() || this.grid.canMergeCells());
    }

    public makeMove(dir: direction): boolean {
        this.grid.prepareMove();
        let changed = false;

        const vertical = (dir === direction.Down || dir === direction.Up);
        if (vertical) {
            for (const col of this.grid.cols()) {
                const colChanged = this.processRowOrCol(col, dir);
                changed = changed || colChanged;
            }
        } else {
            for (const row of this.grid.rows()) {
                const rowChanged = this.processRowOrCol(row, dir);
                changed = changed || rowChanged;
            }
        }
        return changed;
    }

    public playMove(dir: direction) {
        if (this.done) {
            return;
        }
        const changed = this.makeMove(dir);
        if (changed) {
            const pos = this.grid.randomEmptyPosition();
            if (pos) {
                const newVal = this.newCellValue();
                this.grid.addCell(pos!, newVal);
            }
            this._won = this.hasWon();
            this._done = this._won || !this.canMakeMove();
        }
        this.render();
    }

    public processRowOrCol(rowOrCol: CellOrNull[], dir: direction): boolean {
        // when processing a negative direction reverse the row/column first
        if ((dir === direction.Up) || (dir === direction.Left)) {
            rowOrCol.reverse();
        }
        let slided = this.defragRowOrCol(rowOrCol, dir);
        const merged = this.mergeCells(rowOrCol, dir);
        if (merged) {
            slided = this.defragRowOrCol(rowOrCol, dir) || slided;
        }
        return merged || slided;
    }

    private mergeCells(rowOrCol: CellOrNull[], dir: direction): boolean {
        let merged = false;
        let idx = rowOrCol.length - 1;
        while (idx > 0) {
            const curr = rowOrCol[idx];
            const next = rowOrCol[idx - 1];
            if (curr && curr.canMergeWith(next)) {
                this.score += this.grid.mergeCellWith(curr, next!, dir);
                rowOrCol[idx - 1] = null; // updating rowOrCol is only for testing purposes
                merged = true;
            }
            idx--;
        }
        return merged;
    }
    private defragRowOrCol(rowOrCol: CellOrNull[], d: direction): boolean {
        let changed = false;
        let idx = rowOrCol.length - 1;
        while (idx > 0) {
            const cell = rowOrCol[idx];
            let slided;
            if (!cell) {
                slided = this.slideAllCellsOverOnce(rowOrCol, idx, d);
                changed = changed || slided;
            }
            // when nothing has changed, check next position
            if (cell || !slided) {
                idx--;
            }
        }
        return changed;
    }
    private slideAllCellsOverOnce(rowOrCol: CellOrNull[], startIdx: number, d: direction): boolean {
        let moved = false;
        for (let idx = startIdx; idx > 0; idx--) {
            const nextCell = rowOrCol[idx - 1];
            if (nextCell) {
                this.grid.moveCell(nextCell, d);
                moved = true;
            }
            rowOrCol[idx] = nextCell; // updating rowOrCol is only for testing purposes
        }
        rowOrCol[0] = null; // updating rowOrCol is only for testing
        return moved;
    }

    private render() {
        if (this._renderer) {
            this._renderer.render(this.toState());
        }
    }
}
