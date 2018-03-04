import 'mocha';
import { expect } from 'chai';

import { Grid } from '../src/grid';
import { Game } from '../src/game';
import { Cell, CellOrNull } from '../src/cell';
import { direction } from '../src/directions';

describe('Game', function() {
    const grid = new Grid(4);
    const game = new Game(grid);
    describe('start', function() {
        it('should fill 2 cells with a value of 2 or 4', function() {
            game.start();
            const filled = grid.filledCells();
            expect(filled.length).to.equal(2);
            for (const cell of filled) {
                expect(cell.val).to.satisfy((x: number) => ((x === 2) || (x === 4)) );
            }
        });
    });

    function _rowOrColFromString(s: string): CellOrNull[] {
        const rowOrCol = [];
        for (const valstr of s.split(' ')) {
            const val = parseInt(valstr, 10);
            const cell = val ? new Cell(val) : null;
            rowOrCol.push(cell);
        }
        return rowOrCol;
    }
    function _rowOrColTotring(rowOrCol: CellOrNull[]): string {
        let result = '';
        for (const cell of rowOrCol) {
            const s = cell ? cell.val.toString() : 0;
            result += ' ' + s;
        }
        return result.trim();
    }
    type TestVal = [string, string];
    const testVals: TestVal[] = [
        ['2 0 2 2', '0 0 2 4'],
        ['2 4 4 2', '0 2 8 2'],
        ['2 2 4 4', '0 0 4 8'],
        ['2 2 2 2', '0 0 4 4'],
        ['2 0 0 0', '0 0 0 2'],
        ['0 0 0 0', '0 0 0 0'],
        ['2 4 2 4', '2 4 2 4'],
        ['2 0 2 4', '0 0 4 4'],
        ['0 2 0 2', '0 0 0 4'],
        ['2 0 2 0', '0 0 0 4'],
    ];
    describe('processRowOrCol', function() {
        for (const testval of testVals) {
            const test = testval[0];
            const expected = testval[1];
            const testdescr = 'input of "' + test  + '" should return "' + expected + '"';
            it(testdescr, function() {
                const rowOrCol = _rowOrColFromString(test);
                const changed = game.processRowOrCol(rowOrCol, direction.Right);
                const result = _rowOrColTotring(rowOrCol);
                expect(result).to.equal(expected);
                // changed should only be true when test differs from result
                expect(changed).to.equal((test !== result));
            });

        }
    });
});
