import { coloredItems, gray } from "./lib/selectLists";
import { useGlobalState } from "./hooks/useGlobalState";

export default function SelectCellPreview({ cell }) {
    const { selectLists } = useGlobalState();

    const colored = coloredItems(cell.selectList, selectLists);

    return (
        <div className="flex flex-row gap-5 items-center justify-center">
            {cell.data?.map((item) => (
                <div
                    key={item}
                    className={`px-2 py-0 rounded ${colored[item] ?? gray}`}
                >
                    {item}
                </div>
            ))}
        </div>
    );
}
