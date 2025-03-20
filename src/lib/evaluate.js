import { index } from "./grid.js";
import log from "./log.js";
import parse from "./parse.js";
import { isInt, isNumeric } from "./types.js";

function functions() {
    function listOr(f) {
        return (list) => (Array.isArray(list) ? f(list) : "{no array}");
    }

    function sum(list) {
        return list?.reduce?.((acc, curr) => acc + curr, 0);
    }

    function prod(list) {
        return list?.reduce?.((acc, curr) => acc * curr, 1);
    }

    function mean(list) {
        return sum(list) / list.length;
    }

    function min(list) {
        return Math.min(...list);
    }

    function max(list) {
        return Math.max(...list);
    }

    function sin(x) {
        return Math.sin(x);
    }

    function cos(x) {
        return Math.cos(x);
    }

    function exp(x) {
        return Math.exp(x);
    }

    function log(x) {
        return Math.log(x);
    }

    function if_(...x) {
        console.log(x);
    }

    return {
        sum: listOr(sum),
        prod: listOr(prod),
        mean: listOr(mean),
        min: listOr(min),
        max: listOr(max),
        sin,
        cos,
        exp,
        log,
        if: if_,
    };
}

function operator(left, op, right) {
    if (op === "+") return left + right;
    if (op === "-") return left - right;
    if (op === "*") return left * right;
    if (op === "/") return left / right;
}

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
