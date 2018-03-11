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
    private highscoreElmt: HTMLElement;
    private doneStateRendered: boolean = false;
    private renderDoneStateAfter: boolean = false;
    private cellsToMove: ICellToAnimate[] = [];
    private cellsToAppear: ICellToAnimate[] = [];
    private cellsToDisappear: ICellToAnimate[] = [];
    private tilesToFlip: ITileToFlip[] = [];

    constructor(container: HTMLElement, scoreElmt: HTMLElement, highscoreElmt: HTMLElement, gridsize: number) {
        this.container = container;
        this.container.innerHTML = '';
        this.scoreElmt = scoreElmt;
        this.scoreElmt.innerHTML = '';
        this.highscoreElmt = highscoreElmt;
        this.highscoreElmt.innerHTML = '';
        this.setGridSizeCSS(gridsize);
    }

    public updatescores(score: number, highscore: number) {
        this.scoreElmt.innerHTML = score.toString();
        this.highscoreElmt.innerHTML = highscore.toString();
    }

    public render(state: IGameState) {
        if (!state.done) {
            this.doneStateRendered = false; // reset, possible new game
        } else {
            if (this.doneStateRendered) {
                return; // one needed once
            } else {
                // render last move first
                state.done = false;
                // we will render the done state after that
                this.renderDoneStateAfter = true;
            }
        }
        this.renderInitialState(state);
    }

    private renderInitialState(state: IGameState) {

        window.requestAnimationFrame(() => {

            this.container.innerHTML = '';

            const grid = document.createElement('div');
            grid.className = state.done ? 'grid done' : 'grid';

            this.cellsToMove = [];
            this.cellsToAppear = [];
            this.cellsToDisappear = [];
            this.tilesToFlip = [];
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

                const cell = this.makeCell(rs);
                const tile = this.makeTile(rs);
                cell.appendChild(tile);
                grid.appendChild(cell);
            }
            this.container.appendChild(grid);

            if (state.done) {
                // render "game over" state
                const gameover = document.createElement('div');
                gameover.id = 'gameover';
                gameover.innerHTML = '<span>no more moves\nGAME OVER</span>';
                this.container.appendChild(gameover);
                this.doneStateRendered = true;
            }

            // wait for old state to render at least 1 frame, before setting the new state
            this.continueInNextFrame(state);
        });
    }

    private makeCell(rs: IRenderState): HTMLDivElement {
        const cell = document.createElement('div');
        if (rs.moving) {
            // set old pos now
            const oldX = rs.oldPos!.x;
            const oldY = rs.oldPos!.y;
            cell.className = this.getCellClassesBefore(oldX, oldY, rs);
            // move later
            this.cellsToMove.push( {cell, state: rs} );

        } else {
            const x = rs.pos.x;
            const y = rs.pos.y;
            cell.className = this.getCellClassesBefore(x, y, rs);
        }
        if (rs.appearing) {
            // appear later
            this.cellsToAppear.push( {cell, state: rs} );
        }
        if (rs.disappearing) {
            // disappear later
            this.cellsToDisappear.push( {cell, state: rs} );
        }
        return cell;
    }

    private makeTile(rs: IRenderState): HTMLDivElement {
        const tile = document.createElement('div');
        tile.className = 'tile';
        const front = document.createElement('div');

        if (rs.flipping) {
            // set old val to front and new val to back
            front.innerHTML = rs.oldVal!.toString();
            front.className = 'front ' + this.valueToClassName(rs.oldVal!);
            tile.appendChild(front);

            const back = document.createElement('div');
            back.innerHTML = rs.val.toString();
            back.className = 'back ' + this.valueToClassName(rs.val) +
                ' ' + this.willflipClassFromDir(rs.mergeDir!);
            tile.appendChild(back);
            // flip later
            this.tilesToFlip.push( {tile, dir: rs.mergeDir!} );

        } else {
            // use front only
            front.innerHTML = rs.val.toString();
            front.className = 'front ' + this.valueToClassName(rs.val);
            tile.appendChild(front);

        }
        return tile;
    }

    private continueInNextFrame(state: IGameState) {

        window.requestAnimationFrame(() => {

            // set new positions
            for (const cell of this.cellsToMove) {
                const x = cell.state.pos.x;
                const y = cell.state.pos.y;
                cell.cell.className = this.getCellClassesAfter(x, y, cell.state);
            }
            // appear new tiles
            for (const cell of this.cellsToAppear) {
                const x = cell.state.pos.x;
                const y = cell.state.pos.y;
                cell.cell.className = this.getCellClassesAfter(x, y, cell.state);
            }
            // disappear removed tiles
            for (const cell of this.cellsToDisappear) {
                const x = cell.state.pos.x;
                const y = cell.state.pos.y;
                cell.cell.className = this.getCellClassesAfter(x, y, cell.state);
            }
            // flip tiles
            for (const tile of this.tilesToFlip) {
                tile.tile.className = 'tile ' + this.flippedClassFromDir(tile.dir);
            }

            if (this.renderDoneStateAfter) {
                // allow for some time to let animations finish
                window.setTimeout(() => {
                    window.requestAnimationFrame(() => {
                       state.done = true;
                       // move all cells to removedcells
                       state.grid.removedCells = state.grid.removedCells.concat(state.grid.cells);
                       state.grid.cells = [];
                       // reset additional cell status
                       state.grid.removedCells.forEach((cell) => {
                           cell.oldPos = undefined;
                           cell.oldVal = undefined;
                           cell.mergeDir = undefined;
                           cell.new = false;
                       });
                       this.renderInitialState(state);
            });
                }, 500);
                this.renderDoneStateAfter = false;
            }
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
