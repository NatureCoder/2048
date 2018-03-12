import '../styles/styles.sass';
import { Game } from './game';
import { ConsoleRenderer} from './consolerenderer';
import { CanvasRenderer } from './canvasrenderer';
import { HTMLRenderer } from './htmlrenderer';
import { InputHandler } from './inputhandler';
import { Grid } from './grid';
import { GameStorage } from './storage';

if (document.readyState === 'complete') {
    console.log( 'document is already ready' );
    startup();
} else {
document.addEventListener('DOMContentLoaded', function(ev: Event) {
        console.log( 'DOMContentLoaded' );
        startup();
    });
}

function startup() {
    const cntnr = document.getElementById('game');
    const restartBtn = document.getElementById('restart') as HTMLDivElement;
    const scoreElmt = document.getElementById('score');
    const highscoreElmt = document.getElementById('highscore');
    if (cntnr && restartBtn) {
        const gridsize = 4;
        // const renderer = new ConsoleRenderer();
        // const renderer = new CanvasRenderer(cntnr, scoreElmt!, highscoreElmt!);
        const renderer = new HTMLRenderer(cntnr, scoreElmt!, highscoreElmt!, gridsize);
        const storage = new GameStorage();
        const inputHandler = new InputHandler(cntnr, restartBtn);
        const testvals = [
            32,   64,   4,   16,
           128,  512,  64,    2,
             2,    8,  64,  256,
             4,  128,   8, 1024
        ];
        const gameState = storage.load();
        let game: Game;
        if (gameState) {
            game = Game.fromState(gameState, renderer, inputHandler, storage);
        } else {
            const grid = Grid.fromArray(testvals, 4);
            game = new Game(grid, renderer, inputHandler, storage);
            // const game = new Game(gridsize, renderer, inputHandler, storage);
        }
        game.start(2);
    }
}
