import {Pos} from './pos';
import {Direction, direction, DIRECTIONS} from './directions';
import {Cell, CellOrNull} from './cell';
import {Grid} from './grid';
import {randomInt, nf} from './helpers';

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
    public processRowOrCol(rowOrCol: CellOrNull[], dir: direction): boolean {

        const self = this;

        function _shiftValuesRight(cells: CellOrNull[], startIdx: number, d: Direction): boolean {
            let changed = false;
            let i = startIdx;
            while (i > 0) {
                const moving = cells[i - 1];
                if (moving) {
                    const newpos = moving.pos.move(d);
                    self.grid.moveCell(moving, newpos);
                }
                cells[i] = moving;
                changed = changed || (moving !== null);
                i--;
            }
            cells[0] = null; // insert empty val in left most slot
            return changed;
        }
        function _shiftOrMergeCells(cells: CellOrNull[], d: Direction): boolean {
            let changed = false;
            let i = rowOrCol.length - 1;
            while (i > 0) {
                const curr = cells[i];
                const prev = cells[i - 1];
                if (!curr) {
                    changed = changed || _shiftValuesRight(cells, i, d);
                } else if (curr.canMergeWith(prev)) {
                    self.grid.mergeCellWith(curr, prev!);
                    cells[i - 1] = null;
                    changed = true;
                } else {
                    // keep at same pos, no progress
                }
                i--;
            }
            return changed;
        }
        // when using a negative direction reverse the array first
        if ((dir === direction.Up) || (dir === direction.Left)) {
            rowOrCol.reverse();
        }
        const DIR = DIRECTIONS[dir];
        const result = rowOrCol;
        let progress = false;
        let changes = false;
        do {
            progress = _shiftOrMergeCells(result, DIR);
            changes = changes || progress;
        } while (progress);
        return changes;
    }
    public show(): void {
        let s = '';
        for (const row of this.grid.rows()) {
            for (const cell of row) {
                if (cell) {
                    s = s + ' ' + nf(cell.val, 4);
                } else {
                    s = s + ' ' + '    ';
                }
            }
            s += '\n';
        }
        console.log(s);
    }
    private newCellValue(): number {
        return randomInt(100) < 50 ? 2 : 4;
    }
}
