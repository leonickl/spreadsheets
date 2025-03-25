export function sendToSubscribers(wss, clients, uuid, data) {
    wss.clients.forEach((c) => {
        if (clients.get(c) === uuid && c.readyState === 1) {
            c.send(JSON.stringify(data));
        }
    });
}
