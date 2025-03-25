import { notnull } from "../src/lib/notnull.js";
import { repair } from "../src/lib/merge.js";
import fs from "fs";

export function validUuid(uuid) {
    return /^[a-z0-9-]+$/.test(uuid);
}

export function path(uuid) {
    return "./data/" + uuid + ".json";
}

export function exists(uuid) {
    return fs.existsSync(path(uuid));
}

export async function read(uuid) {
    if (!validUuid(uuid)) {
        throw new Error(`${uuid} is not a valid uuid`);
    }

    if (!fs.existsSync(path(uuid))) {
        throw new Error(`file ${uuid} does not exist`);
    }

    const raw = fs.readFileSync(path(uuid)).toString();

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

export async function write(uuid, file) {
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

    return read(uuid);
}

export async function trash(uuid) {
    if (!validUuid(uuid)) {
        throw new Error(`${uuid} is not a valid uuid`);
    }

    fs.renameSync(path(uuid), "./trash/" + uuid + ".json");
}

export async function list() {
    const result = [];
    const raw = fs.readdirSync("./data");

    for (const name of raw) {
        const uuid = name.replace(".json", "");

        let file;

        try {
            file = await read(uuid);
        } catch (e) {
            console.error(e.message);
            continue;
        }

        const content = file.body.filter((cell) => notnull(cell.data));

        if (content.length === 0) {
            continue;
        }

        result.push([uuid, file.filename, content.length]);
    }

    return result.filter(notnull);
}
