import mongodb from 'mongodb';

export class AuditLogEvent<T> {
    constructor(
        public objectId: mongodb.ObjectID,
        public producedAt: Date,
        public eventName: string,
        public data: T,
        public version: number,
        public module: number
    ) {}
}
