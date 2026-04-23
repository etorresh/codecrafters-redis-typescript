import * as net from "net";

import { parse } from "./lib/resp-parser";
import { execute } from "./lib/executor";

const server: net.Server = net.createServer((connection: net.Socket) => {
    connection.on("data", (data) => {
        if (typeof data === "string") {
            console.warn("Parser expected a Buffer but received a string");
            return;
        }
        const [result, _] = parse(data, 0);
        execute(connection, result);
    });
});

server.listen(6379, "127.0.0.1");