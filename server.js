import express from "express";
import { Server } from "https";
import { createServer } from "http";
import fs from "fs";
import cors from "cors";
import { WebSocketServer } from "ws";
import { mergeCell, mergeFiles } from "./src/lib/merge.js";
import { isObject } from "./src/lib/object.js";
import { exists, list, read, write, trash } from "./lib/file.js";
import { handleError, handleErrorWs } from "./lib/handleError.js";
import { sendToSubscribers } from "./lib/ws.js";

("use strict");

if (!fs.existsSync("./data")) {
    fs.mkdirSync("./data");
}

if (!fs.existsSync("./trash")) {
    fs.mkdirSync("./trash");
}

const app = express();
const server = createServer(app);

const wss = new WebSocketServer({ server, path: "/ws" });

const clients = new Map();

wss.on("connection", (ws) => {
    // now and then every 5 seconds
    setInterval(() => ws.send(JSON.stringify({ status: "alive" })), 5000);
    ws.send(JSON.stringify({ status: "alive" }));

    ws.on("message", (message) => {
        const { cell, client, status, uuid, filename, selectLists } =
            JSON.parse(message.toString());

        if (status === "hello" && uuid) {
            clients.set(ws, uuid);

            console.log(`client ${client} joined file ${uuid}`);
        }

        if (cell && client && uuid) {
            read(uuid)
                .then((file) => {
                    write(uuid, { ...file, body: mergeCell(file.body, cell) });
                })
                .then((file) => {
                    console.log(
                        `client ${client} changed file ${uuid}: ${JSON.stringify(
                            cell
                        )}`
                    );

                    sendToSubscribers(wss, clients, uuid, {
                        uuid,
                        cell,
                        client,
                    });

                    ws.send({ ok: true, file });
                })
                .catch(handleErrorWs(ws));
        }

        if (filename && client && uuid) {
            read(uuid)
                .then((file) => {
                    write(uuid, { ...file, filename });
                })
                .then((file) => {
                    console.log(
                        `client ${client} changed filename of ${uuid}: ${filename}`
                    );

                    sendToSubscribers(wss, clients, uuid, {
                        uuid,
                        filename,
                        client,
                    });

                    ws.send({ ok: true, file });
                })
                .catch(handleErrorWs(ws));
        }

        if (selectLists && client && uuid) {
            read(uuid)
                .then((file) => {
                    write(uuid, { ...file, selectLists });
                })
                .then((file) => {
                    console.log(
                        `client ${client} changed selectLists of ${uuid}: ${JSON.stringify(
                            selectLists
                        )}`
                    );

                    sendToSubscribers(wss, clients, uuid, {
                        uuid,
                        selectLists,
                        client,
                    });

                    ws.send({ ok: true, file });
                })
                .catch(handleErrorWs(ws));
        }
    });

    ws.on("close", () => {
        console.log("client left");
    });
});

app.use(
    cors({
        origin: "http://localhost:5173",
        methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
        allowedHeaders: ["Content-Type", "Authorization"],
        credentials: true,
    })
);

app.use(express.json());

app.get("/", (req, res) => {
    res.send("Hello from backend server!");
});

app.get("/files", (req, res) => {
    console.log("client read file list");

    list()
        .then((files) => res.send(files))
        .catch(handleError(res));
});

app.get("/files/:uuid", (req, res) => {
    const uuid = req.params.uuid;

    read(uuid)
        .then((file) => {
            console.log(`client read file ${uuid}`);
            res.json({ ok: true, file });
        })
        .catch(handleError(res));
});

app.post("/files/:uuid", (req, res) => {
    const uuid = req.params.uuid;

    if (!req.body || !isObject(req.body)) {
        console.error("invalid body given");
        res.json({ ok: false, msg: "invalid body given" });
        return;
    }

    if (!exists(uuid)) {
        write(uuid, req.body)
            .then((file) => {
                console.log(`client wrote file ${uuid}`);
                res.json({ ok: true, file });
            })
            .catch(handleError(res));
    }

    read(uuid)
        .then((old) => {
            write(uuid, mergeFiles(old, req.body));
        })
        .then((file) => {
            console.log(`client merged file ${uuid}`);
            res.json({ ok: true, file });
        })
        .catch(handleError(res));
});

app.delete("/files/:uuid", (req, res) => {
    const uuid = req.params.uuid;

    trash(uuid)
        .then(() => {
            console.log(`client deleted file ${uuid}`);
            res.json({ ok: true });
        })
        .catch(handleError(res));
});

const expressServer = server.listen(3000, function () {
    const address =
        expressServer.address().address === "::"
            ? "localhost"
            : expressServer.address().address;

    const protocol = expressServer instanceof Server ? "https" : "http";

    console.log(
        `Express server listening on ${protocol}://${address}:${
            expressServer.address().port
        }`
    );
});

export default app;
