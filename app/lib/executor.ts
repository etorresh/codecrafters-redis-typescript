import type { Socket } from "net";
import type { Message } from "./shared-types";
import { encode } from "./resp-encoder";

// excutes the output of rest-parser.ts
export function execute(connection: Socket, message: Message) {
    switch (message.type) {
        case "SimpleString":
            connection.write(message.content);
            break;
        case "Array":
            if (message.messages.length == 1) {
                if (message.messages[0].type === "BulkString" && message.messages[0].content.length === 4 && message.messages[0].content.toString().toUpperCase() === "PING") {
                    connection.write("+PONG\r\n");
                }
            }
            if (message.messages.length == 2) {
                if (message.messages[0].type === "BulkString" && message.messages[0].content.length === 4 && message.messages[0].content.toString().toUpperCase() === "ECHO" && message.messages[1].type === "BulkString") {
                    connection.write(encode(message.messages[1]));
                }
            }
            break;
    }
}