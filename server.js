import express from "express";
import { Server } from "https";
import { createServer } from "http";
import fs from "fs";
import cors from "cors";
import { WebSocketServer } from "ws";
import { merge } from "./src/lib/merge.js";

("use strict");

function validUuid(uuid) {
    return /^[a-z0-9-]+$/.test(uuid);
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
            const path = "./data/" + uuid + ".json";

            if (!fs.existsSync(path)) {
                console.error(`file ${uuid} does not exist`);
                return;
            }

            const file = JSON.parse(fs.readFileSync(path));
            const body = file.body ?? [];

            fs.writeFileSync(
                path,
                JSON.stringify({ ...file, body: merge(body, cell) })
            );

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
            const path = "./data/" + uuid + ".json";

            if (!fs.existsSync(path)) {
                console.error(`file ${uuid} does not exist`);
                return;
            }

            const file = JSON.parse(fs.readFileSync(path));

            fs.writeFileSync(path, JSON.stringify({ ...file, filename }));

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
            const path = "./data/" + uuid + ".json";

            if (!fs.existsSync(path)) {
                console.error(`file ${uuid} does not exist`);
                return;
            }

            const file = JSON.parse(fs.readFileSync(path));

            fs.writeFileSync(path, JSON.stringify({ ...file, selectLists }));

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
            .map((uuid) => {
                const file = JSON.parse(fs.readFileSync("./data/" + uuid));

                const cellsWithContent = (file?.body ?? []).filter(
                    (cell) => cell.data
                );

                if (cellsWithContent.length === 0) {
                    return null;
                }

                return [
                    uuid.replace(".json", ""),
                    file?.filename,
                    cellsWithContent.length,
                ];
            })
            .filter((x) => x)
    );
});

app.get("/files/:uuid", (req, res) => {
    const file = req.params.uuid;

    if (!validUuid(file)) {
        res.json({ ok: false, msg: "invalid file name" });
        return;
    }

    const filename = "./data/" + file + ".json";

    if (!fs.existsSync(filename)) {
        return { ok: false, msg: "file does not exist" };
    }

    const raw = fs.readFileSync(filename).toString();

    const json = JSON.parse(raw);
    const newFile = { ...json, body: merge(json.body) }; // without duplicate cells

    fs.writeFileSync(filename, JSON.stringify(newFile));

    console.log(`client read file ${file}`);

    res.json({ ok: true, file: newFile });
});

app.post("/files/:uuid", (req, res) => {
    const file = req.params.uuid;

    if (!validUuid(file)) {
        res.json({ ok: false, msg: "invalid file name" });
        return;
    }

    const filename = "./data/" + file + ".json";

    if (!req.body) {
        res.json({ ok: false, msg: "empty file given" });
    }

    const newFile = { ...req.body, body: merge(req.body.body) };

    fs.writeFileSync(filename, JSON.stringify(newFile));

    console.log(`client wrote file ${file}`);

    res.json({ ok: true });
});

app.delete("/files/:uuid", (req, res) => {
    const file = req.params.uuid;

    if (!validUuid(file)) {
        res.json({ ok: false, msg: "invalid file name" });
        return;
    }

    const filename = "./data/" + file + ".json";

    fs.renameSync(filename, "./trash/" + file + ".json");

    console.log(`client deleted file ${file}`);

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
