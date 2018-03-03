import './styles.sass';
import {Grid} from './grid';
import {Game} from './game';

document.addEventListener('DOMContentLoaded', function(ev: Event): void {
    const grid = new Grid();
    const game = new Game(grid);
    game.start();
    game.show();
});
