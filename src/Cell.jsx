import CellData from "./CellData";
import { useGlobalState } from "./hooks/useGlobalState";

export default function Cell({ y, x, cell }) {
    const { cursor, setCursor } = useGlobalState();

    const focused = cursor && cursor.y == y && cursor.x == x;

    return (
        <td
            className={`${
                focused && "outline outline-blue-600 outline-3 rounded"
            } border border-opacity-20 border-white hover:bg-gray-700 ${
                cell.type === "number" && "type-number"
            } relative`}
        >
            <div
                className={`min-h-9 min-w-24 w-full px-5 py-2 inline`}
                onClick={() => setCursor({ y, x })}
            >
                <CellData cell={cell} />
            </div>
        </td>
    );
}
