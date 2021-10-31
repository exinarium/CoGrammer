import { ObjectID } from "mongodb";

export interface ILoggingConsumer {
    consumeAsync(id: ObjectID, message: any): void;
    start(): void;
    requestStop(): void;
    stop(): void;
}
