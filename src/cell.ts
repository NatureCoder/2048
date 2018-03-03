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
    private merged: boolean;
    constructor(id: string, pos?: Pos, val?: number) {
        this.id = id;
        this.pos = pos ? pos : new Pos();
        this.val = val ? val : 0;
        this.merged = false;
    }
    public resetMerged(): void {
        this.merged = false;
    }
    public empty(): boolean {
        return (this.val === 0);
    }
    public canMergeWith(other: Cell): boolean {
        return (!this.merged) && (!other.merged) && (this.val === other.val);
    }
    public mergeWith(other: Cell): void {
        this.val = this.val + other.val;
        other.val = 0;
        this.merged = true; // we can only merge once per move
    }
}
