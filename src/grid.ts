import {Pos} from './pos';
import {Cell, CellOrNull} from './cell';
import {randomInt} from './helpers';

export class Grid {
    public readonly width: number;
    public readonly height: number;
    private cells: CellOrNull[][] = [];
    constructor(size: number) {
        this.width = size;
        this.height = size;
        this.makeEmpty();
    }
    public makeEmpty(): void {
        for (let x = 0; x < this.width; x++) {
            this.cells.push([]);
            for (let y = 0; y < this.height; y ++) {
                this.cells[x][y] = null;
            }
        }
    }
    public emptyPositions(): Pos[] {
        const empty: Pos[] = [];
        this.forEachCell((x, y, cell) => {
            if (!cell) {
                empty.push(new Pos(x, y));
            }
        });
        return empty;
    }
    public filledCells(): Cell[] {
        const filled: Cell[] = [];
        this.forEachCell((x, y, cell) => {
            if (cell) {
                filled.push(cell);
            }
        });
        return filled;
    }
    public cellIsEmpty(pos: Pos) {
        return (this.cells[pos.x][pos.y] !== null);
    }
    public rows(): CellOrNull[][] {
        const result: CellOrNull[][] = [];
        for (let y = 0; y < this.height; y++) {
            const row: CellOrNull[] = [];
            for (let x = 0; x < this.width; x++) {
                row.push(this.cells[x][y]);
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
                col.push(this.cells[x][y]);
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
    public addCell(pos: Pos, val: number): void {
        const cell = new Cell(val, pos);
        this.cells[pos.x][pos.y] = cell;
    }
    public removeCell(cell: Cell): void {
        const pos = cell.pos;
        this.cells[pos.x][pos.y] = null;
    }
    public moveCell(cell: Cell, pos: Pos) {
        // TODO implement this
    }
    public mergeCellWith(cell: Cell, other: Cell): void {
        cell.val = cell.val + other.val;
        cell.merged = true; // we can only merge once per move
        this.removeCell(other);
    }
    private forEachCell(callback: (x: number, y: number, cell: CellOrNull) => void) {
        for (let x = 0; x < this.width; x++) {
            for (let y = 0; y < this.height; y ++) {
                const cell = this.cells[x][y];
                callback(x, y, cell);
            }
        }
    }
}
