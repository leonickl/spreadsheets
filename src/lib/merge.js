/**
 * merge a cell into a table array if given and removes duplicates.
 * if there is no cell given, duplicates are still removed.
 */
export function mergeCell(table, cell) {
    if (!Array.isArray(table)) {
        console.error(table);
        throw new Error();
    }

    const grid = [];

    if (cell) {
        if (!grid[cell.y]) grid[cell.y] = [];

        grid[cell.y][cell.x] = cell;
    }

    for (const cell of table) {
        const found = grid[cell.y]?.[cell.x];

        // overwrite current value if position not used
        // or if current position does not have a date
        // or if new cell has a newer date
        if (!found || !found.date || (cell.date && found.date < cell.date)) {
            if (!grid[cell.y]) grid[cell.y] = [];

            grid[cell.y][cell.x] = cell;
            continue;
        }
    }

    return grid.flat();
}

export function mergeTables(table1, table2) {
    for (const cell of table2) {
        table1 = mergeCell(table1, cell);
    }

    return table1;
}
