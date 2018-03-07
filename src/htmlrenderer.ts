import { IGameState, IRenderer} from './game';
import { ICellState } from './cell';
import { direction } from './direction';

interface ICellToMove {
    state: ICellState;
    cell: HTMLDivElement;
    moveunder: boolean;
}
interface ITileToFlip {
    tile: HTMLDivElement;
    dir: direction;
}
export class HTMLRenderer implements IRenderer {
    private container: HTMLElement;

    constructor(container: HTMLElement, gridsize: number) {
        this.container = container;
        this.container.innerHTML = '';
        this.setGridSizeCSS(gridsize);
    }

    public render(state: IGameState): void {
        window.requestAnimationFrame(() => {

            this.container.innerHTML = '';

            const grid = document.createElement('div');
            grid.className = ('grid');

            const cellsToMove: ICellToMove[] = [];
            const tilesToFlip: ITileToFlip[] = [];
            const tilesToAppear: HTMLDivElement[] = [];
            const tilesToDisappear: HTMLDivElement[] = [];

            for (const cellstate of state.grid.removedCells) {
                cellstate.removed = true;
            }
            let cellstates = state.grid.cells;
            cellstates = cellstates.concat(state.grid.removedCells);
            for (const cellstate of cellstates) {

                const x = cellstate.pos.x;
                const y = cellstate.pos.y;
                const moving = (cellstate.oldPos !== undefined);
                const flipping = (cellstate.oldVal !== undefined);

                const cell = document.createElement('div');
                if (moving) {
                    // set old pos now
                    const oldX = cellstate.oldPos!.x;
                    const oldY = cellstate.oldPos!.y;
                    if (!flipping) {
                        cell.className = 'cell moveunder ' + this.xyToClassNames(oldX, oldY);
                    } else {
                        cell.className = 'cell ' + this.xyToClassNames(oldX, oldY);
                    }
                    // move later
                    cellsToMove.push( {state: cellstate, cell, moveunder: !flipping} );

                } else {
                    cell.className = 'cell ' + this.xyToClassNames(x, y);
                }

                const tile = document.createElement('div');
                tile.className = 'tile';
                const front = document.createElement('div');

                if (flipping) {
                    // set old val to front and new val to back
                    front.innerHTML = cellstate.oldVal!.toString();
                    front.className = 'front ' + this.valueToClassName(cellstate.oldVal!);
                    tile.appendChild(front);
                    const back = document.createElement('div');
                    back.innerHTML = cellstate.val.toString();
                    back.className = 'back ' + this.valueToClassName(cellstate.val) +
                        ' ' + this.willflipClassFromDir(cellstate.mergeDir!);
                    tile.appendChild(back);
                    // flip later
                    tilesToFlip.push( {tile, dir: cellstate.mergeDir!} );

                } else {
                    // use front only
                    front.innerHTML = cellstate.val.toString();
                    front.className = 'front ' + this.valueToClassName(cellstate.val);
                    tile.appendChild(front);
                    // new tile ?
                    if (cellstate.new) {
                        // set initial style
                        tile.className = 'tile willappear';
                        // appear later
                        tilesToAppear.push(tile);
                    }
                    // removed tile ?
                    if (cellstate.removed) {
                        tilesToDisappear.push(tile);
                    }
                }
                cell.appendChild(tile);
                grid.appendChild(cell);
            }
            this.container.appendChild(grid);

            // wait for old state to render at least 1 frame, before setting the new state
            window.requestAnimationFrame(() => {

                // set new positions
                for (const cell of cellsToMove) {
                    const x = cell.state.pos.x;
                    const y = cell.state.pos.y;
                    if (cell.moveunder) {
                        cell.cell.className = 'cell moveunder ' + this.xyToClassNames(x, y);
                    } else {
                        cell.cell.className = 'cell ' + this.xyToClassNames(x, y);
                    }
                }
                // flip tiles
                for (const tile of tilesToFlip) {
                    tile.tile.className = 'tile ' + this.flippedClassFromDir(tile.dir);
                }
                // appear new tiles
                for (const tile of tilesToAppear) {
                    tile.className = 'tile appeared';
                }
                // disappear removed tiles
                for (const tile of tilesToDisappear) {
                    tile.className = 'tile disappeared';
                }
            });
        });
    }

    private xyToClassNames(x: number, y: number): string {
        return `x-${x} y-${y}`;
    }

    private valueToClassName(val: number, front: boolean = true): string {
        const exponent = Math.log2(val);
        return `val-${exponent}`;
    }

    private setGridSizeCSS(gridsize: number) {
        const root = document.querySelector('html');
        if (root) {
            root.style.setProperty('--gridsize', gridsize.toString());
        }
    }

    private willflipClassFromDir(dir: direction) {
        return 'willflip-' + direction[dir];
    }

    private flippedClassFromDir(dir: direction) {
        return 'flipped-' + direction[dir];
    }
}
