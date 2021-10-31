import mongodb from 'mongodb';

export class HubspotIntegrationMessage<T> {
    constructor(public id: mongodb.ObjectID, public data: T, public version: number, public timestamp: Date) {}
}
