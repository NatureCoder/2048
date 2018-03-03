import 'mocha';
import { expect } from 'chai';

import { Grid } from '../src/grid';

describe('Grid', function() {
    const grid = new Grid();
    const total = grid.width * grid.height;
    describe('rows', function() {
        it('should return an array of 4 rows', function() {
            expect(grid.rows.length).to.equal(4);
        });
        it('each row should contain 4 cells ordered left to right', function() {
            let y = 0;
            for (const row of grid.rows) {
                expect(row.length).to.equal(4);
                for (let x = 0; x < 4; x++) {
                    const cell = row[x];
                    expect(cell.pos.x).to.equal(x);
                    expect(cell.pos.y).to.equal(y);
                }
                y++;
            }
        });
    });
    describe('cols', function() {
        it('should return an array of 4 cols', function() {
            expect(grid.cols.length).to.equal(4);
        });
        it('each col should contain 4 cells ordered top to bottom', function() {
            let x = 0;
            for (const col of grid.cols) {
                expect(col.length).to.equal(4);
                for (let y = 0; y < 4; y++) {
                    const cell = col[y];
                    expect(cell.pos.x).to.equal(x);
                    expect(cell.pos.y).to.equal(y);
                }
                x++;
            }
        });
    });
    describe('emptyCells', function() {
        it('should return an array of width x height cells', function() {
            const empties = grid.emptyCells();
            expect(empties.length).to.equal(total);
        });
    });
    describe('randomEmptyCell', function() {
        it('should return an empty cell every time', function() {
            for (let i = 0; i < total; i++) {
                const cell = grid.randomEmptyCell();
                expect(cell!.val).to.equal(0);
                cell!.val = 2;
            }
        });
        it('should return null when there are no more empty cells', function() {
            const cell = grid.randomEmptyCell();
            expect(cell).to.equal(null);
        });
    });
    describe('filledCells', function() {
        it('should return width x height cells after all has been filled', function() {
            const filled = grid.filledCells();
            expect(filled.length).to.equal(total);
        });
    });
});
