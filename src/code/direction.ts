type DirValue = -1 | 0 | 1;

export class Direction {
    public x: DirValue = 0;
    public y: DirValue = 0;
    constructor(x: DirValue, y: DirValue) {
        this.x = x;
        this.y = y;
    }
}

// clockwise start at UP
const UP = new Direction(0, -1);
const RIGHT = new Direction(1, 0);
const DOWN = new Direction(0, 1);
const LEFT = new Direction(-1, 0);
export const DIRECTIONS: Direction[] = [UP, RIGHT, DOWN, LEFT];

export enum direction {Up = 0, Right, Down, Left}
