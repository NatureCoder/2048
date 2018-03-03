import 'mocha';
import { expect } from 'chai';

import { Game } from '../src/game';

describe('Game', function() {
    const game = new Game();
    describe('start', function() {
        it('should fill 2 cells with a value of 2 or 4', function() {
            game.start();
            const filled = game.grid.filledCells();
            expect(filled.length).to.equal(2);
            for (const cell of filled) {
                expect(cell.val).to.satisfy((x: number) => ((x === 2) || (x === 4)) );
            }
        });
    });
});
