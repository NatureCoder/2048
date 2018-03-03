import 'mocha';
import { expect } from 'chai';

import { Grid } from '../src/grid';
import { Game } from '../src/game';
import { Cell } from '../src/cell';

describe('Game', function() {
    const grid = new Grid();
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

    function rowOrColFromString(s: string): Cell[] {
        const rowOrCol = [];
        for (const val of s.split(' ')) {
            const cell = new Cell('', undefined, parseInt(val, 10));
            rowOrCol.push(cell);
        }
        return rowOrCol;
    }
    function rowOrColTotring(rowOrCol: Cell[]): string {
        let result = '';
        for (const cell of rowOrCol) {
            result += ' ' + cell.val.toString();
        }
        return result.trim();
    }
    type TestVal = [string, string];
    const testVals: TestVal[] = [
        ['0 2 0 2', '0 0 0 4'],
        ['2 0 2 0', '0 0 0 4'],
        ['2 0 2 2', '0 0 2 4'],
        ['2 4 4 2', '0 2 8 2'],
        ['2 2 4 4', '0 0 4 8'],
        ['2 2 2 2', '0 0 4 4'],
        ['2 0 0 0', '0 0 0 2']
    ];
    describe('processRowCol', function() {
        for (const testval of testVals) {
            const test = testval[0];
            const expected = testval[1];
            const testdescr = 'input of "' + test  + '" should return "' + expected + '"';
            it(testdescr, function() {
                const rowOrCol = rowOrColFromString(test);
                const resultArr = game.processRowOrCol(rowOrCol);
                const result = rowOrColTotring(resultArr);
                expect(result).to.equal(expected);
            });

        }
    });
});
