import {Pos} from './position';

export type CellOrNull = Cell | null;
export interface ICellState {
    pos: Pos;
    val: number;
}
export class Cell {
    public static fromState(state: ICellState): Cell {
        return new Cell(state.val, state.pos);
    }

    public pos: Pos;
    public val: number;
    private _merged: boolean = false;
    get merged() {
        return this._merged;
    }
    set merged(val) {
        this._merged = val;
    }

    constructor(val: number, pos?: Pos) {
        this.val = val;
        this.pos = pos ? pos : new Pos();
    }

    public prepareMove() {
        this._merged = false;
    }

    public canMergeWith(other: CellOrNull): boolean {
        return (other !== null)
                && (!this._merged)
                && (!other._merged)
                && (this.val === other.val);
    }

    public toState(): ICellState {
        return {
            pos: this.pos,
            val: this.val
        };
    }
}
