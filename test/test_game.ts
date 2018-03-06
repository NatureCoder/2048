import 'mocha';
import { expect } from 'chai';

import { Grid } from '../src/grid';
import { Game } from '../src/game';
import { Cell, CellOrNull } from '../src/cell';
import { Pos } from '../src/position';
import { direction } from '../src/direction';

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

    function rowOrColFromNums(vals: fourNums): CellOrNull[] {
        const rowOrCol = [];
        for (const val of vals) {
            const cell = val ? new Cell(val) : null;
            rowOrCol.push(cell);
        }
        return rowOrCol;
    }
    function rowOrColToNums(rowOrCol: CellOrNull[]): fourNums {
        const result: fourNums = [0, 0, 0, 0];
        for (const [idx, cell]  of rowOrCol.entries()) {
            const val = cell ? cell.val : 0;
            result[idx] = val;
        }
        return result;
    }
    type fourNums = [number, number, number, number];
    type TestVal = [fourNums, fourNums];
    const testVals: TestVal[] = [
        [[2, 4, 4, 2], [0, 2, 8, 2]],
        [[2, 0, 2, 2], [0, 0, 2, 4]],
        [[2, 2, 4, 4], [0, 0, 4, 8]],
        [[2, 2, 2, 2], [0, 0, 4, 4]],
        [[2, 0, 0, 0], [0, 0, 0, 2]],
        [[0, 0, 0, 0], [0, 0, 0, 0]],
        [[2, 4, 2, 4], [2, 4, 2, 4]],
        [[2, 0, 2, 4], [0, 0, 4, 4]],
        [[0, 2, 0, 2], [0, 0, 0, 4]],
    ];
    describe('processRowOrCol', function() {
        for (const testval of testVals) {
            const [test, expected] = testval;
            const testdescr = 'input of "' + test  + '" should return "' + expected + '"';
            it(testdescr, function() {
                const rowOrCol = rowOrColFromNums(test);
                const changed = game.processRowOrCol(rowOrCol, direction.Right);
                const result = rowOrColToNums(rowOrCol);
                expect(JSON.stringify(result)).to.equal(JSON.stringify(expected));
                // changed should only be true when test differs from result
                expect(changed).to.equal((JSON.stringify(test) !== JSON.stringify(result)));
            });

        }
    });
    const testgrid = [
        0, 2, 4, 8,
        8, 4, 0, 2,
        2, 4, 8, 2,
        0, 2, 8, 8
    ];
    describe('makeMove up', function() {
        it('should return the expected values when moving up', function() {
            const expected = [
                8, 2,  4, 8,     // 0, 2, 4, 8,
                2, 8, 16, 4,     // 8, 4, 0, 2,
                0, 2,  0, 8,     // 2, 4, 8, 2,
                0, 0,  0, 0      // 0, 2, 8, 8
            ];
            const gr = Grid.fromArray(testgrid);
            const testGame = new Game(gr);
            testGame.makeMove(direction.Up);
            const test = gr.toArray();
            expect(JSON.stringify(test)).to.equal(JSON.stringify(expected));
        });
    });
    describe('makeMove right', function() {
        it('should return the expected values when moving right', function() {
            const expected = [
                0, 2, 4, 8,     // 0, 2, 4, 8,
                0, 8, 4, 2,     // 8, 4, 0, 2,
                2, 4, 8, 2,     // 2, 4, 8, 2,
                0, 0, 2, 16     // 0, 2, 8, 8

            ];
            const gr = Grid.fromArray(testgrid);
            const testGame = new Game(gr);
            testGame.makeMove(direction.Right);
            const test = gr.toArray();
            expect(JSON.stringify(test)).to.equal(JSON.stringify(expected));
        });
    });
    describe('makeMove down', function() {
        it('should return the expected values when moving down', function() {
            const expected = [
                0, 0,  0, 0,    // 0, 2, 4, 8,
                0, 2,  0, 8,    // 8, 4, 0, 2,
                8, 8,  4, 4,    // 2, 4, 8, 2,
                2, 2, 16, 8     // 0, 2, 8, 8

            ];
            const gr = Grid.fromArray(testgrid);
            const testGame = new Game(gr);
            testGame.makeMove(direction.Down);
            const test = gr.toArray();
            expect(JSON.stringify(test)).to.equal(JSON.stringify(expected));
        });
    });
    describe('makeMove left', function() {
        it('should return the expected values when moving left', function() {
            const expected = [
                2, 4, 8, 0,     // 0, 2, 4, 8,
                8, 4, 2, 0,     // 8, 4, 0, 2,
                2, 4, 8, 2,     // 2, 4, 8, 2,
                2, 16, 0, 0     // 0, 2, 8, 8

            ];
            const gr = Grid.fromArray(testgrid);
            const testGame = new Game(gr);
            testGame.makeMove(direction.Left);
            const test = gr.toArray();
            expect(JSON.stringify(test)).to.equal(JSON.stringify(expected));
        });
    });
    describe('canMakeMove', function() {
        it('returns true when only shifting is possible', function() {
            const test1 = [
                4, 2, 4, 8,
                8, 4, 2, 4,
                2, 0, 4, 2,
                4, 2, 8, 4
            ];
            const gr = Grid.fromArray(test1);
            const testGame = new Game(gr);
            const test = testGame.canMakeMove();
            expect(test).to.equal(true);
        });
        it('returns true when only merging is possible', function() {
            const test2 = [
                4, 2, 4, 8,
                8, 4, 2, 4,
                2, 8, 4, 2,
                4, 2, 8, 2
            ];
            const gr = Grid.fromArray(test2);
            const testGame = new Game(gr);
            const test = testGame.canMakeMove();
            expect(test).to.equal(true);
        });
        it('returns false when neither shifting nor merging is possible', function() {
            const test3 = [
                4, 2, 4, 8,
                8, 4, 2, 4,
                2, 8, 4, 2,
                4, 2, 8, 4
            ];
            const gr = Grid.fromArray(test3);
            const testGame = new Game(gr);
            const test = testGame.canMakeMove();
            expect(test).to.equal(false);
        });
        describe('playMove', function() {
            it('sets done=true & won=false when no more moves possible after adding last number', function() {
                const test1 = [
                     32,   64,   4,   16,
                    128,  512,  64,    2,
                      2,    8,  64,  256,
                      4,  128,   8, 1024
                ];
                const gr = Grid.fromArray(test1);
                const testGame = new Game(gr);
                testGame.playMove(direction.Down);
                const test = testGame.toState();
                expect(test.done).to.equal(true);
                expect(test.won).to.equal(false);
            });
            it('sets done=true & won=true when 2048 is reached after a move', function() {
                const test1 = [
                     32,   64,     4,   16,
                    128,    0,  1024,    2,
                      2,    8,  1024,  256,
                      4,  128,     8, 1024
                ];
                const gr = Grid.fromArray(test1);
                const testGame = new Game(gr);
                testGame.playMove(direction.Down);
                const test = testGame.toState();
                expect(test.done).to.equal(true);
                expect(test.won).to.equal(true);
            });
        });
    });
});
