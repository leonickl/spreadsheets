import { functions, operator } from "./functions.js";
import { index } from "./grid.js";
import parse from "./parse.js";
import { isInt, isNumeric } from "./types.js";

export default function evaluate(table, cell) {
    function hashToCurrent(axis, value, cell) {
        if (!["x", "y"].includes(axis)) {
            throw new Error("axis must be x or y");
        }

        return value === "#" ? cell[axis] : value;
    }

    function evaluateFormula(formula, cell) {
        if (!formula) {
            return null;
        }

        if (formula.type === "number") {
            return parseFloat(formula.value);
        }

        if (formula.type === "function") {
            const f = functions()[formula.name];

            if (!f) {
                return "{unknown function}";
            }

            const result = f(
                ...formula.args.map((e) => evaluateFormula(e, cell))
            );

            return result;
        }

        if (formula.type === "cell") {
            let [, x, y] = formula.value.match(/^([A-Z#]+)([\d#]+)$/);

            x = hashToCurrent("x", x, cell);
            y = hashToCurrent("y", y, cell);

            const referencedCell = table.find(
                (cell) => cell.x == index(x) && cell.y == y
            );

            if (!referencedCell) {
                console.warn("cell not found");
                return null;
            }

            return referencedCell.data?.[0] === "="
                ? evaluateFormula(parse(referencedCell.data), referencedCell)
                : referencedCell.data;
        }

        if (formula.type === "range") {
            const [, x1, y1, x2, y2] = formula.value.match(
                /^([A-Z]+)([\d#]+):([A-Z]+)([\d#]+)$/
            );

            const list = table
                .filter(
                    (cell) =>
                        cell.x >= index(x1) &&
                        cell.x <= index(x2) &&
                        cell.y >= parseInt(y1) &&
                        cell.y <= parseInt(y2)
                )
                .map((cell) =>
                    cell.data?.[0] === "="
                        ? evaluateFormula(parse(cell.data), cell)
                        : cell.data
                );

            return list;
        }

        if (formula.type === "invalid") {
            return "{invalid syntax}";
        }

        if (formula.type === "array") {
            return formula.elements.map((e) => evaluateFormula(e, cell));
        }

        if (formula.type === "operation") {
            return operator(
                evaluateFormula(formula.left, cell),
                formula.operator,
                evaluateFormula(formula.right, cell)
            );
        }

        if (formula.type === "string") {
            return formula.value;
        }

        return "{invalid type}";
    }

    if (!cell.data) {
        console.warn("empty formula");
        return null;
    }

    const parsed = parse(cell.data);

    const result = evaluateFormula(parsed, cell);

    if (isNumeric(result) && !isInt(result)) {
        return result.toFixed(cell.decimals ?? 2);
    }

    return result;
}
