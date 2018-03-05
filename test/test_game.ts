import 'mocha';
import { expect } from 'chai';

import { Grid } from '../src/grid';
import { Game } from '../src/game';

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
});
