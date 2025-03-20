import { index } from "./grid";

export default function evaluate(formula, table, decimals) {
    if (!formula) return null;

    const match = formula.match(/([a-z]+) ([A-Z]+)(\d+):([A-Z]+)(\d+) ?(\d*)/);

    if (!match) return "ERROR";

    const [_, fun, _x1, _y1, _x2, _y2] = match;

    const x1 = index(_x1);
    const y1 = parseInt(_y1, 10);
    const x2 = index(_x2);
    const y2 = parseInt(_y2, 10);

    const values = table
        .filter(
            (cell) =>
                cell.x >= x1 && cell.x <= x2 && cell.y >= y1 && cell.y <= y2
        )
        .map((cell) =>
            cell.type === "formula" ? evaluate(cell.data, table, decimals ?? 3) : cell.data
        )
        .map(parseFloat)
        .filter((num) => !isNaN(num));

    console.log(values);

    function round(result) {
        return result.toFixed(decimals ?? 3);
    }

    if (fun === "sum") {
        return round(values.reduce((acc, val) => acc + val, 0));
    }

    if (fun === "mean") {
        return round(values.reduce((acc, val) => acc + val, 0) / values.length);
    }

    return "UNKNOWN";
}
