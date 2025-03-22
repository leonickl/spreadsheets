import { useGlobalState } from "./hooks/useGlobalState";
import CellInputSelect from "./CellInputSelect";

export default function CellInput() {
    const { inputRef, cursor, cell, updateTable } = useGlobalState();

    return cell.type === "select" ? (
        <CellInputSelect />
    ) : (
        <input
            ref={inputRef}
            disabled={!cursor}
            value={(cursor && cell?.data) ?? ""}
            onChange={(e) =>
                updateTable(cursor.y, cursor.x, {
                    data: e.target.value,
                })
            }
            className="h-full bg-gray-800 w-full px-5 py-2 rounded-md border border-gray-400 focus:border-blue-700 focus:outline-blue-700"
        />
    );
}
