import express from "express";
import { Server } from "https";
import fs from "fs";
import cors from "cors";
import { emptyTable } from "./src/lib/emptyTable.js";

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

app.use(
    cors({
        origin: "http://localhost:5173",
        methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
        allowedHeaders: ["Content-Type", "Authorization"],
        credentials: true,
    })
);

app.use(express.json());

app.get("/", function (req, res) {
    res.send("Hello from backend server!");
});

app.get("/files", (req, res) => {
    res.json(
        fs
            .readdirSync("./data")
            .map((uuid) => {
                const file = JSON.parse(fs.readFileSync("./data/" + uuid));

                const details = Array.isArray(file)
                    ? [
                          uuid.replace(".json", ""),
                          uuid.replace(".json", ""),
                          file?.length,
                      ]
                    : [
                          uuid.replace(".json", ""),
                          file?.filename,
                          file?.body?.length,
                      ];

                const body = Array.isArray(file) ? file : file.body;

                if (details[2] === 1 && !body[0].data) {
                    return null;
                }

                return details;
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
        fs.writeFileSync(filename, JSON.stringify(emptyTable));
    }

    const raw = fs.readFileSync(filename).toString();

    const json = JSON.parse(raw);

    res.json({ ok: true, file: json });
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

    fs.writeFileSync(filename, JSON.stringify(req.body));

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

    res.json({ ok: true });
});

const server = app.listen(3000, function () {
    const address =
        server.address().address === "::"
            ? "localhost"
            : server.address().address;

    const protocol = server instanceof Server ? "https" : "http";

    console.log(
        `Express server listening on ${protocol}://${address}:${
            server.address().port
        }`
    );
});

export default app;
