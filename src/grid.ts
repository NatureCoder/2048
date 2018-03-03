import {Pos, Cell} from './cell';
import {randomInt} from './helpers';

export class Grid {
    public readonly width = 4;
    public readonly height = 4;
    public readonly rows: Cell[][];
    public readonly cols: Cell[][];
    private cells: Cell[] = [];
    constructor() {
        this.rows = [];
        this.cols = [];
        for (let x = 0; x < this.width; x++) {
            const col: Cell[] = [];
            for (let y = 0; y < this.height; y++) {
                const id = '';
                const pos = new Pos(x, y);
                const cell = new Cell(id, pos);
                this.cells.push(cell);
                col.push(cell);
                const row  = this.rows[y] ? this.rows[y] : [];
                row.push(cell);
                this.rows[y] = row;
            }
            this.cols.push(col);
        }
    }
    public emptyCells(): Cell[] {
        return this.cells.filter((c) => c.empty() );
    }
    public randomEmptyCell(): Cell|null {
        const empty = this.emptyCells();
        const idx = randomInt(empty.length);
        return empty.length ? empty[idx] : null;
    }
}
