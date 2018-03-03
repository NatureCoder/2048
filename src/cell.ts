export class Pos {
    public x: number;
    public y: number;
    constructor(x?: number, y?: number) {
        this.x = x ? x : 0;
        this.y = y ? y : 0;
    }
}

export class Cell {
    public pos: Pos;
    public id: string;
    public val: number;
    constructor(id: string, pos?: Pos, val?: number) {
        this.id = id;
        this.pos = pos ? pos : new Pos();
        this.val = val ? val : 0;
    }
    public empty(): boolean {
        return (this.val === 0);
    }
}
