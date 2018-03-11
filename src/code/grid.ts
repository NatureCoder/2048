import { Pos } from './position';
import { Direction, direction, DIRECTIONS } from './direction';
import { Cell, ICellState, ICellRenderState, CellOrNull } from './cell';
import { randomInt, nf } from './helpers';

export interface IGridState {
    size: number;
    cells: ICellState[]; // contains only filled cells
}

export interface IGridRenderState {
    size: number;
    cells: ICellRenderState[]; // contains only filled cells
    removedCells: ICellRenderState[];
}

export class Grid {

    public static fromArray(vals: number[], size: number = 4): Grid {
        if (vals.length !== size * size) {
            throw Error("invalid array length");
        }
        const grid = new Grid(size);
        for (const [idx, val] of vals.entries()) {
            if (val > 0) {
                grid.addCell(grid.indexToPos(idx), val);
            }
        }
        return grid;
    }

    public static fromState(state: IGridState): Grid {
        const grid = new Grid(state.size);
        for (const cellState of state.cells) {
            grid.addCell(Pos.fromState(cellState.pos), cellState.val);
        }
        return grid;
    }

    private _cells: CellOrNull[] = [];
    private _removedCells: Cell[] = [];
    private _size: number;
    get size() {
        return this._size;
    }

    constructor(size: number) {
        this._size = size;
        this.reset();
    }

    public reset() {
        this._cells = [];
        this._removedCells = [];
        for (let idx = 0; idx < this.size * this.size; idx++) {
            this._cells.push(null);
        }
    }

    public toState(): IGridState {
        const cellStates: ICellState[] = [];
        this._cells.forEach((cell) => {
            if (cell) {
                cellStates.push(cell.toState());
            }
        });
        return {
            size: this.size,
            cells: cellStates,
        };
    }

    public toRenderState(): IGridRenderState {
        const cellStates: ICellRenderState[] = [];
        const removedStates: ICellRenderState[]  = [];
        this._cells.forEach((cell) => {
            if (cell) {
                cellStates.push(cell.toRenderState());
            }
        });
        this._removedCells.forEach((cell) => {
            removedStates.push(cell.toRenderState());
        });
        return {
            size: this.size,
            cells: cellStates,
            removedCells: removedStates
        };
    }

    public toArray(): number[] {
        const vals = [];
        for (const cell of this._cells) {
            vals.push(cell ? cell.val : 0);
        }
        return vals;
    }

    public toString(): string {
        let s = '';
        for (const row of this.rows()) {
            for (const cell of row) {
                s = s + ' ' + (cell ? nf(cell.val, 2) : '__');
            }
            s += '\n';
        }
        return s;
    }

    public addCell(pos: Pos, val: number) {
        const cell = new Cell(val, pos);
        const idx = this.posToIndex(pos);
        this._cells[idx] = cell;
    }

    public emptyPositions(): Pos[] {
        const empty: Pos[] = [];
        for (let idx = 0; idx < this.size * this.size; idx++) {
            const cell = this._cells[idx];
            if (cell === null) {
                empty.push(this.indexToPos(idx));
            }
        }
        return empty;
    }

    public cellIsEmpty(pos: Pos) {
        const idx = this.posToIndex(pos);
        return (this._cells[idx] !== null);
    }

    public filledCells(): Cell[] {
        const filled: Cell[] = [];
        this._cells.forEach((cell) => {
            if (cell) {
                filled.push(cell);
            }
        });
        return filled;
    }

    public rows(): CellOrNull[][] {
        const result: CellOrNull[][] = [];
        for (let y = 0; y < this.size; y++) {
            const row: CellOrNull[] = [];
            for (let x = 0; x < this.size; x++) {
                const idx = this.xyToIndex(x, y);
                row.push(this._cells[idx]);
            }
            result.push(row);
        }
        return result;
    }

    public cols(): CellOrNull[][] {
        const result: CellOrNull[][] = [];
        for (let x = 0; x < this.size; x++) {
            const col: CellOrNull[] = [];
            for (let y = 0; y < this.size; y++) {
                const idx = this.xyToIndex(x, y);
                col.push(this._cells[idx]);
            }
            result.push(col);
        }
        return result;
    }

    public randomEmptyPosition(): Pos|null {
        const empty = this.emptyPositions();
        const idx = randomInt(empty.length);
        return empty.length ? empty[idx] : null;
    }

    public prepareMove() {
        this._removedCells = []; // reset
        const cells = this.filledCells();
        for (const cell of cells) {
            cell.prepareMove();
        }
    }

    public canMergeCells(): boolean {
        for (let x = 0; x < this.size; x++) {
            for (let y = 0; y < this.size; y++) {
                const idx = this.xyToIndex(x, y);
                const right = x < this.size - 1 ? this.xyToIndex(x + 1, y) : null;
                const below = y < this.size - 1 ? this.xyToIndex(x, y + 1) : null;
                const cell = this._cells[idx];
                const cellRight = right ? this._cells[right] : null;
                const cellBelow = below ? this._cells[below] : null;
                if (cell) {
                    // only need to check to the right and below:
                    if ((cellRight && (cell.val === cellRight.val)) ||
                        (cellBelow && (cell.val === cellBelow.val))) {
                        return true;
                    }
                }
            }
        }
        return false;
    }

    public canShiftCells(): boolean {
        const empty = this.emptyPositions();
        return empty.length > 0;
    }

    public moveCell(cell: Cell, dir: direction) {
        // get direction vector
        const vector = DIRECTIONS[dir];
        // update cell
        const oldpos = cell.pos;
        const newpos = cell.pos.move(vector);
        cell.pos = newpos;
        // update grid
        const oldidx = this.posToIndex(oldpos);
        this._cells[oldidx] = null;
        const newidx = this.posToIndex(newpos);
        this._cells[newidx] = cell;
    }

    public mergeCellWith(cell: Cell, other: Cell, dir: direction): number {
        cell.val =  cell.val + other.val;
        cell.setMergeDir(dir);
        const newPos = cell.pos.copy();
        this.removeCell(other, newPos);
        return cell.val;
    }

    private xyToIndex(x: number, y: number): number {
        return y * this.size + x;
    }

    private posToIndex(pos: Pos): number {
        return pos.y * this.size + pos.x;
    }

    private indexToPos(idx: number): Pos {
        const p = new Pos();
        p.y = Math.floor(idx / this.size);
        p.x = idx % this.size;
        return p;

    }

    private removeCell(cell: Cell, newPos: Pos) {
        // set new position for removed cell
        const oldPpos = cell.pos;
        cell.pos = newPos;
        // keep the removed cell (for displaying purposes)
        this._removedCells.push(cell);
        // update grid
        const idx = this.posToIndex(oldPpos);
        this._cells[idx] = null;
    }
}
