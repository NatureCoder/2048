import { IGameRenderState, IRenderer} from './game';

// same values as in styles.sass
const containerSize = 450;
const fontsize = 20;
const cellsize = 100;
const gridmargin = 15;
const cellmargin = 4;
const borderwidth = 4;

export class CanvasRenderer implements IRenderer {
    private container: HTMLElement;
    private canvas: HTMLCanvasElement;
    private scoreElmt: HTMLElement;
    private highscoreElmt: HTMLElement;

    constructor(container: HTMLElement, scoreElmt: HTMLElement, highscoreElmt: HTMLElement) {
        this.container = container;
        this.container.innerHTML = '';
        this.scoreElmt = scoreElmt;
        this.scoreElmt.innerHTML = '';
        this.highscoreElmt = highscoreElmt;
        this.highscoreElmt.innerHTML = '';

        this.canvas = document.createElement("canvas");
        this.container.appendChild(this.canvas);
    }

    public updatescores(score: number, highscore: number) {
        this.scoreElmt.innerHTML = score.toString();
        this.highscoreElmt.innerHTML = highscore.toString();
    }

    public render(state: IGameRenderState) {

        function clearBackground(ctx: CanvasRenderingContext2D, w: number, h: number) {
            ctx.fillStyle = 'dimgray';
            ctx.fillRect(0, 0, w, h);
        }
        function drawBorder(ctx: CanvasRenderingContext2D, w: number, h: number) {
            ctx.beginPath();
            ctx.lineWidth = 2 * cellmargin;
            ctx.strokeStyle = '#333';
            ctx.rect(0, 0, w, h);
            ctx.stroke();
        }
        function drawGridLines(ctx: CanvasRenderingContext2D, w: number, h: number, size: number) {
            ctx.strokeStyle = '#333';
            ctx.lineWidth = 1;
            ctx.beginPath();
            const siz = (cellmargin + cellsize);
            const start = gridmargin - cellmargin;
            for (let x = 1; x < size; x++) {
                ctx.moveTo(start + x * siz, start);
                ctx.lineTo(start + x * siz, h + start);
            }
            for (let y = 1; y < size; y++) {
                ctx.moveTo(start, start + y * siz);
                ctx.lineTo(w + start, start + y * siz);
            }
            ctx.stroke();
        }
        function drawTiles(ctx: CanvasRenderingContext2D) {

            function drawTileBackGround(x: number, y: number, size: number) {
                const lost = state.done && ! state.won;
                ctx.fillStyle = lost ? 'crimson' : 'darksalmon';
                ctx.fillRect(x, y, size, size);
            }
            function drawTileBorder(x: number, y: number, size: number) {
                const lw = borderwidth;
                ctx.beginPath();
                ctx.lineWidth = lw;
                ctx.strokeStyle = 'rgba(0, 0, 0, 0.4)';
                ctx.rect(x + lw / 2, y + lw / 2, size - lw, size - lw);
                ctx.stroke();
            }
            function drawTileText(val: string, x: number, y: number, size: number) {
                ctx.fillStyle = 'rgba(0, 0, 0, 0.4)';
                ctx.fillText(val, x + size / 2, y + size / 2);
            }
            const tileSize = cellsize - cellmargin;
            ctx.textAlign = 'center';
            ctx.font = 'bold 20px Arial';
            ctx.textBaseline = 'middle';
            for (const cell of state.grid.cells) {
                const x = gridmargin + (cellmargin + cellsize) * cell.pos.x;
                const y = gridmargin + (cellmargin + cellsize) * cell.pos.y;
                const val = cell.val.toString();
                drawTileBackGround(x, y, tileSize);
                drawTileBorder(x, y, tileSize);
                drawTileText(val, x, y, tileSize);
            }
        }

        const cols = state.grid.size;
        const gridsize = (cols * cellsize) + (cols - 1) * cellmargin + (2 * gridmargin);
        this.canvas.width = gridsize;
        this.canvas.height = gridsize;
        window.requestAnimationFrame(() => {
            const ctx = this.canvas.getContext("2d");
            if (ctx) {
                ctx.save();
                let width = gridsize;
                let height = gridsize;
                clearBackground(ctx, width, height);
                drawBorder(ctx, width, height);
                width -= (2 * gridmargin);
                height -= (2 * gridmargin);
                drawGridLines(ctx, width, height, cols);
                drawTiles(ctx);
                ctx.restore();
            }
        });
    }
}
