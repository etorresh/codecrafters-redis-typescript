import type { Message } from "./shared-types";

export function encode(message: Message): string {
    switch(message.type) {
        case "BulkString":
            return `$${message.content.length}\r\n${message.content.toString()}\r\n`;
    }

    return "";
}