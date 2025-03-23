import { useGlobalState } from "./hooks/useGlobalState";

export default function SelectSelectList() {
    const { cursor, cell, updateTable, selectLists } = useGlobalState();

    return (
        <select
            value={cell.selectList}
            onChange={(e) =>
                updateTable(cursor.y, cursor.x, {
                    selectList: e.target.value,
                })
            }
            className="h-full bg-gray-800 w-40 px-5 py-2 rounded-md border border-gray-400 focus:border-blue-700 focus:outline-blue-700"
        >
            <option></option>
            
            {Object.keys(selectLists).map((item) => (
                <option>{item}</option>
            ))}
        </select>
    );
}
