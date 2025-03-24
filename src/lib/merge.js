import { letter } from "./grid.js";

/**
 * merges a cell into a table array if given and removes duplicates.
 * if there is no cell given, duplicates are still removed.
 */
export function merge(table, cell) {
    const unique = cell ? [cell] : [];

    for (const c of table) {
        if (unique.find(({ x, y }) => c.x == x && c.y == y)) {
            console.debug(`found duplicate at ${letter(c.x)} ${c.y}`);
            continue;
        }

        unique.push(c);
    }

    return unique;
}
