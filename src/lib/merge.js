import { now } from "./date.js";
import { isObject } from "./object.js";

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

export function mergeObjects(object1, object2) {
    const { date1, data1 } = object1;
    const { date2, data2 } = object2;

    if (!date1) {
        return { date2, data2 };
    }

    if (!date2) {
        return { date1, data1 };
    }

    if (date1 < date2) {
        return { date2, data2 };
    }

    return { date1, data1 };
}

export function mergeFiles(file1, file2) {
    file1 = repair(file1);
    file2 = repair(file2);

    return {
        filename: mergeObjects(file1.filename, file2.filename),
        selectLists: mergeObjects(file1.selectLists, file2.selectLists),
        body: mergeTables(file1.table, file2.table),
    };
}

export function repair(file) {
    if (!isObject()) {
        throw new Error("file is not an object");
    }

    let { filename, selectLists, body } = file;

    if (!filename) {
        filename = "Spreadsheet";
    }

    if (typeof filename === "string") {
        filename = { date: now(), data: filename };
    }

    if (!selectLists) {
        selectLists = [];
    }

    if (Array.isArray(selectLists)) {
        selectLists = { date: now(), data: selectLists };
    }

    if (!isObject(selectLists)) {
        throw new Error("invalid select lists");
    }

    if (!body) {
        body = [];
    }

    if (!Array.isArray(body)) {
        throw new Error("body is not an array");
    }

    // remove duplicate cells
    body = mergeCell(body);

    return { filename, selectLists, body };
}
