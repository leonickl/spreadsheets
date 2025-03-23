import { coloredItems } from "./lib/selectLists";

export default function SelectCellPreview({ cell }) {
    const colored = coloredItems(cell.selectList);

    return (
        <div className="flex flex-row gap-5 items-center justify-center">
            {cell.data?.map((item) => (
                <div
                    key={item}
                    className={`px-2 py-0 rounded ${colored[item]}`}
                >
                    {item}
                </div>
            ))}
        </div>
    );
}
