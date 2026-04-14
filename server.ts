import { createServer } from "http";
import { parse } from "url";
import next from "next";
import { Server } from "socket.io";
import { setIO } from "@/lib/io";

const app = next({ dev: process.env.NODE_ENV !== "production" });
const handle = app.getRequestHandler();

app.prepare().then(() => {
    const httpServer = createServer((req, res) => {
        const parsedUrl = parse(req.url!, true);
        handle(req, res, parsedUrl);
    });

    const io = new Server(httpServer);
    setIO(io);

    io.on("connection", (socket) => {
        socket.on("item:create", (payload) => {
            socket.broadcast.emit("item:create", payload)
        })

        socket.on("item:move", (payload) => {
            socket.broadcast.emit("item:move", payload);
        });

        socket.on("item:update", (payload) => {
            socket.broadcast.emit("item:update", payload);
        });

        socket.on("item:visibility", (payload) => {
            socket.broadcast.emit("item:visibility", payload);
        });

        socket.on("item:lock", (payload) => {
            socket.broadcast.emit("item:lock", payload);
        });

        socket.on("item:unlock", (payload) => {
            socket.broadcast.emit("item:unlock", payload);
        });

        socket.on("item:delete", (payload) => {
            socket.broadcast.emit("item:delete", payload)
        })
    });

    httpServer.listen(3000, () => console.log("Ready on http://localhost:3000"));
});