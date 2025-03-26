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
import { deleteTable, fetchFile, storeFile } from "../lib/fetchFile";
import { mergeCell } from "../lib/merge";
import { now } from "../lib/date";

const GlobalStateContext = createContext();

export const GlobalStateProvider = ({ children }) => {
    const [secondaryCursor, setSecondaryCursor] = useState();
    const [cursor, setCursor] = useState({ x: 0, y: 0 });

    const [clipboard, setClipboard] = useState();

    const [client] = useState(
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
    const filename = useMemo(() => file?.filename?.data, [file]);
    const selectLists = useMemo(() => file?.selectLists?.data ?? {}, [file]);

    const cell = useMemo(
        () => find(table, cursor.y, cursor.x) ?? cursor,
        [table, cursor]
    );

    useEffect(() => {
        setFile(emptyTable);
        fetchFile(uuid).then(setFile);
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

    useEffect(() => {
        const timeout = setTimeout(() => {
            sync().then(() => setChanged(false));
        }, 5000);

        return () => clearTimeout(timeout);
    }, [changed]);

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
                console.debug("received new cell:", cell);
                updateTable(cell.y, cell.x, cell, true);
            }

            if (filename && uuid === forUuid) {
                console.debug("received new filename:", filename);
                setFilename(filename, false);
            }

            if (selectLists && uuid === forUuid) {
                console.debug("received new selectLists:", selectLists);
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

    function socketSend(data) {
        if (socket.readyState === WebSocket.OPEN) {
            socket.send(JSON.stringify(data));
        } else {
            console.error("socket closed. cannot send");
        }
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
            console.debug("socket uninitialized");
            return;
        }

        socketSend({ cell, client, uuid });
        console.debug("sent cell:", cell);
    }

    function setTable(table) {
        setFile((file) => ({ ...file, body: table(file.body) }));
    }

    function setFilename(filename, pushToServer = true) {
        setFile((file) => ({
            ...file,
            filename: { date: now(), data: filename },
        }));

        if (pushToServer) {
            socketSend({ filename, client, uuid });
            console.debug("sent filename:", filename);
        }
    }

    function setSelectLists(selectLists, pushToServer = true) {
        const lists = selectLists(file.selectLists?.data ?? {});

        setFile((file) => ({
            ...file,
            selectLists: { date: now(), data: lists },
        }));

        if (pushToServer) {
            socketSend({ selectLists: lists, client, uuid });
            console.debug("sent selectLists:", selectLists);
        }
    }

    function updateTable(y, x, props, overwrite = false) {
        if (table.find((cell) => cell.y == y && cell.x == x)) {
            setTable((table) =>
                mergeCell(
                    table.map((cell) => {
                        if (!(cell.y == y && cell.x == x)) {
                            return cell;
                        }

                        const newCell = overwrite
                            ? { x, y, ...props, date: now() }
                            : { ...cell, ...props, date: now() };

                        onCellChange(newCell);

                        return newCell;
                    })
                )
            );
        } else {
            const newCell = { y, x, ...props, date: now() };

            setTable((table) => mergeCell(table, newCell));

            onCellChange(newCell);
        }

        setChanged(true);
    }

    function removeFromTable(y, x) {
        const date = now();

        setTable((table) =>
            table.map((cell) =>
                cell.y == y && cell.x == x ? { x, y, date } : cell
            )
        );

        onCellChange({ x, y, date });

        setChanged(true);
    }

    function closeTable() {
        setFile(emptyTable);
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

    async function sync() {
        storeFile(uuid, file).then(({ ok, file, msg }) => {
            if (ok && file) {
                setFile(file);
                setChanged(false);
            } else {
                console.error({ ok, msg, file });
            }
        });
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
                sync,
            }}
        >
            {children}
        </GlobalStateContext.Provider>
    );
};

export const useGlobalState = () => useContext(GlobalStateContext);
