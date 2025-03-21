import { functions, operator } from "./functions.js";
import { index } from "./grid.js";
import log from "./log.js";
import parse from "./parse.js";
import { isInt, isNumeric } from "./types.js";

export default function evaluate(formula, table, decimals) {
    function evaluateFormula(formula) {
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

            const result = f(...formula.args.map(evaluateFormula));

            return result;
        }

        if (formula.type === "cell") {
            const [, x, y] = formula.value.match(/^([A-Z]+)(\d+)$/);

            const cell = table.find(
                (cell) => cell.x == index(x) && cell.y == y
            );

            if (!cell) {
                log("cell not found");
                return null;
            }

            return cell.data?.[0] === "="
                ? evaluateFormula(parse(cell.data))
                : parseFloat(cell.data);
        }

        if (formula.type === "range") {
            const [, x1, y1, x2, y2] = formula.value.match(
                /^([A-Z]+)(\d+):([A-Z]+)(\d+)$/
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
                        ? evaluateFormula(parse(cell.data))
                        : parseFloat(cell.data)
                );

            return list;
        }

        if (formula.type === "invalid") {
            return "{invalid syntax}";
        }

        if (formula.type === "array") {
            return formula.elements.map(evaluateFormula);
        }

        if (formula.type === "operation") {
            return operator(
                evaluateFormula(formula.left),
                formula.operator,
                evaluateFormula(formula.right)
            );
        }

        if (formula.type === "string") {
            return formula.value;
        }

        return "{invalid type}";
    }

    if (!formula) {
        log("empty formula");
        return null;
    }

    const parsed = parse(formula);

    log(parsed);

    const result = evaluateFormula(parsed);

    if (isNumeric(result) && !isInt(result)) {
        return result.toFixed(decimals ?? 2);
    }

    return result;
}
