import Cell from "./Cell";
import { useGlobalState } from "./hooks/useGlobalState";
import { dimensions, grid, letter } from "./lib/grid";

export default function Spreadsheet() {
    const { table, cursor } = useGlobalState();

    const [, width] = dimensions(table, cursor);

    return (
        <table className="w-full">
            <thead>
                <tr>
                    <th className="border border-white border-opacity-20 bg-gray-800 sticky left-0 top-0 z-10">
                        <div className="min-h-9 min-w-24 px-5 py-2"></div>
                    </th>

                    {new Array(width + 1).fill(null).map((_, i) => (
                        <th
                            className="border border-white border-opacity-20 bg-gray-800 sticky top-0 z-10"
                            key={i}
                        >
                            <div className="min-h-9 min-w-24 px-5 py-2 select-none">
                                {letter(i)}
                            </div>
                        </th>
                    ))}
                </tr>
            </thead>

            <tbody>
                {grid(table, cursor).map((row, i) => (
                    <tr key={i} className="relative">
                        <th className="border border-white border-opacity-20 bg-gray-800 sticky left-0 z-10">
                            <div className="min-h-9 min-w-24 px-5 py-2 select-none">
                                {i}
                            </div>
                        </th>

                        {row.map((cell, j) => (
                            <Cell y={i} x={j} cell={cell} key={`${i}.${j}`} />
                        ))}
                    </tr>
                ))}
            </tbody>
        </table>
    );
}
