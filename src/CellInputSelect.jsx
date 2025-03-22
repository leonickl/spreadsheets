import { useGlobalState } from "./hooks/useGlobalState";
import { selectLists } from "./lib/selectLists";
import SelectItem from "./SelectItem";

export default function CellInputSelect() {
    const { cell, updateTable, cursor } = useGlobalState();

    if (!Array.isArray(cell.data)) {
        updateTable(cursor.y, cursor.x, {
            data: [],
        });
    }

    const colors = [
        "bg-yellow-200 text-yellow-900",
        "bg-green-200 text-green-900",
        "bg-pink-200 text-pink-900",
        "bg-red-200 text-red-900",
        "bg-yellow-300 text-yellow-900",
        "bg-green-300 text-green-900",
        "bg-pink-300 text-pink-900",
        "bg-blue-300 text-blue-900",
    ];

    return (
        <div className="flex flex-row items-start gap-10 bg-gray-800 min-h-10 w-full px-5 py-2 rounded-md border border-gray-400 focus:border-blue-700 focus:outline-blue-700">
            {selectLists[cell.selectList]?.map((item, index) => (
                <SelectItem
                    key={item}
                    item={item}
                    color={colors[index % colors.length]}
                    active={cell.data.includes(item)}
                    toggleActive={() =>
                        updateTable(cursor.y, cursor.x, {
                            data: cell.data.includes(item)
                                ? cell.data.filter((it) => it !== item)
                                : [...cell.data, item],
                        })
                    }
                />
            ))}
        </div>
    );
}
