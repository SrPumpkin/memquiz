

export const math = {
    lerp: (a: number, b: number, n: number) => {
        return (1 - n) * a + n * b;
    },
    norm: (value: number, min: number, max: number) => {
        return (value - min) / (max - min);
    },
    toFixed: (num: number, fixed: number) => {
        let re = new RegExp('^-?\\d+(?:\.\\d{0,' + (fixed || -1) + '})?');
        // @ts-ignore
        return Number(num.toString().match(re)[0]);
    },
    smoothstep: (min: number, max: number, x: number) => {
        return Math.min( Math.max( x, min ), max);
    },
    rand: (a: number, b: number) => {
        return Number((Math.random() * (b-a) + a).toFixed(2))
    }
};