export function limit({ x, y }) {
    return { x: Math.max(0, x), y: Math.max(0, y) };
}
