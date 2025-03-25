export function handleError(res) {
    return (e) => {
        console.error(e.message);
        res.json({ ok: false, msg: e.message });
    };
}

export function handleErrorWs(ws) {
    return (e) => {
        console.error(e.message);
        ws.send({ ok: false, msg: e.message });
    };
}
