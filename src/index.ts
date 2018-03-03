import './styles.sass';
import {Game} from './game';

document.addEventListener('DOMContentLoaded', function(ev: Event): void {
    const game = new Game();
    game.start();
    game.show();
});
