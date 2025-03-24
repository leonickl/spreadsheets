import { useGlobalState } from "./hooks/useGlobalState";
import { colors } from "./lib/selectLists";
import SelectItem from "./SelectItem";

export default function CellInputSelect() {
    const { cell, updateTable, cursor, selectLists } = useGlobalState();

    if (!Array.isArray(cell.data)) {
        updateTable(cursor.y, cursor.x, {
            data: [],
        });
    }

    const selectList = selectLists[cell.selectList] ?? [];
    const foreignItems = (cell.data ?? []).filter(
        (item) => !selectList.includes(item)
    );

    return (
        <div className="flex flex-row items-center justify-start gap-10 bg-gray-800 min-h-10 w-full px-5 py-2 rounded-md border border-gray-400 focus:border-blue-700 focus:outline-blue-700">
            {selectList.map((item, index) => (
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

            {foreignItems.length > 0 && "|"}

            {foreignItems.map((item, index) => (
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
