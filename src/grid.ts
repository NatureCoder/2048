import {Pos} from './position';
import {Direction, direction, DIRECTIONS} from './direction';
import {Cell, CellOrNull} from './cell';
import {randomInt} from './helpers';

export class Grid {
    public readonly width: number;
    public readonly height: number;
    private cells: CellOrNull[] = [];

    constructor(size: number) {
        this.width = size;
        this.height = size;
        this.makeEmpty();
    }
    public makeEmpty(): void {
        for (let idx = 0; idx < this.width * this.height; idx++) {
            this.cells.push(null);
        }
    }
    public addCell(pos: Pos, val: number): void {
        const cell = new Cell(val, pos);
        const idx = this._posToIndex(pos);
        this.cells[idx] = cell;
    }
    public emptyPositions(): Pos[] {
        const empty: Pos[] = [];
        for (let idx = 0; idx < this.width * this.height; idx++) {
            const cell = this.cells[idx];
            if (cell === null) {
                empty.push(this._indexToPos(idx));
            }
        }
        return empty;
    }
    public cellIsEmpty(pos: Pos) {
        const idx = this._posToIndex(pos);
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
        for (let y = 0; y < this.height; y++) {
            const row: CellOrNull[] = [];
            for (let x = 0; x < this.width; x++) {
                const idx = this._xyToIndex(x, y);
                row.push(this.cells[idx]);
            }
            result.push(row);
        }
        return result;
    }
    public cols(): CellOrNull[][] {
        const result: CellOrNull[][] = [];
        for (let x = 0; x < this.width; x++) {
            const col: CellOrNull[] = [];
            for (let y = 0; y < this.height; y++) {
                const idx = this._xyToIndex(x, y);
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
    public resetMerged(): void {
        const cells = this.filledCells();
        for (const cell of cells) {
            cell.merged = false;
        }
    }
    public processRowOrCol(rowOrCol: CellOrNull[], dir: direction): boolean {
        // when processing a negative direction reverse the row/column first
        if ((dir === direction.Up) || (dir === direction.Left)) {
            rowOrCol.reverse();
        }
        const vector = DIRECTIONS[dir];
        let progress = false;
        let changes = false;
        do {
            progress = this._shiftOrMerge(rowOrCol, vector);
            changes = changes || progress;
        } while (progress);
        return changes;
    }
    private _xyToIndex(x: number, y: number): number {
        return y * this.width + x;
    }
    private _posToIndex(pos: Pos): number {
        return pos.y * this.width + pos.x;
    }
    private _indexToPos(idx: number): Pos {
        const p = new Pos();
        p.y = Math.floor(idx / this.width);
        p.x = idx % this.width;
        return p;

    }
    private _shiftOrMerge(rowOrCol: CellOrNull[], d: Direction): boolean {
        let changed = false;
        let idx = rowOrCol.length - 1;
        while (idx > 0) {
            const curr = rowOrCol[idx];
            const next = rowOrCol[idx - 1];
            if (!curr) {
                changed = changed || this._shiftCells(rowOrCol, idx, d);
            } else if (curr.canMergeWith(next)) {
                this._mergeCellWith(curr, next!);
                rowOrCol[idx - 1] = null;
                changed = true;
            } else {
                // keep at same pos, no progress
            }
            idx--;
        }
        return changed;
    }
    private _shiftCells(rowOrCol: CellOrNull[], startIdx: number, d: Direction): boolean {
        let changed = false;
        let idx = startIdx;
        while (idx > 0) {
            const movingCell = rowOrCol[idx - 1];
            if (movingCell) {
                this._moveCell(movingCell, d);
            }
            rowOrCol[idx] = movingCell; // place cell at next positions
            changed = changed || (movingCell !== null);
            idx--;
        }
        rowOrCol[0] = null; // insert empty val in left most slot
        return changed;
    }
    private _removeCell(cell: Cell): void {
        const pos = cell.pos;
        const idx = this._posToIndex(pos);
        this.cells[idx] = null;
    }
    private _moveCell(cell: Cell, d: Direction) {
        const newpos = cell.pos.move(d);
        cell.pos = newpos;
    }
    private _mergeCellWith(cell: Cell, other: Cell): void {
        cell.val = cell.val + other.val;
        cell.merged = true; // we can only merge once per move
        this._removeCell(other);
    }

}
