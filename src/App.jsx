import Spreadsheet from "./Spreadsheet";
import { letter } from "./lib/grid";
import { useGlobalState } from "./hooks/useGlobalState";
import { find } from "./lib/data";
import { limit } from "./lib/cursor";
import { useEffect, useRef, useState } from "react";

export default function App() {
    const inputRef = useRef();
    const fileInputRef = useRef(null);

    const [isFocused, setIsFocused] = useState(false);

    const {
        cursor,
        setCursor,
        table,
        updateTable,
        dropTable,
        removeFromTable,
        exportTable,
        importTable,
        filename,
        setFilename,
        changed,
    } = useGlobalState();

    const cell = find(table, cursor.y, cursor.x);

    useEffect(() => {
        const checkFocus = () => {
            setIsFocused(document.activeElement === inputRef.current);
        };

        document.addEventListener("focusin", checkFocus);
        document.addEventListener("focusout", checkFocus);

        return () => {
            document.removeEventListener("focusin", checkFocus);
            document.removeEventListener("focusout", checkFocus);
        };
    }, []);

    useEffect(() => {
        const handleKeyPress = (event) => {
            // also if in input mode

            if (event.key === "ArrowUp") {
                setCursor(({ x, y }) => limit({ x, y: y - 1 }));
            }

            if (event.key === "ArrowDown") {
                setCursor(({ x, y }) => limit({ x, y: y + 1 }));
            }

            if (event.key === "Enter") {
                if (isFocused) {
                    setCursor(({ x, y }) => limit({ x, y: y + 1 }));
                } else {
                    inputRef.current.focus();
                }
            }

            if (event.key === "Escape") {
                inputRef.current.blur();
            }

            if (event.key === "Tab") {
                event.preventDefault();
                setCursor(({ x, y }) => limit({ x: x + 1, y }));
            }

            if (isFocused) return;

            // only if in navigation mode

            if (event.key === "ArrowLeft") {
                setCursor(({ x, y }) => limit({ x: x - 1, y }));
            }

            if (event.key === "ArrowRight") {
                setCursor(({ x, y }) => limit({ x: x + 1, y }));
            }

            if (event.key === "Delete") {
                removeFromTable(cursor.y, cursor.x);
            }

            if (event.key === "#") {
                updateTable(cursor.y, cursor.x, {
                    type: cell.type === "number" ? "string" : "number",
                });
            }

            if (event.key === "*") {
                updateTable(cursor.y, cursor.x, {
                    type: cell.type === "special" ? "string" : "special",
                });
            }

            if (event.key === "b" || event.key === "B") {
                updateTable(cursor.y, cursor.x, { bold: !cell?.bold });
            }

            if (event.key === "u" || event.key === "U") {
                updateTable(cursor.y, cursor.x, {
                    underline: !cell?.underline,
                });
            }

            if (event.key === "i" || event.key === "I") {
                updateTable(cursor.y, cursor.x, {
                    italic: !cell?.italic,
                });
            }

            if (event.key === "s" || event.key === "S") {
                exportTable();
            }
        };

        document.addEventListener("keydown", handleKeyPress);

        return () => {
            document.removeEventListener("keydown", handleKeyPress);
        };
    }, [isFocused, cursor]);

    return (
        <div className="flex flex-col gap-10 items-center min-h-screen bg-gray-900 text-white text-center p-8">
            <div className="w-full flex flex-row gap-5 h-10">
                <button
                    className="grid items-center justify-center font-bold px-5 bg-gray-700 hover:bg-red-700 rounded text-3xl opacity-80"
                    onClick={dropTable}
                >
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="20"
                        height="20"
                        fill="currentColor"
                        className="bi bi-x-circle-fill"
                        viewBox="0 0 16 16"
                    >
                        <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0M5.354 4.646a.5.5 0 1 0-.708.708L7.293 8l-2.647 2.646a.5.5 0 0 0 .708.708L8 8.707l2.646 2.647a.5.5 0 0 0 .708-.708L8.707 8l2.647-2.646a.5.5 0 0 0-.708-.708L8 7.293z" />
                    </svg>
                </button>

                <button
                    className="grid items-center justify-center font-bold px-5 bg-gray-700 hover:bg-blue-700 rounded text-3xl opacity-80"
                    onClick={() => fileInputRef.current.click()}
                >
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="16"
                        height="16"
                        fill="currentColor"
                        className="bi bi-folder-fill"
                        viewBox="0 0 16 16"
                    >
                        <path d="M9.828 3h3.982a2 2 0 0 1 1.992 2.181l-.637 7A2 2 0 0 1 13.174 14H2.825a2 2 0 0 1-1.991-1.819l-.637-7a2 2 0 0 1 .342-1.31L.5 3a2 2 0 0 1 2-2h3.672a2 2 0 0 1 1.414.586l.828.828A2 2 0 0 0 9.828 3m-8.322.12q.322-.119.684-.12h5.396l-.707-.707A1 1 0 0 0 6.172 2H2.5a1 1 0 0 0-1 .981z" />
                    </svg>
                </button>

                <button
                    className={`grid items-center justify-center font-bold px-5 ${
                        changed ? "bg-orange-700" : "bg-gray-700"
                    } hover:bg-purple-700 rounded text-3xl opacity-80`}
                    onClick={exportTable}
                >
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="16"
                        height="16"
                        fill="currentColor"
                        class="bi bi-floppy-fill"
                        viewBox="0 0 16 16"
                    >
                        <path d="M0 1.5A1.5 1.5 0 0 1 1.5 0H3v5.5A1.5 1.5 0 0 0 4.5 7h7A1.5 1.5 0 0 0 13 5.5V0h.086a1.5 1.5 0 0 1 1.06.44l1.415 1.414A1.5 1.5 0 0 1 16 2.914V14.5a1.5 1.5 0 0 1-1.5 1.5H14v-5.5A1.5 1.5 0 0 0 12.5 9h-9A1.5 1.5 0 0 0 2 10.5V16h-.5A1.5 1.5 0 0 1 0 14.5z" />
                        <path d="M3 16h10v-5.5a.5.5 0 0 0-.5-.5h-9a.5.5 0 0 0-.5.5zm9-16H4v5.5a.5.5 0 0 0 .5.5h7a.5.5 0 0 0 .5-.5zM9 1h2v4H9z" />
                    </svg>
                </button>

                <input
                    value={filename}
                    onChange={(e) => setFilename(e.target.value)}
                    className="bg-gray-800 min-h-10 w-max px-5 py-2 rounded-md border border-gray-400 focus:border-blue-700 focus:outline-blue-700"
                />
            </div>

            <div className="w-full flex flex-row gap-5">
                <div className="grid items-center justify-center font-bold px-5">
                    {letter(cursor.x) + cursor.y}
                </div>

                <input
                    ref={inputRef}
                    disabled={!cursor}
                    value={(cursor && cell?.data) ?? ""}
                    onChange={(e) =>
                        updateTable(cursor.y, cursor.x, {
                            data: e.target.value,
                        })
                    }
                    className="bg-gray-800 min-h-10 w-full px-5 py-2 rounded-md border border-gray-400 focus:border-blue-700 focus:outline-blue-700"
                />
            </div>

            <div className="w-full max-h-full overflow-auto">
                <div className="w-full relative overflow-auto whitespace-nowrap">
                    <Spreadsheet />
                </div>
            </div>

            <input
                type="file"
                accept=".json"
                onChange={importTable}
                ref={fileInputRef}
                style={{ display: "none" }}
            />
        </div>
    );
}
