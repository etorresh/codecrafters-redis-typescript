export type SimpleString = {
    type: "SimpleString",
    content: string
}

export type SimpleError = {
    type: "SimpleError"
}

export type NullArray = {
    type: "NullArray"
}

export type Array = {
    type: "Array",
    messages: Message[]
}

// official name is BulkString but seems it should be ByteArray
export type BulkString = {
    type: "BulkString",
    content: Buffer,
}

export type Message = SimpleString | SimpleError | NullArray | Array | BulkString;