import { Direction } from './direction';

export class Pos {
    public x: number;
    public y: number;
    constructor(x?: number, y?: number) {
        this.x = x ? x : 0;
        this.y = y ? y : 0;
    }
    public move(dir: Direction) {
        return new Pos(this.x + dir.x, this.y + dir.y);
    }
    public toString() {
        return `(${this.x}, ${this.y})`;
    }
    public copy(): Pos {
        return new Pos(this.x, this.y);
    }
}
