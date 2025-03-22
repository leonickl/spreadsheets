import { colors } from "./lib/selectLists";

export default function SelectCellPreview({ cell }) {
    return (
        <div className="flex flex-row gap-5 items-center justify-center">
            {cell.data?.map((item, index) => (
                <div
                    className={`px-2 py-0 rounded ${
                        colors[index % colors.length]
                    }`}
                >
                    {item}
                </div>
            ))}
        </div>
    );
}
