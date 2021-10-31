import mongodb from 'mongodb';

export class EmailEvent<T> {
    constructor(
        public id: mongodb.ObjectID,
        public producedAt: Date,
        public eventName: string,
        public data: T,
        public version: number,
        public produceMessage: boolean
    ) {}
}
