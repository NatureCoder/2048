import { Pos } from './position';
import { Direction, direction, DIRECTIONS } from './direction';
import { Cell, ICellState, CellOrNull } from './cell';
import { randomInt, nf } from './helpers';

export interface IGridState {
    size: number;
    cells: ICellState[];
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
            grid.addCell(cellState.pos, cellState.val);
        }
        return grid;
    }

    private _size: number;
    get size() {
        return this._size;
    }
    private cells: CellOrNull[] = [];

    constructor(size: number) {
        this._size = size;
        this.cells = [];
        for (let idx = 0; idx < this.size * this.size; idx++) {
            this.cells.push(null);
        }
    }

    public toState(): IGridState {
        const cellStates: ICellState[] = [];
        this.cells.forEach((cell) => {
            if (cell) {
                cellStates.push(cell.toState());
            }
        });
        return {
            size: this.size,
            cells: cellStates
        };
    }

    public toArray(): number[] {
        const vals = [];
        for (const cell of this.cells) {
            vals.push(cell ? cell.val : 0);
        }
        return vals;
    }

    public toString(): string {
        let s = '';
        for (const row of this.rows()) {
            for (const cell of row) {
                s = s + ' ' + (cell ? nf(cell.val, 4) : '    ');
            }
            s += '\n';
        }
        return s;
    }

    public addCell(pos: Pos, val: number): void {
        const cell = new Cell(val, pos);
        const idx = this.posToIndex(pos);
        this.cells[idx] = cell;
    }

    public emptyPositions(): Pos[] {
        const empty: Pos[] = [];
        for (let idx = 0; idx < this.size * this.size; idx++) {
            const cell = this.cells[idx];
            if (cell === null) {
                empty.push(this.indexToPos(idx));
            }
        }
        return empty;
    }

    public cellIsEmpty(pos: Pos) {
        const idx = this.posToIndex(pos);
        return (this.cells[idx] !== null);
    }

    public filledCells(): Cell[] {
        const filled: Cell[] = [];
        this.cells.forEach((cell) => {
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
                row.push(this.cells[idx]);
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
                col.push(this.cells[idx]);
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

    public prepareMove(): void {
        const cells = this.filledCells();
        for (const cell of cells) {
            cell.prepareMove();
        }
    }

    public canMergeCells(): boolean {
        // check all cells
        for (const cell of this.cells) {
            if (cell) {
                // check all directions
                for (const dir of DIRECTIONS) {
                    const otherPos = cell.pos.move(dir);
                    if (this._isValidPosition(otherPos)) {
                        const otherIdx = this.posToIndex(otherPos);
                        const other = this.cells[otherIdx];
                        if (cell.canMergeWith(other)) {
                            return true;
                        }
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
        this.cells[oldidx] = null;
        const newidx = this.posToIndex(newpos);
        this.cells[newidx] = cell;
    }

    public mergeCellWith(cell: Cell, other: Cell): number {
        cell.val =  cell.val + other.val;
        cell.merged = true; // we can only merge once per move
        this.removeCell(other);
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

    private removeCell(cell: Cell): void {
        const pos = cell.pos;
        const idx = this.posToIndex(pos);
        this.cells[idx] = null;
    }

    private _isValidPosition(pos: Pos): boolean {
        return (pos.x >= 0) &&
               (pos.x < this.size) &&
               (pos.y >= 0) &&
               (pos.y < this.size);
    }
}
