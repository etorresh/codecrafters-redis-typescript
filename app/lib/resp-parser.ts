/* 
RESP (REdis Serialization Protocol)
Protocol version 2
https://redis.io/docs/latest/develop/reference/protocol-spec/
Supports:
- Simple strings
- Simple errors
- Integers
- Bulk strings
- Null bulk strings
- Arrays
*/

// \r = carriage return (CR)
// \n = line feed (LF)

import type { Message } from "./shared-types";

export function parse(data: Buffer, pos: number): [Message, number] {
    switch(data[pos]) {
        case 0x2B: // 0x2B = +
            return simpleString(data, pos + 1);
        case 0x2A: // 0x2A = *
            return array(data, pos + 1);
        case 0x24: // 0x24 = $
            return bulkString(data, pos + 1);
        default:
            console.log("unsupported data type");
            return [{type: "SimpleError"}, 0]

    }
}

function simpleString(data: Buffer, pos: number): [Message, number] {
    const start = pos;
    let end = pos;
    while (data[end] !== 0x0A) { // 0x0A = LF
        end += 1;
    }
    return [{ type: "SimpleString", content: data.subarray(start, end - 1).toString() }, end + 1]
}

function array(data: Buffer, pos: number): [Message, number] {
    const start = pos;
    let end = pos;
    while (data[end] !== 0x0A) { // 0x0A = LF
        end += 1;
    }
    
    if (data[start] === 0x2D) { // 0x2D = -
        return [{type: "NullArray"}, end + 1]
    }

    const length = asciiToInt(data, start, end - 1);
    let messages: Message[] = [];
    let nextPos = end + 1;
    for (let i = 0; i < length; i++) {
        const result = parse(data, nextPos);
        messages.push(result[0]);
        nextPos = result[1];
    }
    return [{type: "Array", messages: messages}, nextPos]
}

function bulkString(data: Buffer, pos:number): [Message, number] {
    const start = pos;
    let end = pos;
    while (data[end] !== 0x0A) { // 0x0A = LF
        end += 1
    }

    const length = asciiToInt(data, start, end - 1);
    const byteArrayStart = end + 1;
    const byteArrayEnd = byteArrayStart + length;
    const byteArray = data.subarray(byteArrayStart, byteArrayEnd);
    return [{type: "BulkString", content: byteArray}, byteArrayEnd + 2];
}

// only takes positive numbers
// [start, end) inclusive, exclusive
function asciiToInt(data: Buffer, start: number, end: number) : number {
    let total = 0;
    for (; start < end; start++) {
        const digit = data[start] - 48; // 48 = 0 in ASCII
        total = total * 10 + digit;
    }

    return total;
}