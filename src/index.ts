import './styles.sass';
import { Game } from './game';
import { Renderer } from './renderer';
import { InputHandler } from './inputhandler';

document.addEventListener('DOMContentLoaded', function(ev: Event): void {
    const cntnr = document.getElementById('container');
    if (cntnr) {
        const renderer = new Renderer(cntnr);
        const inputHandler = new InputHandler(cntnr);
        const game = new Game(4, renderer, inputHandler);
        game.start();
    }
});
