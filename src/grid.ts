import {Pos} from './position';
import {Direction, direction, DIRECTIONS} from './direction';
import {Cell, CellOrNull} from './cell';
import {randomInt, nf} from './helpers';

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
        this.cells = [];
        for (let idx = 0; idx < this.width * this.height; idx++) {
            this.cells.push(null);
        }
    }
    public fromArray(vals: number[]): void {
        if (vals.length !== this.width * this.height) {
            throw Error("invalid array length");
        }
        this.makeEmpty();
        for (const [idx, val] of vals.entries()) {
            if (val > 0) {
                this.addCell(this._indexToPos(idx), val);
            }
        }
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
        let progress = false;
        let changes = false;
        do {
            progress = this._shiftOrMerge(rowOrCol, dir);
            changes = changes || progress;
        } while (progress);
        return changes;
    }
    public canMakeMove(): boolean {
        return (this._canShiftCells() || this._canMergeCells());
    }
    public makeMove(dir: direction): boolean {
        let changed = false;
        const vertical = (dir === direction.Down || dir === direction.Up);
        if (vertical) {
            for (const col of this.cols()) {
                const colChanged = this.processRowOrCol(col, dir);
                changed = changed || colChanged;
            }
        } else {
            for (const row of this.rows()) {
                const rowChanged = this.processRowOrCol(row, dir);
                changed = changed || rowChanged;
            }
        }
        return changed;
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
    private _shiftOrMerge(rowOrCol: CellOrNull[], d: direction): boolean {
        let changed = false;
        let idx = rowOrCol.length - 1;
        while (idx > 0) {
            const curr = rowOrCol[idx];
            const next = rowOrCol[idx - 1];
            if (!curr) {
                const shifted = this._shiftCells(rowOrCol, idx, d);
                changed = changed || shifted;
            } else if (curr.canMergeWith(next)) {
                this._mergeCellWith(curr, next!);
                rowOrCol[idx - 1] = null; // updating rowOrCol is only for testing
                changed = true;
            } else {
                // keep at same pos, no progress
            }
            idx--;
        }
        return changed;
    }
    private _shiftCells(rowOrCol: CellOrNull[], startIdx: number, d: direction): boolean {
        let changed = false;
        let idx = startIdx;
        while (idx > 0) {
            const movingCell = rowOrCol[idx - 1];
            if (movingCell) {
                this._moveCell(movingCell, d);
            }
            rowOrCol[idx] = movingCell; // updating rowOrCol is only for testing
            changed = changed || (movingCell !== null);
            idx--;
        }
        rowOrCol[0] = null; // updating rowOrCol is only for testing
        return changed;
    }
    private _removeCell(cell: Cell): void {
        const pos = cell.pos;
        const idx = this._posToIndex(pos);
        this.cells[idx] = null;
    }
    private _moveCell(cell: Cell, dir: direction) {
        // get direction vector
        const vector = DIRECTIONS[dir];
        // update cell
        const oldpos = cell.pos;
        const newpos = cell.pos.move(vector);
        cell.pos = newpos;
        // update grid
        const oldidx = this._posToIndex(oldpos);
        this.cells[oldidx] = null;
        const newidx = this._posToIndex(newpos);
        this.cells[newidx] = cell;
    }
    private _mergeCellWith(cell: Cell, other: Cell): void {
        cell.val =  cell.val + other.val;
        cell.merged = true; // we can only merge once per move
        this._removeCell(other);
    }
    private _isValidPosition(pos: Pos): boolean {
        return (pos.x >= 0) &&
               (pos.x < this.width) &&
               (pos.y >= 0) &&
               (pos.y < this.height);
    }
    private _canMergeCells(): boolean {
        // check all cells
        for (const cell of this.cells) {
            if (cell) {
                // check all directions
                for (const dir of DIRECTIONS) {
                    const otherPos = cell.pos.move(dir);
                    if (this._isValidPosition(otherPos)) {
                        const otherIdx = this._posToIndex(otherPos);
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
    private _canShiftCells(): boolean {
        const empty = this.emptyPositions();
        return empty.length > 0;
    }
}
