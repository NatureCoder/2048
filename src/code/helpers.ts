export function randomInt(maxExclusive: number): number {
    return Math.floor(Math.random() * Math.floor(maxExclusive));
}

export function nf(val: number, width: number): string {
    let s = val.toString();
    while (s.length < width) {
        s = ' ' + s;
    }
    return s;
}
