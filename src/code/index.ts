import '../styles/styles.sass';
import { Game } from './game';
import { ConsoleRenderer} from './consolerenderer';
import { CanvasRenderer } from './canvasrenderer';
import { HTMLRenderer } from './htmlrenderer';
import { InputHandler } from './inputhandler';
import { Grid } from './grid';

document.addEventListener('DOMContentLoaded', function(ev: Event) {
    const cntnr = document.getElementById('game');
    const scoreElmt = document.getElementById('score');
    const highscoreElmt = document.getElementById('highscore');
    if (cntnr) {
        const gridsize = 4;
        // const renderer = new ConsoleRenderer();
        // const renderer = new CanvasRenderer(cntnr);
        const renderer = new HTMLRenderer(cntnr, scoreElmt!, highscoreElmt!, gridsize);
        const inputHandler = new InputHandler(cntnr);
        const testvals = [
            32,   64,   4,   16,
           128,  512,  64,    2,
             2,    8,  64,  256,
             4,  128,   8, 1024
        ];
        // const testvals = [
        // 2, 2, 2, 2,
        // 2, 2, 0, 0,
        // 0, 0, 0, 0,
        // 0, 0, 0, 0
        // ];
        const grid = Grid.fromArray(testvals, 4);
        const game = new Game(grid, renderer, inputHandler);
        // const game = new Game(gridsize, renderer, inputHandler);
        game.start(2);
    }
});
