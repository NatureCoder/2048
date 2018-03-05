import {Pos} from './position';
import {Grid} from './grid';
import {randomInt} from './helpers';

const filledAtStart = 2;

export class Game {
    public readonly grid: Grid;
    constructor(grid: Grid) {
        this.grid = grid;
    }
    public start(): void {
        for (let i = 0; i < filledAtStart; i++) {
            const pos = this.grid.randomEmptyPosition();
            this.grid.addCell(pos!, this.newCellValue());
        }
    }
    private newCellValue(): number {
        return randomInt(100) < 50 ? 2 : 4;
    }
}
