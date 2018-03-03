import {Grid} from './grid';
import {randomInt, nf} from './helpers';

const filledAtStart = 2;

export class Game {
    public readonly grid: Grid;
    constructor() {
        this.grid = new Grid();
    }
    public start(): void {
        for (let i = 0; i < filledAtStart; i++) {
            const cell = this.grid.randomEmptyCell();
            cell!.val = this.newCellValue();
        }
    }
    public show(): void {
        let s = '';
        for (const row of this.grid.rows) {
            for (const cell of row) {
                s = s + ' ' + nf(cell.val, 4);
            }
            s += '\n';
        }
        console.log(s);
    }
    private newCellValue(): number {
        return randomInt(100) < 50 ? 2 : 4;
    }
}
