export function find(table, y, x) {
    return table?.find((cell) => cell.y == y && cell.x == x);
}

export function between(value, one, other) {
    return (value >= one && value <= other) || (value >= other && value <= one);
}
