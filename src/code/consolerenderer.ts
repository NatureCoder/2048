import { IGameRenderState, IRenderer} from './game';

export class ConsoleRenderer implements IRenderer {
    constructor() {
        //
    }

    public updatescores(score: number, highscore: number) {
        console.log(`score: ${score}, best: ${highscore}`);
    }

    public render(state: IGameRenderState) {
        const cells: number[][] = [];
        for (let y = 0; y < state.size; y++) {
            cells[y] = [];
            for (let x = 0; x < state.size; x++) {
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
