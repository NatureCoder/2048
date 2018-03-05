import { IGameState } from "./game";

export class Renderer {
    private container: HTMLElement;
    private canvas: HTMLCanvasElement;

    constructor(container: HTMLElement) {
        this.container = container;
        this.container.innerHTML = '';
        this.canvas = document.createElement("canvas");
        this.canvas.width = 600;
        this.canvas.height = 600;
        this.container.appendChild(this.canvas);
    }

    public render(state: IGameState) {
        const ctx = this.canvas.getContext("2d");
        let w = this.canvas.clientWidth;
        let h = this.canvas.clientHeight;
        const m = 10;
        if (ctx) {
            // clear background
            ctx.fillStyle = 'dimgray';
            ctx.fillRect(0, 0, w, h);

            // draw border
            ctx.lineWidth = 2 * m;
            ctx.strokeStyle = '#333';
            ctx.rect(0, 0, w, h);
            ctx.stroke();

            // draw grid lines
            w -= (2 * m);
            h -= (2 * m);
            ctx.strokeStyle = '#333';
            ctx.lineWidth = 1;
            ctx.beginPath();
            const gridSize = state.grid.size;
            const cellSize = w / gridSize;
            for (let x = 1; x < gridSize; x++) {
                ctx.moveTo(m + x * cellSize, m);
                ctx.lineTo(m + x * cellSize, h + m);
            }
            for (let y = 1; y < gridSize; y++) {
                ctx.moveTo(m, m + y * cellSize);
                ctx.lineTo(w + m, m + y * cellSize);
            }
            ctx.stroke();

            // draw tiles
            const mm = 5;
            const tileSize = cellSize - mm * 2;
            ctx.textAlign = 'center';
            ctx.font = 'bold 50px Arial';
            ctx.textBaseline = 'middle';
            for (const cell of state.grid.cells) {
                const x = m + mm + cell.pos.x * cellSize;
                const y = m + mm + cell.pos.y * cellSize;
                const val = cell.val.toString();
                // draw tile background
                ctx.fillStyle = 'darksalmon';
                ctx.fillRect(x, y, tileSize, tileSize);
                // draw tile border
                ctx.beginPath();
                const lw = 10;
                ctx.lineWidth = lw;
                ctx.strokeStyle = 'rgba(0, 0, 0, 0.4)';
                ctx.rect(x + lw / 2, y + lw / 2, tileSize - lw, tileSize - lw);
                ctx.stroke();
                // draw tile text
                ctx.fillStyle = 'rgba(0, 0, 0, 0.4)';
                ctx.fillText(val, x + tileSize / 2, y + tileSize / 2);
            }
        }
    }
}
