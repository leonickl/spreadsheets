const base = "http://localhost:3000/files/";

export async function fetchFile(uuid) {
    const stored = await fetch(base + uuid);

    const { ok, msg, file } = await stored.json();

    if (!ok) {
        console.debug(msg);
        return;
    }

    if (!file || file?.body?.length === 0) {
        return;
    }

    return file;
}

export async function storeFile(uuid, body) {
    fetch(base + uuid, {
        headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
        },
        method: "POST",
        body,
    });
}

export async function fetchFileList() {
    const res = await fetch(base);

    return await res.json();
}

export async function deleteTable(uuid) {
    fetch(base + uuid, {
        method: "DELETE",
    });
}
