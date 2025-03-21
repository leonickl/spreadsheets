import CellData from "./CellData";
import { useGlobalState } from "./hooks/useGlobalState";
import { between } from "./lib/data";

export default function Cell({ y, x, cell }) {
    const { cursor, setCursor, secondaryCursor, inputRef } = useGlobalState();

    const focused = cursor && cursor.y == y && cursor.x == x;
    const secondaryFocused =
        secondaryCursor && secondaryCursor.y == y && secondaryCursor.x == x;
    const focusRange =
        secondaryCursor &&
        between(x, cursor.x, secondaryCursor.x) &&
        between(y, cursor.y, secondaryCursor.y);

    return (
        <td
            className={`
                ${focused && "outline outline-blue-600 outline-3 rounded"}
                ${
                    secondaryFocused &&
                    "outline outline-red-600 outline-3 rounded"
                }
                ${focusRange && "bg-gray-800"}
                border border-opacity-20 border-white
                hover:bg-gray-700 relative
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
