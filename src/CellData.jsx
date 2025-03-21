import { useGlobalState } from "./hooks/useGlobalState";
import evaluate from "./lib/evaluate";
import { isEmail, isPhoneNumber, isURL } from "./lib/types";

export default function CellData({ cell }) {
    const { table, updateTable, cursor } = useGlobalState();

    if (cell.data?.[0] === "=") {
        const result = evaluate(table, cell);

        if (
            cell.type === "special" &&
            cell.data?.[0] === "=" &&
            (result == 1 || result == 0)
        ) {
            return (
                <input
                    type="checkbox"
                    checked={result}
                    className="accent-green-400 opacity-70"
                    readOnly
                />
            );
        }

        return <span>{result}</span>;
    }

    if (cell.type === "special" && (cell.data == 1 || cell.data == 0)) {
        return (
            <input
                type="checkbox"
                checked={cell.data}
                onChange={(e) =>
                    updateTable(cursor.y, cursor.x, {
                        data: e.target.checked ? 1 : 0,
                    })
                }
                className="accent-green-400"
            />
        );
    }

    if (cell.type === "special" && isEmail(cell.data)) {
        return (
            <a
                className="underline decoration-gray-400"
                href={`mailto:${cell.data}`}
            >
                {cell.data}
            </a>
        );
    }

    if (cell.type === "special" && isURL(cell.data)) {
        return (
            <a className="underline decoration-gray-400" href={`${cell.data}`}>
                {cell.data}
            </a>
        );
    }

    if (cell.type === "special" && isPhoneNumber(cell.data)) {
        return (
            <a
                className="underline decoration-gray-400"
                href={`tel:${cell.data}`}
            >
                {cell.data}
            </a>
        );
    }

    return (
        <span
            className={`${cell.bold && "font-bold"}
                ${cell.underline && "underline"}
                ${cell.italic && "italic"}`}
        >
            {cell.data}
        </span>
    );
}
