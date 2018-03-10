import { IGameState, IRenderer} from './game';

export class CanvasRenderer implements IRenderer {
    private container: HTMLElement;
    private canvas: HTMLCanvasElement;
    private scoreElmt: HTMLElement;

    constructor(container: HTMLElement, scoreElmt: HTMLElement) {
        this.container = container;
        this.container.innerHTML = '';
        this.scoreElmt = scoreElmt;
        this.scoreElmt.innerHTML = '';

        this.canvas = document.createElement("canvas");
        this.canvas.width = 600;
        this.canvas.height = 600;
        this.container.appendChild(this.canvas);
    }

    public updatescore(score: number) {
        this.scoreElmt.innerHTML = score.toString();
    }
    public render(state: IGameState) {

        function clearBackground(ctx: CanvasRenderingContext2D, w: number, h: number) {
            ctx.fillStyle = 'dimgray';
            ctx.fillRect(0, 0, w, h);
        }
        function drawBorder(ctx: CanvasRenderingContext2D, m: number, w: number, h: number) {
            ctx.beginPath();
            ctx.lineWidth = 2 * m;
            ctx.strokeStyle = '#333';
            ctx.rect(0, 0, w, h);
            ctx.stroke();
        }
        function drawGridLines(ctx: CanvasRenderingContext2D, m: number, w: number, h: number,
                               size: number, cellSize: number) {
            ctx.strokeStyle = '#333';
            ctx.lineWidth = 1;
            ctx.beginPath();

            for (let x = 1; x < size; x++) {
                ctx.moveTo(m + x * cellSize, m);
                ctx.lineTo(m + x * cellSize, h + m);
            }
            for (let y = 1; y < size; y++) {
                ctx.moveTo(m, m + y * cellSize);
                ctx.lineTo(w + m, m + y * cellSize);
            }
            ctx.stroke();
        }
        function drawTiles(ctx: CanvasRenderingContext2D, m: number, cellSize: number) {

            function drawTileBackGround(x: number, y: number, size: number) {
                const lost = state.done && ! state.won;
                ctx.fillStyle = lost ? 'crimson' : 'darksalmon';
                ctx.fillRect(x, y, size, size);
            }
            function drawTileBorder(x: number, y: number, size: number) {
                const lw = 10;
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
            const mm = 5;
            const tileSize = cellSize - mm * 2;
            ctx.textAlign = 'center';
            ctx.font = 'bold 50px Arial';
            ctx.textBaseline = 'middle';
            for (const cell of state.grid.cells) {
                const x = m + mm + cell.pos.x * cellSize;
                const y = m + mm + cell.pos.y * cellSize;
                const val = cell.val.toString();
                drawTileBackGround(x, y, tileSize);
                drawTileBorder(x, y, tileSize);
                drawTileText(val, x, y, tileSize);
            }
        }

        window.requestAnimationFrame(() => {
            const ctx = this.canvas.getContext("2d");
            if (ctx) {
                ctx.save();
                let width = this.canvas.clientWidth;
                let height = this.canvas.clientHeight;
                const margin = 10;
                const cols = state.grid.size;
                clearBackground(ctx, width, height);
                drawBorder(ctx, margin, width, height);
                width -= (2 * margin);
                height -= (2 * margin);
                const cellSize = width / cols;
                drawGridLines(ctx, margin, width, height, cols, cellSize);
                drawTiles(ctx, margin, cellSize);
                ctx.restore();
            }
        });
    }
}
