import Spreadsheet from "./Spreadsheet";
import { letter } from "./lib/grid";
import { useGlobalState } from "./hooks/useGlobalState";
import { limit } from "./lib/cursor";
import { useEffect, useState } from "react";
import keyPress from "./lib/keyPress";
import SelectCellType from "./SelectCellType";
import SelectSelectList from "./SelectSelectList";
import CellInput from "./CellInput";
import FileList from "./FileList";
import SelectLists from "./SelectLists";
import {
    FloppyFill,
    FolderFill,
    Trash3Fill,
    UiChecksGrid,
    XCircleFill,
} from "react-bootstrap-icons";

export default function App() {
    const [isFocused, setIsFocused] = useState(false);

    const {
        cursor,
        cell,
        setCursor,
        table,
        updateTable,
        closeTable,
        removeFromTable,
        saveTable,
        filename,
        setFilename,
        changed,
        inputRef,
        secondaryCursor,
        setSecondaryCursor,
        clipboard,
        setClipboard,
        uuid,
        showFileList,
        setShowFileList,
        handleDelete,
        connected,
        showSelectLists,
        setShowSelectLists,
    } = useGlobalState();

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
    }, [cursor]);

    useEffect(() => {
        const handleKeyPress = (event) => {
            if (showFileList || showSelectLists) {
                return;
            }

            keyPress({
                event,
                updateTable,
                limit,
                setCursor,
                inputRef,
                removeFromTable,
                cursor,
                isFocused,
                cell,
                secondaryCursor,
                setSecondaryCursor,
                table,
                clipboard,
                setClipboard,
            });
        };

        document.addEventListener("keydown", handleKeyPress);

        return () => {
            document.removeEventListener("keydown", handleKeyPress);
        };
    }, [isFocused, cursor, table, secondaryCursor]);

    if (!table) {
        return <p>loading...</p>;
    }

    return (
        <div className="flex flex-col gap-10 items-center min-h-screen bg-gray-900 text-white text-center p-8">
            <div className="w-full flex flex-row gap-5 h-10">
                <button
                    className="grid items-center justify-center font-bold px-5 bg-gray-700 hover:bg-red-700 rounded text-3xl opacity-80"
                    onClick={closeTable}
                >
                    <XCircleFill width={16} />
                </button>

                <button
                    className="grid items-center justify-center font-bold px-5 bg-gray-700 hover:bg-blue-700 rounded text-3xl opacity-80"
                    onClick={() => setShowFileList((curr) => !curr)}
                >
                    <FolderFill width={16} />
                </button>

                <button
                    className={`grid items-center justify-center font-bold px-5 ${
                        changed ? "bg-orange-700" : "bg-gray-700"
                    } hover:bg-purple-700 rounded text-3xl opacity-80`}
                    onClick={saveTable}
                >
                    <FloppyFill width={16} />
                </button>

                <button
                    className={`grid items-center justify-center font-bold px-5 bg-gray-700 hover:bg-red-700 rounded text-3xl opacity-80`}
                    onClick={handleDelete}
                >
                    <Trash3Fill width={16} />
                </button>

                <button
                    className={`grid items-center justify-center font-bold px-5 bg-gray-700 hover:bg-yellow-700 rounded text-3xl opacity-80`}
                    onClick={() => setShowSelectLists(true)}
                >
                    <UiChecksGrid width={16} />
                </button>

                <div
                    className={`h-10 w-10 px-5 py-2 rounded-md border ${
                        connected
                            ? "bg-green-500 border-green-900"
                            : "bg-red-500 border-red-900"
                    }`}
                ></div>

                <input
                    value={filename}
                    onChange={(e) => setFilename(e.target.value)}
                    className="bg-gray-800 min-h-10 w-max px-5 py-2 rounded-md border border-gray-400 focus:border-blue-700 focus:outline-blue-700"
                />

                <pre className="opacity-40 bg-gray-800 min-h-10 w-max px-5 py-2 rounded-md border border-gray-400 focus:border-blue-700 focus:outline-blue-700">
                    {uuid}
                </pre>
            </div>

            <div className="w-full flex flex-row gap-5 h-16">
                <div className="grid items-center justify-center font-bold px-5 h-full">
                    {(secondaryCursor
                        ? letter(secondaryCursor.x) + secondaryCursor.y + ":"
                        : "") +
                        letter(cursor.x) +
                        cursor.y}
                </div>

                <CellInput />

                <SelectCellType />

                {cell.type === "select" && <SelectSelectList />}
            </div>

            <div className="w-full max-h-full">
                <div className="w-full relative whitespace-nowrap">
                    <Spreadsheet />
                </div>
            </div>

            {showFileList && <FileList />}
            {showSelectLists && <SelectLists />}
        </div>
    );
}
