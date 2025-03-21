export function functions() {
    // decorators

    function floatList(f) {
        return (list) => (Array.isArray(list) ? f(list.map(parseFloat)) : list);
    }

    function listOr(f) {
        return (list) => (Array.isArray(list) ? f(list) : "{no array}");
    }

    // functions

    function json(...x) {
        return JSON.stringify(x);
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

    function test(test, yes, no) {
        return test ? yes : no;
    }

    function and(a, b) {
        return a && b;
    }

    function or(a, b) {
        return a || b;
    }

    function not(a) {
        return !a;
    }

    function eq(x, y) {
        return x == y;
    }

    // export

    return {
        json,
        sum: listOr(floatList(sum)),
        prod: listOr(floatList(prod)),
        mean: listOr(floatList(mean)),
        min: listOr(floatList(min)),
        max: listOr(floatList(max)),
        sin,
        cos,
        exp,
        log,
        if: test,
        and,
        or,
        not,
        eq,
    };
}

export function operator(left, op, right) {
    left = parseFloat(left);
    right = parseFloat(right);

    if (op === "+") return left + right;
    if (op === "-") return left - right;
    if (op === "*") return left * right;
    if (op === "/") return left / right;

    if (op === "<") return left < right ? 1 : 0;
    if (op === "<=") return left <= right ? 1 : 0;
    if (op === ">") return left > right ? 1 : 0;
    if (op === ">=") return left >= right ? 1 : 0;
    if (op === "==") return left == right ? 1 : 0;
}
