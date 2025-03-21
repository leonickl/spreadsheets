import { useGlobalState } from "./hooks/useGlobalState";
import evaluate from "./lib/evaluate";
import { isEmail, isPhoneNumber, isURL } from "./lib/types";

export default function CellData({ cell }) {
    const { table, updateTable, cursor } = useGlobalState();

    const classes = [
        cell.bold && "font-bold",
        cell.underline && "underline",
        cell.italic && "italic",
    ].join(" ");

    if (cell.data?.[0] === "=") {
        const result = evaluate(table, cell);

        if (cell.type === "checkbox") {
            return (
                <input
                    type="checkbox"
                    checked={result}
                    className={`accent-green-400 opacity-70 ${classes}`}
                    readOnly
                />
            );
        }

        return (
            <span className={classes}>
                {cell.type === "percent" ? result * 100 : result}
            </span>
        );
    }

    if (cell.type === "checkbox") {
        return (
            <input
                type="checkbox"
                checked={cell.data}
                onChange={(e) =>
                    updateTable(cursor.y, cursor.x, {
                        data: e.target.checked ? 1 : 0,
                    })
                }
                className={`accent-green-400 ${classes}`}
            />
        );
    }

    if (cell.type === "special") {
        if (isEmail(cell.data)) {
            return (
                <a
                    className={`underline decoration-gray-400 ${classes}`}
                    href={`mailto:${cell.data}`}
                >
                    {cell.data}
                </a>
            );
        }

        if (isURL(cell.data)) {
            return (
                <a
                    className={`underline decoration-gray-400 ${classes}`}
                    href={
                        cell.data.substr(0, 4) === "http"
                            ? cell.data
                            : "https://" + cell.data
                    }
                >
                    {cell.data}
                </a>
            );
        }

        if (isPhoneNumber(cell.data)) {
            return (
                <a
                    className={`underline decoration-gray-400 ${classes}`}
                    href={`tel:${cell.data}`}
                >
                    {cell.data}
                </a>
            );
        }
    }

    return (
        <span className={classes}>
            {cell.type === "percent" ? cell.data * 100 : cell.data}
        </span>
    );
}
