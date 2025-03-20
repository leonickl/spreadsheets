export function dimensions(table, cursor) {
    return [
        Math.max(...table.map((data) => data.y), cursor.y),
        Math.max(...table.map((data) => data.x), cursor.x),
    ];
}

export function grid(table, cursor) {
    const [height, width] = dimensions(table, cursor);

    const grid = new Array(height + 1)
        .fill(null)
        .map(() => new Array(width + 1).fill(null));

    for (const i in grid) {
        for (const j in grid[i]) {
            grid[i][j] = { y: i, x: j, data: null };
        }
    }

    table.forEach((cell) => {
        grid[cell.y][cell.x] = cell;
    });

    return grid;
}

export function letter(index) {
    let result = "";

    index += 1; // Convert to 1-based index

    while (index > 0) {
        index -= 1; // Adjust for zero-based indexing
        result = String.fromCharCode((index % 26) + 65) + result;
        index = Math.floor(index / 26);
    }

    return result;
}

export function index(letter) {
    let index = 0;

    for (let i = 0; i < letter.length; i++) {
        index = index * 26 + (letter.charCodeAt(i) - 65 + 1);
    }
    
    return index - 1; // Convert back to zero-based index
}
