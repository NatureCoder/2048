import { IGameState, IRenderer} from "./game";

export class HTMLRenderer implements IRenderer {
    private container: HTMLElement;

    constructor(container: HTMLElement) {
        this.container = container;
        this.container.innerHTML = '';
    }

    public render(state: IGameState): void {
        window.requestAnimationFrame(() => {
            this.container.innerHTML = '';

            const grid = document.createElement('div');
            grid.className = ('grid');

            for (const cellstate of state.grid.cells) {

                const cell = document.createElement('div');
                const x = cellstate.pos.x;
                const y = cellstate.pos.y;
                cell.className = 'cell ' + this.xyToClassNames(x, y);

                const tile = document.createElement('div');
                tile.className = 'tile';

                const front = document.createElement('div');
                front.className = 'front ' + this.valueToClassName(cellstate.val);
                front.innerHTML = cellstate.val.toString();
                const back = document.createElement('div');
                back.className = 'back';

                tile.appendChild(front);
                tile.appendChild(back);
                cell.appendChild(tile);
                grid.appendChild(cell);
            }
            this.container.appendChild(grid);
        });
    }

    private xyToClassNames(x: number, y: number): string {
        return `x-${x} y-${y}`;
    }
    private valueToClassName(val: number, front: boolean = true): string {
        const exponent = Math.log2(val);
        return `val-${exponent}`;
    }
}
