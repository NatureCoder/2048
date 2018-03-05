import './styles.sass';
import { Game } from './game';
import { Renderer } from './renderer';

document.addEventListener('DOMContentLoaded', function(ev: Event): void {
    const cntnr = document.getElementById('container');
    if (cntnr) {
        const renderer = new Renderer(cntnr);
        const game = new Game(4, renderer);
        game.start();
    }
});
