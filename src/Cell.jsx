import CellData from "./CellData";
import { useGlobalState } from "./hooks/useGlobalState";

export default function Cell({ y, x, cell }) {
    const { cursor, setCursor, inputRef } = useGlobalState();

    const focused = cursor && cursor.y == y && cursor.x == x;

    return (
        <td
            className={`
                ${focused && "outline outline-blue-600 outline-3 rounded"}
                border border-opacity-20 border-white hover:bg-gray-700 relative
                ${cell.type === "number" && "type-number"}
                ${cell.type === "special" && "type-special"}
                ${cell.data?.[0] === "=" && "type-formula"}
            `}
            onMouseDown={() => setCursor({ y, x })}
            onDoubleClick={() => inputRef.current.focus()}
        >
            <div
                className={`min-h-9 min-w-24 w-full px-5 py-2 inline select-none`}
            >
                <CellData cell={cell} />
            </div>
        </td>
    );
}
