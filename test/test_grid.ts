import 'mocha';
import { expect } from 'chai';

import { Grid } from '../src/grid';
import { Cell, CellOrNull } from '../src/cell';
import { Pos } from '../src/position';
import { direction } from '../src/direction';

describe('Grid', function() {
    const grid = new Grid(4);
    const total = grid.width * grid.height;
    describe('rows', function() {
        it('should return an array of 4 rows', function() {
            expect(grid.rows().length).to.equal(4);
        });
        it('each row should contain 4 empty cells', function() {
            for (const row of grid.rows()) {
                expect(row.length).to.equal(4);
                for (let x = 0; x < 4; x++) {
                    const cell = row[x];
                    expect(cell).to.equal(null);
                }
            }
        });
    });
    describe('cols', function() {
        it('should return an array of 4 cols', function() {
            expect(grid.cols().length).to.equal(4);
        });
        it('each col should contain 4 empty cells', function() {
            for (const col of grid.cols()) {
                expect(col.length).to.equal(4);
                for (let y = 0; y < 4; y++) {
                    const cell = col[y];
                    expect(cell).to.equal(null);
                }
            }
        });
    });
    describe('emptyCells', function() {
        it('should return an array of width x height cells', function() {
            const empties = grid.emptyPositions();
            expect(empties.length).to.equal(total);
        });
    });
    describe('randomEmptyCell', function() {
        it('should return an empty cell every time', function() {
            for (let i = 0; i < total; i++) {
                const pos = grid.randomEmptyPosition();
                expect(grid.cellIsEmpty(pos!)).to.equal(false);
                grid.addCell(pos!, 2);
            }
        });
        it('should return null when there are no more empty cells', function() {
            const pos = grid.randomEmptyPosition();
            expect(pos).to.equal(null);
        });
    });
    describe('filledCells', function() {
        it('should return width x height cells after all has been filled', function() {
            const filled = grid.filledCells();
            expect(filled.length).to.equal(total);
        });
    });

    function _rowOrColFromNums(vals: fourNums): CellOrNull[] {
        const rowOrCol = [];
        for (const val of vals) {
            const cell = val ? new Cell(val) : null;
            rowOrCol.push(cell);
        }
        return rowOrCol;
    }
    function _rowOrColToNums(rowOrCol: CellOrNull[]): fourNums {
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
        [[2, 0, 2, 0], [0, 0, 0, 4]],
        [[8, 4, 0, 2], [0, 8, 4, 2]]
    ];
    describe('processRowOrCol', function() {
        for (const testval of testVals) {
            const [test, expected] = testval;
            const testdescr = 'input of "' + test  + '" should return "' + expected + '"';
            it(testdescr, function() {
                const rowOrCol = _rowOrColFromNums(test);
                const changed = grid.processRowOrCol(rowOrCol, direction.Right);
                const result = _rowOrColToNums(rowOrCol);
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
    describe('fromArray toArray', function() {

        it('should return the same values after toArray > fromArray', function() {
            grid.fromArray(testgrid);
            const test = grid.toArray();
            expect(JSON.stringify(test)).to.equal(JSON.stringify(testgrid));
        });
    });
    describe('makeMove up', function() {
        it('should return the expected values when moving up', function() {
            const expected = [
                8, 2,  4, 8,     // 0, 2, 4, 8,
                2, 8, 16, 4,     // 8, 4, 0, 2,
                0, 2,  0, 8,     // 2, 4, 8, 2,
                0, 0,  0, 0      // 0, 2, 8, 8
            ];
            grid.fromArray(testgrid);
            grid.makeMove(direction.Up);
            const test = grid.toArray();
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
            grid.fromArray(testgrid);
            grid.makeMove(direction.Right);
            const test = grid.toArray();
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
            grid.fromArray(testgrid);
            grid.makeMove(direction.Down);
            const test = grid.toArray();
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
            grid.fromArray(testgrid);
            grid.makeMove(direction.Left);
            const test = grid.toArray();
            expect(JSON.stringify(test)).to.equal(JSON.stringify(expected));
        });
    });

});
