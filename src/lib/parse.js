export default function parse(formula) {
    function tokenize(str) {
        return (
            str.match(
                /"[^"]*"|-?\d*\.?\d+(e[+-]?\d+)?|[A-Z#]+[\d#]+:[A-Z#]+[\d#]+|[A-Z#]+[\d#]+|[a-z]+(?=\()|<=|>=|==|[+\-*/()<>]|\[|\]|,|\w+/g
            ) || []
        );
    }

    // function parseTokens(tokens) {
    //     const output = [];
    //     const operators = [];

    //     const precedence = {
    //         "<": 1,
    //         ">": 1,
    //         "<=": 1,
    //         ">=": 1,
    //         "==": 1,
    //         "+": 2,
    //         "-": 2,
    //         "*": 3,
    //         "/": 3,
    //     };

    //     function applyOperator() {
    //         const op = operators.pop();

    //         if (op === "[" || op === "(") return;

    //         const right = output.pop();
    //         const left = output.pop();

    //         if (left === undefined) {
    //             output.push({ type: "invalid" });
    //             return;
    //         }

    //         output.push({ type: "operation", operator: op, left, right });
    //     }

    //     function applyFunction() {
    //         const funcName = operators.pop();
    //         const args = [];
    //         let temp = [];

    //         while (output.length && output[output.length - 1] !== "(") {
    //             const item = output.pop();
    //             if (item.type === "comma") {
    //                 args.unshift(temp.length === 1 ? temp[0] : temp);
    //                 temp = [];
    //             } else {
    //                 temp.unshift(item);
    //             }
    //         }

    //         if (temp.length > 0) {
    //             args.unshift(temp.length === 1 ? temp[0] : temp);
    //         }

    //         output.pop(); // Remove "("
    //         output.push({ type: "function", name: funcName, args });
    //     }

    //     function applyArray() {
    //         const elements = [];
    //         let temp = [];

    //         while (output.length && output[output.length - 1] !== "[") {
    //             const item = output.pop();
    //             if (item.type === "comma") {
    //                 elements.unshift(temp.length === 1 ? temp[0] : temp);
    //                 temp = [];
    //             } else {
    //                 temp.unshift(item);
    //             }
    //         }

    //         if (temp.length > 0) {
    //             elements.unshift(temp.length === 1 ? temp[0] : temp);
    //         }

    //         output.pop(); // Remove "["
    //         output.push({ type: "array", elements });
    //     }

    //     for (const token of tokens) {
    //         if (/^"[^"]*"$/.test(token)) {
    //             output.push({ type: "string", value: token.slice(1, -1) });
    //         } else if (/^-?\d*\.?\d+(e[+-]?\d+)?$/i.test(token)) {
    //             output.push({ type: "number", value: parseFloat(token) });
    //         } else if (/^[A-Z#]+[\d#]+:[A-Z#]+[\d#]+$/.test(token)) {
    //             output.push({ type: "range", value: token });
    //         } else if (/^[A-Z#]+[\d#]+$/.test(token)) {
    //             output.push({ type: "cell", value: token });
    //         } else if (/<=|>=|==|[+\-*/<>]/.test(token)) {
    //             while (
    //                 operators.length &&
    //                 precedence[operators[operators.length - 1]] >=
    //                     precedence[token] &&
    //                 operators[operators.length - 1] !== "["
    //             ) {
    //                 applyOperator();
    //             }
    //             operators.push(token);
    //         } else if (/^[a-z]+$/.test(token)) {
    //             operators.push(token);
    //         } else if (token === "(") {
    //             operators.push(token);
    //         } else if (token === ")") {
    //             while (
    //                 operators.length &&
    //                 operators[operators.length - 1] !== "("
    //             ) {
    //                 applyOperator();
    //             }

    //             operators.pop(); // Remove "("

    //             if (
    //                 operators.length &&
    //                 /^[a-z]+$/.test(operators[operators.length - 1])
    //             ) {
    //                 applyFunction();
    //             }
    //         } else if (token === ",") {
    //             output.push({ type: "comma" });
    //         } else if (token === "[") {
    //             operators.push("[");
    //         } else if (token === "]") {
    //             applyArray();
    //         }
    //     }

    //     while (operators.length) {
    //         if (
    //             operators[operators.length - 1] === "[" ||
    //             operators[operators.length - 1] === "("
    //         ) {
    //             operators.pop();
    //         } else {
    //             applyOperator();
    //         }
    //     }

    //     return output.length === 1 ? output[0] : { type: "invalid" };
    // }

    const tokens = tokenize(formula.trim());

    console.debug(tokens);

    // return parseTokens(tokens);
}
