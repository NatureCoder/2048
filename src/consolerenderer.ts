import { IGameState, IRenderer} from './game';

export class ConsoleRenderer implements IRenderer {
    constructor() {
        //
    }
    public render(state: IGameState): void {
        const cells: number[][] = [];
        for (let y = 0; y < state.grid.size; y++) {
            cells[y] = [];
            for (let x = 0; x < state.grid.size; x++) {
                cells[y][x] = 0;
            }
        }
        for (const cell of state.grid.cells) {
            // x <> y reversed, because of the way console draws tables (row, column)
            cells[cell.pos.y][cell.pos.x] = cell.val;
        }
        console.table(cells);
    }
}
