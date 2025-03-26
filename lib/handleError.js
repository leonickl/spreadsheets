export function handleError(res) {
    return (e) => {
        console.error(e);
        res.json({ ok: false, msg: e.message });
    };
}

export function handleErrorWs(ws) {
    return (e) => {
        console.error(e);
        ws.send(JSON.stringify({ ok: false, msg: e.message }));
    };
}
