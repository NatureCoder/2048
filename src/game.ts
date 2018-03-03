import {Cell} from './cell';
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
            const cell = this.grid.randomEmptyCell();
            cell!.val = this.newCellValue();
        }
    }
    public processRowOrCol(rowOrCol: Cell[]): Cell[] {
        function _shiftValuesRight(cells: Cell[], startIdx: number): boolean {
            let changed = false;
            let i = startIdx;
            while (i > 0) {
                cells[i].val = cells[i - 1].val;
                changed = changed || (cells[i].val !== 0);
                i--;
            }
            cells[0].val = 0; // insert empty val in left most
            return changed;
        }
        function _shiftOrMergeValues(cells: Cell[]): boolean {
            let changed = false;
            let i = rowOrCol.length - 1;
            while (i > 0) {
                const curr = cells[i];
                const prev = cells[i - 1];
                if (curr.empty()) {
                    changed = changed || _shiftValuesRight(cells, i);
                } else if (curr.canMergeWith(prev)) {
                    curr.mergeWith(prev);
                    changed = true;
                } else {
                    // keep at same pos, no progress
                }
                i--;
            }
            return changed;
        }

        const result = rowOrCol;
        let progress = false;
        do {
            progress = _shiftOrMergeValues(result);
        } while (progress);
        return result;
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
