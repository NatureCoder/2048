import { IGameState, IRenderer} from './game';
import { ICellState } from './cell';
import { direction } from './direction';

interface IRenderState extends ICellState {
    appearing: boolean;
    disappearing: boolean;
    flipping: boolean;
    moving: boolean;
    moveunder: boolean;
}
interface ICellToAnimate {
    cell: HTMLDivElement;
    state: IRenderState;
}
interface ITileToFlip {
    tile: HTMLDivElement;
    dir: direction;
}
export class HTMLRenderer implements IRenderer {
    private container: HTMLElement;
    private scoreElmt: HTMLElement;

    constructor(container: HTMLElement, scoreElmt: HTMLElement, gridsize: number) {
        this.container = container;
        this.container.innerHTML = '';
        this.scoreElmt = scoreElmt;
        this.scoreElmt.innerHTML = '';
        this.setGridSizeCSS(gridsize);
    }

    public updatescore(score: number) {
        this.scoreElmt.innerHTML = score.toString();
    }

    public render(state: IGameState) {
        window.requestAnimationFrame(() => {

            this.container.innerHTML = '';

            const grid = document.createElement('div');
            grid.className = ('grid');

            const cellsToMove: ICellToAnimate[] = [];
            const cellsToAppear: ICellToAnimate[] = [];
            const cellsToDisappear: ICellToAnimate[] = [];
            const tilesToFlip: ITileToFlip[] = [];
            let cellstates = state.grid.cells;

            // add disappearing flags
            for (const cellstate of state.grid.removedCells) {
                (cellstate as IRenderState).disappearing = true;
            }
            // add append removed cells, so we can process all in 1 go
            cellstates = cellstates.concat(state.grid.removedCells);

            for (const cellstate of cellstates) {

                const rs: IRenderState = cellstate as IRenderState;
                rs.appearing = cellstate.new;
                rs.moving = (cellstate.oldPos !== undefined);
                rs.flipping = (cellstate.oldVal !== undefined);
                rs.moveunder = rs.moving && (!rs.flipping);

                const cell = document.createElement('div');
                if (rs.moving) {
                    // set old pos now
                    const oldX = cellstate.oldPos!.x;
                    const oldY = cellstate.oldPos!.y;
                    cell.className = this.getCellClassesBefore(oldX, oldY, rs);
                    // move later
                    cellsToMove.push( {cell, state: rs} );

                } else {
                    const x = cellstate.pos.x;
                    const y = cellstate.pos.y;
                    cell.className = this.getCellClassesBefore(x, y, rs);
                }
                if (rs.appearing) {
                    // appear later
                    cellsToAppear.push( {cell, state: rs} );
                }
                if (rs.disappearing) {
                    // disappear later
                    cellsToDisappear.push( {cell, state: rs} );
                }

                const tile = document.createElement('div');
                tile.className = 'tile';
                const front = document.createElement('div');

                if (rs.flipping) {
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
                    cell.cell.className = this.getCellClassesAfter(x, y, cell.state);
                }
                // appear new tiles
                for (const cell of cellsToAppear) {
                    const x = cell.state.pos.x;
                    const y = cell.state.pos.y;
                    cell.cell.className = this.getCellClassesAfter(x, y, cell.state);
                }
                // disappear removed tiles
                for (const cell of cellsToDisappear) {
                    const x = cell.state.pos.x;
                    const y = cell.state.pos.y;
                    cell.cell.className = this.getCellClassesAfter(x, y, cell.state);
                }
                // flip tiles
                for (const tile of tilesToFlip) {
                    tile.tile.className = 'tile ' + this.flippedClassFromDir(tile.dir);
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

    private getCellClassesBefore(x: number, y: number, rs: IRenderState): string {
        let classes = 'cell ' + this.xyToClassNames(x, y);
        if (rs.moveunder) {
            classes += ' moveunder';
        }
        if (rs.appearing) {
            classes += ' willappear';
        }
        if (rs.disappearing) {
            classes += ' willdisappear';
        }
        return classes;
    }

    private getCellClassesAfter(x: number, y: number, rs: IRenderState): string {
        let classes = 'cell ' + this.xyToClassNames(x, y);
        if (rs.moveunder) {
            classes += ' moveunder';
        }
        if (rs.appearing) {
            classes += ' appeared';
        }
        if (rs.disappearing) {
            classes += ' disappeared';
        }
        return classes;
    }
}
