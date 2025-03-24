import { find } from "./data";

export default function keyPress({
    event,
    updateTable,
    limit,
    setCursor,
    inputRef,
    removeFromTable,
    cursor,
    isFocused,
    cell,
    secondaryCursor,
    setSecondaryCursor,
    table,
    clipboard,
    setClipboard,
}) {
    function secondaryCursorCell() {
        return (
            find(table, secondaryCursor.y, secondaryCursor.x) ?? {
                data: null,
            }
        );
    }

    function doWithRange(f, from, to) {
        const [fromX, toX] = from.x < to.x ? [from.x, to.x] : [to.x, from.x];
        const [fromY, toY] = from.y < to.y ? [from.y, to.y] : [to.y, from.y];

        for (let y = fromY; y <= toY; y++) {
            for (let x = fromX; x <= toX; x++) {
                f(y, x);
            }
        }
    }

    function updateRange(from, to, props) {
        doWithRange((y, x) => updateTable(y, x, props), from, to);
    }

    function removeRange(from, to) {
        doWithRange((y, x) => removeFromTable(y, x), from, to);
    }

    function without(obj, props) {
        return Object.fromEntries(
            Object.entries(obj).filter(([key]) => !props.includes(key))
        );
    }

    // also if in input mode

    if (event.key === "ArrowUp") {
        setCursor(({ x, y }) => limit({ x, y: y - 1 }));
    }

    if (event.key === "ArrowDown") {
        setCursor(({ x, y }) => limit({ x, y: y + 1 }));
    }

    if (event.key === "Enter") {
        if (isFocused) {
            setCursor(({ x, y }) => limit({ x, y: y + 1 }));
        } else {
            inputRef.current.focus();
        }
    }

    if (event.key === "Escape") {
        inputRef.current.blur();
    }

    if (event.key === "Tab") {
        event.preventDefault();
        setCursor(({ x, y }) => limit({ x: x + 1, y }));
    }

    if (isFocused) return;

    // only if in navigation mode

    if (event.key === "ArrowLeft") {
        setCursor(({ x, y }) => limit({ x: x - 1, y }));
    }

    if (event.key === "ArrowRight") {
        setCursor(({ x, y }) => limit({ x: x + 1, y }));
    }

    if (event.key === "Delete") {
        if (secondaryCursor) {
            removeRange(secondaryCursor, cursor);
        } else {
            removeFromTable(cursor.y, cursor.x);
        }
    }

    if (event.key === "b" || event.key === "B") {
        updateTable(cursor.y, cursor.x, { bold: !cell?.bold });
    }

    if (event.key === "u" || event.key === "U") {
        updateTable(cursor.y, cursor.x, {
            underline: !cell?.underline,
        });
    }

    if (event.key === "i" || event.key === "I") {
        updateTable(cursor.y, cursor.x, {
            italic: !cell?.italic,
        });
    }

    if (event.key === "+") {
        updateTable(cursor.y, cursor.x, {
            decimals: (cell.decimals ?? 0) + 1,
        });
    }

    if (event.key === "-") {
        updateTable(cursor.y, cursor.x, {
            decimals: Math.max(0, (cell.decimals ?? 0) - 1),
        });
    }

    if (event.key === "Shift") {
        if (secondaryCursor) {
            setSecondaryCursor();
        } else {
            setSecondaryCursor(cursor);
        }
    }

    if (event.key === "Escape") {
        setSecondaryCursor();
    }

    if (event.key === "f" && cursor && secondaryCursor) {
        updateRange(
            secondaryCursor,
            cursor,
            without(secondaryCursorCell(), ["x", "y"])
        );
    }

    if (event.key === "f" && cursor && !secondaryCursor) {
        const column = table
            .filter(
                (cell) => cell.x == cursor.x && cell.data && cell.y < cursor.y
            )
            .sort((one, other) => one.y - other.y);

        const last = column[column.length - 1] ?? { data: null };

        updateRange(
            { x: last.x, y: last.y + 1 },
            cursor,
            without(last, ["x", "y"])
        );
    }

    if (event.key === "c" || event.key === "C") {
        setClipboard(cell ?? { data: null });
    }

    if (event.key === "x" || event.key === "X") {
        setClipboard(cell ?? { data: null });
        removeFromTable(cell.y, cell.x);
    }

    if (event.key === "v" || event.key === "V") {
        updateTable(cursor.y, cursor.x, without(clipboard, ["x", "y"]), true);
    }
}
