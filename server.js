import express from "express";
import { Server } from "https";
import { createServer } from "http";
import fs from "fs";
import cors from "cors";
import { WebSocketServer } from "ws";
import { mergeCell, mergeFiles, mergeTables, repair } from "./src/lib/merge.js";
import { notnull } from "./src/lib/notnull.js";
import { isObject } from "./src/lib/object.js";

("use strict");

function validUuid(uuid) {
    return /^[a-z0-9-]+$/.test(uuid);
}

function path(uuid) {
    return "./data/" + uuid + ".json";
}

function exists(uuid) {
    return fs.existsSync(path(uuid));
}

async function read(uuid) {
    if (!validUuid(uuid)) {
        throw new Error(`${uuid} is not a valid uuid`);
    }

    if (!fs.existsSync(path(uuid))) {
        throw new Error(`file ${uuid} does not exist`);
    }

    const raw = fs.readFileSync(path).toString();

    if (!raw) {
        throw new Error(`file ${uuid} is empty`);
    }

    let parsed = null;

    try {
        parsed = JSON.parse(raw);
    } catch {
        throw new Error(`file ${uuid} has invalid json`);
    }

    let repaired = null;

    try {
        repaired = repair(parsed);
    } catch (e) {
        throw new Error(`file ${uuid} is invalid: ${e.message}`);
    }

    if (!repaired) {
        throw new Error(`repaired file ${uuid} is empty: ${repaired}`);
    }

    return repaired;
}

async function write(uuid, file) {
    if (!validUuid(uuid)) {
        throw new Error(`${uuid} is not a valid uuid`);
    }

    let repaired;

    try {
        repaired = repair(file);
    } catch (e) {
        throw new Error(`file ${uuid} is invalid: ${e.message}`);
    }

    fs.writeFileSync(path(uuid), JSON.stringify(repaired));
}

async function trash(uuid) {
    if (!validUuid(uuid)) {
        throw new Error(`${uuid} is not a valid uuid`);
    }

    fs.renameSync(path(uuid), "./trash/" + uuid + ".json");
}

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
            const file = read(uuid);

            const body = mergeCell(file.body, cell);

            write(uuid, { ...file, body });

            console.log(
                `client ${client} changed file ${uuid}: ${JSON.stringify(cell)}`
            );

            wss.clients.forEach((c) => {
                if (clients.get(c) === uuid && c.readyState === 1) {
                    c.send(JSON.stringify({ uuid, cell, client }));
                }
            });
        }

        if (filename && client && uuid) {
            const file = read(uuid);

            if (!file) {
                return;
            }

            write(uuid, { ...file, filename });

            console.log(
                `client ${client} changed filename of ${uuid}: ${filename}`
            );

            wss.clients.forEach((c) => {
                if (clients.get(c) === uuid && c.readyState === 1) {
                    c.send(JSON.stringify({ uuid, filename, client }));
                }
            });
        }

        if (selectLists && client && uuid) {
            const file = read(uuid);

            if (!file) {
                return;
            }

            write(uuid, { ...file, selectLists });

            console.log(
                `client ${client} changed selectLists of ${uuid}: ${JSON.stringify(
                    selectLists
                )}`
            );

            wss.clients.forEach((c) => {
                if (clients.get(c) === uuid && c.readyState === 1) {
                    c.send(JSON.stringify({ uuid, selectLists, client }));
                }
            });
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

    res.json(
        fs
            .readdirSync("./data")
            .map((name) => {
                const uuid = name.replace(".json", "");

                const file = read(uuid);

                if (!file) {
                    return;
                }

                const content = file.body.filter((cell) => notnull(cell.data));

                if (content.length === 0) {
                    return;
                }

                return [uuid, file.filename, content.length];
            })
            .filter(notnull)
    );
});

app.get("/files/:uuid", (req, res) => {
    const uuid = req.params.uuid;

    const file = read(uuid);

    if (!file) {
        return;
    }

    console.log(`client read file ${uuid}`);

    res.json({ ok: true, file });
});

app.post("/files/:uuid", (req, res) => {
    const uuid = req.params.uuid;

    if (!req.body || !isObject(req.body)) {
        console.error("invalid body given");
        return;
    }

    if (!exists(uuid)) {
        write(uuid, req.body);
        console.log(`client wrote file ${uuid}`);
        return;
    }

    const old = read(uuid);

    if (!old) {
        return;
    }

    write(uuid, mergeFiles(old, req.body));

    console.log(`client merged file ${uuid}`);

    const file = read(uuid);

    if (!file) {
        return;
    }

    res.json({ ok: true, file });
});

app.delete("/files/:uuid", (req, res) => {
    const uuid = req.params.uuid;

    trash(uuid);

    console.log(`client deleted file ${uuid}`);

    res.json({ ok: true });
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
