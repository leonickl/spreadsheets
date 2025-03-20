import { useGlobalState } from "./hooks/useGlobalState";
import evaluate from "./lib/evaluate";
import { isEmail, isPhoneNumber, isURL } from "./lib/types";

export default function CellData({ cell }) {
    const { table } = useGlobalState();

    if (cell.type === "formula") {
        return <span>{evaluate(cell.data, table)}</span>;
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
