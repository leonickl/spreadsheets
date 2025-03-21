export function find(table, y, x) {
    return table?.find((cell) => cell.y == y && cell.x == x);
}
