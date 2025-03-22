import { useGlobalState } from "./hooks/useGlobalState";

export default function SelectCellType() {
    const { cursor, cell, updateTable } = useGlobalState();
    
    return (
        <select
            disabled={!cursor}
            value={(cursor && cell?.type) ?? ""}
            onChange={(e) => {
                updateTable(cursor.y, cursor.x, {
                    type: e.target.value,
                });
            }}
            className="bg-gray-800 min-h-10 w-40 px-5 py-2 rounded-md border border-gray-400 focus:border-blue-700 focus:outline-blue-700"
        >
            <option></option>
            <option>checkbox</option>
            <option>percent</option>
            <option>money</option>
            <option>special</option>
            <option>select</option>
        </select>
    );
}
