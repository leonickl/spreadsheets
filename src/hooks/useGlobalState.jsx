import React, {
    createContext,
    useContext,
    useEffect,
    useMemo,
    useRef,
    useState,
} from "react";
import { emptyTable } from "../lib/emptyTable";

const GlobalStateContext = createContext();

export const GlobalStateProvider = ({ children }) => {
    const [secondaryCursor, setSecondaryCursor] = useState();
    const [cursor, setCursor] = useState({ x: 0, y: 0 });
    const [clipboard, setClipboard] = useState();

    const [file, setFile] = useState(() => {
        const stored = localStorage.getItem("file");

        if (!stored) {
            return emptyTable;
        }

        const parsed = JSON.parse(localStorage.getItem("file"));

        if (!parsed || parsed?.body?.length === 0) {
            return emptyTable;
        }

        return parsed;
    });

    const [changed, setChanged] = useState(
        localStorage.getItem("changed") ?? false
    );

    const inputRef = useRef();

    const table = useMemo(() => file.body, [file]);
    const filename = useMemo(() => file.filename ?? "Spreadsheet", [file]);

    function setTable(table) {
        if (Array.isArray(table)) {
            return setFile((file) => ({ ...file, body: table }));
        }

        setFile((file) => ({ ...file, body: table(file.body) }));
    }

    function setFilename(filename) {
        setFile((file) => ({ ...file, filename }));
    }

    function updateTable(y, x, props) {
        if (table.find((cell) => cell.y == y && cell.x == x)) {
            setTable((table) =>
                table.map((cell) =>
                    cell.y == y && cell.x == x ? { ...cell, ...props } : cell
                )
            );
        } else {
            setTable((table) => [...table, { y, x, ...props }]);
        }

        setChanged(true);
    }

    function removeFromTable(y, x) {
        setTable((table) =>
            table.filter((cell) => !(cell.y == y && cell.x == x))
        );

        setChanged(true);
    }

    function dropTable() {
        setTable(emptyTable);
        setFilename("Spreadsheet");
        setChanged(false);
    }

    function exportTable() {
        const json = JSON.stringify(file, null, 2);

        const blob = new Blob([json], { type: "application/json" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `${filename}.json`;
        a.click();
        URL.revokeObjectURL(url);

        setChanged(false);
    }

    function importTable(event) {
        const file = event.target.files[0];

        if (file && file.type === "application/json") {
            const reader = new FileReader();

            reader.onload = () => {
                try {
                    const parsed = JSON.parse(reader.result);

                    setFile(
                        Array.isArray(parsed)
                            ? {
                                  filename: file.name.replace(".json", ""),
                                  body: parsed,
                              }
                            : parsed
                    );
                } catch (error) {
                    console.error("Error parsing JSON:", error);
                }
            };

            reader.readAsText(file);
        } else {
            alert("Please upload a valid JSON file.");
        }
    }

    useEffect(() => {
        localStorage.setItem("file", JSON.stringify(file));
    }, [file]);

    useEffect(() => {
        localStorage.setItem("changed", changed);
    }, [changed]);

    return (
        <GlobalStateContext.Provider
            value={{
                cursor,
                setCursor,
                table,
                setTable,
                updateTable,
                dropTable,
                removeFromTable,
                exportTable,
                importTable,
                filename,
                setFilename,
                changed,
                setChanged,
                inputRef,
                secondaryCursor,
                setSecondaryCursor,
                clipboard,
                setClipboard,
            }}
        >
            {children}
        </GlobalStateContext.Provider>
    );
};

export const useGlobalState = () => useContext(GlobalStateContext);
