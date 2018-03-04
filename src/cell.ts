import {Pos} from './pos';

export type CellOrNull = Cell | null;

export class Cell {
    public pos: Pos;
    public val: number;
    public merged: boolean;
    constructor(val: number, pos?: Pos, ) {
        this.pos = pos ? pos : new Pos();
        this.val = val;
        this.merged = false;
    }
    public canMergeWith(other: CellOrNull): boolean {
        return (other !== null)
                && (!this.merged)
                && (!other.merged)
                && (this.val === other.val);
    }
}
