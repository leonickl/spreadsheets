import React, {
    createContext,
    useContext,
    useEffect,
    useMemo,
    useRef,
    useState,
} from "react";
import { emptyTable } from "../lib/emptyTable";
import { find } from "../lib/data";
import { deleteTable, fetchFile, storeTable } from "../lib/fetchFile";

const GlobalStateContext = createContext();

export const GlobalStateProvider = ({ children }) => {
    const [secondaryCursor, setSecondaryCursor] = useState();
    const [cursor, setCursor] = useState({ x: 0, y: 0 });

    const [clipboard, setClipboard] = useState();

    const [client, setClient] = useState(
        sessionStorage.getItem("client") ?? crypto.randomUUID()
    );

    const [file, setFile] = useState(emptyTable);
    const [uuid, setUuid] = useState(
        sessionStorage.getItem("uuid") ?? crypto.randomUUID()
    );

    const [showFileList, setShowFileList] = useState(false);
    const [showSelectLists, setShowSelectLists] = useState(false);
    const [changed, setChanged] = useState(false);

    const [socket, setSocket] = useState(null);
    const [connected, setConnected] = useState(false);
    const heartbeatTimeout = useRef(null);

    const inputRef = useRef();

    const table = useMemo(() => file?.body, [file]);
    const filename = useMemo(() => file?.filename, [file]);
    const selectLists = useMemo(() => file?.selectLists ?? {}, [file]);

    const cell = useMemo(
        () => find(table, cursor.y, cursor.x) ?? cursor,
        [table, cursor]
    );

    useEffect(() => {
        fetchFile(uuid, setFile);
    }, [uuid]);

    useEffect(() => {
        sessionStorage.setItem("client", client);
    }, [client]);

    useEffect(() => {
        sessionStorage.setItem("uuid", uuid);
    }, [uuid]);

    useEffect(() => {
        connectWebSocket();

        return () => {
            if (socket) {
                socket.close();
            }

            clearTimeout(heartbeatTimeout.current);
        };
    }, [uuid, client]); // Reconnect when file or user changes

    function connectWebSocket() {
        const ws = new WebSocket("ws://localhost:3000/ws");

        ws.onopen = () => {
            setConnected(true);

            ws.send(JSON.stringify({ status: "hello", client, uuid }));
        };

        ws.onmessage = (event) => {
            const {
                status,
                uuid: forUuid,
                cell,
                filename,
                selectLists,
                client: byClient,
            } = JSON.parse(event.data);

            if (byClient === client) {
                console.debug("you");
                return;
            }

            if (status === "alive") {
                console.debug("alive");
                resetHeartbeat();
            }

            if (cell && uuid === forUuid) {
                updateTable(cell.y, cell.x, cell, true);
            }

            if (filename && uuid === forUuid) {
                setFilename(filename, false);
            }

            if (selectLists && uuid === forUuid) {
                setSelectLists(() => selectLists, false);
            }
        };

        ws.onclose = () => {
            console.debug(
                "Disconnected from server, attempting to reconnect..."
            );
            setConnected(false);
            clearTimeout(heartbeatTimeout.current);
            setTimeout(connectWebSocket, 8000);
        };

        setSocket(ws);
    }

    function resetHeartbeat() {
        console.debug("heartbeat reset");
        clearTimeout(heartbeatTimeout.current);
        heartbeatTimeout.current = setTimeout(checkHeartbeat, 6000);
    }

    function checkHeartbeat() {
        console.debug("Heartbeat timeout! Connection lost.");
        setConnected(false);
        socket?.close(); // Force reconnect
    }

    function onCellChange(cell) {
        if (!socket) {
            console.error("socket uninitialized");
            return;
        }

        socket.send(JSON.stringify({ cell, client, uuid }));
    }

    function setTable(table) {
        setFile((file) => ({ ...file, body: table(file.body) }));
    }

    function setFilename(filename, pushToServer = true) {
        setFile((file) => ({ ...file, filename }));

        if (pushToServer) {
            socket.send(JSON.stringify({ filename, client, uuid }));
        }
    }

    function setSelectLists(selectLists, pushToServer = true) {
        console.log(selectLists);
        const lists = selectLists(file.selectLists ?? {});

        setFile((file) => ({
            ...file,
            selectLists: lists,
        }));

        if (pushToServer) {
            socket.send(JSON.stringify({ selectLists: lists, client, uuid }));
        }
    }

    function updateTable(y, x, props, overwrite = false) {
        if (table.find((cell) => cell.y == y && cell.x == x)) {
            setTable((table) =>
                table.map((cell) => {
                    if (!(cell.y == y && cell.x == x)) {
                        return cell;
                    }

                    const newCell = overwrite
                        ? { x, y, ...props }
                        : { ...cell, ...props };

                    onCellChange(newCell);

                    return newCell;
                })
            );
        } else {
            const newCell = { y, x, ...props };

            setTable((table) => [...table, newCell]);

            onCellChange(newCell);
        }

        setChanged(true);
    }

    function removeFromTable(y, x) {
        setTable((table) =>
            table.map((cell) => (cell.y == y && cell.x == x ? { x, y } : cell))
        );

        onCellChange({ x, y });

        setChanged(true);
    }

    function closeTable() {
        setFile(emptyTable);
        setChanged(false);
    }

    async function saveTable() {
        const json = JSON.stringify(file, null, 2);

        await storeTable(uuid, json);

        setChanged(false);
    }

    function openTable(newUuid) {
        setUuid(newUuid);
        setShowFileList(false);
    }

    function handleDelete() {
        setUuid(crypto.randomUUID());
        deleteTable(uuid);
    }

    return (
        <GlobalStateContext.Provider
            value={{
                cursor,
                cell,
                setCursor,
                table,
                updateTable,
                closeTable,
                removeFromTable,
                saveTable,
                openTable,
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
                file,
                selectLists,
                setSelectLists,
            }}
        >
            {children}
        </GlobalStateContext.Provider>
    );
};

export const useGlobalState = () => useContext(GlobalStateContext);
