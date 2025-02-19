const { Server } = require("ws");

module.exports = (req, res) => {
    if (!res.socket.server.websocket) {
        const wss = new Server({ noServer: true });
        res.socket.server.websocket = wss;

        wss.on("connection", ws => {
            ws.on("message", data => {
                wss.clients.forEach(client => {
                    if (client.readyState === 1) {
                        client.send(data);
                    }
                });
            });
        });

        res.socket.server.on("upgrade", (request, socket, head) => {
            if (request.url === "/ws") {
                wss.handleUpgrade(request, socket, head, ws => {
                    wss.emit("connection", ws, request);
                });
            }
        });
    }
    res.end();
};
