import { Pos } from './position';
import { direction } from './direction';

export type CellOrNull = Cell | null;
export interface ICellState {
    pos: Pos;
    val: number;
}
// these are only for displaying purposes:
export interface ICellRenderState extends ICellState {
    oldPos?: Pos;
    oldVal?: number;
    mergeDir?: direction;
    new: boolean;
}

export class Cell {
    public static fromState(state: ICellState): Cell {
        return new Cell(state.val, state.pos);
    }
    private _oldVal?: number = undefined;
    private _oldPos?: Pos = undefined;
    private _mergeDir?: direction = undefined;
    private _new: boolean = true;
    private _pos: Pos;
    private _val: number;
    get pos() {
        return this._pos;
    }
    set pos(pos) {
        if (!this._oldPos) {
            this._oldPos = this._pos;
        }
        this._pos = pos;
    }
    get val() {
        return this._val;
    }
    set val(val) {
        this._oldVal = this._val;
        this._val = val;
    }
    get merged() {
        // could alse check _mergeDir here
        return (this._oldVal !== undefined);
    }

    constructor(val: number, pos?: Pos) {
        this._val = val;
        this._pos = pos ? pos : new Pos();
    }

    public prepareMove() {
        this._oldPos = undefined;
        this._oldVal = undefined;
        this._mergeDir = undefined;
        this._new = false;
    }

    public setMergeDir(dir: direction) {
        this._mergeDir = dir;
    }

    public canMergeWith(other: CellOrNull): boolean {
        return (other !== null)
                && (!this.merged)
                && (!other.merged)
                && (this.val === other.val);
    }

    public toState(): ICellState {
        return {
            pos: this.pos,
            val: this.val,
        };
    }

    public toRenderState(): ICellRenderState {
        return {
            pos: this.pos,
            val: this.val,
            oldPos: this._oldPos,
            oldVal: this._oldVal,
            mergeDir: this._mergeDir,
            new: this._new
        };
    }
}
