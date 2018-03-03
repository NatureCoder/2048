import {Grid} from './grid';
import {randomInt} from './helpers';

const filledAtStart = 2;

export class Game {
    private grid: Grid;
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
        return;
    }
    private newCellValue(): number {
        return randomInt(100) < 50 ? 2 : 4;
    }
}
