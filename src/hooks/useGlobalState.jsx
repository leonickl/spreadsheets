import React, { createContext, useContext, useEffect, useRef, useState } from "react";

const GlobalStateContext = createContext();

export const GlobalStateProvider = ({ children }) => {
    const [cursor, setCursor] = useState({ x: 0, y: 0 });
    const [table, setTable] = useState(() =>
        localStorage.getItem("table")
            ? JSON.parse(localStorage.getItem("table"))
            : []
    );
    const [filename, setFilename] = useState(
        localStorage.getItem("filename") ?? "Spreadsheet"
    );
    const [changed, setChanged] = useState(
        localStorage.getItem("changed") ?? false
    );

    const inputRef = useRef();

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
        setTable([{ x: 5, y: 10, data: null }]);
        setFilename("Spreadsheet");
        setChanged(false);
    }

    function exportTable() {
        const json = JSON.stringify(table, null, 2);

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
                    setTable(JSON.parse(reader.result));
                    setFilename(file.name.replace(".json", ""));
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
        localStorage.setItem("table", JSON.stringify(table));
    }, [table]);

    useEffect(() => {
        localStorage.setItem("filename", filename);
    }, [filename]);

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
            }}
        >
            {children}
        </GlobalStateContext.Provider>
    );
};

export const useGlobalState = () => useContext(GlobalStateContext);
